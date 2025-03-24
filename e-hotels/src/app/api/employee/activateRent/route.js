import { NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import {
    getFirestore, collection, doc, setDoc, updateDoc
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
        const data = await req.json();

        const {
            book_ID,
            checkInDate,
            checkOutDate,
            cus_ID,
            room_ID,
            ba_ID
        } = data;

        const rent_ID = `rent_${Date.now()}`;
        const archive_ID = `rentArchive_${Date.now()}`;

        const rentData = {
            rent_ID,
            book_ID,
            checkInDate,
            checkOutDate,
            cus_ID,
            room_ID,
            active: true,
            dateCreated: new Date().toISOString()
        };

        const rentArchiveData = {
            ...rentData,
            rentArchive_ID: archive_ID,
            ba_ID
        };

        // ✅ 1. Save to Rents
        await setDoc(doc(db, "Rent", rent_ID), rentData);

        // ✅ 2. Save to RentArchives
        await setDoc(doc(db, "RentArchive", archive_ID), rentArchiveData);

        // ✅ 3. Update Book to mark as checkedIn
        await updateDoc(doc(db, "Book", book_ID), {
            checkedIn: true
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("❌ Failed to activate rent:", error);
        return NextResponse.json({ error: "Failed to activate rent." }, { status: 500 });
    }
}
