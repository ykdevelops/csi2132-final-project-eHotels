"use client";

import { useEffect, useState } from "react";
import { Container, Typography, Grid, Card, CardActionArea, CardContent, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useRouter } from "next/navigation";

export default function EmployeeDashboard() {
    const router = useRouter();
    const [view, setView] = useState("dashboard");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [data, setData] = useState([]);

    const categories = [
        { label: "New Booking Requests", key: "pendingBookings" },
        { label: "New Rental Requests", key: "pendingRents" },
        { label: "Active Rentals", key: "activeRentals" },
        { label: "Upcoming Bookings", key: "upcomingBookings" },
        { label: "Vacant Rooms", key: "vacantRooms" }
    ];

    useEffect(() => {
        if (selectedCategory) {
            fetch(`/api/employee/${selectedCategory}`)
                .then(res => res.json())
                .then(data => setData(data))
                .catch(error => console.error("Error fetching data:", error));
        }
    }, [selectedCategory]);

    return (
        <Container maxWidth="lg" style={{ textAlign: "center", marginTop: "40px" }}>
            {view === "dashboard" ? (
                <>
                    <Typography variant="h4" gutterBottom>Employee Dashboard</Typography>
                    <Typography variant="subtitle1">Manage bookings, rentals, and room availability</Typography>
                    <Grid container spacing={3} justifyContent="center" style={{ marginTop: "20px" }}>
                        {categories.map((category) => (
                            <Grid item xs={12} sm={6} md={4} key={category.key}>
                                <Card>
                                    <CardActionArea onClick={() => { setSelectedCategory(category.key); setView("details"); }}>
                                        <CardContent>
                                            <Typography variant="h6" style={{ fontWeight: "bold" }}>{category.label}</Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </>
            ) : (
                <>
                    <Button onClick={() => setView("dashboard")} variant="outlined" color="primary" style={{ marginBottom: "20px" }}>Back</Button>
                    <Typography variant="h5" gutterBottom>{categories.find(c => c.key === selectedCategory)?.label}</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Hotel</strong></TableCell>
                                    <TableCell><strong>Room</strong></TableCell>
                                    <TableCell><strong>Guest</strong></TableCell>
                                    <TableCell><strong>Start Date</strong></TableCell>
                                    <TableCell><strong>End Date</strong></TableCell>
                                    <TableCell><strong>Status</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.length > 0 ? (
                                    data.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell>{row.hotelName}</TableCell>
                                            <TableCell>Room {row.roomId}</TableCell>
                                            <TableCell>{row.guestName}</TableCell>
                                            <TableCell>{row.startDate}</TableCell>
                                            <TableCell>{row.endDate}</TableCell>
                                            <TableCell>{row.status}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">No data available.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            )}
        </Container>
    );
}