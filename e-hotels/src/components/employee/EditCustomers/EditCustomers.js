"use client";

import { useState, useEffect } from "react";
import {
    Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, CircularProgress, Box, Button
} from "@mui/material";
import CustomerModal from "./CustomerModal";
import NewCustomerModal from "./NewCustomerModal";

export default function EditCustomers() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openNewModal, setOpenNewModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    useEffect(() => {
        fetchCustomerData();
    }, []);

    const fetchCustomerData = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/employee/allCustomers");
            const result = await response.json();
            if (response.ok) {
                setData(result.data || []);
            } else {
                console.error("❌ Fetch Error:", result.error);
            }
        } catch (error) {
            console.error("❌ Error fetching customer data:", error);
        }
        setLoading(false);
    };

    // ✅ Open Modal to Edit a Customer
    const handleOpenModal = (customer) => {
        setSelectedCustomer(customer);
        setOpenModal(true);
    };

    // ✅ Open Modal to Create a New Customer
    const handleOpenNewModal = () => {
        setOpenNewModal(true);
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
                Edit Customers
            </Typography>

            {/* ✅ Add New Customer Button */}
            <Box textAlign="right" mb={2}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenNewModal}
                >
                    + Add New Customer
                </Button>
            </Box>

            <TableContainer component={Paper} style={{ marginTop: "20px" }}>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", padding: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Address</TableCell>
                                <TableCell>Date of Registration</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.length > 0 ? (
                                data.map((customer) => (
                                    <TableRow
                                        key={customer.cus_ID}  // ✅ FIX: Ensuring unique key
                                        hover
                                        onClick={() => handleOpenModal(customer)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <TableCell>{customer.cus_ID}</TableCell>
                                        <TableCell>{customer.email || "N/A"}</TableCell>
                                        <TableCell>{customer.name || "N/A"}</TableCell>
                                        <TableCell>{customer.address || "N/A"}</TableCell>
                                        <TableCell>{customer.dateOfReg || "N/A"}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} style={{ textAlign: "center" }}>
                                        No customers found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            {/* ✅ Customer Details Modal (Edit Mode) */}
            <CustomerModal
                open={openModal}
                customer={selectedCustomer}
                onClose={() => setOpenModal(false)}
                refreshData={fetchCustomerData}
            />

            {/* ✅ New Customer Modal */}
            <NewCustomerModal
                open={openNewModal}
                onClose={() => setOpenNewModal(false)}
                refreshData={fetchCustomerData}
            />
        </Container>
    );
}
