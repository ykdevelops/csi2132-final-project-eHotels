"use client";

import { useState, useEffect } from "react";
import {
    Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
    IconButton, CircularProgress, Box
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function EditHotels() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        fetchHotelData();
    }, []);

    const fetchHotelData = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/employee/allHotels");
            const result = await response.json();
            if (response.ok) {
                setData(result.data || []);
            } else {
                console.error("❌ Fetch Error:", result.error);
            }
        } catch (error) {
            console.error("❌ Error fetching hotel data:", error);
        }
        setLoading(false);
    };

    // ✅ Open Add/Edit Modal
    const handleOpenModal = (item = null) => {
        setEditingItem(item);
        setOpenModal(true);
    };

    // ✅ Handle Save (Add/Update Hotel)
    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newItem = Object.fromEntries(formData.entries());

        const method = editingItem ? "PUT" : "POST";
        const requestBody = {
            type: "hotels",
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
                alert(`Hotel ${editingItem ? "updated" : "added"} successfully`);
                fetchHotelData(); // Refresh table
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error("❌ Error saving hotel data:", error);
            alert("Failed to save entry.");
        }

        setOpenModal(false);
    };

    // ✅ Handle Delete Hotel
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this hotel?")) return;

        try {
            const response = await fetch("/api/employee/editDatabase", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "hotels", id }),
            });

            const result = await response.json();
            if (response.ok) {
                alert("Hotel deleted successfully");
                fetchHotelData(); // Refresh table
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error("❌ Error deleting hotel:", error);
            alert("Failed to delete entry.");
        }
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
                Edit Hotels
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
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.length > 0 ? (
                                data.map((hotel) => (
                                    <TableRow key={hotel.id}>
                                        <TableCell>{hotel.id}</TableCell>
                                        <TableCell>{hotel.name || "N/A"}</TableCell>
                                        <TableCell>{hotel.location || "N/A"}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => handleOpenModal(hotel)} color="primary">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={() => handleDelete(hotel.id)} color="secondary">
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan="4" style={{ textAlign: "center" }}>
                                        No hotels found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            {/* Show Add Hotel Button */}
            <Button variant="contained" color="primary" onClick={() => handleOpenModal()} style={{ marginTop: "20px" }}>
                Add New Hotel
            </Button>

            {/* Add/Edit Hotel Modal */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
                <DialogTitle>{editingItem ? "Edit" : "Add"} Hotel</DialogTitle>
                <DialogContent>
                    <form id="editForm" onSubmit={handleSave}>
                        <TextField
                            label="Name"
                            name="name"
                            defaultValue={editingItem ? editingItem.name : ""}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Location"
                            name="location"
                            defaultValue={editingItem ? editingItem.location : ""}
                            fullWidth
                            margin="normal"
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)} color="secondary">Cancel</Button>
                    <Button type="submit" form="editForm" variant="contained" color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
