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

// ========== Hotels (Now 25 total) ==========
// Original 6 remain unchanged; new ones have been ADDED below
const hotels = [
    // -----------------------------
    // Existing (hc1) -> 2 hotels
    // -----------------------------
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

    // -----------------------------
    // Existing (hc2) -> 2 hotels
    // -----------------------------
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

    // -----------------------------
    // Existing (hc3) -> 2 hotels
    // -----------------------------
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

    // ==============================
    // ADDITIONAL HOTELS
    // ==============================

    // ~~~ For hc1 (need 3 more to reach 5 total) ~~~
    {
        hotel_ID: "h7",
        hotelC_ID: "hc1",
        name: "Peakside Suites",
        address: "200 Alpine Path",
        email: "peakside@example.com",
        rating: 4,
        numOfRooms: 5,
        phoneNumber: "+1 303-555-0207",
        area: "Countryside",
    },
    {
        hotel_ID: "h8",
        hotelC_ID: "hc1",
        name: "Mountain Edge Resort",
        address: "305 Summit Drive",
        email: "mountainedge@example.com",
        rating: 5,
        numOfRooms: 5,
        phoneNumber: "+1 303-555-0208",
        area: "Downtown",
    },
    {
        hotel_ID: "h9",
        hotelC_ID: "hc1",
        name: "Alpine Heights Hotel",
        address: "910 Skyline Blvd",
        email: "alpineheights@example.com",
        rating: 3,
        numOfRooms: 5,
        phoneNumber: "+1 303-555-0209",
        area: "Suburban",
    },

    // ~~~ For hc2 (need 3 more to reach 5 total) ~~~
    {
        hotel_ID: "h10",
        hotelC_ID: "hc2",
        name: "Forestview Inn",
        address: "441 Maple Grove",
        email: "forestview@example.com",
        rating: 4,
        numOfRooms: 5,
        phoneNumber: "+1 587-555-0210",
        area: "Countryside",
    },
    {
        hotel_ID: "h11",
        hotelC_ID: "hc2",
        name: "Pinecone Retreat",
        address: "120 Pinecone Lane",
        email: "pinecone@example.com",
        rating: 5,
        numOfRooms: 5,
        phoneNumber: "+1 587-555-0211",
        area: "Downtown",
    },
    {
        hotel_ID: "h12",
        hotelC_ID: "hc2",
        name: "Woodland Oasis",
        address: "680 Cedar Rd",
        email: "woodland@example.com",
        rating: 4,
        numOfRooms: 5,
        phoneNumber: "+1 587-555-0212",
        area: "Suburban",
    },

    // ~~~ For hc3 (need 3 more to reach 5 total) ~~~
    {
        hotel_ID: "h13",
        hotelC_ID: "hc3",
        name: "Metropolitan Hub",
        address: "22 Skyline Ave",
        email: "metrohub@example.com",
        rating: 4,
        numOfRooms: 5,
        phoneNumber: "+1 416-555-0213",
        area: "Downtown",
    },
    {
        hotel_ID: "h14",
        hotelC_ID: "hc3",
        name: "Urban Heights Inn",
        address: "77 Midtown Rd",
        email: "urbanheights@example.com",
        rating: 5,
        numOfRooms: 5,
        phoneNumber: "+1 416-555-0214",
        area: "Suburban",
    },
    {
        hotel_ID: "h15",
        hotelC_ID: "hc3",
        name: "City Lights Hotel",
        address: "33 Bright Blvd",
        email: "citylights@example.com",
        rating: 3,
        numOfRooms: 5,
        phoneNumber: "+1 416-555-0215",
        area: "Downtown",
    },

    // ~~~ For hc4 (need 5 total) ~~~
    {
        hotel_ID: "h16",
        hotelC_ID: "hc4",
        name: "Coastal Breeze Resort",
        address: "101 Seashore Dr",
        email: "coastalbreeze@example.com",
        rating: 5,
        numOfRooms: 5,
        phoneNumber: "+1 305-555-0216",
        area: "Downtown",
    },
    {
        hotel_ID: "h17",
        hotelC_ID: "hc4",
        name: "Oceanview Villas",
        address: "202 Marine Ave",
        email: "oceanviewvillas@example.com",
        rating: 4,
        numOfRooms: 5,
        phoneNumber: "+1 305-555-0217",
        area: "Suburban",
    },
    {
        hotel_ID: "h18",
        hotelC_ID: "hc4",
        name: "Island Paradise Inn",
        address: "300 Palm Tree Rd",
        email: "islandparadise@example.com",
        rating: 5,
        numOfRooms: 5,
        phoneNumber: "+1 305-555-0218",
        area: "Countryside",
    },
    {
        hotel_ID: "h19",
        hotelC_ID: "hc4",
        name: "Tidal Wave Suites",
        address: "400 Coral Blvd",
        email: "tidalwave@example.com",
        rating: 3,
        numOfRooms: 5,
        phoneNumber: "+1 305-555-0219",
        area: "Downtown",
    },
    {
        hotel_ID: "h20",
        hotelC_ID: "hc4",
        name: "Seashore Deluxe",
        address: "505 Anchor Ln",
        email: "seashoredeluxe@example.com",
        rating: 4,
        numOfRooms: 5,
        phoneNumber: "+1 305-555-0220",
        area: "Suburban",
    },

    // ~~~ For hc5 (need 5 total) ~~~
    {
        hotel_ID: "h21",
        hotelC_ID: "hc5",
        name: "Mountaintop Resort",
        address: "700 Summit Ave",
        email: "mountaintop@example.com",
        rating: 5,
        numOfRooms: 5,
        phoneNumber: "+1 604-555-0221",
        area: "Countryside",
    },
    {
        hotel_ID: "h22",
        hotelC_ID: "hc5",
        name: "High Peak Lodges",
        address: "801 Ridge Rd",
        email: "highpeak@example.com",
        rating: 4,
        numOfRooms: 5,
        phoneNumber: "+1 604-555-0222",
        area: "Suburban",
    },
    {
        hotel_ID: "h23",
        hotelC_ID: "hc5",
        name: "Snowcap Suites",
        address: "900 Glacier Dr",
        email: "snowcap@example.com",
        rating: 3,
        numOfRooms: 5,
        phoneNumber: "+1 604-555-0223",
        area: "Downtown",
    },
    {
        hotel_ID: "h24",
        hotelC_ID: "hc5",
        name: "Alpine Getaway Inn",
        address: "1022 Crestview Pl",
        email: "alpinegetaway@example.com",
        rating: 4,
        numOfRooms: 5,
        phoneNumber: "+1 604-555-0224",
        area: "Suburban",
    },
    {
        hotel_ID: "h25",
        hotelC_ID: "hc5",
        name: "Glacier Bay Hotel",
        address: "1150 Northern Pass",
        email: "glacierbay@example.com",
        rating: 5,
        numOfRooms: 5,
        phoneNumber: "+1 604-555-0225",
        area: "Countryside",
    },
];

