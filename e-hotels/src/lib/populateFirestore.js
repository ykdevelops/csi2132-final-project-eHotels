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

// =======================================
// 1) Firebase Config + Initialization
// =======================================
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// =======================================
// 2) Data Definitions
// =======================================

// ========== Hotel Chains (5) ==========
const hotelChains = [
    {
        hotelC_ID: "hc1",
        name: "Summit Grand Group",
        email: "summit@example.com",
        address: "777 Peak Rd, Denver",
        numOfHotels: 5,
        phoneNumber: "+1 303-555-0101",
    },
    {
        hotelC_ID: "hc2",
        name: "Evergreen Hospitality",
        email: "evergreen@example.com",
        address: "111 Greenway Dr, Calgary",
        numOfHotels: 5,
        phoneNumber: "+1 587-555-0102",
    },
    {
        hotelC_ID: "hc3",
        name: "Urban Lux Stays",
        email: "urbanlux@example.com",
        address: "555 Downtown St, Toronto",
        numOfHotels: 5,
        phoneNumber: "+1 416-555-0103",
    },
    {
        hotelC_ID: "hc4",
        name: "Coastal Retreats",
        email: "coastal@example.com",
        address: "222 Oceanview Ave, Miami",
        numOfHotels: 5,
        phoneNumber: "+1 305-555-0104",
    },
    {
        hotelC_ID: "hc5",
        name: "Mountain Escapes",
        email: "mountain@example.com",
        address: "999 Alpine Rd, Vancouver",
        numOfHotels: 5,
        phoneNumber: "+1 604-555-0105",
    },
];

// ========== Hotels (6 total) ==========
// (You can expand further if you like, but here we have at least 5+ total)
const hotels = [
    // For chain hc1
    {
        hotel_ID: "h1",
        hotelC_ID: "hc1",
        name: "Summit View Hotel",
        address: "121 Mountain Peak St",
        email: "summitview@example.com",
        rating: 5,
        numOfRooms: 5,
        phoneNumber: "+1 303-555-0201",
        area: "Downtown",
    },
    {
        hotel_ID: "h2",
        hotelC_ID: "hc1",
        name: "Grand Valley Inn",
        address: "99 Hilltop Rd",
        email: "grandvalley@example.com",
        rating: 4,
        numOfRooms: 5,
        phoneNumber: "+1 303-555-0202",
        area: "Suburban",
    },

    // For chain hc2
    {
        hotel_ID: "h3",
        hotelC_ID: "hc2",
        name: "Evergreen Lodge",
        address: "400 Pine St",
        email: "evergreenlodge@example.com",
        rating: 5,
        numOfRooms: 5,
        phoneNumber: "+1 587-555-0203",
        area: "Countryside",
    },
    {
        hotel_ID: "h4",
        hotelC_ID: "hc2",
        name: "Greenway Hotel",
        address: "112 Maple Dr",
        email: "greenwayhotel@example.com",
        rating: 3,
        numOfRooms: 5,
        phoneNumber: "+1 587-555-0204",
        area: "Suburban",
    },

    // For chain hc3
    {
        hotel_ID: "h5",
        hotelC_ID: "hc3",
        name: "Urban Loft Hotel",
        address: "50 Downtown Ave",
        email: "urbanloft@example.com",
        rating: 5,
        numOfRooms: 5,
        phoneNumber: "+1 416-555-0205",
        area: "Downtown",
    },
    {
        hotel_ID: "h6",
        hotelC_ID: "hc3",
        name: "Cityscape Suites",
        address: "88 Highrise Blvd",
        email: "cityscape@example.com",
        rating: 4,
        numOfRooms: 5,
        phoneNumber: "+1 416-555-0206",
        area: "Suburban",
    },
];

// ========== Rooms ==========
// Dynamically create 5 rooms per hotel => 6 hotels => 30 rooms
const amenitiesList = [
    ["WiFi", "TV", "Balcony"],
    ["WiFi", "TV"],
    ["WiFi", "TV", "Mini Fridge"],
    ["WiFi", "TV", "Balcony", "Hot Tub"],
    ["WiFi", "TV", "Work Desk"],
];

