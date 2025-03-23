// File: /app/api/employee/createHotel/route.js
import { NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import {
    getFirestore,
    doc,
    setDoc
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

export async function POST(request) {
    try {
        const body = await request.json();

        if (!body || !body.name || !body.email || !body.numOfRooms || !body.hotelChain) {
            return NextResponse.json({ error: "Missing required hotel fields." }, { status: 400 });
        }

        const hotel_ID = `h_${Date.now()}`;
        const newHotel = {
            hotel_ID,
            ...body
        };

        await setDoc(doc(db, "Hotel", hotel_ID), newHotel);

        return NextResponse.json({ success: true, hotel_ID }, { status: 201 });
    } catch (error) {
        console.error("❌ Error creating hotel:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function GET() {
    return NextResponse.json({ message: "Send a POST request to add a new hotel." });
}
