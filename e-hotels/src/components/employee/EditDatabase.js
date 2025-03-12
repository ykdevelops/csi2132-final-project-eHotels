"use client";

import { useState, useEffect } from "react";
import {
    Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Tabs, Tab, IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

// Dummy Data Structure
const initialData = {
    customers: [
        { id: 1, name: "John Doe", email: "john@example.com" },
        { id: 2, name: "Jane Smith", email: "jane@example.com" }
    ],
    employees: [
        { id: 1, name: "Alice Johnson", position: "Manager" },
        { id: 2, name: "Bob Brown", position: "Receptionist" }
    ],
    hotels: [
        { id: 1, name: "Luxury Inn", location: "Downtown" },
        { id: 2, name: "Budget Stay", location: "Suburban" }
    ],
    rooms: [
        { id: 1, hotel: "Luxury Inn", capacity: 2, price: 120 },
        { id: 2, hotel: "Budget Stay", capacity: 3, price: 80 }
    ]
};

export default function EditDatabase() {
    const [tab, setTab] = useState("customers"); // Default tab
    const [data, setData] = useState(initialData);
    const [openModal, setOpenModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    // Handles switching tabs
    const handleChangeTab = (event, newValue) => setTab(newValue);

    // Handles opening the Add/Edit Modal
    const handleOpenModal = (item = null) => {
        setEditingItem(item);
        setOpenModal(true);
    };

    // Handles form submission for adding/updating
    const handleSave = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newItem = Object.fromEntries(formData.entries());

        setData(prev => ({
            ...prev,
            [tab]: editingItem
                ? prev[tab].map(item => item.id === editingItem.id ? { ...item, ...newItem } : item) // Update
                : [...prev[tab], { id: Date.now(), ...newItem }] // Create
        }));

        setOpenModal(false);
    };

    // Handles Deletion
    const handleDelete = (id) => {
        setData(prev => ({
            ...prev,
            [tab]: prev[tab].filter(item => item.id !== id)
        }));
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
                Edit Database
            </Typography>

            {/* Tabs for Different Entities */}
            <Tabs value={tab} onChange={handleChangeTab} centered>
                <Tab label="Customers" value="customers" />
                <Tab label="Employees" value="employees" />
                <Tab label="Hotels" value="hotels" />
                <Tab label="Rooms" value="rooms" />
            </Tabs>

            {/* Table Displaying Current Data */}
            <TableContainer component={Paper} style={{ marginTop: "20px" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {Object.keys(data[tab][0] || {}).map((key) => (
                                <TableCell key={key}>{key.toUpperCase()}</TableCell>
                            ))}
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data[tab].map((item) => (
                            <TableRow key={item.id}>
                                {Object.values(item).map((val, index) => (
                                    <TableCell key={index}>{val}</TableCell>
                                ))}
                                <TableCell>
                                    <IconButton onClick={() => handleOpenModal(item)} color="primary">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(item.id)} color="secondary">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add New Entry Button */}
            <Button variant="contained" color="primary" onClick={() => handleOpenModal()} style={{ marginTop: "20px" }}>
                Add New {tab.slice(0, -1)}
            </Button>

            {/* Add/Edit Modal */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
                <DialogTitle>{editingItem ? "Edit" : "Add"} {tab.slice(0, -1)}</DialogTitle>
                <DialogContent>
                    <form id="editForm" onSubmit={handleSave}>
                        {Object.keys(data[tab][0] || {}).map((key) => (
                            key !== "id" && (
                                <TextField
                                    key={key}
                                    label={key.toUpperCase()}
                                    name={key}
                                    defaultValue={editingItem ? editingItem[key] : ""}
                                    fullWidth
                                    margin="normal"
                                />
                            )
                        ))}
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)} color="secondary">Cancel</Button>
                    <Button type="submit" form="editForm" variant="contained" color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
