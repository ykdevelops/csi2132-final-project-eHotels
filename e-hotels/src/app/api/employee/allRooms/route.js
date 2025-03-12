import { NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import {
    getFirestore, collection, getDocs
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
 * ✅ GET Request: Fetch all Rooms from Firestore
 */
export async function GET() {
    try {
        console.log("🔍 [GET] Fetching all rooms from Firestore...");

        // Fetch all rooms from the "Room" collection
        const querySnapshot = await getDocs(collection(db, "Room"));

        if (querySnapshot.empty) {
            console.warn("⚠️ [GET] No rooms found in Firestore.");
            return NextResponse.json({ success: true, data: [] }, { status: 200 });
        }

        // Map the documents to JSON format
        const rooms = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        console.log(`✅ [GET] Successfully fetched ${rooms.length} rooms.`);
        return NextResponse.json({ success: true, data: rooms }, { status: 200 });
    } catch (error) {
        console.error("❌ [GET] Error fetching rooms:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
