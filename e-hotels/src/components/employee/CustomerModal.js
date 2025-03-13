"use client";

import { useState, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField
} from "@mui/material";

export default function CustomerModal({ open, customer, onClose, refreshData }) {
    const [customerData, setCustomerData] = useState({
        cus_ID: "",
        email: "",
        name: "",
        address: "",
        dateOfReg: "",
        password: "",
    });

    // ✅ Update form when modal opens with new customer
    useEffect(() => {
        if (customer) {
            setCustomerData({
                cus_ID: customer.cus_ID || "",
                email: customer.email || "",
                name: customer.name || "",
                address: customer.address || "",
                dateOfReg: customer.dateOfReg || "",
                password: customer.password || "",
            });
        }
    }, [customer]); // ✅ Runs every time `customer` changes

    // ✅ Handle Input Changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomerData((prev) => ({ ...prev, [name]: value }));
    };

    // ✅ Handle Save
    const handleSave = async () => {
        try {
            const response = await fetch("/api/employee/allCustomers", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(customerData)
            });

            const result = await response.json();
            if (response.ok) {
                alert("Customer updated successfully!");
                refreshData();
                onClose();
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error("❌ Error updating customer:", error);
            alert("Failed to update customer.");
        }
    };

    // ✅ Handle Delete
    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this customer?")) return;

        try {
            const response = await fetch(`/api/employee/allCustomers?cus_ID=${customerData.cus_ID}`, {
                method: "DELETE"
            });

            const result = await response.json();
            if (response.ok) {
                alert("Customer deleted successfully!");
                refreshData();
                onClose();
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error("❌ Error deleting customer:", error);
            alert("Failed to delete customer.");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogContent>
                <TextField fullWidth label="Email" name="email" value={customerData.email} onChange={handleChange} margin="normal" />
                <TextField fullWidth label="Name" name="name" value={customerData.name} onChange={handleChange} margin="normal" />
                <TextField fullWidth label="Address" name="address" value={customerData.address} onChange={handleChange} margin="normal" />
                <TextField fullWidth label="Date of Registration" name="dateOfReg" value={customerData.dateOfReg} onChange={handleChange} margin="normal" />
                <TextField fullWidth label="Password" name="password" value={customerData.password} onChange={handleChange} margin="normal" />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDelete} color="error">Delete</Button>
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    );
}
