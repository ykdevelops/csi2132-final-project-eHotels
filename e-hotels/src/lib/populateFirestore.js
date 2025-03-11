require("dotenv").config({ path: ".env.local" });

const { initializeApp } = require("firebase/app");
const {
    getFirestore,
    collection,
    doc,
    setDoc,
    deleteDoc,
    getDocs,
} = require("firebase/firestore");
const bcrypt = require("bcryptjs");

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

// ============ Database Population ============ //

// ✅ Hotel Chains
const hotelChains = [
    { hotelC_ID: "hc1", name: "Summit Grand Group", email: "summit@example.com", address: "777 Peak Rd, Denver", numOfHotels: 5, phoneNumber: "+1 303-555-0101" },
    { hotelC_ID: "hc2", name: "Evergreen Hospitality", email: "evergreen@example.com", address: "111 Greenway Dr, Calgary", numOfHotels: 5, phoneNumber: "+1 587-555-0102" },
    { hotelC_ID: "hc3", name: "Urban Lux Stays", email: "urbanlux@example.com", address: "555 Downtown St, Toronto", numOfHotels: 5, phoneNumber: "+1 416-555-0103" },
    { hotelC_ID: "hc4", name: "Coastal Retreats", email: "coastal@example.com", address: "222 Oceanview Ave, Miami", numOfHotels: 5, phoneNumber: "+1 305-555-0104" },
    { hotelC_ID: "hc5", name: "Mountain Escapes", email: "mountain@example.com", address: "999 Alpine Rd, Vancouver", numOfHotels: 5, phoneNumber: "+1 604-555-0105" },
];

// ✅ Hotels (5 per chain, each with an area)
const hotels = [
    // Summit Grand Group
    { hotel_ID: "h1", hotelC_ID: "hc1", name: "Summit View Hotel", address: "121 Mountain Peak St", email: "summitview@example.com", rating: 5, numOfRooms: 5, phoneNumber: "+1 303-555-0201", area: "Downtown" },
    { hotel_ID: "h2", hotelC_ID: "hc1", name: "Grand Valley Inn", address: "99 Hilltop Rd", email: "grandvalley@example.com", rating: 4, numOfRooms: 5, phoneNumber: "+1 303-555-0202", area: "Suburban" },

    // Evergreen Hospitality
    { hotel_ID: "h3", hotelC_ID: "hc2", name: "Evergreen Lodge", address: "400 Pine St", email: "evergreenlodge@example.com", rating: 5, numOfRooms: 5, phoneNumber: "+1 587-555-0203", area: "Countryside" },
    { hotel_ID: "h4", hotelC_ID: "hc2", name: "Greenway Hotel", address: "112 Maple Dr", email: "greenwayhotel@example.com", rating: 3, numOfRooms: 5, phoneNumber: "+1 587-555-0204", area: "Suburban" },

    // Urban Lux Stays
    { hotel_ID: "h5", hotelC_ID: "hc3", name: "Urban Loft Hotel", address: "50 Downtown Ave", email: "urbanloft@example.com", rating: 5, numOfRooms: 5, phoneNumber: "+1 416-555-0205", area: "Downtown" },
    { hotel_ID: "h6", hotelC_ID: "hc3", name: "Cityscape Suites", address: "88 Highrise Blvd", email: "cityscape@example.com", rating: 4, numOfRooms: 5, phoneNumber: "+1 416-555-0206", area: "Suburban" },
];


// ✅ Rooms (5 per hotel with variation)
const amenitiesList = [
    "WiFi,TV,Balcony",
    "WiFi,TV",
    "WiFi,TV,Mini Fridge",
    "WiFi,TV,Balcony,Hot Tub",
    "WiFi,TV,Work Desk"
];

const rooms = [];
hotels.forEach((hotel, index) => {
    for (let i = 1; i <= 5; i++) {
        rooms.push({
            room_ID: `r${index + 1}_${i}`,
            hotel_ID: hotel.hotel_ID,
            capacity: Math.floor(Math.random() * 4) + 1, // Random capacity between 1 and 4
            price: 80 + Math.floor(Math.random() * 121) + i * 10, // Price between 80 and 200 with variation
            view: Math.random() > 0.5, // 50% chance of having a view
            isAvailable: true,
            extendible: Math.random() > 0.5, // 50% chance of being extendible
            amenities: amenitiesList[i - 1], // Vary amenities
            issues: Math.random() > 0.85 ? "Minor plumbing issue" : "", // 15% chance of an issue
            bookedDates: [],
        });
    }
});


// ✅ Customers
const customers = [
    { cus_ID: "c1", name: "John Doe", email: "customer1@example.com", address: "111 Customer Ave", dateOfReg: "2024-01-01" },
    { cus_ID: "c2", name: "Alice Brown", email: "customer2@example.com", address: "222 Customer Blvd", dateOfReg: "2024-02-15" },
];

// ✅ Bookings
const book = [
    { book_ID: "bk1", cus_ID: "c1", room_ID: "r1_1", ba_ID: "b1", checkInDate: "2025-03-01", checkOutDate: "2025-03-05" },
    { book_ID: "bk2", cus_ID: "c2", room_ID: "r2_2", ba_ID: "b2", checkInDate: "2025-04-10", checkOutDate: "2025-04-15" },
];

// ✅ Rent Relationship
const rent = [
    { rent_ID: "rent1", cus_ID: "c1", room_ID: "r3_1", startDate: "2025-06-01", endDate: "2025-06-07" },
];

// ==================================
// ============ MAIN SCRIPT =========
// ==================================

async function populateFirestore() {
    console.log("🔥 Clearing existing data...");

    // Clear all relevant collections
    const collectionsToClear = [
        "HotelChain",
        "Hotel",
        "Room",
        "Customer",
        "Book",
        "Rent",
    ];

    for (const col of collectionsToClear) {
        await clearCollection(col);
    }
    console.log("🗑 All collections cleared!");

    console.log("🔥 Populating Firestore...");

    // Insert data
    await insertData("HotelChain", hotelChains, "hotelC_ID");
    await insertData("Hotel", hotels, "hotel_ID");
    await insertData("Room", rooms, "room_ID");

    // Insert Customers
    for (const cust of customers) {
        cust.password = await bcrypt.hash("1234", 10);
    }
    await insertData("Customer", customers, "cus_ID");

    await insertData("Book", book, "book_ID");
    await insertData("Rent", rent, "rent_ID");

    console.log("✅ Firestore Population Complete!");
}

// ================== Helpers ==================

// Clears entire collection
async function clearCollection(collectionName) {
    const querySnapshot = await getDocs(collection(db, collectionName));
    for (const docSnap of querySnapshot.docs) {
        await deleteDoc(doc(db, collectionName, docSnap.id));
        console.log(`🗑 Deleted from ${collectionName}: ${docSnap.id}`);
    }
}

// Inserts array of items into a Firestore collection
async function insertData(collectionName, dataArray, idField) {
    for (const item of dataArray) {
        const itemID = item[idField];
        if (!itemID) {
            console.error(`❌ Missing ${idField} for ${collectionName}:`, item);
            continue;
        }
        const itemRef = doc(collection(db, collectionName), itemID);
        await setDoc(itemRef, item);
        console.log(`✅ Inserted into ${collectionName}: ${itemID}`);
    }
}

// Run the script
populateFirestore().catch(console.error);
