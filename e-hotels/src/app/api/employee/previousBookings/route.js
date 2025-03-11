import { NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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

// ✅ Fetch previous bookings
export async function GET() {
    try {
        const snapshot = await getDocs(collection(db, "BookArchive"));
        const today = new Date();

        const bookings = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })).filter(booking => new Date(booking.endDate) < today);

        return NextResponse.json(bookings, { status: 200 });
    } catch (error) {
        console.error("❌ Error fetching previous bookings:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
