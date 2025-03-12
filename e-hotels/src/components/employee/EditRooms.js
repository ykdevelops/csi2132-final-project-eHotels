"use client";

import { useState, useEffect } from "react";
import {
    Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
    IconButton, CircularProgress, Box
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function EditRooms() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

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

    // ✅ Open Add/Edit Modal
    const handleOpenModal = (item = null) => {
        setEditingItem(item);
        setOpenModal(true);
    };

    // ✅ Handle Save (Add/Update Room)
    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newItem = Object.fromEntries(formData.entries());

        const method = editingItem ? "PUT" : "POST";
        const requestBody = {
            type: "rooms",
            data: newItem,
        };

        if (editingItem) {
            requestBody.id = editingItem.id;
        }

        try {
            const response = await fetch("/api/employee/editDatabase", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody),
            });

            const result = await response.json();
            if (response.ok) {
                alert(`Room ${editingItem ? "updated" : "added"} successfully`);
                fetchRoomData();
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error("❌ Error saving room data:", error);
            alert("Failed to save entry.");
        }

        setOpenModal(false);
    };

    // ✅ Handle Delete Room
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this room?")) return;

        try {
            const response = await fetch("/api/employee/editDatabase", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "rooms", id }),
            });

            const result = await response.json();
            if (response.ok) {
                alert("Room deleted successfully");
                fetchRoomData();
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error("❌ Error deleting room:", error);
            alert("Failed to delete entry.");
        }
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
                                    Object.keys(data[0]).map((key) => (
                                        <TableCell key={key}>{key.toUpperCase()}</TableCell>
                                    ))
                                }
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.length > 0 ? (
                                data.map((item) => (
                                    <TableRow key={item.id}>
                                        {Object.values(item).map((val, index) => (
                                            <TableCell key={index}>{JSON.stringify(val)}</TableCell>
                                        ))}
                                        <TableCell>
                                            <IconButton onClick={() => handleOpenModal(item)} color="primary">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(item.id)} color="secondary">
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan="100%" style={{ textAlign: "center" }}>
                                        No rooms found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            <Button variant="contained" color="primary" onClick={() => handleOpenModal()} style={{ marginTop: "20px" }}>
                Add New Room
            </Button>
        </Container>
    );
}
