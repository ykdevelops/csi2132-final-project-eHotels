"use client";

import { useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField
} from "@mui/material";

export default function NewCustomerModal({ open, onClose, refreshData }) {
    const [customerData, setCustomerData] = useState({
        email: "",
        name: "",
        address: "",
        dateOfReg: new Date().toISOString().split("T")[0], // Default to today
        password: ""
    });

    // ✅ Handle Input Changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomerData((prev) => ({ ...prev, [name]: value }));
    };

    // ✅ Handle Save New Customer
    const handleSave = async () => {
        // Ensure all required fields are filled
        if (!customerData.email || !customerData.name || !customerData.password) {
            alert("Email, Name, and Password are required.");
            return;
        }

        try {
            const response = await fetch("/api/employee/allCustomers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(customerData) // ✅ Ensure correct payload
            });

            const result = await response.json();
            if (response.ok) {
                alert("New customer added successfully!");
                refreshData();
                onClose();
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error("❌ Error saving new customer:", error);
            alert("Failed to save new customer.");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogContent>
                <TextField fullWidth label="Email" name="email" value={customerData.email} onChange={handleChange} margin="normal" required />
                <TextField fullWidth label="Name" name="name" value={customerData.name} onChange={handleChange} margin="normal" required />
                <TextField fullWidth label="Address" name="address" value={customerData.address} onChange={handleChange} margin="normal" />
                <TextField fullWidth label="Date of Registration" name="dateOfReg" type="date" value={customerData.dateOfReg} onChange={handleChange} margin="normal" />
                <TextField fullWidth label="Password" name="password" type="password" value={customerData.password} onChange={handleChange} margin="normal" required />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    );
}
