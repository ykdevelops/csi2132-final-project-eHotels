"use client";

import { useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField
} from "@mui/material";

export default function NewHotelModal({ open, onClose, refreshData }) {
    const [hotelData, setHotelData] = useState({
        name: "",
        location: "",
        hotelC_ID: "",
        area: "",
        email: "",
        numOfRooms: 0, // Default as number
        phoneNumber: "",
        rating: 0 // Default as number
    });

    // ✅ Handle Input Changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setHotelData((prev) => ({
            ...prev,
            [name]: name === "numOfRooms" || name === "rating" ? Number(value) : value
        }));
    };

    // ✅ Handle Save New Hotel
    const handleSave = async () => {
        console.log("🔍 Sending Hotel Data:", JSON.stringify(hotelData)); // Debugging log

        // Ensure required fields are filled
        if (!hotelData.name || !hotelData.location || !hotelData.email || !hotelData.numOfRooms) {
            alert("Please fill in all required fields (Name, Location, Email, Number of Rooms).");
            return;
        }

        try {
            const response = await fetch("/api/employee/allHotels", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(hotelData) // ✅ Send correct format
            });

            const result = await response.json();
            if (response.ok) {
                alert("New hotel added successfully!");
                refreshData();
                onClose();
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error("❌ Error saving new hotel:", error);
            alert("Failed to save new hotel.");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Add New Hotel</DialogTitle>
            <DialogContent>
                <TextField fullWidth label="Name" name="name" value={hotelData.name} onChange={handleChange} margin="normal" required />
                <TextField fullWidth label="Location" name="location" value={hotelData.location} onChange={handleChange} margin="normal" required />
                <TextField fullWidth label="Hotel Chain ID" name="hotelC_ID" value={hotelData.hotelC_ID} onChange={handleChange} margin="normal" />
                <TextField fullWidth label="Area" name="area" value={hotelData.area} onChange={handleChange} margin="normal" />
                <TextField fullWidth label="Email" name="email" value={hotelData.email} onChange={handleChange} margin="normal" required />
                <TextField fullWidth label="Number of Rooms" name="numOfRooms" type="number" value={hotelData.numOfRooms} onChange={handleChange} margin="normal" required />
                <TextField fullWidth label="Phone Number" name="phoneNumber" value={hotelData.phoneNumber} onChange={handleChange} margin="normal" />
                <TextField fullWidth label="Rating" name="rating" type="number" value={hotelData.rating} onChange={handleChange} margin="normal" />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    );
}