const rooms = [];
hotels.forEach((hotel, index) => {
    for (let i = 1; i <= 5; i++) {
        rooms.push({
            room_ID: `r${index + 1}_${i}`,
            hotel_ID: hotel.hotel_ID,
            capacity: Math.floor(Math.random() * 4) + 1, // 1-4
            price: 80 + Math.floor(Math.random() * 121) + i * 10, // 80-200 range
            view: Math.random() > 0.5, // boolean
            isAvailable: true,
            extendible: Math.random() > 0.5 ? "Yes" : "No",
            amenities: amenitiesList[i - 1],
            issues: Math.random() > 0.85 ? "Minor plumbing issue" : "",
            // ~20% chance to have a "bookedDates" entry
            bookedDates:
                Math.random() > 0.2
                    ? [
                        {
                            book_ID: `book_${Date.now() + i}`,
                            startDate: "2025-03-12",
                            endDate: "2025-03-13",
                        },
                    ]
                    : [],
        });
    }
});

// ========== Customers (5) ==========
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
    {
        cus_ID: "c3",
        name: "Bob Smith",
        email: "customer3@example.com",
        address: "333 Customer Cres",
        dateOfReg: "2024-03-20",
    },
    {
        cus_ID: "c4",
        name: "Diana Prince",
        email: "customer4@example.com",
        address: "444 Amazon Ave",
        dateOfReg: "2024-04-25",
    },
    {
        cus_ID: "c5",
        name: "Charlie Green",
        email: "customer5@example.com",
        address: "555 Forest Ln",
        dateOfReg: "2024-05-30",
    },
];

// ========== Book (5) ==========
const book = [
    {
        book_ID: "bk1",
        cus_ID: "c1",
        room_ID: "r1_1",
        ba_ID: "b1",
        checkInDate: "2025-03-01",
        checkOutDate: "2025-03-05",
        checkedIn: false,
    },
    {
        book_ID: "bk2",
        cus_ID: "c2",
        room_ID: "r2_2",
        ba_ID: "b2",
        checkInDate: "2025-04-10",
        checkOutDate: "2025-04-15",
        checkedIn: false,
    },
    {
        book_ID: "bk3",
        cus_ID: "c3",
        room_ID: "r4_1",
        ba_ID: "b3",
        checkInDate: "2025-05-01",
        checkOutDate: "2025-05-03",
        checkedIn: false,
    },
    {
        book_ID: "bk4",
        cus_ID: "c4",
        room_ID: "r5_2",
        ba_ID: "b4",
        checkInDate: "2025-06-20",
        checkOutDate: "2025-06-25",
        checkedIn: false,
    },
    {
        book_ID: "bk5",
        cus_ID: "c5",
        room_ID: "r6_5",
        ba_ID: "b5",
        checkInDate: "2025-07-05",
        checkOutDate: "2025-07-10",
        checkedIn: false,
    },
];

// ========== Rent (5) ==========
const rent = [
    {
        rent_ID: "rent1",
        cus_ID: "c1",
        room_ID: "r3_1",
        startDate: "2025-06-01",
        endDate: "2025-06-07",
    },
    {
        rent_ID: "rent2",
        cus_ID: "c2",
        room_ID: "r1_2",
        startDate: "2025-08-10",
        endDate: "2025-08-15",
    },
    {
        rent_ID: "rent3",
        cus_ID: "c3",
        room_ID: "r2_5",
        startDate: "2025-09-05",
        endDate: "2025-09-10",
    },
    {
        rent_ID: "rent4",
        cus_ID: "c4",
        room_ID: "r6_3",
        startDate: "2025-11-20",
        endDate: "2025-11-22",
    },
    {
        rent_ID: "rent5",
        cus_ID: "c5",
        room_ID: "r4_2",
        startDate: "2025-12-01",
        endDate: "2025-12-05",
    },
];

// ============================================
// 3) NEW RELATIONS (5 each), from screenshots
// ============================================

