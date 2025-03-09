require("dotenv").config({ path: ".env.local" });

const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, doc, setDoc, getDoc } = require("firebase/firestore");
const bcrypt = require("bcryptjs");

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

// ✅ Fetch Existing Users
async function fetchExistingUsers() {
    try {
        console.log("🔥 Fetching existing users...");

        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);

        const users = usersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        console.log("📋 Current users:", users);

        if (users.length === 0) {
            console.log("🚨 No users found! We need to insert new ones.");
        } else {
            console.log(`✅ Found ${users.length} users in Firestore.`);
        }

        return users;
    } catch (error) {
        console.error("❌ Error fetching users:", error.message);
        return [];
    }
}

// ✅ Create a User (All Users Have Password "1234" Hashed)
async function createUser(email, role) {
    try {
        console.log(`🔍 Checking if ${role} account for ${email} exists...`);

        const userRef = doc(db, "users", email);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            console.log(`✅ ${role} account already exists for ${email}.`);
            return;
        }

        // ✅ Hash password "1234" before storing
        const password = "1234";
        const hashedPassword = await bcrypt.hash(password, 10);

        const userData = {
            email,
            password: hashedPassword,
            role,
            createdAt: new Date().toISOString(),
        };

        console.log(`📤 Writing ${role} user to Firestore:`, userData);

        // ✅ Insert user into Firestore
        await setDoc(userRef, userData);
        console.log(`✅ ${role} account created for ${email}.`);

    } catch (error) {
        console.error(`❌ Error creating ${role} user:`, error.message);
    }
}

// ✅ Insert 2 Users (1 Customer, 1 Employee)
async function insertUsers() {
    console.log("🔥 Inserting new users...");

    const usersToInsert = [
        { email: "customer@example.com", role: "customer" },
        { email: "employee@example.com", role: "employee" },
    ];

    for (const user of usersToInsert) {
        await createUser(user.email, user.role);
    }

    console.log("🚀 User insertion completed!");
}

// ✅ Run Fetch First, Then Insert If Needed
fetchExistingUsers().then((users) => {
    if (users.length < 2) {
        insertUsers();
    } else {
        console.log("✅ Enough users exist! Insert skipped.");
    }
});
