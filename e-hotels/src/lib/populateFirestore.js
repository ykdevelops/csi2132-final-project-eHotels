require("dotenv").config({ path: ".env.local" });

const { initializeApp } = require("firebase/app");
const { getFirestore, collection, doc, setDoc, getDocs } = require("firebase/firestore");
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

// ✅ Sample Hotel Chains
const hotelChains = [
    { name: "Grand Luxe Hotels", numOfHotels: 5, address: "123 Main St, Toronto" },
    { name: "Skyline Suites & Resorts", numOfHotels: 3, address: "456 Downtown Ave, Vancouver" },
    { name: "Royal Haven Inn", numOfHotels: 4, address: "789 Prestige Rd, Montreal" },
    { name: "BlueWave Hospitality", numOfHotels: 6, address: "555 Seaside Blvd, Miami" },
    { name: "Evergreen Stays", numOfHotels: 2, address: "111 Greenway Dr, Calgary" },
    { name: "Summit Grand Hotels", numOfHotels: 7, address: "777 Peak Rd, Denver" },
];

// ✅ Sample Employees
const employees = [
    { name: "Jane Smith", email: "employee1@example.com", role: "Manager" },
    { name: "Mark Johnson", email: "employee2@example.com", role: "Receptionist" },
];

// ✅ Sample Customers
const customers = [
    { name: "John Doe", email: "customer1@example.com" },
    { name: "Alice Brown", email: "customer2@example.com" },
];

// ✅ Insert Hotel Chains
async function insertHotelChains() {
    try {
        console.log("🔥 Inserting hotel chains...");
        for (const chain of hotelChains) {
            const chainRef = doc(collection(db, "HotelChain"));
            await setDoc(chainRef, chain);
            console.log(`✅ Hotel Chain added: ${chain.name}`);
        }
        console.log("🚀 All hotel chains inserted!");
    } catch (error) {
        console.error("❌ Error inserting hotel chains:", error);
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

populateFirestore();
