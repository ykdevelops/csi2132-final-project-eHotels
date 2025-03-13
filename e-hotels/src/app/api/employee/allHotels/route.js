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
 * ✅ GET Request: Fetch all hotels
 */
export async function GET() {
    try {
        console.log("🔍 [GET] Fetching all hotels from Firestore...");
        const querySnapshot = await getDocs(collection(db, "Hotel"));

        if (querySnapshot.empty) {
            console.warn("⚠️ [GET] No hotels found.");
        }

        const hotels = querySnapshot.docs.map(doc => ({
            hotel_ID: doc.id, // Firestore ID
            ...doc.data()
        }));

        return NextResponse.json({ success: true, data: hotels }, { status: 200 });
    } catch (error) {
        console.error("❌ [GET] Error fetching hotels:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * ✅ POST Request: Add a new hotel
 */
export async function POST(req) {
    try {
        const {
            name, location, hotelC_ID, address, area, email,
            numOfRooms, phoneNumber, rating
        } = await req.json();

        // ✅ Check for required fields
        if (!name || !location || !email || !numOfRooms) {
            return NextResponse.json({ error: "Missing required fields (name, location, email, numOfRooms)" }, { status: 400 });
        }

        const newHotelRef = doc(collection(db, "Hotel"));
        const newHotel = {
            hotel_ID: newHotelRef.id,
            name,
            location,
            hotelC_ID: hotelC_ID || "", // Optional
            address: address || "", // Optional
            area: area || "", // Optional
            email,
            numOfRooms: parseInt(numOfRooms) || 0, // Ensure it's a number
            phoneNumber: phoneNumber || "",
            rating: parseFloat(rating) || 0 // Ensure it's a number
        };

        await setDoc(newHotelRef, newHotel);

        return NextResponse.json({ success: true, message: "Hotel added successfully", data: newHotel }, { status: 201 });
    } catch (error) {
        console.error("❌ [POST] Error adding hotel:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

/**
 * ✅ PUT Request: Update an existing hotel
 */
export async function PUT(req) {
    try {
        const { hotel_ID, hotelC_ID, name, location, area, email, numOfRooms, phoneNumber, rating } = await req.json();

        if (!hotel_ID) {
            return NextResponse.json({ error: "Hotel ID is required" }, { status: 400 });
        }

        const hotelRef = doc(db, "Hotel", hotel_ID);
        await updateDoc(hotelRef, {
            hotelC_ID,
            name,
            location,  // ✅ Ensure this matches frontend
            area,
            email,
            numOfRooms,
            phoneNumber,
            rating
        });

        return NextResponse.json({ success: true, message: "Hotel updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("❌ [PUT] Error updating hotel:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


/**
 * ✅ DELETE Request: Remove a hotel
 */
export async function DELETE(req) {
    try {
        const { hotel_ID } = await req.json();

        if (!hotel_ID) {
            return NextResponse.json({ error: "Hotel ID is required" }, { status: 400 });
        }

        await deleteDoc(doc(db, "Hotel", hotel_ID));

        return NextResponse.json({ success: true, message: "Hotel deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("❌ [DELETE] Error deleting hotel:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

