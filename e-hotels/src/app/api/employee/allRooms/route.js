import { NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import {
    getFirestore, collection, getDocs, doc, updateDoc, deleteDoc
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
 * ✅ GET: Fetch all Rooms from Firestore
 */
export async function GET() {
    try {
        console.log("🔍 [GET] Fetching all rooms from Firestore...");

        // Fetch all rooms from Firestore
        const querySnapshot = await getDocs(collection(db, "Room"));

        if (querySnapshot.empty) {
            console.warn("⚠️ [GET] No rooms found in Firestore.");
            return NextResponse.json({ success: true, data: [] }, { status: 200 });
        }

        // Map Firestore documents to JSON
        const rooms = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        console.log(`✅ [GET] Successfully fetched ${rooms.length} rooms.`);
        return NextResponse.json({ success: true, data: rooms }, { status: 200 });
    } catch (error) {
        console.error("❌ [GET] Error fetching rooms:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * ✅ PUT: Edit a Room
 */
export async function PUT(req) {
    try {
        const { id, data } = await req.json();

        if (!id || !data) {
            return NextResponse.json({ error: "Invalid request. Missing room ID or data." }, { status: 400 });
        }

        console.log(`✏️ [PUT] Updating Room ID: ${id}`);

        const roomRef = doc(db, "Room", id);
        await updateDoc(roomRef, data);

        console.log(`✅ [PUT] Room ID ${id} updated successfully.`);
        return NextResponse.json({ success: true, message: "Room updated successfully." }, { status: 200 });
    } catch (error) {
        console.error("❌ [PUT] Error updating room:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * ✅ DELETE: Remove a Room
 */
export async function DELETE(req) {
    try {
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ error: "Invalid request. Missing room ID." }, { status: 400 });
        }

        console.log(`🗑️ [DELETE] Deleting Room ID: ${id}`);

        const roomRef = doc(db, "Room", id);
        await deleteDoc(roomRef);

        console.log(`✅ [DELETE] Room ID ${id} deleted successfully.`);
        return NextResponse.json({ success: true, message: "Room deleted successfully." }, { status: 200 });
    } catch (error) {
        console.error("❌ [DELETE] Error deleting room:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
