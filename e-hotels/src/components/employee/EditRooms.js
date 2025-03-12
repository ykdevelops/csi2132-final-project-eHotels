"use client";

import { useState, useEffect } from "react";
import {
    Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, CircularProgress, Box
} from "@mui/material";
import RoomModal from "./RoomModal"; // Import the new modal component

export default function EditRooms() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
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

    // ✅ Open Modal when a row is clicked
    const handleOpenModal = (room) => {
        setSelectedRoom(room);
        setOpenModal(true);
    };

    // ✅ Close Modal
    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedRoom(null);
    };

    // ✅ Format Data for Table Display
    const formatValue = (val, key) => {
        if (key === "view" || key === "extendible") {
            return val ? "Yes" : "No";
        }
        if (key === "bookedDates" && Array.isArray(val)) {
            return val.length > 0 ? `${val[0].startDate} to ${val[0].endDate}` : "None";
        }
        return val || "—";
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
                Edit Rooms
            </Typography>

            <TableContainer component={Paper} style={{ marginTop: "20px" }}>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", padding: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                {data.length > 0 &&
                                    Object.keys(data[0])
                                        .slice(0, 6) // ✅ Only Show 6 Columns
                                        .map((key) => (
                                            <TableCell key={key}>{key.toUpperCase()}</TableCell>
                                        ))
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.length > 0 ? (
                                data.map((item) => (
                                    <TableRow key={item.id} hover onClick={() => handleOpenModal(item)} style={{ cursor: "pointer" }}>
                                        {Object.keys(item)
                                            .slice(0, 6) // ✅ Only Show 6 Columns
                                            .map((key) => (
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

            {/* Room Details Modal Component */}
            <RoomModal
                open={openModal}
                room={selectedRoom}
                onClose={handleCloseModal}
                refreshData={fetchRoomData}
            />
        </Container>
    );
}
