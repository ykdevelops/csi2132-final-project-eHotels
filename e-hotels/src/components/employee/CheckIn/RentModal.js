"use client";

import { useState } from "react";
import { DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

export default function RentModal({ onClose, refreshData }) {
    const [rentData, setRentData] = useState({
        checkInDate: "",
        checkOutDate: "",
        cus_ID: "",
        room_ID: "",
        active: true
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRentData((prev) => ({ ...prev, [name]: value }));
    };

    // ✅ Handle Rent Creation
    const handleCreateRent = async () => {
        try {
            const response = await fetch("/api/employee/createRent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(rentData)
            });

            const result = await response.json();
            if (response.ok) {
                alert("Rent created successfully!");
                refreshData();
                onClose();
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error("❌ Error creating rent:", error);
        }
    };

    return (
        <>
            <DialogTitle>Rent a Room</DialogTitle>
            <DialogContent>
                <TextField fullWidth label="Check-In Date" name="checkInDate" type="date" value={rentData.checkInDate} onChange={handleChange} margin="normal" />
                <TextField fullWidth label="Check-Out Date" name="checkOutDate" type="date" value={rentData.checkOutDate} onChange={handleChange} margin="normal" />
                <TextField fullWidth label="Customer ID" name="cus_ID" value={rentData.cus_ID} onChange={handleChange} margin="normal" />
                <TextField fullWidth label="Room ID" name="room_ID" value={rentData.room_ID} onChange={handleChange} margin="normal" />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={handleCreateRent} variant="contained" color="primary">Confirm Rent</Button>
            </DialogActions>
        </>
    );
}
