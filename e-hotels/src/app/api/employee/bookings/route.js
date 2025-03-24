// File: /app/api/employee/bookings/route.js

import { NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    getDocs,
    query,
    where,
    doc,
    setDoc,
    deleteDoc,
    updateDoc
} from "firebase/firestore";

// ✅ Firebase Configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ GET: Fetch all pending bookings (checkedIn: false)
export async function GET() {
    try {
        const bookingsRef = collection(db, "Book");
        const q = query(bookingsRef, where("checkedIn", "==", false));
        const querySnapshot = await getDocs(q);

        const bookings = querySnapshot.docs.map(doc => ({
            book_ID: doc.id,
            ...doc.data()
        }));

        return NextResponse.json({ success: true, data: bookings });
    } catch (error) {
        console.error("❌ [GET] Error fetching bookings:", error);
        return NextResponse.json({ error: "Failed to fetch bookings." }, { status: 500 });
    }
}

// ✅ POST: Create a new booking
export async function POST(req) {
    try {
        const data = await req.json();
        const book_ID = data.book_ID || `bk_${Date.now()}`;
        await setDoc(doc(db, "Book", book_ID), data);

        return NextResponse.json({ success: true, book_ID });
    } catch (error) {
        console.error("❌ [POST] Error creating booking:", error);
        return NextResponse.json({ error: "Failed to create booking." }, { status: 500 });
    }
}

// ✅ PUT: Update an existing booking
export async function PUT(req) {
    try {
        const data = await req.json();
        const { book_ID, ...updateFields } = data;

        if (!book_ID) {
            return NextResponse.json({ error: "Missing booking ID." }, { status: 400 });
        }

        await updateDoc(doc(db, "Book", book_ID), updateFields);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("❌ [PUT] Error updating booking:", error);
        return NextResponse.json({ error: "Failed to update booking." }, { status: 500 });
    }
}

// ✅ DELETE: Delete a booking
export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const book_ID = searchParams.get("book_ID");

        if (!book_ID) {
            return NextResponse.json({ error: "Missing booking ID" }, { status: 400 });
        }

        await deleteDoc(doc(db, "Book", book_ID));

        return NextResponse.json({ success: true, message: `Booking ${book_ID} deleted.` });
    } catch (error) {
        console.error("❌ Error deleting booking:", error);
        return NextResponse.json({ error: "Failed to delete booking." }, { status: 500 });
    }
}