// ========== CheckIn (5) ==========
const checkIns = [
    {
        checkIn_ID: "ch1",
        book_ID: "bk1",
        checkInDate: "2025-03-03",
        cus_ID: "c1",
        room_ID: "r1_1",
    },
    {
        checkIn_ID: "ch2",
        book_ID: "bk2",
        checkInDate: "2025-03-10",
        cus_ID: "c2",
        room_ID: "r2_2",
    },
    {
        checkIn_ID: "ch3",
        book_ID: "bk3",
        checkInDate: "2025-05-02",
        cus_ID: "c3",
        room_ID: "r4_1",
    },
    {
        checkIn_ID: "ch4",
        book_ID: "bk4",
        checkInDate: "2025-06-20",
        cus_ID: "c4",
        room_ID: "r5_2",
    },
    {
        checkIn_ID: "ch5",
        book_ID: "bk5",
        checkInDate: "2025-07-05",
        cus_ID: "c5",
        room_ID: "r6_5",
    },
];

// ========== RentArchive (5) ==========
const rentArchive = [
    {
        rentA_ID: "ra1",
        rent_ID: "rent1",
        cus_ID: "c1",
        room_ID: "r3_1",
        ba_ID: "b1",
        book_ID: "bk1",
        checkInDate: "2025-03-03",
        checkOutDate: "2025-03-05",
        active: false,
    },
    {
        rentA_ID: "ra2",
        rent_ID: "rent2",
        cus_ID: "c2",
        room_ID: "r1_2",
        ba_ID: "b2",
        book_ID: "bk2",
        checkInDate: "2025-04-10",
        checkOutDate: "2025-04-15",
        active: false,
    },
    {
        rentA_ID: "ra3",
        rent_ID: "rent3",
        cus_ID: "c3",
        room_ID: "r2_5",
        ba_ID: "b3",
        book_ID: "bk3",
        checkInDate: "2025-05-01",
        checkOutDate: "2025-05-03",
        active: false,
    },
    {
        rentA_ID: "ra4",
        rent_ID: "rent4",
        cus_ID: "c4",
        room_ID: "r6_3",
        ba_ID: "b4",
        book_ID: "bk4",
        checkInDate: "2025-06-20",
        checkOutDate: "2025-06-25",
        active: true,
    },
    {
        rentA_ID: "ra5",
        rent_ID: "rent5",
        cus_ID: "c5",
        room_ID: "r4_2",
        ba_ID: "b5",
        book_ID: "bk5",
        checkInDate: "2025-07-05",
        checkOutDate: "2025-07-10",
        active: true,
    },
];

// ========== BookArchive (5) ==========
const bookArchive = [
    {
        bookA_ID: "ba1",
        book_ID: "bk1",
        cus_ID: "c1",
        room_ID: "r1_1",
        startDate: "2025-06-01",
        endDate: "2025-06-07",
        createdAt: "11 March 2025 at 23:34:31 UTC-4",
    },
    {
        bookA_ID: "ba2",
        book_ID: "bk2",
        cus_ID: "c2",
        room_ID: "r2_2",
        startDate: "2025-07-10",
        endDate: "2025-07-15",
        createdAt: "12 March 2025 at 11:22:00 UTC-4",
    },
    {
        bookA_ID: "ba3",
        book_ID: "bk3",
        cus_ID: "c3",
        room_ID: "r4_1",
        startDate: "2025-05-01",
        endDate: "2025-05-03",
        createdAt: "13 March 2025 at 09:15:55 UTC-4",
    },
    {
        bookA_ID: "ba4",
        book_ID: "bk4",
        cus_ID: "c4",
        room_ID: "r5_2",
        startDate: "2025-06-20",
        endDate: "2025-06-25",
        createdAt: "14 March 2025 at 17:47:10 UTC-4",
    },
    {
        bookA_ID: "ba5",
        book_ID: "bk5",
        cus_ID: "c5",
        room_ID: "r6_5",
        startDate: "2025-07-05",
        endDate: "2025-07-10",
        createdAt: "15 March 2025 at 08:05:27 UTC-4",
    },
];

