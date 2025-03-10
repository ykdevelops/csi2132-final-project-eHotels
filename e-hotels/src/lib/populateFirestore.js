require("dotenv").config({ path: ".env.local" });

const { initializeApp } = require("firebase/app");
const { getFirestore, collection, doc, setDoc } = require("firebase/firestore");
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

// ✅ Sample Hotel Chains (3 chains)
const hotelChains = [
    { name: "Summit Grand Hotels", numOfHotels: 3, address: "777 Peak Rd, Denver" },
    { name: "Evergreen Stays", numOfHotels: 3, address: "111 Greenway Dr, Calgary" },
    { name: "BlueWave Hospitality", numOfHotels: 3, address: "555 Seaside Blvd, Miami" },
];

// ✅ Sample Hotels (3 hotels, each assigned to a chain)
const hotels = [
    { name: "Skyline Resort", address: "300 Downtown St, Vancouver", rating: 4, numOfRooms: 3 },
    { name: "Lakeside Paradise", address: "500 Lakeview Rd, Chicago", rating: 5, numOfRooms: 3 },
    { name: "Golden Sands Hotel", address: "700 Beachside Ave, Miami", rating: 5, numOfRooms: 3 },
];

// ✅ Sample Rooms (3 rooms per hotel)
const rooms = [
    {
        bookingType: "Booking", // Booking or Renting
        startDate: "2025-04-01", // Example start date
        endDate: "2025-04-05", // Example end date
        capacity: 2,
        area: "Downtown",
        hotelChain: "Summit Grand Hotels",
        hotelCategory: "Luxury",
        totalRooms: 100, // Total rooms in the hotel
        price: 150,
        view: "sea",
        isAvailable: true,
        amenities: ["TV", "WiFi"],
    },
    {
        bookingType: "Renting",
        startDate: "2025-05-10",
        endDate: "2025-05-15",
        capacity: 3,
        area: "City Center",
        hotelChain: "Evergreen Stays",
        hotelCategory: "Budget",
        totalRooms: 50,
        price: 200,
        view: "city",
        isAvailable: true,
        amenities: ["TV", "WiFi", "Balcony"],
    },
    {
        bookingType: "Booking",
        startDate: "2025-06-20",
        endDate: "2025-06-25",
        capacity: 4,
        area: "Mountain Side",
        hotelChain: "BlueWave Hospitality",
        hotelCategory: "Business",
        totalRooms: 75,
        price: 250,
        view: "mountain",
        isAvailable: false,
        amenities: ["TV", "WiFi", "Hot Tub"],
    },
    {
        bookingType: "Renting",
        startDate: "2025-07-10",
        endDate: "2025-07-15",
        capacity: 1,
        area: "Beachfront",
        hotelChain: "Skyline Suites & Resorts",
        hotelCategory: "Luxury",
        totalRooms: 120,
        price: 180,
        view: "ocean",
        isAvailable: true,
        amenities: ["TV", "WiFi", "Mini-Fridge"],
    },
    {
        bookingType: "Booking",
        startDate: "2025-08-05",
        endDate: "2025-08-10",
        capacity: 5,
        area: "Suburban",
        hotelChain: "Royal Haven Inn",
        hotelCategory: "Budget",
        totalRooms: 30,
        price: 300,
        view: "garden",
        isAvailable: true,
        amenities: ["TV", "WiFi", "Kitchenette", "Private Deck"],
    },
    {
        bookingType: "Renting",
        startDate: "2025-09-15",
        endDate: "2025-09-20",
        capacity: 2,
        area: "Lakeview",
        hotelChain: "Grand Luxe Hotels",
        hotelCategory: "Business",
        totalRooms: 90,
        price: 160,
        view: "lake",
        isAvailable: true,
        amenities: ["TV", "WiFi", "Jacuzzi"],
    },
];


// ✅ Sample Employees (3 employees)
const employees = [
    { name: "Jane Smith", email: "employee1@example.com", role: "Manager" },
    { name: "Mark Johnson", email: "employee2@example.com", role: "Receptionist" },
    { name: "Emma Wilson", email: "employee3@example.com", role: "Housekeeping" },
];

// ✅ Sample Customers (3 customers)
const customers = [
    { name: "John Doe", email: "customer1@example.com" },
    { name: "Alice Brown", email: "customer2@example.com" },
    { name: "Michael Davis", email: "customer3@example.com" },
];

// ✅ Insert Hotel Chains
async function insertHotelChains() {
    try {
        console.log("🔥 Inserting hotel chains...");
        for (const chain of hotelChains) {
            const chainRef = doc(collection(db, "HotelChain"));
            await setDoc(chainRef, chain);
            console.log(`✅ Hotel Chain added: ${chain.name}`);

            // Insert Hotels inside this Hotel Chain
            await insertHotels(chainRef.id);
        }
        console.log("🚀 All hotel chains inserted!");
    } catch (error) {
        console.error("❌ Error inserting hotel chains:", error);
    }
}

// ✅ Insert Hotels
async function insertHotels(chainId) {
    try {
        console.log(`🏨 Adding hotels under chain ID: ${chainId}`);
        for (const hotel of hotels) {
            const hotelRef = doc(collection(db, "HotelChain", chainId, "Hotels"));
            await setDoc(hotelRef, hotel);
            console.log(`✅ Hotel added: ${hotel.name}`);

            // Insert Rooms inside this Hotel
            await insertRooms(chainId, hotelRef.id);
        }
    } catch (error) {
        console.error("❌ Error inserting hotels:", error);
    }
}

// ✅ Insert Rooms
async function insertRooms(chainId, hotelId) {
    try {
        console.log(`🛏 Adding rooms under hotel ID: ${hotelId}`);
        for (const room of rooms) {
            const roomRef = doc(collection(db, "HotelChain", chainId, "Hotels", hotelId, "Rooms"));
            await setDoc(roomRef, room);
            console.log(`✅ Room added with price: $${room.price}`);
        }
    } catch (error) {
        console.error("❌ Error inserting rooms:", error);
    }
}

// ✅ Insert Employees
async function insertEmployees() {
    try {
        console.log("🔥 Inserting employees...");

        for (const emp of employees) {
            const hashedPassword = await bcrypt.hash("1234", 10);
            const empData = { ...emp, password: hashedPassword };

            const empRef = doc(collection(db, "Employee"));
            await setDoc(empRef, empData);
            console.log(`✅ Employee added: ${emp.name}`);
        }

        console.log("🚀 All employees inserted!");
    } catch (error) {
        console.error("❌ Error inserting employees:", error);
    }
}

// ✅ Insert Customers
async function insertCustomers() {
    try {
        console.log("🔥 Inserting customers...");

        for (const cust of customers) {
            const hashedPassword = await bcrypt.hash("1234", 10);
            const custData = { ...cust, password: hashedPassword };

            const custRef = doc(collection(db, "Customer"));
            await setDoc(custRef, custData);
            console.log(`✅ Customer added: ${cust.name}`);
        }

        console.log("🚀 All customers inserted!");
    } catch (error) {
        console.error("❌ Error inserting customers:", error);
    }
}

// ✅ Run Insertions
async function populateFirestore() {
    console.log("🔥 Populating Firestore...");
    await insertHotelChains();
    await insertEmployees();
    await insertCustomers();
    console.log("✅ Firestore Population Complete!");
}

// ✅ Run the script
populateFirestore();
