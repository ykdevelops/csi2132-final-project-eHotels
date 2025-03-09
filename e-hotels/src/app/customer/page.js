"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { db, collection, query, where, getDocs } from "@/lib/firebase";
import { Container, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

export default function CustomerPage() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            router.push("/login"); // 🔹 Redirect if not logged in
            return;
        }

        const userData = JSON.parse(storedUser);
        setUser(userData);

        // 🔹 Fetch customer bookings
        const fetchBookings = async () => {
            try {
                console.log("🔥 Fetching bookings for:", userData.email);
                const bookingsRef = collection(db, "Bookings");
                const q = query(bookingsRef, where("customerEmail", "==", userData.email));
                const bookingsSnapshot = await getDocs(q);

                const customerBookings = bookingsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                console.log("📋 Booking Data:", customerBookings);
                setBookings(customerBookings);
            } catch (error) {
                console.error("❌ Error fetching bookings:", error);
            }
        };

        fetchBookings();
    }, [router]);

    return (
        <Container maxWidth="md" style={{ textAlign: "center", marginTop: "40px" }}>
            {user ? (
                <>
                    <Typography variant="h4">Welcome, {user.name}!</Typography>
                    <Typography variant="body1" color="textSecondary">
                        Here are your current and past bookings.
                    </Typography>

                    {/* 🔹 Bookings Table */}
                    <TableContainer component={Paper} style={{ marginTop: "30px" }}>
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
                                            No bookings yet.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            ) : (
                <Typography variant="h5" color="error">Redirecting...</Typography>
            )}
        </Container>
    );
}
