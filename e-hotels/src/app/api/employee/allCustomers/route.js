import { NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import {
    getFirestore, collection, getDocs, doc, setDoc, updateDoc, deleteDoc
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
 * ✅ GET Request: Fetch all customers from Firestore
 */
export async function GET() {
    try {
        console.log("🔍 [GET] Fetching all customers from Firestore...");

        const querySnapshot = await getDocs(collection(db, "Customer"));
        if (querySnapshot.empty) {
            console.warn("⚠️ [GET] No customer records found.");
        }

        const customers = querySnapshot.docs.map(doc => ({
            cus_ID: doc.id,
            ...doc.data()
        }));

        console.log(`✅ [GET] Successfully fetched ${customers.length} customers.`);
        return NextResponse.json({ success: true, data: customers }, { status: 200 });
    } catch (error) {
        console.error("❌ [GET] Error fetching customers:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * ✅ POST Request: Add a new customer to Firestore
 */
export async function POST(req) {
    try {
        const { email, name, address, dateOfReg, password } = await req.json();

        if (!email || !name || !password) {
            return NextResponse.json({ error: "Missing required fields (Email, Name, Password)" }, { status: 400 });
        }

        const newCustomerRef = doc(collection(db, "Customer")); // Auto-generate ID
        const newCustomer = {
            cus_ID: newCustomerRef.id, // Firestore auto-generated ID
            email,
            name,
            address: address || "",
            dateOfReg: dateOfReg || new Date().toISOString().split("T")[0],
            password
        };

        await setDoc(newCustomerRef, newCustomer);

        console.log(`✅ [POST] Customer added with ID: ${newCustomerRef.id}`);
        return NextResponse.json({ success: true, message: "Customer added successfully", data: newCustomer }, { status: 201 });
    } catch (error) {
        console.error("❌ [POST] Error adding customer:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * ✅ PUT Request: Update an existing customer in Firestore
 */
export async function PUT(req) {
    try {
        const { cus_ID, email, name, address, dateOfReg, password } = await req.json();

        if (!cus_ID) {
            return NextResponse.json({ error: "Customer ID (cus_ID) is required" }, { status: 400 });
        }

        const customerRef = doc(db, "Customer", cus_ID);
        await updateDoc(customerRef, {
            email,
            name,
            address,
            dateOfReg,
            password
        });

        console.log(`✅ [PUT] Customer updated with ID: ${cus_ID}`);
        return NextResponse.json({ success: true, message: "Customer updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("❌ [PUT] Error updating customer:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * ✅ DELETE Request: Remove a customer from Firestore
 */
export async function DELETE(req) {
    try {
        const { cus_ID } = await req.json();

        if (!cus_ID) {
            return NextResponse.json({ error: "Customer ID (cus_ID) is required" }, { status: 400 });
        }

        const customerRef = doc(db, "Customer", cus_ID);
        await deleteDoc(customerRef);

        console.log(`✅ [DELETE] Customer deleted with ID: ${cus_ID}`);
        return NextResponse.json({ success: true, message: "Customer deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("❌ [DELETE] Error deleting customer:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
