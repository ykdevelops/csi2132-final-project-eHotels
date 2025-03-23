"use client";

import { useState, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, FormControl, InputLabel, Select, MenuItem, Box
} from "@mui/material";

// Static hotel chain options
const hotelChains = [
    { hotelC_ID: "hc1", name: "Summit Grand Group" },
    { hotelC_ID: "hc2", name: "Evergreen Hospitality" },
    { hotelC_ID: "hc3", name: "Urban Lux Stays" },
    { hotelC_ID: "hc4", name: "Coastal Retreats" },
    { hotelC_ID: "hc5", name: "Mountain Escapes" },
];

const areaOptions = ["Downtown", "Suburban", "Countryside"];

export default function NewHotelModal({ open, onClose, refreshData, hotel }) {
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        area: "",
        email: "",
        numOfRooms: "",
        phoneNumber: "",
        rating: "",
        hotelChain: ""
    });

    useEffect(() => {
        if (hotel) {
            setFormData({ ...hotel });
        } else {
            setFormData({
                name: "",
                address: "",
                area: "",
                email: "",
                numOfRooms: "",
                phoneNumber: "",
                rating: "",
                hotelChain: ""
            });
        }
    }, [hotel, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        const isEditing = Boolean(hotel?.hotel_ID);
        const hasEmpty = Object.values(formData).some((val) => val === "");

        if (hasEmpty) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            const res = await fetch("/api/employee/hotel", {
                method: isEditing ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    hotel_ID: isEditing ? hotel.hotel_ID : `h_${Date.now()}`
                }),
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "Save failed");

            alert(isEditing ? "✅ Hotel updated!" : "✅ Hotel created!");
            refreshData();
            onClose();
        } catch (err) {
            console.error(err);
            alert("Failed to save hotel.");
        }
    };

    const handleDelete = async () => {
        if (!hotel?.hotel_ID) return;
        if (!confirm("Are you sure you want to delete this hotel?")) return;

        try {
            const res = await fetch(`/api/employee/hotel?hotel_ID=${hotel.hotel_ID}`, {
                method: "DELETE",
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.error || "Delete failed");

            alert("✅ Hotel deleted!");
            refreshData();
            onClose();
        } catch (err) {
            console.error(err);
            alert("Failed to delete hotel.");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{hotel ? "Edit Hotel" : "Add New Hotel"}</DialogTitle>
            <DialogContent>
                <Box display="flex" flexDirection="column" gap={2} mt={1}>
                    <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth required />
                    <TextField label="Address" name="address" value={formData.address} onChange={handleChange} fullWidth required />

                    <FormControl fullWidth>
                        <InputLabel>Area</InputLabel>
                        <Select name="area" value={formData.area} onChange={handleChange}>
                            {areaOptions.map(area => (
                                <MenuItem key={area} value={area}>{area}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth>
                        <InputLabel>Hotel Chain</InputLabel>
                        <Select name="hotelChain" value={formData.hotelChain} onChange={handleChange}>
                            {hotelChains.map(chain => (
                                <MenuItem key={chain.hotelC_ID} value={chain.name}>{chain.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth required />
                    <TextField label="Number of Rooms" name="numOfRooms" value={formData.numOfRooms} onChange={handleChange} type="number" fullWidth required />
                    <TextField label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} fullWidth required />
                    <TextField label="Rating" name="rating" value={formData.rating} onChange={handleChange} type="number" fullWidth required />
                </Box>
            </DialogContent>
            <DialogActions>
                {hotel?.hotel_ID && (
                    <Button onClick={handleDelete} color="error">
                        Delete
                    </Button>
                )}
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    );
}
