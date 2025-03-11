"use client";

import { useEffect, useState } from "react";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";

export default function PreviousBookings({ goBack }) {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        fetch("/api/employee/previousBookings")
            .then(res => res.json())
            .then(data => setBookings(data))
            .catch(error => console.error("Error fetching previous bookings:", error));
    }, []);

    return (
        <Container maxWidth="md" style={{ marginTop: "40px", textAlign: "center" }}>
            <Button onClick={goBack} variant="outlined" color="primary" style={{ marginBottom: "20px" }}>
                Back
            </Button>
            <Typography variant="h5">Previous Bookings</Typography>

            <TableContainer component={Paper} style={{ marginTop: "20px" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Booking ID</strong></TableCell>
                            <TableCell><strong>Room</strong></TableCell>
                            <TableCell><strong>Check-in</strong></TableCell>
                            <TableCell><strong>Check-out</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bookings.length > 0 ? (
                            bookings.map((booking) => (
                                <TableRow key={booking.id}>
                                    <TableCell>{booking.book_ID}</TableCell>
                                    <TableCell>{booking.room_ID}</TableCell>
                                    <TableCell>{booking.checkInDate || "N/A"}</TableCell>
                                    <TableCell>{booking.checkOutDate || "N/A"}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">No previous bookings found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}
