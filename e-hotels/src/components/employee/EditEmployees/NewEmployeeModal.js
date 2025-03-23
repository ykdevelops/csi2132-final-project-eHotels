"use client";

import { useState } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField
} from "@mui/material";

export default function NewEmployeeModal({ open, onClose, refreshData }) {
    const [employeeData, setEmployeeData] = useState({
        emp_ID: "",
        hotel_ID: "",
        name: "",
        email: "",
        address: "",
        role: "",
        phoneNumber: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployeeData((prev) => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setEmployeeData({
            emp_ID: "",
            hotel_ID: "",
            name: "",
            email: "",
            address: "",
            role: "",
            phoneNumber: "",
            password: ""
        });
    };

    const handleSave = async () => {
        const { emp_ID, hotel_ID, name, email, address, role, phoneNumber, password } = employeeData;

        if (!emp_ID || !hotel_ID || !name || !email || !address || !role || !phoneNumber || !password) {
            alert("⚠️ Please fill in all required fields.");
            return;
        }

        try {
            const response = await fetch("/api/employee/employees", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(employeeData)
            });

            const result = await response.json();
            if (response.ok) {
                alert("✅ New employee added successfully!");
                refreshData();
                resetForm();        // ✅ Clear fields
                onClose();          // ✅ Close modal
            } else {
                alert(`❌ Error: ${result.error}`);
            }
        } catch (error) {
            console.error("❌ Error saving new employee:", error);
            alert("⚠️ Failed to save new employee.");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogContent>
                <TextField fullWidth label="Employee ID" name="emp_ID" value={employeeData.emp_ID} onChange={handleChange} margin="normal" required />
                <TextField fullWidth label="Hotel ID" name="hotel_ID" value={employeeData.hotel_ID} onChange={handleChange} margin="normal" required />
                <TextField fullWidth label="Name" name="name" value={employeeData.name} onChange={handleChange} margin="normal" required />
                <TextField fullWidth label="Email" name="email" value={employeeData.email} onChange={handleChange} margin="normal" required />
                <TextField fullWidth label="Address" name="address" value={employeeData.address} onChange={handleChange} margin="normal" required />
                <TextField fullWidth label="Role" name="role" value={employeeData.role} onChange={handleChange} margin="normal" required />
                <TextField fullWidth label="Phone Number" name="phoneNumber" value={employeeData.phoneNumber} onChange={handleChange} margin="normal" required />
                <TextField fullWidth label="Password" name="password" type="password" value={employeeData.password} onChange={handleChange} margin="normal" required />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    );
}
