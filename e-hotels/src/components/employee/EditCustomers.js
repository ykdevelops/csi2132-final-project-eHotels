"use client";

import { useState, useEffect } from "react"; // ✅ Import useState and useEffect
import {
    Container, Typography, Table, TableBody, TableCell, TableContainer, TableRow,
    Paper, CircularProgress, Box
} from "@mui/material";

export default function EditCustomers() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

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

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
                Edit Customers
            </Typography>

            <TableContainer component={Paper} style={{ marginTop: "20px" }}>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", padding: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Table>
                        <TableBody>
                            {data.length > 0 ? data.map((item) => (
                                <TableRow key={item.id}>
                                    {Object.values(item).map((val, index) => (
                                        <TableCell key={index}>{JSON.stringify(val)}</TableCell>
                                    ))}
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan="100%" style={{ textAlign: "center" }}>
                                        No customers found.
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
