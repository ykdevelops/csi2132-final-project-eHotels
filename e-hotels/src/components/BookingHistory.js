"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db, collection, query, where, getDocs } from "@/lib/firebase";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";

export default function BookingHistory({ goBack }) {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            router.push("/login");
            return;
        }

        const userData = JSON.parse(storedUser);
        setUser(userData);

        const fetchBookings = async () => {
            try {
                const bookingsRef = collection(db, "Bookings");
                const q = query(bookingsRef, where("customerEmail", "==", userData.email));
                const bookingsSnapshot = await getDocs(q);
                setBookings(bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            } catch (error) {
                console.error("❌ Error fetching bookings:", error);
            }
        };

        fetchBookings();
    }, [router]);

    return (
        <Container maxWidth="md" style={{ marginTop: "40px", textAlign: "center" }}>
            <Button onClick={goBack} variant="outlined" color="primary" style={{ marginBottom: "20px" }}>Back</Button>
            <Typography variant="h5">Your Booking History</Typography>

            <TableContainer component={Paper} style={{ marginTop: "20px" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Hotel</strong></TableCell>
                            <TableCell><strong>Room</strong></TableCell>
                            <TableCell><strong>Check-in</strong></TableCell>
                            <TableCell><strong>Check-out</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bookings.length > 0 ? (
                            bookings.map((booking) => (
                                <TableRow key={booking.id}>
                                    <TableCell>{booking.hotelName}</TableCell>
                                    <TableCell>Room {booking.roomId}</TableCell>
                                    <TableCell>{booking.checkInDate}</TableCell>
                                    <TableCell>{booking.checkOutDate}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    No bookings found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}
