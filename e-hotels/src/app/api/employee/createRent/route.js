import { NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

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
 * ✅ POST Request: Create Rent & RentArchive
 */
export async function POST(req) {
    try {
        const rentData = await req.json();
        const rentRef = doc(collection(db, "Rent"));
        rentData.rent_ID = rentRef.id;

        // ✅ Store in Rent
        await setDoc(rentRef, rentData);

        // ✅ Store in RentArchive
        const rentArchiveRef = doc(collection(db, "RentArchive"));
        await setDoc(rentArchiveRef, rentData);

        return NextResponse.json({ success: true, message: "Rent created successfully", data: rentData }, { status: 201 });
    } catch (error) {
        console.error("❌ [POST] Error creating rent:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
