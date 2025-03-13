"use client";

import { useState, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField
} from "@mui/material";

export default function HotelModal({ open, hotel, onClose, refreshData }) {
    const [hotelData, setHotelData] = useState({
        hotel_ID: "",
        hotelC_ID: "",
        name: "",
        address: "",
        area: "",
        email: "",
        numOfRooms: "",
        phoneNumber: "",
        rating: ""
    });

    // ✅ Populate data when hotel is selected
    useEffect(() => {
        if (hotel) {
            setHotelData({
                hotel_ID: hotel.hotel_ID || "",
                hotelC_ID: hotel.hotelC_ID || "",
                name: hotel.name || "",
                address: hotel.address || "",
                area: hotel.area || "",
                email: hotel.email || "",
                numOfRooms: hotel.numOfRooms || "",
                phoneNumber: hotel.phoneNumber || "",
                rating: hotel.rating || ""
            });
        }
    }, [hotel]);

    // ✅ Handle Input Changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setHotelData((prev) => ({ ...prev, [name]: value }));
    };

    // ✅ Handle Save (Create or Edit Hotel)
    const handleSave = async () => {
        if (!hotelData.hotel_ID) {
            alert("Hotel ID is required for editing.");
            return;
        }

        try {
            const method = hotel ? "PUT" : "POST";
            const requestBody = {
                hotel_ID: hotelData.hotel_ID,
                hotelC_ID: hotelData.hotelC_ID,
                name: hotelData.name,
                location: hotelData.address, // ✅ Ensure address is sent as "location"
                area: hotelData.area,
                email: hotelData.email,
                numOfRooms: hotelData.numOfRooms,
                phoneNumber: hotelData.phoneNumber,
                rating: hotelData.rating
            };

            const response = await fetch("/api/employee/allHotels", {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody) // ✅ Ensure correct format
            });

            const result = await response.json();
            if (response.ok) {
                alert(`Hotel ${hotel ? "updated" : "added"} successfully!`);
                refreshData();
                onClose();
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error("❌ Error saving hotel:", error);
            alert("Failed to save hotel.");
        }
    };



    // ✅ Handle Delete
    const handleDelete = async () => {
        if (!hotelData.hotel_ID) {
            alert("Hotel ID is missing. Cannot delete.");
            return;
        }

        if (!window.confirm("Are you sure you want to delete this hotel?")) return;

        try {
            const response = await fetch("/api/employee/allHotels", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ hotel_ID: hotelData.hotel_ID }) // ✅ Correctly sending hotel_ID
            });

            const result = await response.json();
            if (response.ok) {
                alert("Hotel deleted successfully!");
                refreshData();
                onClose();
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error("❌ Error deleting hotel:", error);
            alert("Failed to delete hotel.");
        }
    };


    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{hotel ? "Edit Hotel" : "Add New Hotel"}</DialogTitle>
            <DialogContent>
                <TextField fullWidth label="Hotel ID" name="hotel_ID" value={hotelData.hotel_ID} onChange={handleChange} margin="normal" required />
                <TextField fullWidth label="Hotel Chain ID" name="hotelC_ID" value={hotelData.hotelC_ID} onChange={handleChange} margin="normal" required />
                <TextField fullWidth label="Name" name="name" value={hotelData.name} onChange={handleChange} margin="normal" required />
                <TextField fullWidth label="Address" name="address" value={hotelData.address} onChange={handleChange} margin="normal" required />
                <TextField fullWidth label="Area" name="area" value={hotelData.area} onChange={handleChange} margin="normal" required />
                <TextField fullWidth label="Email" name="email" value={hotelData.email} onChange={handleChange} margin="normal" required />
                <TextField fullWidth label="Number of Rooms" name="numOfRooms" type="number" value={hotelData.numOfRooms} onChange={handleChange} margin="normal" required />
                <TextField fullWidth label="Phone Number" name="phoneNumber" value={hotelData.phoneNumber} onChange={handleChange} margin="normal" required />
                <TextField fullWidth label="Rating" name="rating" type="number" value={hotelData.rating} onChange={handleChange} margin="normal" required />
            </DialogContent>
            <DialogActions>
                {hotel && <Button onClick={handleDelete} color="error">Delete</Button>}
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    );
}
