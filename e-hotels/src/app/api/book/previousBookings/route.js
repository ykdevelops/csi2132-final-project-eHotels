import { NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    getDocs,
    query,
    where
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
        // 1. Parse body
        const { cus_ID } = await req.json();
        if (!cus_ID) {
            return NextResponse.json({ error: "Missing cus_ID" }, { status: 400 });
        }

        console.log(`🔎 Searching for bookings with cus_ID: ${cus_ID}`);

        // 2. Query 'Book' collection for docs with matching cus_ID
        const bookingsRef = collection(db, "Book"); // 🔥 Changed from 'BookArchive' to 'Book'
        const q = query(bookingsRef, where("cus_ID", "==", cus_ID)); // ✅ Ensure field name is correct
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.log(`⚠️ No bookings found for cus_ID: ${cus_ID}`);
            return NextResponse.json([], { status: 200 });
        }

        // 3. Extract data
        const results = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        console.log(`✅ Found ${results.length} booking(s) for cus_ID: ${cus_ID}`);
        return NextResponse.json(results, { status: 200 });
    } catch (error) {
        console.error("❌ Error retrieving bookings:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
