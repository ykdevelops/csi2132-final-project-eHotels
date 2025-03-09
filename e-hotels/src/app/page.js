"use client";

import { useEffect, useState } from "react";
import { db, collection, getDocs } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        console.log("🔥 Fetching hotel chains...");

        const hotelChainsSnapshot = await getDocs(collection(db, "hotelChains"));
        let allRooms = [];

        for (const chainDoc of hotelChainsSnapshot.docs) {
          const chainId = chainDoc.id;
          const hotelsCollection = collection(db, "hotelChains", chainId, "hotels");
          const hotelsSnapshot = await getDocs(hotelsCollection);

          for (const hotelDoc of hotelsSnapshot.docs) {
            const hotelId = hotelDoc.id;
            const hotelData = hotelDoc.data();

            const roomsCollection = collection(db, "hotelChains", chainId, "hotels", hotelId, "rooms");
            const roomsSnapshot = await getDocs(roomsCollection);

            const hotelRooms = roomsSnapshot.docs.map((doc) => ({
              id: doc.id,
              hotelName: hotelData.name,
              ...doc.data(),
            }));

            allRooms = [...allRooms, ...hotelRooms];
          }
        }

        setRooms(allRooms);
      } catch (error) {
        console.error("❌ Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div>
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
    </div>
  );
}
