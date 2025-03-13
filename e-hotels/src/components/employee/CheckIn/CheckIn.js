"use client";

import { useState, useEffect } from "react";
import {
    Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, CircularProgress, Box, Dialog, Button
} from "@mui/material";
import BookingModal from "./BookingModal";
import RentModal from "./RentModal";

export default function CheckIn() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [openRentModal, setOpenRentModal] = useState(false);

    useEffect(() => {
        fetchPendingBookings();
    }, []);

    // ✅ Fetch only PENDING BOOKINGS (checkedIn: false)
    const fetchPendingBookings = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/employee/pendingBookings");
            const result = await response.json();
            if (response.ok) {
                setData(result.data || []);
            } else {
                console.error("❌ Fetch Error:", result.error);
            }
        } catch (error) {
            console.error("❌ Error fetching pending bookings:", error);
        }
        setLoading(false);
    };

    // ✅ Handle Row Click to Open Modal
    const handleRowClick = (booking) => {
        setSelectedBooking(booking);
        setOpenModal(true);
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
                Pending Bookings
            </Typography>

            <Box textAlign="right" mb={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenRentModal(true)}
                >
                    Rent a Room
                </Button>
            </Box>

            <TableContainer component={Paper}>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", padding: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Booking ID</TableCell>
                                <TableCell>Customer ID</TableCell>
                                <TableCell>Room ID</TableCell>
                                <TableCell>Check-In Date</TableCell>
                                <TableCell>Check-Out Date</TableCell>
                                <TableCell>Checked-In</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((booking) => (
                                <TableRow
                                    key={booking.book_ID}
                                    hover
                                    onClick={() => handleRowClick(booking)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <TableCell>{booking.book_ID}</TableCell>
                                    <TableCell>{booking.cus_ID}</TableCell>
                                    <TableCell>{booking.room_ID}</TableCell>
                                    <TableCell>{booking.checkInDate}</TableCell>
                                    <TableCell>{booking.checkOutDate}</TableCell>
                                    <TableCell>{booking.checkedIn ? "Yes" : "No"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            {/* Booking Modal */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
                {selectedBooking && (
                    <BookingModal
                        booking={selectedBooking}
                        onClose={() => setOpenModal(false)}
                        refreshData={fetchPendingBookings}
                    />
                )}
            </Dialog>

            {/* Rent Modal */}
            <Dialog open={openRentModal} onClose={() => setOpenRentModal(false)} fullWidth maxWidth="sm">
                <RentModal onClose={() => setOpenRentModal(false)} refreshData={fetchPendingBookings} />
            </Dialog>
        </Container>
    );
}
