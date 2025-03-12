import { NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    doc,
    setDoc,
    serverTimestamp
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

export async function POST(req) {
    try {
        const body = await req.json();
        const { cus_ID, room_ID, startDate, endDate } = body;

        if (!cus_ID || !room_ID || !startDate || !endDate) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // ✅ Generate a unique book ID
        const book_ID = `book_${Date.now()}`;

        // ✅ Booking data
        const bookingData = {
            book_ID,
            cus_ID,
            room_ID,
            startDate,
            endDate,
            createdAt: serverTimestamp(),
        };

        // ✅ Add to `Book` collection
        await setDoc(doc(db, "Book", book_ID), bookingData);

        // ✅ Add to `BookArchive` collection (backup storage)
        await setDoc(doc(db, "BookArchive", book_ID), bookingData);

        return NextResponse.json({ success: true, book_ID }, { status: 201 });
    } catch (error) {
        console.error("❌ Error creating booking:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
