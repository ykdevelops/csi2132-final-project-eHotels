"use client";

import { useState, useEffect } from "react";
import {
    Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Button, CircularProgress, Box
} from "@mui/material";
import HotelModal from "./HotelModal";
import NewHotelModal from "./NewHotelModal";

export default function EditHotels() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openNewModal, setOpenNewModal] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState(null);

    useEffect(() => {
        fetchHotelData();
    }, []);

    const fetchHotelData = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/employee/allHotels");
            const result = await response.json();
            setData(result.data || []);
        } catch (error) {
            console.error("❌ Error fetching hotel data:", error);
        }
        setLoading(false);
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
                Edit Hotels
            </Typography>

            {/* ✅ Add New Hotel Button */}
            <Box textAlign="right" mb={2}>
                <Button variant="contained" color="primary" onClick={() => setOpenNewModal(true)}>
                    + Add New Hotel
                </Button>
            </Box>

            <TableContainer component={Paper} style={{ marginTop: "20px" }}>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", padding: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Hotel ID</TableCell>
                                <TableCell>Chain ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Address</TableCell>
                                <TableCell>Area</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Number of Rooms</TableCell>
                                <TableCell>Phone Number</TableCell>
                                <TableCell>Rating</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((hotel) => (
                                <TableRow key={hotel.hotel_ID} hover onClick={() => { setSelectedHotel(hotel); setOpenModal(true); }} style={{ cursor: "pointer" }}>
                                    <TableCell>{hotel.hotel_ID}</TableCell>
                                    <TableCell>{hotel.hotelC_ID || "N/A"}</TableCell>
                                    <TableCell>{hotel.name || "N/A"}</TableCell>
                                    <TableCell>{hotel.address || "N/A"}</TableCell>
                                    <TableCell>{hotel.area || "N/A"}</TableCell>
                                    <TableCell>{hotel.email || "N/A"}</TableCell>
                                    <TableCell>{hotel.numOfRooms || "N/A"}</TableCell>
                                    <TableCell>{hotel.phoneNumber || "N/A"}</TableCell>
                                    <TableCell>{hotel.rating || "N/A"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            {/* ✅ Hotel Details Modal */}
            <HotelModal
                open={openModal}
                hotel={selectedHotel}
                onClose={() => setOpenModal(false)}
                refreshData={fetchHotelData}
            />

            {/* ✅ New Hotel Modal */}
            <NewHotelModal
                open={openNewModal}
                onClose={() => setOpenNewModal(false)}
                refreshData={fetchHotelData}
            />
        </Container>
    );
}
