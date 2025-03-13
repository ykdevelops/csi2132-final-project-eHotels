import { NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import {
    getFirestore, doc, updateDoc
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

/**
 * ✅ PUT Request: Update an existing booking
 */
export async function PUT(req) {
    try {
        const { book_ID, ba_ID, checkInDate, checkOutDate, cus_ID, room_ID, checkedIn } = await req.json();

        if (!book_ID) {
            return NextResponse.json({ error: "Booking ID (book_ID) is required" }, { status: 400 });
        }

        // ✅ Reference to the Firestore document
        const bookingRef = doc(db, "Book", book_ID);

        // ✅ Update the document
        await updateDoc(bookingRef, {
            ba_ID,
            checkInDate,
            checkOutDate,
            cus_ID,
            room_ID,
            checkedIn, // ✅ Ensure checkedIn status is saved
        });

        return NextResponse.json({ success: true, message: "Booking updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("❌ [PUT] Error updating booking:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
