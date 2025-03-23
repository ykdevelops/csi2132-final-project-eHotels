"use client";

import { useState, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, IconButton, InputAdornment
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

export default function EmployeeModal({ open, employee, onClose, refreshData }) {
    const [employeeData, setEmployeeData] = useState({
        emp_ID: "",
        hotel_ID: "",
        name: "",
        email: "",
        address: "",
        role: "",
        phoneNumber: ""
    });
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (employee) {
            setEmployeeData({
                emp_ID: employee.emp_ID || "",
                hotel_ID: employee.hotel_ID || "",
                name: employee.name || "",
                email: employee.email || "",
                address: employee.address || "",
                role: employee.role || "",
                phoneNumber: employee.phoneNumber || ""
            });
            setNewPassword("");
        }
    }, [employee]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployeeData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        if (!employeeData.emp_ID) {
            alert("Error: Employee ID is required!");
            return;
        }

        const payload = {
            ...employeeData
        };

        if (newPassword.trim() !== "") {
            payload.password = newPassword;
        }

        try {
            const response = await fetch("/api/employee/employees", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (response.ok) {
                alert("✅ Employee updated successfully!");
                refreshData();
                onClose();
            } else {
                alert(`❌ Error: ${result.error}`);
            }
        } catch (error) {
            console.error("❌ Error updating employee:", error);
            alert("Server error.");
        }
    };

    const handleDelete = async () => {
        if (!employeeData.emp_ID) {
            alert("Error: Employee ID is required for deletion!");
            return;
        }

        if (!window.confirm("Are you sure you want to delete this employee?")) return;

        try {
            const response = await fetch("/api/employee/employees", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ emp_ID: employeeData.emp_ID })
            });

            const result = await response.json();
            if (response.ok) {
                alert("✅ Employee deleted successfully!");
                refreshData();
                onClose();
            } else {
                alert(`❌ Delete failed: ${result.error}`);
            }
        } catch (error) {
            console.error("❌ Error deleting employee:", error);
            alert("Server error.");
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogContent>
                <TextField fullWidth label="Employee ID" name="emp_ID" value={employeeData.emp_ID} disabled margin="normal" />
                <TextField fullWidth label="Hotel ID" name="hotel_ID" value={employeeData.hotel_ID} disabled margin="normal" />
                <TextField fullWidth label="Name" name="name" value={employeeData.name} onChange={handleChange} margin="normal" required />
                <TextField fullWidth label="Email" name="email" value={employeeData.email} onChange={handleChange} margin="normal" required />
                <TextField fullWidth label="Address" name="address" value={employeeData.address} onChange={handleChange} margin="normal" required />
                <TextField fullWidth label="Role" name="role" value={employeeData.role} onChange={handleChange} margin="normal" required />
                <TextField fullWidth label="Phone Number" name="phoneNumber" value={employeeData.phoneNumber} onChange={handleChange} margin="normal" required />

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
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
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
