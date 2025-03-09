require("dotenv").config({ path: ".env.local" });

const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs } = require("firebase/firestore");

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

// ✅ Fetch Users from Employee and Customer collections
async function fetchUsers() {
    try {
        console.log("🔍 Fetching users from Firestore...");

        // Fetch Employees
        const employeesSnapshot = await getDocs(collection(db, "Employee"));
        const employees = employeesSnapshot.docs.map(doc => doc.data().email);
        console.log("👔 Employees:", employees);

        // Fetch Customers
        const customersSnapshot = await getDocs(collection(db, "Customer"));
        const customers = customersSnapshot.docs.map(doc => doc.data().email);
        console.log("🛒 Customers:", customers);

    } catch (error) {
        console.error("❌ Error fetching users:", error);
    }
}

fetchUsers();
