// File: /app/api/employee/rent/route.js

import { NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import {
    getFirestore,
    doc,
    setDoc,
    updateDoc,
    collection,
    getDocs
} from "firebase/firestore";

// ✅ Firebase Config
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

// ✅ GET: fetch all rents
export async function GET() {
    try {
        const snapshot = await getDocs(collection(db, "Rent"));
        const rents = snapshot.docs.map((doc) => doc.data());
        return NextResponse.json({ data: rents }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// ✅ POST: Create Rent + RentArchive + Payment
export async function POST(req) {
    try {
        const body = await req.json();
        const {
            cus_ID,
            room_ID,
            checkInDate,
            checkOutDate,
            paymentAmount,
            paymentMethod
        } = body;

        const rent_ID = `rent_${Date.now()}`;
        const rentA_ID = `rentA_${Date.now()}`;
        const payment_ID = `payment_${Date.now()}`;

        // ✅ 1. Create Payment (❌ Removed cardNumber)
        await setDoc(doc(db, "Payment", payment_ID), {
            payment_ID,
            rent_ID,
            cus_ID,
            room_ID,
            paymentMethod,
            paymentAmount,
            datePaid: new Date().toISOString()
        });

        // ✅ 2. Create Rent (with payment_ID)
        await setDoc(doc(db, "Rent", rent_ID), {
            rent_ID,
            cus_ID,
            room_ID,
            payment_ID,
            startDate: checkInDate,
            endDate: checkOutDate,
            active: true
        });

        // ✅ 3. Create RentArchive
        await setDoc(doc(db, "RentArchive", rentA_ID), {
            rentA_ID,
            rent_ID,
            cus_ID,
            room_ID,
            checkInDate,
            checkOutDate,
            active: true
        });

        // ✅ 4. Mark room as unavailable
        await updateDoc(doc(db, "Room", room_ID), {
            isAvailable: false
        });

        return NextResponse.json({ success: true, rent_ID, payment_ID }, { status: 200 });
    } catch (error) {
        console.error("❌ Error creating rent & payment:", error);
        return NextResponse.json({ error: "Failed to create rent." }, { status: 500 });
    }
}
