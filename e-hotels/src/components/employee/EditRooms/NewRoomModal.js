"use client";

import { useState } from "react";
import {
    Dialog, Typography, DialogTitle, DialogContent, DialogActions,
    Button, TextField, FormControl, InputLabel, Select, MenuItem, Box
} from "@mui/material";

export default function NewRoomModal({ open, onClose, refreshData }) {
    const [roomData, setRoomData] = useState({
        room_ID: "",
        hotel_ID: "",
        capacity: "",
        price: "",
        view: "No",
        extendible: "No",
        isAvailable: "Yes",
        issues: "",
        amenities: "",
        bookedDates: []
    });

    // ✅ Handle Input Changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoomData((prev) => ({ ...prev, [name]: value }));
    };

    // ✅ Handle Add Booking Date
    const handleAddBooking = () => {
        setRoomData((prev) => ({
            ...prev,
            bookedDates: [...prev.bookedDates, { startDate: "", endDate: "" }]
        }));
    };

    // ✅ Handle Change in Booking Dates
    const handleBookingChange = (index, field, value) => {
        const updatedBookings = [...roomData.bookedDates];
        updatedBookings[index][field] = value;
        setRoomData((prev) => ({ ...prev, bookedDates: updatedBookings }));
    };

    // ✅ Handle Remove Booking Date
    const handleRemoveBooking = (index) => {
        const updatedBookings = roomData.bookedDates.filter((_, i) => i !== index);
        setRoomData((prev) => ({ ...prev, bookedDates: updatedBookings }));
    };

    // ✅ Handle Save New Room
    const handleSave = async () => {
        try {
            const response = await fetch("/api/employee/editDatabase", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "rooms", data: roomData })
            });

            const result = await response.json();
            if (response.ok) {
                alert("New room added successfully!");
                refreshData();
                onClose();
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error("❌ Error saving new room:", error);
            alert("Failed to save new room.");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Add New Room</DialogTitle>
            <DialogContent>
                <TextField fullWidth label="Room ID" name="room_ID" value={roomData.room_ID} onChange={handleChange} margin="normal" />
                <TextField fullWidth label="Hotel ID" name="hotel_ID" value={roomData.hotel_ID} onChange={handleChange} margin="normal" />
                <TextField fullWidth label="Capacity" name="capacity" type="number" value={roomData.capacity} onChange={handleChange} margin="normal" />
                <TextField fullWidth label="Price" name="price" type="number" value={roomData.price} onChange={handleChange} margin="normal" />

                <FormControl fullWidth margin="normal">
                    <InputLabel>View</InputLabel>
                    <Select name="view" value={roomData.view} onChange={handleChange}>
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel>Extendible</InputLabel>
                    <Select name="extendible" value={roomData.extendible} onChange={handleChange}>
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                    <InputLabel>Available</InputLabel>
                    <Select name="isAvailable" value={roomData.isAvailable} onChange={handleChange}>
                        <MenuItem value="Yes">Yes</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                    </Select>
                </FormControl>

                <TextField fullWidth label="Issues" name="issues" value={roomData.issues} onChange={handleChange} margin="normal" />
                <TextField fullWidth label="Amenities (comma-separated)" name="amenities" value={roomData.amenities} onChange={handleChange} margin="normal" />

                {/* ✅ Display Booked Dates */}
                <Box mt={2}>
                    <Typography variant="h6">Booked Dates</Typography>
                    {roomData.bookedDates.map((booking, index) => (
                        <Box key={index} display="flex" alignItems="center" gap={1} mb={1}>
                            <TextField
                                label="Start Date"
                                type="date"
                                name="startDate"
                                value={booking.startDate}
                                onChange={(e) => handleBookingChange(index, "startDate", e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                sx={{ flex: 1 }}
                            />
                            <TextField
                                label="End Date"
                                type="date"
                                name="endDate"
                                value={booking.endDate}
                                onChange={(e) => handleBookingChange(index, "endDate", e.target.value)}
                                InputLabelProps={{ shrink: true }}
                                sx={{ flex: 1 }}
                            />
                            <Button variant="outlined" color="error" onClick={() => handleRemoveBooking(index)}>
                                ❌
                            </Button>
                        </Box>
                    ))}
                    <Button variant="outlined" color="primary" onClick={handleAddBooking}>
                        + Add Booking
                    </Button>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    );
}

