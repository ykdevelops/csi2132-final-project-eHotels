// File: /app/api/employee/hotel/route.js

import { NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    getDocs,
    setDoc,
    doc,
    deleteDoc
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ============================
// ✅ GET: Fetch All Hotels
// ============================
export async function GET() {
    try {
        const snapshot = await getDocs(collection(db, "Hotel"));
        const data = snapshot.docs.map(doc => doc.data());
        return NextResponse.json({ data });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch hotels" }, { status: 500 });
    }
}

// ============================
// ✅ POST: Create New Hotel
// ============================
export async function POST(req) {
    try {
        const body = await req.json();
        if (!body.name || !body.email || !body.numOfRooms || !body.hotel_ID) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await setDoc(doc(db, "Hotel", body.hotel_ID), body);
        return NextResponse.json({ success: true, message: "Hotel created" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create hotel" }, { status: 500 });
    }
}

// ============================
// ✅ PUT: Update Existing Hotel
// ============================
export async function PUT(req) {
    try {
        const body = await req.json();
        if (!body.hotel_ID) {
            return NextResponse.json({ error: "Missing hotel_ID for update" }, { status: 400 });
        }

        await setDoc(doc(db, "Hotel", body.hotel_ID), body, { merge: true });
        return NextResponse.json({ success: true, message: "Hotel updated" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update hotel" }, { status: 500 });
    }
}

// ============================
// ✅ DELETE: Delete Hotel
// ============================
export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const hotel_ID = searchParams.get("hotel_ID");

        if (!hotel_ID) {
            return NextResponse.json({ error: "Missing hotel_ID in query" }, { status: 400 });
        }

        await deleteDoc(doc(db, "Hotel", hotel_ID));
        return NextResponse.json({ success: true, message: "Hotel deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete hotel" }, { status: 500 });
    }
}
