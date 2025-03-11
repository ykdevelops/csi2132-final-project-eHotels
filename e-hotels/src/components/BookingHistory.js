"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";

export default function BookingHistory({ goBack }) {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
            console.warn("⚠️ No user found in localStorage. Redirecting to login.");
            router.push("/login");
            return;
        }

        const userData = JSON.parse(storedUser);
        setUser(userData);

        if (!userData.cus_ID) {
            console.error("❌ Customer ID (cus_ID) not found in user data.");
            return;
        }

        console.log(`🔍 Fetching previous bookings for cus_ID: ${userData.cus_ID}`);

        // 🔥 Fetch previous bookings from your API
        const fetchPreviousBookings = async () => {
            try {
                const response = await fetch("/api/book/previousBookings", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ cus_ID: userData.cus_ID })
                });

                if (!response.ok) {
                    console.error("❌ Failed to fetch previous bookings.");
                    return;
                }

                const data = await response.json();
                console.log("📦 Booking data received:", data);
                setBookings(data);
            } catch (error) {
                console.error("❌ Error fetching previous bookings:", error);
            }
        };

        fetchPreviousBookings();
    }, [router]);

    return (
        <Container maxWidth="md" style={{ marginTop: "40px", textAlign: "center" }}>
            <Button onClick={goBack} variant="outlined" color="primary" style={{ marginBottom: "20px" }}>
                Back
            </Button>
            <Typography variant="h5">Your Booking History</Typography>

            <TableContainer component={Paper} style={{ marginTop: "20px" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Booking ID</strong></TableCell>
                            <TableCell><strong>Room ID</strong></TableCell>
                            <TableCell><strong>Check-in</strong></TableCell>
                            <TableCell><strong>Check-out</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bookings.length > 0 ? (
                            bookings.map((booking) => (
                                <TableRow key={booking.id || booking.book_ID}>
                                    <TableCell>{booking.book_ID || "Unknown"}</TableCell>
                                    <TableCell>{booking.room_ID || "N/A"}</TableCell>
                                    <TableCell>{booking.checkInDate || "N/A"}</TableCell>
                                    <TableCell>{booking.checkOutDate || "N/A"}</TableCell>
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
