import { NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    getDocs,
    setDoc,
    deleteDoc,
    doc,
} from "firebase/firestore";

// ✅ Firebase Initialization
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
const collectionName = "Customer";

// ========== GET (Fetch all customers) ==========
export async function GET() {
    try {
        const snapshot = await getDocs(collection(db, collectionName));
        const customers = snapshot.docs.map(doc => doc.data());
        return NextResponse.json({ data: customers });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// ========== POST (Add new customer) ==========
export async function POST(req) {
    try {
        const body = await req.json();
        const cus_ID = `c_${Date.now()}`;
        const newCustomer = { ...body, cus_ID };

        await setDoc(doc(db, collectionName, cus_ID), newCustomer);
        return NextResponse.json({ message: "Customer created", id: cus_ID });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// ========== PUT (Update existing customer) ==========
export async function PUT(req) {
    try {
        const body = await req.json();
        const { cus_ID } = body;

        if (!cus_ID) {
            return NextResponse.json({ error: "Missing customer ID" }, { status: 400 });
        }

        await setDoc(doc(db, collectionName, cus_ID), body);
        return NextResponse.json({ message: "Customer updated" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// ========== DELETE (Delete customer by ID) ==========
export async function DELETE(req) {
    try {
        const { cus_ID } = await req.json();

        if (!cus_ID) {
            return NextResponse.json({ error: "Missing customer ID" }, { status: 400 });
        }

        await deleteDoc(doc(db, collectionName, cus_ID));
        return NextResponse.json({ message: "Customer deleted" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
