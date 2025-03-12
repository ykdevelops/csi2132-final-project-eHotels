"use client";

import { useState, useEffect } from "react";
import {
    Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
    IconButton, CircularProgress, Box
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function EditHotels() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        fetchHotelData();
    }, []);

    const fetchHotelData = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/employee/allHotels");
            const result = await response.json();
            if (response.ok) {
                setData(result.data || []);
            } else {
                console.error("❌ Fetch Error:", result.error);
            }
        } catch (error) {
            console.error("❌ Error fetching hotel data:", error);
        }
        setLoading(false);
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
                Edit Hotels
            </Typography>

            <TableContainer component={Paper} style={{ marginTop: "20px" }}>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", padding: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                {data.length > 0 &&
                                    Object.keys(data[0]).map((key) => (
                                        <TableCell key={key}>{key.toUpperCase()}</TableCell>
                                    ))
                                }
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.length > 0 ? (
                                data.map((item) => (
                                    <TableRow key={item.id}>
                                        {Object.values(item).map((val, index) => (
                                            <TableCell key={index}>{JSON.stringify(val)}</TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan="100%" style={{ textAlign: "center" }}>
                                        No hotels found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>
        </Container>
    );
}
