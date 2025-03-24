"use client";

import { useState } from "react";
import {
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem
} from "@mui/material";

export default function RentModal({ onClose, refreshData }) {
    const [rentData, setRentData] = useState({
        checkInDate: "",
        checkOutDate: "",
        cus_ID: "",
        room_ID: "",
        paymentAmount: "",
        paymentMethod: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRentData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateRent = async () => {
        const missingFields = Object.entries(rentData).filter(([_, v]) => !v);
        if (missingFields.length > 0) {
            alert("Please fill out all fields before submitting.");
            return;
        }

        try {
            const response = await fetch("/api/employee/rent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(rentData)
            });

            const result = await response.json();
            if (response.ok) {
                alert("✅ Rent & payment created successfully!");
                refreshData();
                onClose();
            } else {
                alert(`❌ Error: ${result.error}`);
            }
        } catch (error) {
            console.error("❌ Error creating rent:", error);
            alert("Server error.");
        }
    };

    return (
        <>
            <DialogTitle>Rent a Room (with Payment)</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="Check-In Date"
                    name="checkInDate"
                    type="date"
                    value={rentData.checkInDate}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Check-Out Date"
                    name="checkOutDate"
                    type="date"
                    value={rentData.checkOutDate}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Customer ID"
                    name="cus_ID"
                    value={rentData.cus_ID}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Room ID"
                    name="room_ID"
                    value={rentData.room_ID}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Payment Amount ($)"
                    name="paymentAmount"
                    type="number"
                    value={rentData.paymentAmount}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    select
                    fullWidth
                    label="Payment Method"
                    name="paymentMethod"
                    value={rentData.paymentMethod}
                    onChange={handleChange}
                    margin="normal"
                >
                    <MenuItem value="Credit Card">Credit Card</MenuItem>
                    <MenuItem value="Debit">Debit</MenuItem>
                    <MenuItem value="Cash">Cash</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={handleCreateRent} variant="contained" color="primary">Confirm Rent</Button>
            </DialogActions>
        </>
    );
}
