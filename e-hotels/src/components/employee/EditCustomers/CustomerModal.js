"use client";

import { useState, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, IconButton, InputAdornment
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function CustomerModal({ open, customer, onClose, refreshData }) {
    const [customerData, setCustomerData] = useState({
        cus_ID: "",
        email: "",
        name: "",
        address: "",
        dateOfReg: ""
    });

    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (customer) {
            setCustomerData({
                cus_ID: customer.cus_ID || "",
                email: customer.email || "",
                name: customer.name || "",
                address: customer.address || "",
                dateOfReg: customer.dateOfReg || ""
            });
            setNewPassword("");
            setShowPassword(false);
        }
    }, [customer]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomerData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        const payload = { ...customerData };
        if (newPassword.trim()) {
            payload.password = newPassword;
        }

        try {
            const response = await fetch("/api/employee/customers", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (response.ok) {
                alert("✅ Customer updated successfully!");
                refreshData();
                onClose();
            } else {
                alert(`❌ Error: ${result.error}`);
            }
        } catch (error) {
            console.error("❌ Error updating customer:", error);
            alert("Failed to update customer.");
        }
    };

    const handleDelete = async () => {
        if (!customerData.cus_ID) return;

        if (!window.confirm("Are you sure you want to delete this customer?")) return;

        try {
            const response = await fetch("/api/employee/customers", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cus_ID: customerData.cus_ID })
            });

            const result = await response.json();
            if (response.ok) {
                alert("🗑️ Customer deleted successfully!");
                refreshData();
                onClose();
            } else {
                alert(`❌ Delete failed: ${result.error}`);
            }
        } catch (error) {
            console.error("❌ Error deleting customer:", error);
            alert("Server error.");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="Customer ID"
                    name="cus_ID"
                    value={customerData.cus_ID}
                    margin="normal"
                    disabled
                />
                <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={customerData.email}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={customerData.name}
                    onChange={handleChange}
                    margin="normal"
                    required
                />
                <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={customerData.address}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    fullWidth
                    label="Date of Registration"
                    name="dateOfReg"
                    type="date"
                    value={customerData.dateOfReg}
                    onChange={handleChange}
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    fullWidth
                    label="New Password"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    margin="normal"
                    helperText="Leave blank to keep the current password"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDelete} color="error">Delete</Button>
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
            </DialogActions>
        </Dialog>
    );
}
