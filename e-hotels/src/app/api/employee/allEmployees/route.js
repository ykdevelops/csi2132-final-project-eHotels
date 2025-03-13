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
 * ✅ GET Request: Fetch all employees
 */
export async function GET() {
    try {
        console.log("🔍 [GET] Fetching all employees from Firestore...");
        const querySnapshot = await getDocs(collection(db, "Employee"));

        if (querySnapshot.empty) {
            console.warn("⚠️ [GET] No employees found.");
        }

        const employees = querySnapshot.docs.map(doc => ({
            emp_ID: doc.id, // Firestore ID
            ...doc.data()
        }));

        return NextResponse.json({ success: true, data: employees }, { status: 200 });
    } catch (error) {
        console.error("❌ [GET] Error fetching employees:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * ✅ POST Request: Add a new employee
 */
export async function POST(req) {
    try {
        const { emp_ID, hotel_ID, name, email, address, role, phoneNumber, password } = await req.json();

        if (!emp_ID || !hotel_ID || !name || !email || !address || !role || !phoneNumber || !password) {
            return NextResponse.json({ error: "Missing required fields (emp_ID, hotel_ID, name, email, address, role, phoneNumber, password)" }, { status: 400 });
        }

        const newEmployeeRef = doc(db, "Employee", emp_ID);
        const newEmployee = { emp_ID, hotel_ID, name, email, address, role, phoneNumber, password };

        await setDoc(newEmployeeRef, newEmployee);

        return NextResponse.json({ success: true, message: "Employee added successfully", data: newEmployee }, { status: 201 });
    } catch (error) {
        console.error("❌ [POST] Error adding employee:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * ✅ PUT Request: Update an existing employee
 */
export async function PUT(req) {
    try {
        const { emp_ID, hotel_ID, name, email, address, role, phoneNumber, password } = await req.json();

        if (!emp_ID) {
            return NextResponse.json({ error: "Employee ID (emp_ID) is required for updating" }, { status: 400 });
        }

        const employeeRef = doc(db, "Employee", emp_ID);
        await updateDoc(employeeRef, { hotel_ID, name, email, address, role, phoneNumber, password });

        return NextResponse.json({ success: true, message: "Employee updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("❌ [PUT] Error updating employee:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


/**
 * ✅ DELETE Request: Remove an employee
 */
export async function DELETE(req) {
    try {
        const { emp_ID } = await req.json();

        if (!emp_ID) {
            return NextResponse.json({ error: "Employee ID (emp_ID) is required for deletion" }, { status: 400 });
        }

        await deleteDoc(doc(db, "Employee", emp_ID));

        return NextResponse.json({ success: true, message: "Employee deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("❌ [DELETE] Error deleting employee:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
