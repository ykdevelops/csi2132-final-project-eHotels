"use client";

import { useEffect, useState } from "react";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";

export default function PreviousRentals({ goBack }) {
    const [rentals, setRentals] = useState([]);

    useEffect(() => {
        fetch("/api/employee/previousRentals")
            .then(res => res.json())
            .then(data => setRentals(data))
            .catch(error => console.error("Error fetching previous rentals:", error));
    }, []);

    return (
        <Container maxWidth="md" style={{ marginTop: "40px", textAlign: "center" }}>
            <Button onClick={goBack} variant="outlined" color="primary" style={{ marginBottom: "20px" }}>
                Back
            </Button>
            <Typography variant="h5">Previous Rentals</Typography>

            <TableContainer component={Paper} style={{ marginTop: "20px" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Rental ID</strong></TableCell>
                            <TableCell><strong>Customer ID</strong></TableCell>
                            <TableCell><strong>Room</strong></TableCell>
                            <TableCell><strong>Check-in</strong></TableCell>
                            <TableCell><strong>Check-out</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rentals.length > 0 ? (
                            rentals.map((rental) => (
                                <TableRow key={rental.id}>
                                    <TableCell>{rental.rent_ID}</TableCell>
                                    <TableCell>{rental.cus_ID}</TableCell>
                                    <TableCell>{rental.room_ID}</TableCell>
                                    <TableCell>{rental.checkInDate}</TableCell>
                                    <TableCell>{rental.checkOutDate}</TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">No previous rentals found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}