// ========== Employee (5) ==========
// We’ll hash the password for each employee
const employees = [
    {
        emp_ID: "e1",
        hotel_ID: "h1",
        name: "Bob Williams",
        email: "employee1@example.com",
        phoneNumber: "555-1111",
        address: "123 Example St",
        role: "Reception",
    },
    {
        emp_ID: "e2",
        hotel_ID: "h2",
        name: "Charlie Parker",
        email: "employee2@example.com",
        phoneNumber: "555-2222",
        address: "456 Another St",
        role: "Housekeeping",
    },
    {
        emp_ID: "e3",
        hotel_ID: "h3",
        name: "Diane Sawyer",
        email: "employee3@example.com",
        phoneNumber: "555-3333",
        address: "789 Third Ave",
        role: "Maintenance",
    },
    {
        emp_ID: "e4",
        hotel_ID: "h4",
        name: "Erika Stone",
        email: "employee4@example.com",
        phoneNumber: "555-4444",
        address: "101 CheckIn Blvd",
        role: "Security",
    },
    {
        emp_ID: "e5",
        hotel_ID: "h5",
        name: "Frank Green",
        email: "employee5@example.com",
        phoneNumber: "555-5555",
        address: "202 Kitchen Alley",
        role: "Chef",
    },
];

// ========== Manager (5) ==========
// (Can also hash password if your model requires it)
const managers = [
    {
        man_ID: "m1",
        hotel_ID: "h1",
        name: "Alice Johnson",
        email: "manager1@example.com",
    },
    {
        man_ID: "m2",
        hotel_ID: "h2",
        name: "Brian Thompson",
        email: "manager2@example.com",
    },
    {
        man_ID: "m3",
        hotel_ID: "h3",
        name: "Carla White",
        email: "manager3@example.com",
    },
    {
        man_ID: "m4",
        hotel_ID: "h4",
        name: "Daniel Lee",
        email: "manager4@example.com",
    },
    {
        man_ID: "m5",
        hotel_ID: "h5",
        name: "Eva Green",
        email: "manager5@example.com",
    },
];

// ========== Payment (5) ==========
const payments = [
    {
        pay_ID: "p1",
        amount: 300,
        date: "2025-04-15",
    },
    {
        pay_ID: "p2",
        amount: 450,
        date: "2025-05-02",
    },
    {
        pay_ID: "p3",
        amount: 120,
        date: "2025-06-09",
    },
    {
        pay_ID: "p4",
        amount: 750,
        date: "2025-07-10",
    },
    {
        pay_ID: "p5",
        amount: 280,
        date: "2025-08-01",
    },
];

// ==================================
// 4) Main population script
// ==================================
async function populateFirestore() {
    console.log("🔥 Clearing existing data...");

    // Add all old + new collections here
    const collectionsToClear = [
        "HotelChain",
        "Hotel",
        "Room",
        "Customer",
        "Book",
        "Rent",
        "CheckIn",
        "RentArchive",
        "BookArchive",
        "Employee",
        "Manager",
        "Payment",
    ];

    for (const col of collectionsToClear) {
        await clearCollection(col);
    }
    console.log("🗑 All collections cleared!");

    console.log("🔥 Populating Firestore...");

    // =======================================
    // 4A) Insert old (original) data
    // =======================================
    await insertData("HotelChain", hotelChains, "hotelC_ID");
    await insertData("Hotel", hotels, "hotel_ID");
    await insertData("Room", rooms, "room_ID");

    // Customers get hashed passwords
    for (const cust of customers) {
        cust.password = await bcrypt.hash("1234", 10);
    }
    await insertData("Customer", customers, "cus_ID");

    await insertData("Book", book, "book_ID");
    await insertData("Rent", rent, "rent_ID");

    // =======================================
    // 4B) Insert new data (from screenshots)
    // =======================================

    // CheckIn
    await insertData("CheckIn", checkIns, "checkIn_ID");

    // RentArchive
    await insertData("RentArchive", rentArchive, "rentA_ID");

    // BookArchive
    await insertData("BookArchive", bookArchive, "bookA_ID");

    // Employees get hashed passwords, if needed
    for (const emp of employees) {
        emp.password = await bcrypt.hash("1234", 10);
    }
    await insertData("Employee", employees, "emp_ID");

    // Managers (hash if needed)
    for (const mgr of managers) {
        // mgr.password = await bcrypt.hash("1234", 10);
    }
    await insertData("Manager", managers, "man_ID");

    // Payment
    await insertData("Payment", payments, "pay_ID");

    console.log("✅ Firestore Population Complete!");
}

// ================ Helper Functions ================

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

// ================ Run the script ================
populateFirestore().catch(console.error);
