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

/**
 * Clear an entire collection in Firestore.
 * @param {string} collectionName
 */
async function clearCollection(collectionName) {
    const querySnapshot = await getDocs(collection(db, collectionName));
    for (const docSnap of querySnapshot.docs) {
        await deleteDoc(doc(db, collectionName, docSnap.id));
        console.log(`🗑 Deleted from ${collectionName}: ${docSnap.id}`);
    }
}

/**
 * Insert an array of data items into a Firestore collection.
 * Uses the item object's corresponding ID field to ensure uniqueness.
 * e.g. hotelC_ID for HotelChain, hotel_ID for Hotel, etc.
 */
async function insertData(collectionName, dataArray, idField) {
    for (const item of dataArray) {
        // Attempt to get the ID from the item
        const itemID = item[idField];
        if (!itemID) {
            console.error(`❌ Missing ${idField} for collection ${collectionName}:`, item);
            continue;
        }

        const itemRef = doc(collection(db, collectionName), itemID);
        await setDoc(itemRef, item);
        console.log(`✅ Inserted into ${collectionName}: ${itemID}`);
    }
}

// ============ Sample Data ============ //

// ✅ HotelChain
const hotelChains = [
    {
        hotelC_ID: "hc1",
        name: "Summit Grand Hotels",
        email: "summit@example.com",
        address: "777 Peak Rd, Denver",
        numOfHotels: 2,
        phoneNumber: "+1 303-555-0101",
    },
    {
        hotelC_ID: "hc2",
        name: "Evergreen Stays",
        email: "evergreen@example.com",
        address: "111 Greenway Dr, Calgary",
        numOfHotels: 2,
        phoneNumber: "+1 587-555-0102",
    },
];

// ✅ Hotel
const hotels = [
    {
        hotel_ID: "h1",
        hotelC_ID: "hc1",
        name: "Golden Sands Hotel",
        address: "789 Beachfront Ave",
        email: "goldensands@example.com",
        rating: 5,
        numOfRooms: 10,
        phoneNumber: "+1 305-555-0103",
    },
    {
        hotel_ID: "h2",
        hotelC_ID: "hc2",
        name: "Skyline Resort",
        address: "101 Mountain View St",
        email: "skylineresort@example.com",
        rating: 4,
        numOfRooms: 8,
        phoneNumber: "+1 604-555-0104",
    },
];

// ✅ Manager
// In your schema, Manager(man-ID) is PK + FK to Employee(emp-ID).
// We'll store man-ID as the same as an Employee's emp-ID who is a Manager.
const managers = [
    { man_ID: "e1" }, // e1 is manager for hotel1
];

// ✅ Employee
const employees = [
    {
        emp_ID: "e1",
        hotel_ID: "h1", // Manager for Golden Sands Hotel
        name: "Alice Johnson",
        email: "employee1@example.com",
        address: "111 Manager Rd",
        role: "Manager",
    },
    {
        emp_ID: "e2",
        hotel_ID: "h1",
        name: "Bob Smith",
        email: "employee2@example.com",
        address: "222 Receptionist Ln",
        role: "Receptionist",
    },
    {
        emp_ID: "e3",
        hotel_ID: "h2",
        name: "Charlie Wilson",
        email: "employee3@example.com",
        address: "333 Housekeeping Ave",
        role: "Housekeeping",
    },
];

// ✅ Room
const rooms = [
    {
        room_ID: "r1",
        hotel_ID: "h1",
        capacity: 2,
        price: 150,
        view: true, // 'view' is boolean in schema
        isAvailable: true,
        extendible: false,
        amenities: "TV,WiFi",
        issues: "",
    },
    {
        room_ID: "r2",
        hotel_ID: "h1",
        capacity: 3,
        price: 200,
        view: false,
        isAvailable: true,
        extendible: true,
        amenities: "TV,WiFi,Balcony",
        issues: "AC not working",
    },
    {
        room_ID: "r3",
        hotel_ID: "h2",
        capacity: 4,
        price: 250,
        view: false,
        isAvailable: false,
        extendible: false,
        amenities: "TV,WiFi,Hot Tub",
        issues: "",
    },
];

// ✅ Customer
const customers = [
    {
        cus_ID: "c1",
        name: "John Doe",
        email: "customer1@example.com",
        address: "111 Customer Ave",
        dateOfReg: "2024-01-01",
    },
    {
        cus_ID: "c2",
        name: "Alice Brown",
        email: "customer2@example.com",
        address: "222 Customer Blvd",
        dateOfReg: "2024-02-15",
    },
];

// ✅ BookArchive
const bookArchive = [
    { ba_ID: "b1", date: "2025-04-10" },
    { ba_ID: "b2", date: "2025-05-12" },
];

// ✅ RentArchive
const rentArchive = [
    { ra_ID: "ra1", date: "2025-04-20" },
    { ra_ID: "ra2", date: "2025-05-22" },
];

// ✅ Book Relationship (cus-ID, room-ID, ba-ID, check-in, check-out)
const book = [
    {
        book_ID: "bk1",
        cus_ID: "c1",
        room_ID: "r1",
        ba_ID: "b1",
        checkInDate: "2025-03-01",
        checkOutDate: "2025-03-05"
    },
    {
        book_ID: "bk2",
        cus_ID: "c2",
        room_ID: "r2",
        ba_ID: "b2",
        checkInDate: "2025-04-10",
        checkOutDate: "2025-04-15"
    },
];


// ✅ Rent Relationship
// Active rentals might also exist outside the archive
const rent = [
    {
        rent_ID: "rent1",
        cus_ID: "c1",
        room_ID: "r2",
        startDate: "2025-06-01",
        endDate: "2025-06-07",
    },
];

// ✅ Payment
const payments = [
    { pay_ID: "p1", date: "2025-04-15", amount: 300 },
    { pay_ID: "p2", date: "2025-05-16", amount: 400 },
];

// ✅ CheckIn(cus-ID, emp-ID, pay-ID, ra-ID)
const checkIn = [
    {
        checkIn_ID: "ch1",
        cus_ID: "c1",
        emp_ID: "e2", // receptionist
        pay_ID: "p1",
        ra_ID: "ra1",
    },
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
        "Manager",
        "Room",
        "Employee",
        "Customer",
        "BookArchive",
        "RentArchive",
        "Book",
        "Rent",
        "Payment",
        "CheckIn",
    ];

    for (const col of collectionsToClear) {
        await clearCollection(col);
    }
    console.log("🗑 All collections cleared!");

    console.log("🔥 Populating Firestore...");

    // Insert data
    await insertData("HotelChain", hotelChains, "hotelC_ID");
    await insertData("Hotel", hotels, "hotel_ID");
    await insertData("Manager", managers, "man_ID");

    // Encrypt employee passwords before insert
    for (const emp of employees) {
        emp.password = await bcrypt.hash("1234", 10);
    }
    await insertData("Employee", employees, "emp_ID");

    // Insert Rooms
    await insertData("Room", rooms, "room_ID");

    // Insert Customers
    for (const cust of customers) {
        cust.password = await bcrypt.hash("1234", 10);
    }
    await insertData("Customer", customers, "cus_ID");

    await insertData("BookArchive", bookArchive, "ba_ID");
    await insertData("RentArchive", rentArchive, "ra_ID");
    await insertData("Book", book, "book_ID");
    await insertData("Rent", rent, "rent_ID");
    await insertData("Payment", payments, "pay_ID");
    await insertData("CheckIn", checkIn, "checkIn_ID");

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
