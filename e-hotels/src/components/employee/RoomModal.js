"use client";

import { useState, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, IconButton, Grid, Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

export default function RoomModal({ open, room, onClose, refreshData }) {
    const [editedRoom, setEditedRoom] = useState({
        amenities: "",
        isAvailable: "No",
        view: "No",
        extendible: "No",
        bookedDates: [], // ✅ Always ensure bookedDates is initialized as an array
    });

    // ✅ Populate Modal with API Data
    useEffect(() => {
        if (room) {
            setEditedRoom({
                ...room,
                amenities: Array.isArray(room.amenities) ? room.amenities.join(", ") : room.amenities || "",
                isAvailable: room.isAvailable ? "Yes" : "No",
                view: room.view ? "Yes" : "No",
                extendible: room.extendible === "Yes" || room.extendible === true ? "Yes" : "No",
                bookedDates: Array.isArray(room.bookedDates) ? [...room.bookedDates] : [], // ✅ Ensure it's always an array
            });
        }
    }, [room]);

    // ✅ Handle Input Changes
    const handleChange = (e) => {
        setEditedRoom({ ...editedRoom, [e.target.name]: e.target.value });
    };

    // ✅ Handle Booked Dates Change
    const handleBookedDateChange = (index, field, value) => {
        const updatedBookedDates = [...editedRoom.bookedDates];
        updatedBookedDates[index] = { ...updatedBookedDates[index], [field]: value };
        setEditedRoom({ ...editedRoom, bookedDates: updatedBookedDates });
    };

    // ✅ Add a New Booking Row
    const handleAddBooking = () => {
        setEditedRoom({
            ...editedRoom,
            bookedDates: [...editedRoom.bookedDates, { startDate: "", endDate: "" }],
        });
    };

    // ✅ Remove a Booking Row
    const handleRemoveBooking = (index) => {
        const updatedBookedDates = editedRoom.bookedDates.filter((_, i) => i !== index);
        setEditedRoom({ ...editedRoom, bookedDates: updatedBookedDates });
    };

    // ✅ Handle Save (Update Room)
    const handleSave = async () => {
        const updatedRoom = {
            ...editedRoom,
            amenities: editedRoom.amenities.split(",").map((item) => item.trim()), // Convert back to array
            isAvailable: editedRoom.isAvailable === "Yes",
            view: editedRoom.view === "Yes",
            extendible: editedRoom.extendible === "Yes",
            bookedDates: editedRoom.bookedDates.filter(b => b.startDate && b.endDate), // Remove empty bookings
        };

        try {
            const response = await fetch("/api/employee/allRooms", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "rooms", id: room.id, data: updatedRoom }),
            });

            if (response.ok) {
                alert("Room updated successfully");
                refreshData();
                onClose();
            } else {
                alert("Error updating room.");
            }
        } catch (error) {
            console.error("❌ Error saving room data:", error);
            alert("Failed to update room.");
        }
    };

    // ✅ Handle Delete
    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this room?")) return;
        try {
            const response = await fetch("/api/employee/allRooms", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "rooms", id: room.id }),
            });

            if (response.ok) {
                alert("Room deleted successfully");
                refreshData();
                onClose();
            } else {
                alert("Error deleting room.");
            }
        } catch (error) {
            console.error("❌ Error deleting room:", error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit Room Details</DialogTitle>
            <DialogContent>
                {room && Object.keys(room).map((key) => {
                    if (key === "id" || key === "bookedDates") return null;

                    if (key === "view" || key === "extendible" || key === "isAvailable") {
                        return (
                            <TextField
                                key={key}
                                select
                                label={key.toUpperCase()}
                                name={key}
                                value={editedRoom[key] || "No"}
                                onChange={handleChange}
                                fullWidth
                                margin="normal"
                            >
                                <MenuItem value="Yes">Yes</MenuItem>
                                <MenuItem value="No">No</MenuItem>
                            </TextField>
                        );
                    }

                    return (
                        <TextField
                            key={key}
                            label={key.toUpperCase()}
                            name={key}
                            value={editedRoom[key] || ""}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                        />
                    );
                })}

                {/* ✅ Display Booked Dates as Editable Inputs */}
                <Typography variant="h6" style={{ marginTop: "20px" }}>
                    Booked Dates
                </Typography>
                {(!editedRoom.bookedDates || editedRoom.bookedDates.length === 0) && (
                    <Typography color="textSecondary">No bookings found.</Typography>
                )}

                {editedRoom.bookedDates.map((booking, index) => (
                    <Grid container spacing={2} key={index} alignItems="center" style={{ marginBottom: "10px" }}>
                        <Grid item xs={5}>
                            <TextField
                                label="Start Date"
                                type="date"
                                name="startDate"
                                value={booking.startDate || ""}
                                onChange={(e) => handleBookedDateChange(index, "startDate", e.target.value)}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={5}>
                            <TextField
                                label="End Date"
                                type="date"
                                name="endDate"
                                value={booking.endDate || ""}
                                onChange={(e) => handleBookedDateChange(index, "endDate", e.target.value)}
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <IconButton onClick={() => handleRemoveBooking(index)} color="error">
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                ))}

                {/* ✅ Add New Booking Button */}
                <Button startIcon={<AddIcon />} onClick={handleAddBooking} color="primary">
                    Add Booking
                </Button>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleDelete} color="error">Delete</Button>
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    );
}
