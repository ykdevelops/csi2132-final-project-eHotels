import { NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, where, getDocs } from "firebase/firestore";
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

export async function POST(req) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        console.log(`🔍 Checking if user exists: ${email}`);

        // ✅ Check if the user already exists
        const userQuery = query(collection(db, "Customer"), where("email", "==", email));
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
            console.error("❌ User already exists:", email);
            return NextResponse.json({ error: "User already exists" }, { status: 409 });
        }

        // ✅ Hash password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Store user in Firestore under "Customer" collection
        const newUserRef = await addDoc(collection(db, "Customer"), {
            name: name.trim(),
            email: email.trim(),
            password: hashedPassword,
            createdAt: new Date().toISOString(),
        });

        console.log(`✅ New user registered: ${name} (ID: ${newUserRef.id})`);

        return NextResponse.json({
            message: "Registration successful",
            user: { id: newUserRef.id, name, email },
        });

    } catch (error) {
        console.error("❌ Registration API error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
