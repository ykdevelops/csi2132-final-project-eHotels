// File: /app/api/employee/createRoom/route.js
import { NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import {
    getFirestore,
    doc,
    setDoc
} from "firebase/firestore";

// ✅ 1. Firebase Config
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// ✅ 2. Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ✅ 3. Handle POST request to create a new room
export async function POST(request) {
    try {
        const { type, data } = await request.json();

        // Basic validation
        if (type !== "rooms" || !data) {
            return NextResponse.json(
                { error: "Invalid request. Expected type='rooms' and valid data." },
                { status: 400 }
            );
        }

        // Generate unique room_ID if not provided
        const room_ID = data.room_ID || `room_${Date.now()}`;

        // Final data
        const roomData = {
            room_ID,
            ...data,
            bookedDates: [] // Ensure this field exists
        };

        // ✅ Save to Firestore
        await setDoc(doc(db, "Room", room_ID), roomData);

        return NextResponse.json({ success: true, room_ID }, { status: 201 });
    } catch (error) {
        console.error("❌ Error creating room:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// ✅ Optional: Add GET for testing route directly in browser
export async function GET() {
    return NextResponse.json({ message: "POST to this endpoint to create a new room." });
}
