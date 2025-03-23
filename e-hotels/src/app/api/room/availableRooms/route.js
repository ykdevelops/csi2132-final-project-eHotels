// File: /app/api/room/availableRooms/route.js
// (or /pages/api/room/availableRooms.js in Next.js 12 or earlier)
import { NextResponse } from "next/server";
import { initializeApp } from "firebase/app";
import {
    getFirestore,
    collection,
    getDocs,
} from "firebase/firestore";

// 1) Firebase Configuration
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

/**
 * Helper function: check if two date ranges overlap
 *
 * Overlaps if (startA <= endB) && (endA >= startB).
 * Adjust if you want to allow same-day checkin/checkout (e.g., treat boundary touching as non-overlap).
 */
function dateRangesOverlap(range1Start, range1End, range2Start, range2End) {
    return range1Start <= range2End && range1End >= range2Start;
}

export async function GET(request) {
    try {
        // 2) Parse query params for date filtering
        const { searchParams } = new URL(request.url);
        const startDateParam = searchParams.get("startDate"); // e.g. "2025-03-12"
        const endDateParam = searchParams.get("endDate");     // e.g. "2025-03-13"

        let filterByDates = false;
        let requestStartDate, requestEndDate;

        // Validate the passed-in dates
        if (startDateParam && endDateParam) {
            try {
                filterByDates = true;
                requestStartDate = new Date(startDateParam);
                requestEndDate = new Date(endDateParam);

                // Ensure start <= end
                if (requestStartDate > requestEndDate) {
                    return NextResponse.json(
                        { error: "Start date cannot be after End date." },
                        { status: 400 }
                    );
                }
            } catch (err) {
                console.error("❌ Failed to parse date params:", err);
                filterByDates = false;
            }
        }

        // 3) Fetch HotelChain docs for chain names
        const hotelChainsSnapshot = await getDocs(collection(db, "HotelChain"));
        const hotelChainsMap = {}; // { hotelC_ID -> chainName }

        hotelChainsSnapshot.forEach((doc) => {
            const chainData = doc.data();
            hotelChainsMap[chainData.hotelC_ID] = chainData.name ?? "Unknown Chain";
        });

        // 4) Fetch Hotel docs for rating, area, etc.
        const hotelsSnapshot = await getDocs(collection(db, "Hotel"));
        const hotelMap = {}; // { hotel_ID -> { name, chain, rating, area } }

        hotelsSnapshot.forEach((doc) => {
            const hotelData = doc.data();
            hotelMap[hotelData.hotel_ID] = {
                hotelName: hotelData.name || "Unknown Hotel",
                hotelChain: hotelChainsMap[hotelData.hotelC_ID] || "Unknown Chain",
                rating: Number(hotelData.rating) || 0,
                area: hotelData.area || "Unknown Area",
            };
        });

        // 5) Fetch all Room docs
        const roomsSnapshot = await getDocs(collection(db, "Room"));
        let availableRooms = [];

        roomsSnapshot.forEach((roomDoc) => {
            const roomData = roomDoc.data();
            const hotelInfo = hotelMap[roomData.hotel_ID] || {
                hotelName: "Unknown Hotel",
                hotelChain: "Unknown Chain",
                rating: 0,
                area: "Unknown Area",
            };

            let isAvailable = true;

            // 6) If we have date filters, check each bookedDates entry for overlap
            if (filterByDates && Array.isArray(roomData.bookedDates)) {
                for (let booking of roomData.bookedDates) {
                    // Convert the booking start/end into Date objects
                    const bookingStart = new Date(booking.startDate);
                    const bookingEnd = new Date(booking.endDate);

                    if (
                        dateRangesOverlap(
                            requestStartDate,
                            requestEndDate,
                            bookingStart,
                            bookingEnd
                        )
                    ) {
                        isAvailable = false;
                        break; // no need to check further
                    }
                }
            }

            // If still available, add to results
            if (isAvailable) {
                availableRooms.push({
                    // Firestore document ID
                    id: roomDoc.id,
                    room_ID: roomData.room_ID,
                    // Merge in hotel data
                    hotelName: hotelInfo.hotelName,
                    hotelChain: hotelInfo.hotelChain,
                    hotelRating: hotelInfo.rating,
                    area: hotelInfo.area,

                    // Other fields on the Room
                    price: roomData.price ?? 0,
                    capacity: roomData.capacity ?? 1,
                    type: roomData.type || "",
                    amenities: roomData.amenities || [],
                    view: roomData.view || "",
                });
            }
        });

        return NextResponse.json(availableRooms, { status: 200 });
    } catch (error) {
        console.error("❌ Error fetching available rooms:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
