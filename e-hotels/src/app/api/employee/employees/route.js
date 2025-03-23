// File: /app/api/employee/employees/route.js

import { NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    getDocs,
    setDoc,
    doc,
    deleteDoc
} from "firebase/firestore";
import bcrypt from "bcryptjs";

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

// ✅ Collection name
const COLLECTION = "Employee";

// ========================= //
//       GET: All Employees
// ========================= //
export async function GET() {
    try {
        const snapshot = await getDocs(collection(db, COLLECTION));
        const data = snapshot.docs.map(doc => doc.data());
        return NextResponse.json({ data });
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 });
    }
}

// ========================= //
//       POST: Create Employee
// ========================= //
export async function POST(req) {
    try {
        const body = await req.json();
        const { emp_ID, password, ...rest } = body;

        if (!emp_ID || !password) {
            return NextResponse.json({ error: "Employee ID and password are required" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const employeeData = { emp_ID, password: hashedPassword, ...rest };

        await setDoc(doc(db, COLLECTION, emp_ID), employeeData);
        return NextResponse.json({ message: "Employee created" });
    } catch (error) {
        console.error("POST Error:", error);
        return NextResponse.json({ error: "Failed to create employee" }, { status: 500 });
    }
}

// ========================= //
//       PUT: Update Employee
// ========================= //
export async function PUT(req) {
    try {
        const body = await req.json();
        const { emp_ID, password, ...rest } = body;

        if (!emp_ID) {
            return NextResponse.json({ error: "Employee ID is required" }, { status: 400 });
        }

        const updateData = password
            ? { ...rest, emp_ID, password: await bcrypt.hash(password, 10) }
            : { ...rest, emp_ID };

        await setDoc(doc(db, COLLECTION, emp_ID), updateData, { merge: true });
        return NextResponse.json({ message: "Employee updated" });
    } catch (error) {
        console.error("PUT Error:", error);
        return NextResponse.json({ error: "Failed to update employee" }, { status: 500 });
    }
}

// ========================= //
//       DELETE: Remove Employee
// ========================= //
export async function DELETE(req) {
    try {
        const body = await req.json();
        const { emp_ID } = body;

        if (!emp_ID) {
            return NextResponse.json({ error: "Employee ID is required" }, { status: 400 });
        }

        await deleteDoc(doc(db, COLLECTION, emp_ID));
        return NextResponse.json({ message: "Employee deleted" });
    } catch (error) {
        console.error("DELETE Error:", error);
        return NextResponse.json({ error: "Failed to delete employee" }, { status: 500 });
    }
}
