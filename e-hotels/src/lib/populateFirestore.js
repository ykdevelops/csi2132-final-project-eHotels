require("dotenv").config({ path: ".env.local" }); // ✅ Load environment variables

const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, doc, setDoc } = require("firebase/firestore");

// ✅ Firebase Configuration (Uses Environment Variables)
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

const hotelChainId = "2vGpPOwRVel05GwtQg6F"; // 🔹 Replace with your hotel chain ID
const hotelId = "RMtUTvMcPiuwIRBSFLtU"; // 🔹 Replace with your hotel ID

// ✅ Fetch Existing Rooms
async function fetchAvailableRooms() {
    try {
        console.log("🔥 Fetching available rooms...");

        if (!hotelChainId || !hotelId) {
            throw new Error("❌ Invalid hotelChainId or hotelId. Ensure they exist in Firestore.");
        }

        const roomsCollection = collection(db, "hotelChains", hotelChainId, "hotels", hotelId, "rooms");
        const roomsSnapshot = await getDocs(roomsCollection);

        const rooms = roomsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        console.log("📋 Current available rooms:", rooms);

        if (rooms.length === 0) {
            console.log("🚨 No available rooms found! We need to insert new ones.");
        } else {
            console.log(`✅ Found ${rooms.length} rooms in Firestore.`);
        }

        return rooms;
    } catch (error) {
        console.error("❌ Error fetching rooms:", error.message);
        return [];
    }
}

// ✅ Insert 5 Unique Rooms
async function insertMultipleRooms() {
    try {
        console.log("🔥 Inserting 5 unique rooms...");

        if (!hotelChainId || !hotelId) {
            throw new Error("❌ Invalid hotelChainId or hotelId.");
        }

        const newRooms = [
            {
                id: "room_002",
                capacity: 3,
                price: 180,
                view: "mountain",
                isAvailable: true,
                amenities: ["TV", "WiFi", "Coffee Maker"],
                extendible: true,
            },
            {
                id: "room_003",
                capacity: 4,
                price: 250,
                view: "city",
                isAvailable: true,
                amenities: ["TV", "WiFi", "Mini Bar", "Balcony"],
                extendible: false,
            },
            {
                id: "room_004",
                capacity: 1,
                price: 100,
                view: "garden",
                isAvailable: false,
                amenities: ["TV", "WiFi"],
                extendible: false,
            },
            {
                id: "room_005",
                capacity: 2,
                price: 130,
                view: "poolside",
                isAvailable: true,
                amenities: ["TV", "WiFi", "Jacuzzi"],
                extendible: true,
            },
            {
                id: "room_006",
                capacity: 5,
                price: 300,
                view: "ocean",
                isAvailable: true,
                amenities: ["TV", "WiFi", "Kitchenette", "Private Deck"],
                extendible: false,
            },
        ];

        for (const room of newRooms) {
            const roomRef = doc(db, "hotelChains", hotelChainId, "hotels", hotelId, "rooms", room.id);
            await setDoc(roomRef, room);
            console.log(`✅ Room ${room.id} added.`);
        }

        console.log("🚀 All rooms added successfully!");

    } catch (error) {
        console.error("❌ Error inserting rooms:", error.message);
    }
}

// ✅ Run Fetch First, Then Insert If Needed
fetchAvailableRooms().then((rooms) => {
    if (rooms.length < 5) {
        insertMultipleRooms();
    } else {
        console.log("✅ Enough rooms exist! Insert skipped.");
    }
});
