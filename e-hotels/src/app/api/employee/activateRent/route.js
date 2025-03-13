import { NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import {
    getFirestore, collection, doc, setDoc, updateDoc
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
 * ✅ POST Request: Activate Rent
 */
export async function POST(req) {
    try {
        const { book_ID, ba_ID, checkInDate, checkOutDate, cus_ID, room_ID } = await req.json();

        if (!book_ID || !cus_ID || !room_ID || !checkInDate || !checkOutDate) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // ✅ Mark booking as checked in
        const bookingRef = doc(db, "Book", book_ID);
        await updateDoc(bookingRef, { checkedIn: true });

        // ✅ Create Rent document
        const rentRef = doc(collection(db, "Rent"));
        const rentData = {
            rent_ID: rentRef.id,
            book_ID,
            ba_ID,
            checkInDate,
            checkOutDate,
            cus_ID,
            room_ID,
            active: true
        };
        await setDoc(rentRef, rentData);

        // ✅ Create RentArchive document
        const rentArchiveRef = doc(collection(db, "RentArchive"));
        await setDoc(rentArchiveRef, rentData);

        // ✅ Create CheckIn document
        const checkInRef = doc(collection(db, "CheckIn"));
        await setDoc(checkInRef, { book_ID, cus_ID, room_ID, checkInDate });

        return NextResponse.json({
            success: true,
            message: "Booking checked in, Rent activated, and archived.",
            data: rentData
        }, { status: 201 });

    } catch (error) {
        console.error("❌ [POST] Error activating rent:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