// ========== Rooms ==========
// Dynamically create 5 rooms per hotel => 25 hotels => 125 rooms
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
            room_ID: `r${index + 1}_${i}`,  // e.g. r1_1 ... r25_5
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
        pay_ID: "payment_1",
        cus_ID: "c1",
        amount: 450,
        date: "2025-06-08",
        method: "Credit Card"
    },
    {
        pay_ID: "payment_2",
        cus_ID: "c2",
        amount: 375,
        date: "2025-06-15",
        method: "Debit Card"
    },
    {
        pay_ID: "payment_3",
        cus_ID: "c3",
        amount: 600,
        date: "2025-06-22",
        method: "Cash"
    },
    {
        pay_ID: "payment_4",
        cus_ID: "c4",
        amount: 520,
        date: "2025-06-29",
        method: "Credit Card"
    },
    {
        pay_ID: "payment_5",
        cus_ID: "c5",
        amount: 400,
        date: "2025-07-06",
        method: "Bank Transfer"
    }
];

// ========== Rent (5) ==========
const rent = [
    {
        rent_ID: "rent1",
        cus_ID: "c1",
        room_ID: "r1_5",
        startDate: "2025-06-08",
        endDate: "2025-06-11",
        payment_ID: "payment_1"
    },
    {
        rent_ID: "rent2",
        cus_ID: "c2",
        room_ID: "r2_3",
        startDate: "2025-06-15",
        endDate: "2025-06-18",
        payment_ID: "payment_2"
    },
    {
        rent_ID: "rent3",
        cus_ID: "c3",
        room_ID: "r3_4",
        startDate: "2025-06-22",
        endDate: "2025-06-25",
        payment_ID: "payment_3"
    },
    {
        rent_ID: "rent4",
        cus_ID: "c4",
        room_ID: "r4_2",
        startDate: "2025-06-29",
        endDate: "2025-07-02",
        payment_ID: "payment_4"
    },
    {
        rent_ID: "rent5",
        cus_ID: "c5",
        room_ID: "r5_3",
        startDate: "2025-07-06",
        endDate: "2025-07-09",
        payment_ID: "payment_5"
    }
];

// ==================================
// 4) Main population script
// ==================================
async function populateFirestore() {
    console.log("🔥 Clearing existing data...");

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
        "Payment"
    ];

    for (const col of collectionsToClear) {
        await clearCollection(col);
    }
    console.log("🗑 All collections cleared!");

    console.log("🔥 Populating Firestore...");

    await insertData("HotelChain", hotelChains, "hotelC_ID");
    await insertData("Hotel", hotels, "hotel_ID");
    await insertData("Room", rooms, "room_ID");

    for (const cust of customers) {
        cust.password = await bcrypt.hash("1234", 10);
    }
    await insertData("Customer", customers, "cus_ID");

    await insertData("Payment", payments, "pay_ID");
    await insertData("Book", book, "book_ID");
    await insertData("Rent", rent, "rent_ID");
    await insertData("CheckIn", checkIns, "checkIn_ID");
    await insertData("RentArchive", rentArchive, "rentA_ID");
    await insertData("BookArchive", bookArchive, "bookA_ID");

    for (const emp of employees) {
        emp.password = await bcrypt.hash("1234", 10);
    }
    await insertData("Employee", employees, "emp_ID");
    await insertData("Manager", managers, "man_ID");

    console.log("✅ Firestore Population Complete!");
}

async function clearCollection(collectionName) {
    const querySnapshot = await getDocs(collection(db, collectionName));
    for (const docSnap of querySnapshot.docs) {
        await deleteDoc(doc(db, collectionName, docSnap.id));
        console.log(`🗑 Deleted from ${collectionName}: ${docSnap.id}`);
    }
}

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

populateFirestore().catch(console.error);
