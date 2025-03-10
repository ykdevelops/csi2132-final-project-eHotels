import { NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    getDocs,
    query,
    where
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

export async function GET() {
    try {
        console.log("🔥 Fetching all available rooms from Firestore...");

        // Step 1: Fetch All Hotels
        const hotelsSnapshot = await getDocs(collection(db, "Hotel"));
        if (hotelsSnapshot.empty) {
            console.log("🚨 No hotels found!");
            return NextResponse.json([], { status: 200 });
        }

        let allRooms = [];

        // Step 2: For each hotel, fetch matching rooms from top-level "Room" collection
        for (const hotelDoc of hotelsSnapshot.docs) {
            const hotelData = hotelDoc.data();
            const hID = hotelData.hotel_ID; // The unique ID assigned in your schema
            console.log(`🏨 Found hotel: ${hID} - ${hotelData.name}`);

            // Query the "Room" collection for rooms referencing this hotel
            const roomQuery = query(collection(db, "Room"), where("hotel_ID", "==", hID));
            const roomsSnapshot = await getDocs(roomQuery);

            if (roomsSnapshot.empty) {
                console.log(`🚨 No rooms found for hotel: ${hotelData.name}`);
            }

            roomsSnapshot.forEach((roomDoc) => {
                const rData = roomDoc.data();
                console.log(`🛏️ Found room: ${rData.room_ID} - Data:`, rData);

                allRooms.push({
                    id: roomDoc.id,         // Firestore doc ID
                    hotelID: hID,           // The hotel this room belongs to
                    hotelName: hotelData.name,
                    ...rData,               // e.g. capacity, price, view, etc.
                });
            });
        }

        console.log(`✅ Total rooms fetched: ${allRooms.length}`);
        return NextResponse.json(allRooms, { status: 200 });
    } catch (error) {
        console.error("❌ Error fetching rooms:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
