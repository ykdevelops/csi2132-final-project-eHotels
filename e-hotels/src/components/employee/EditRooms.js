"use client";

import { useState, useEffect } from "react";
import {
    Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, CircularProgress, Box, Button
} from "@mui/material";
import RoomModal from "./RoomModal"; // Import the modal for editing rooms
import NewRoomModal from "./NewRoomModal"; // Import the modal for adding new rooms

export default function EditRooms() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openNewRoomModal, setOpenNewRoomModal] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);

    // ✅ Fetch Rooms from API
    useEffect(() => {
        fetchRoomData();
    }, []);

    const fetchRoomData = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/employee/allRooms");
            const result = await response.json();

            console.log("📥 API Response:", result); // ✅ Log structure for debugging

            if (response.ok) {
                setData(result.data || []);
            } else {
                console.error("❌ Fetch Error:", result.error);
            }
        } catch (error) {
            console.error("❌ Error fetching room data:", error);
        }
        setLoading(false);
    };

    // ✅ Open Edit Room Modal
    const handleOpenModal = (room) => {
        setSelectedRoom(room);
        setOpenModal(true);
    };

    // ✅ Close Edit Room Modal
    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedRoom(null);
    };

    // ✅ Open New Room Modal
    const handleOpenNewRoomModal = () => {
        setOpenNewRoomModal(true);
    };

    // ✅ Close New Room Modal
    const handleCloseNewRoomModal = () => {
        setOpenNewRoomModal(false);
    };

    // ✅ Format Data for Table Display
    const formatValue = (val, key) => {
        if (key === "view" || key === "extendible" || key === "isAvailable") {
            return val === "Yes" || val === true ? "Yes" : "No";
        }
        if (key === "amenities" && Array.isArray(val)) {
            return val.length > 0 ? val.join(", ") : "None"; // Convert array to a readable string
        }
        if (key === "bookedDates" && Array.isArray(val) && val.length > 0) {
            return `${val[0].startDate} to ${val[0].endDate}`; // Show only first booking
        }
        return val || "—";
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
                Edit Rooms
            </Typography>

            {/* ✅ Add New Room Button */}
            <Box textAlign="right" mb={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenNewRoomModal}
                >
                    + Add New Room
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
                                {/* ✅ Select 6 Key Attributes for Table Display */}
                                {["room_ID", "hotel_ID", "capacity", "price", "view", "bookedDates"].map((key) => (
                                    <TableCell key={key}>{key.toUpperCase()}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.length > 0 ? (
                                data.map((item) => (
                                    <TableRow key={item.id} hover onClick={() => handleOpenModal(item)} style={{ cursor: "pointer" }}>
                                        {/* ✅ Show only selected columns */}
                                        {["room_ID", "hotel_ID", "capacity", "price", "view", "bookedDates"].map((key) => (
                                            <TableCell key={key}>{formatValue(item[key], key)}</TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} style={{ textAlign: "center" }}>
                                        No rooms found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            {/* Room Details Modal Component (Edit) */}
            <RoomModal
                open={openModal}
                room={selectedRoom} // Null for new room
                onClose={handleCloseModal}
                refreshData={fetchRoomData}
            />

            {/* New Room Modal Component (Add) */}
            <NewRoomModal
                open={openNewRoomModal}
                onClose={handleCloseNewRoomModal}
                refreshData={fetchRoomData}
            />
        </Container>
    );
}
