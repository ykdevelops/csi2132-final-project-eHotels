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

// ✅ Fetch current rentals
export async function GET() {
    try {
        const snapshot = await getDocs(collection(db, "Rent"));
        const today = new Date();

        const rentals = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })).filter(rental => new Date(rental.endDate) >= today);

        return NextResponse.json(rentals, { status: 200 });
    } catch (error) {
        console.error("❌ Error fetching current rentals:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
