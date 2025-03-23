"use client";

import { useState, useEffect } from "react";
import {
    Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Button, CircularProgress, Box
} from "@mui/material";
import NewHotelModal from "./NewHotelModal";

export default function EditHotels() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [selectedHotel, setSelectedHotel] = useState(null);

    useEffect(() => {
        fetchHotelData();
    }, []);

    const fetchHotelData = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/employee/hotel");
            const result = await response.json();
            setData(result.data || []);
        } catch (error) {
            console.error("❌ Error fetching hotel data:", error);
        }
        setLoading(false);
    };

    const handleOpenAdd = () => {
        setSelectedHotel(null);
        setOpenModal(true);
    };

    const handleOpenEdit = (hotel) => {
        setSelectedHotel(hotel);
        setOpenModal(true);
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
                Edit Hotels
            </Typography>

            <Box textAlign="right" mb={2}>
                <Button variant="contained" color="primary" onClick={handleOpenAdd}>
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
                                <TableCell>Name</TableCell>
                                <TableCell>Address</TableCell>
                                <TableCell>Area</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Rooms</TableCell>
                                <TableCell>Phone</TableCell>
                                <TableCell>Rating</TableCell>
                                <TableCell>Chain</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((hotel) => (
                                <TableRow
                                    key={hotel.hotel_ID}
                                    hover
                                    onClick={() => handleOpenEdit(hotel)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <TableCell>{hotel.hotel_ID}</TableCell>
                                    <TableCell>{hotel.name}</TableCell>
                                    <TableCell>{hotel.address}</TableCell>
                                    <TableCell>{hotel.area}</TableCell>
                                    <TableCell>{hotel.email}</TableCell>
                                    <TableCell>{hotel.numOfRooms}</TableCell>
                                    <TableCell>{hotel.phoneNumber}</TableCell>
                                    <TableCell>{hotel.rating}</TableCell>
                                    <TableCell>{hotel.hotelChain}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            <NewHotelModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                refreshData={fetchHotelData}
                hotel={selectedHotel}
            />
        </Container>
    );
}
