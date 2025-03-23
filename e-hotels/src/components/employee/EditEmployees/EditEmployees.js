"use client";

import { useState, useEffect } from "react";
import {
    Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, Button, CircularProgress, Box
} from "@mui/material";
import EmployeeModal from "./EmployeeModal";
import NewEmployeeModal from "./NewEmployeeModal";

export default function EditEmployees() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openNewModal, setOpenNewModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    useEffect(() => {
        fetchEmployeeData();
    }, []);

    const fetchEmployeeData = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/employee/employees");
            const result = await response.json();
            setData(result.data || []);
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

            <Box textAlign="right" mb={2}>
                <Button variant="contained" color="primary" onClick={() => setOpenNewModal(true)}>
                    + Add New Employee
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
                                <TableCell>Employee ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Address</TableCell>
                                <TableCell>Hotel ID</TableCell>
                                <TableCell>Role</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((employee) => (
                                <TableRow key={employee.emp_ID} hover onClick={() => { setSelectedEmployee(employee); setOpenModal(true); }} style={{ cursor: "pointer" }}>
                                    <TableCell>{employee.emp_ID}</TableCell>
                                    <TableCell>{employee.name}</TableCell>
                                    <TableCell>{employee.email}</TableCell>
                                    <TableCell>{employee.address}</TableCell>
                                    <TableCell>{employee.hotel_ID}</TableCell>
                                    <TableCell>{employee.role}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            <EmployeeModal open={openModal} employee={selectedEmployee} onClose={() => setOpenModal(false)} refreshData={fetchEmployeeData} />
            <NewEmployeeModal open={openNewModal} onClose={() => setOpenNewModal(false)} refreshData={fetchEmployeeData} />
        </Container>
    );
}
