"use client";

import { useEffect, useState } from "react";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";

export default function CurrentBookings({ goBack }) {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        fetch("/api/employee/currentBookings")
            .then(res => res.json())
            .then(data => setBookings(data))
            .catch(error => console.error("Error fetching current bookings:", error));
    }, []);

    return (
        <Container maxWidth="md" style={{ marginTop: "40px", textAlign: "center" }}>
            <Button onClick={goBack} variant="outlined" color="primary" style={{ marginBottom: "20px" }}>
                Back
            </Button>
            <Typography variant="h5">Current Bookings</Typography>

            <TableContainer component={Paper} style={{ marginTop: "20px" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Booking ID</strong></TableCell>
                            <TableCell><strong>Room</strong></TableCell>
                            <TableCell><strong>Customer</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bookings.length > 0 ? (
                            bookings.map((booking) => (
                                <TableRow key={booking.id}>
                                    <TableCell>{booking.book_ID}</TableCell>
                                    <TableCell>{booking.room_ID}</TableCell>
                                    <TableCell>{booking.cus_ID}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} align="center">No active bookings found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}
