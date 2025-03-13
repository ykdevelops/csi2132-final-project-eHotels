import { NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import {
    getFirestore, collection, getDocs, query, where
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
 * ✅ GET Request: Fetch only **Pending Bookings** (`checkedIn: false`)
 */
export async function GET() {
    try {
        console.log("🔍 [GET] Fetching pending bookings (checkedIn: false)...");

        const bookingsRef = collection(db, "Book");
        const q = query(bookingsRef, where("checkedIn", "==", false)); // ✅ Fetch only unchecked-in bookings
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.warn("⚠️ [GET] No pending bookings found.");
        }

        const bookings = querySnapshot.docs.map(doc => ({
            book_ID: doc.id,
            ...doc.data()
        }));

        return NextResponse.json({ success: true, data: bookings }, { status: 200 });
    } catch (error) {
        console.error("❌ [GET] Error fetching pending bookings:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
