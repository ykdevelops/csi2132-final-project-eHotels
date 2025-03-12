import { NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    arrayUnion,
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
        const { rent_ID, room_ID, startDate, endDate } = body;

        if (!rent_ID || !room_ID || !startDate || !endDate) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // ✅ Generate a unique book_ID
        const book_ID = `book_${Date.now()}`;

        // ✅ Check if the room exists
        const roomRef = doc(db, "Room", room_ID);
        const roomSnap = await getDoc(roomRef);

        if (!roomSnap.exists()) {
            return NextResponse.json({ error: "Room not found" }, { status: 404 });
        }

        const roomData = roomSnap.data();

        // ✅ Check for overlapping bookings
        const isOverlap = roomData.bookedDates?.some(({ startDate: bookedStart, endDate: bookedEnd }) => {
            const bookedStartDate = new Date(bookedStart);
            const bookedEndDate = new Date(bookedEnd);
            const newStartDate = new Date(startDate);
            const newEndDate = new Date(endDate);

            return (
                (newStartDate <= bookedEndDate && newStartDate >= bookedStartDate) ||
                (newEndDate >= bookedStartDate && newEndDate <= bookedEndDate) ||
                (newStartDate <= bookedStartDate && newEndDate >= bookedEndDate)
            );
        });

        if (isOverlap) {
            return NextResponse.json({ error: "Room is already booked for these dates" }, { status: 409 });
        }

        // ✅ Booking data
        const bookingData = {
            book_ID,
            rent_ID,
            room_ID,
            startDate,
            endDate,
            createdAt: serverTimestamp(),
        };

        // ✅ Add to `Book` collection
        await setDoc(doc(db, "Book", book_ID), bookingData);

        // ✅ Add to `BookArchive` collection (backup storage)
        await setDoc(doc(db, "BookArchive", book_ID), bookingData);

        // ✅ Update Room document to add booked dates
        await updateDoc(roomRef, {
            bookedDates: arrayUnion({
                book_ID,
                startDate,
                endDate,
            }),
        });

        return NextResponse.json({ success: true, book_ID }, { status: 201 });
    } catch (error) {
        console.error("❌ Error creating booking:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
