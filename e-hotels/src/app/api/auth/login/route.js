import { NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
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

// ✅ Function to Search User in Both Collections
async function findUserByEmail(email) {
    console.log(`🔍 Searching for "${email}" in Firestore...`);

    // ✅ Check Employee Collection
    const employeeSnapshot = await getDocs(collection(db, "Employee"));
    for (const doc of employeeSnapshot.docs) {
        const userData = doc.data();
        if (userData.email === email) {
            console.log(`✅ User found in Employee collection: ${email}`);
            return { ...userData, role: "Employee" };
        }
    }

    // ✅ Check Customer Collection
    const customerSnapshot = await getDocs(collection(db, "Customer"));
    for (const doc of customerSnapshot.docs) {
        const userData = doc.data();
        if (userData.email === email) {
            console.log(`✅ User found in Customer collection: ${email}`);
            return { ...userData, role: "Customer" };
        }
    }

    console.log(`❌ User not found: ${email}`);
    return null;
}

// ✅ Handle POST request (Login)
export async function POST(req) {
    try {
        const { email, password } = await req.json();
        if (!email || !password) {
            return NextResponse.json({ error: "Email and password required" }, { status: 400 });
        }

        // ✅ Step 1: Find User by Email
        const userData = await findUserByEmail(email);
        if (!userData) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // ✅ Step 2: Encrypt the Input Password and Compare
        console.log(`🔑 Checking password for "${email}"...`);
        const isValidPassword = await bcrypt.compare(password, userData.password);
        if (!isValidPassword) {
            console.log(`❌ Invalid password for "${email}"`);
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        console.log(`✅ Login successful for "${email}"`);
        return NextResponse.json({
            message: "Login successful",
            user: {
                name: userData.name,
                email: userData.email,
                role: userData.role,
            }
        });

    } catch (error) {
        console.error("❌ Login API error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
