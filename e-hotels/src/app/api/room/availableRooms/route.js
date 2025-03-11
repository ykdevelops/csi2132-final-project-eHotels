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

        // Step 1: Fetch All Hotel Chains
        const hotelChainsSnapshot = await getDocs(collection(db, "HotelChain"));
        const hotelChainsMap = {}; // { hotelC_ID -> hotelChainName }

        hotelChainsSnapshot.forEach((doc) => {
            const chainData = doc.data();
            hotelChainsMap[chainData.hotelC_ID] = chainData.name || "Unknown Chain";
        });

        // Step 2: Fetch All Hotels
        const hotelsSnapshot = await getDocs(collection(db, "Hotel"));
        if (hotelsSnapshot.empty) {
            console.log("🚨 No hotels found!");
            return NextResponse.json([], { status: 200 });
        }

        // Create a hotel map for quick lookup (hotel_ID -> { hotelName, hotelChain, area })
        const hotelMap = {};
        hotelsSnapshot.forEach((doc) => {
            const hotelData = doc.data();
            hotelMap[hotelData.hotel_ID] = {
                hotelName: hotelData.name || "Unknown Hotel",
                hotelChain: hotelChainsMap[hotelData.hotelC_ID] || "Unknown Chain",
                area: hotelData.area || "Unknown Area"
            };
        });

        let allRooms = [];

        // Step 3: Fetch All Rooms
        const roomsSnapshot = await getDocs(collection(db, "Room"));
        if (roomsSnapshot.empty) {
            console.log("🚨 No rooms found!");
            return NextResponse.json([], { status: 200 });
        }

        roomsSnapshot.forEach((roomDoc) => {
            const roomData = roomDoc.data();
            const hotelDetails = hotelMap[roomData.hotel_ID] || {
                hotelName: "Unknown Hotel",
                hotelChain: "Unknown Chain",
                area: "Unknown Area"
            };

            console.log(`🛏️ Found room: ${roomData.room_ID} in ${hotelDetails.hotelName}`);

            allRooms.push({
                id: roomDoc.id,       // Firestore doc ID
                hotelID: roomData.hotel_ID,
                hotelName: hotelDetails.hotelName,
                hotelChain: hotelDetails.hotelChain,
                area: hotelDetails.area,
                ...roomData,          // e.g. capacity, price, view, etc.
            });
        });

        console.log(`✅ Total rooms fetched: ${allRooms.length}`);
        return NextResponse.json(allRooms, { status: 200 });
    } catch (error) {
        console.error("❌ Error fetching rooms:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
