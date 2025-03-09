"use client";

import { useEffect, useState } from "react";
import { db, collection, getDocs } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";

export default function HomePage() {
  const router = useRouter();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        console.log("🔥 Fetching hotel chains...");

        const hotelChainsSnapshot = await getDocs(collection(db, "HotelChain"));
        let allRooms = [];

        for (const chainDoc of hotelChainsSnapshot.docs) {
          const chainId = chainDoc.id;
          const hotelsCollection = collection(db, "HotelChain", chainId, "Hotels");
          const hotelsSnapshot = await getDocs(hotelsCollection);

          for (const hotelDoc of hotelsSnapshot.docs) {
            const hotelId = hotelDoc.id;
            const hotelData = hotelDoc.data();

            const roomsCollection = collection(db, "HotelChain", chainId, "Hotels", hotelId, "Rooms");
            const roomsSnapshot = await getDocs(roomsCollection);

            const hotelRooms = roomsSnapshot.docs.map((doc) => ({
              id: doc.id,
              hotelName: hotelData.name || "Unknown",
              ...doc.data(),
            }));

            allRooms = [...allRooms, ...hotelRooms];
          }
        }

        console.log("🚀 Final Room List:", allRooms);
        setRooms(allRooms);
      } catch (error) {
        console.error("❌ Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div style={{ marginTop: "30px", textAlign: "center", padding: "20px" }}>
      <h2>Available Rooms</h2>

      <TableContainer component={Paper} style={{ width: "80%", margin: "auto" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Hotel</strong></TableCell>
              <TableCell><strong>Capacity</strong></TableCell>
              <TableCell><strong>Price</strong></TableCell>
              <TableCell><strong>Amenities</strong></TableCell>
              <TableCell><strong>Book</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms.length > 0 ? (
              rooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell>{room.hotelName}</TableCell>
                  <TableCell>{room.capacity}</TableCell>
                  <TableCell>${room.price}</TableCell>
                  <TableCell>{room.amenities ? room.amenities.join(", ") : "None"}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => router.push(`/room/${room.id}`)}
                    >
                      Book Now
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">No available rooms at the moment.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
