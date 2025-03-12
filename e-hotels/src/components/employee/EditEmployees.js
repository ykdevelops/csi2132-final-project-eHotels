"use client";

import { useState, useEffect } from "react";
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Box
} from "@mui/material";

export default function EditEmployees() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchEmployeeData();
    }, []);

    const fetchEmployeeData = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/employee/allEmployees");
            const result = await response.json();
            if (response.ok) {
                setData(result.data || []);
            } else {
                console.error("❌ Fetch Error:", result.error);
            }
        } catch (error) {
            console.error("❌ Error fetching employee data:", error);
        }
        setLoading(false);
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
                Edit Employees
            </Typography>

            <TableContainer component={Paper} style={{ marginTop: "20px" }}>
                {loading ? (
                    <Box sx={{ display: "flex", justifyContent: "center", padding: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Table>
                        {/* ✅ Always Render Table Headers */}
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Name</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.length > 0 ? (
                                data.map((employee) => (
                                    <TableRow key={employee.id}>
                                        <TableCell>{employee.id}</TableCell>
                                        <TableCell>{employee.email || "N/A"}</TableCell>
                                        <TableCell>{employee.name || "N/A"}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan="3" style={{ textAlign: "center" }}>
                                        No employees found.
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
