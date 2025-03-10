import { NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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

        let allRooms = [];
        const hotelChainsSnapshot = await getDocs(collection(db, "HotelChain"));

        if (hotelChainsSnapshot.empty) {
            console.log("🚨 No hotel chains found!");
        }

        for (const chainDoc of hotelChainsSnapshot.docs) {
            console.log(`🔍 Checking hotel chain: ${chainDoc.id} - ${chainDoc.data().name}`);

            const chainId = chainDoc.id;
            const hotelsCollection = collection(db, "HotelChain", chainId, "Hotels");
            const hotelsSnapshot = await getDocs(hotelsCollection);

            if (hotelsSnapshot.empty) {
                console.log(`🚨 No hotels found under chain: ${chainDoc.data().name}`);
            }

            for (const hotelDoc of hotelsSnapshot.docs) {
                console.log(`🏨 Found hotel: ${hotelDoc.id} - ${hotelDoc.data().name}`);

                const hotelId = hotelDoc.id;
                const roomsCollection = collection(db, "HotelChain", chainId, "Hotels", hotelId, "Rooms");
                const roomsSnapshot = await getDocs(roomsCollection);

                if (roomsSnapshot.empty) {
                    console.log(`🚨 No rooms found under hotel: ${hotelDoc.data().name}`);
                }

                roomsSnapshot.forEach((roomDoc) => {
                    console.log(`🛏️ Found room: ${roomDoc.id} - Data:`, roomDoc.data());
                    allRooms.push({
                        id: roomDoc.id,
                        hotelChain: chainDoc.data().name,
                        hotelName: hotelDoc.data().name,
                        ...roomDoc.data(),
                    });
                });
            }
        }

        console.log(`✅ Total rooms fetched: ${allRooms.length}`);
        return NextResponse.json(allRooms);

    } catch (error) {
        console.error("❌ Error fetching rooms:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
