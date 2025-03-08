"use client";

import { useEffect, useState } from "react";
import { db, collection, getDocs } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function RootLayout({ children }) {
  const router = useRouter();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        console.log("🔥 Fetching hotel chains...");

        // Step 1: Fetch all hotelChains
        const hotelChainsSnapshot = await getDocs(collection(db, "hotelChains"));
        let allRooms = [];

        console.log(`✅ Found ${hotelChainsSnapshot.docs.length} hotel chains`);

        for (const chainDoc of hotelChainsSnapshot.docs) {
          const chainId = chainDoc.id;
          console.log(`🏨 Hotel Chain ID: ${chainId}`);

          // Step 2: Fetch all hotels inside this hotel chain
          const hotelsCollection = collection(db, "hotelChains", chainId, "hotels");
          const hotelsSnapshot = await getDocs(hotelsCollection);

          console.log(`✅ Found ${hotelsSnapshot.docs.length} hotels in chain "${chainId}"`);

          for (const hotelDoc of hotelsSnapshot.docs) {
            const hotelId = hotelDoc.id;
            const hotelData = hotelDoc.data();

            console.log(`🏨 Hotel: ${hotelData.name} (ID: ${hotelId})`);

            // Step 3: Fetch all rooms inside this hotel
            const roomsCollection = collection(db, "hotelChains", chainId, "hotels", hotelId, "rooms");
            const roomsSnapshot = await getDocs(roomsCollection);

            console.log(`🏠 Found ${roomsSnapshot.docs.length} rooms in hotel "${hotelData.name}"`);

            const hotelRooms = roomsSnapshot.docs.map((doc) => ({
              id: doc.id,
              hotelName: hotelData.name, // Attach hotel name
              ...doc.data(),
            }));

            allRooms = [...allRooms, ...hotelRooms]; // Merge into the final rooms array
          }
        }

        setRooms(allRooms);
        console.log("🚀 Final Room List:", allRooms);

      } catch (error) {
        console.error("❌ Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  return (
    <html lang="en">
      <body>
        <header style={{ textAlign: "center", padding: "20px" }}>
          <h1>Welcome to e-Hotels</h1>
          <p>Find and book rooms from top hotel chains with real-time availability.</p>
          <button onClick={() => router.push("/auth")} style={{ margin: "10px", padding: "10px 20px" }}>
            Login
          </button>
          <button onClick={() => router.push("/auth")} style={{ margin: "10px", padding: "10px 20px" }}>
            Register
          </button>
        </header>

        {/* Available Rooms Table */}
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <h2>Available Rooms</h2>
          <table border="1" style={{ width: "80%", margin: "auto", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Hotel</th>
                <th>Capacity</th>
                <th>Price</th>
                <th>Amenities</th>
                <th>Book</th>
              </tr>
            </thead>
            <tbody>
              {rooms.length > 0 ? (
                rooms.map((room) => (
                  <tr key={room.id}>
                    <td>{room.hotelName || "Unknown"}</td>
                    <td>{room.capacity}</td>
                    <td>${room.price}</td>
                    <td>{room.amenities ? room.amenities.join(", ") : "None"}</td>
                    <td>
                      <button onClick={() => router.push(`/room/${room.id}`)}>Book Now</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No available rooms at the moment.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <main>{children}</main>
      </body>
    </html>
  );
}
