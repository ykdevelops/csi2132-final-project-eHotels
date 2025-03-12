import { NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    getDocs
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
 * ✅ GET Request: Fetch all employees from Firestore
 */
export async function GET() {
    try {
        console.log("🔍 [GET] Fetching employees data from Firestore...");
        const querySnapshot = await getDocs(collection(db, "Employee"));

        if (querySnapshot.empty) {
            console.warn("⚠️ [GET] No employees found.");
        }

        const employees = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        console.log(`✅ [GET] Successfully fetched ${employees.length} employees.`, employees);

        return NextResponse.json({ success: true, data: employees }, { status: 200 });
    } catch (error) {
        console.error("❌ [GET] Error fetching employees:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
