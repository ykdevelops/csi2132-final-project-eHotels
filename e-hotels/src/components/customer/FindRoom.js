"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Container, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, TextField, MenuItem, Select,
    FormControl, InputLabel, Box, Grid, Divider
} from "@mui/material";

export default function FindRoom({ goBack }) {
    const router = useRouter();
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [areas, setAreas] = useState([]);

    // Filters
    const [bookingType, setBookingType] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [capacity, setCapacity] = useState("");
    const [area, setArea] = useState("");
    const [hotelChain, setHotelChain] = useState("");
    const [hotelCategory, setHotelCategory] = useState("");
    const [totalRooms, setTotalRooms] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await fetch("/api/room/availableRooms");
                if (!response.ok) throw new Error("Failed to fetch rooms.");
                const data = await response.json();
                setRooms(data);
                setFilteredRooms(data);

                // Extract unique area values for dropdown
                const uniqueAreas = [...new Set(data.map(room => room.area))].filter(Boolean);
                setAreas(uniqueAreas);
            } catch (error) {
                console.error("❌ Error fetching rooms:", error);
            }
        };

        fetchRooms();
    }, []);

    useEffect(() => {
        let updatedRooms = rooms;

        if (bookingType) updatedRooms = updatedRooms.filter(room => room.bookingType === bookingType);
        if (startDate) updatedRooms = updatedRooms.filter(room => new Date(room.startDate) >= new Date(startDate));
        if (endDate) updatedRooms = updatedRooms.filter(room => new Date(room.endDate) <= new Date(endDate));
        if (capacity) updatedRooms = updatedRooms.filter(room => room.capacity === parseInt(capacity));
        if (area) updatedRooms = updatedRooms.filter(room => room.area === area);
        if (hotelChain) updatedRooms = updatedRooms.filter(room => room.hotelName === hotelChain);
        if (hotelCategory) updatedRooms = updatedRooms.filter(room => room.hotelCategory === hotelCategory);
        if (totalRooms) updatedRooms = updatedRooms.filter(room => room.totalRooms === parseInt(totalRooms));
        if (minPrice) updatedRooms = updatedRooms.filter(room => room.price >= parseInt(minPrice));
        if (maxPrice) updatedRooms = updatedRooms.filter(room => room.price <= parseInt(maxPrice));

        setFilteredRooms(updatedRooms);
    }, [bookingType, startDate, endDate, capacity, area, hotelChain, hotelCategory, totalRooms, minPrice, maxPrice, rooms]);

    const handleBooking = (roomId) => {
        console.log(`🔹 Booking room: ${roomId}`);
        // Add logic to handle booking request
    };

    const handleRenting = (roomId) => {
        console.log(`🔹 Renting room: ${roomId}`);
        // Add logic to handle renting request
    };

    return (
        <Container maxWidth="lg" style={{ marginTop: "40px" }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
                Find a Room
            </Typography>

            <Grid container spacing={3}>
                {/* Filters Column (1/3 width) */}
                <Grid item xs={12} sm={4}>
                    <Paper style={{ padding: "20px", height: "100%", position: "sticky", top: "20px" }}>
                        <Typography variant="h6" gutterBottom>
                            Filters
                        </Typography>
                        <Divider style={{ marginBottom: "20px" }} />

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Booking Type</InputLabel>
                            <Select value={bookingType} onChange={(e) => setBookingType(e.target.value)}>
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="Booking">Booking</MenuItem>
                                <MenuItem value="Renting">Renting</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            label="Start Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            fullWidth
                            margin="normal"
                        />

                        <TextField
                            label="End Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            fullWidth
                            margin="normal"
                        />

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Capacity</InputLabel>
                            <Select value={capacity} onChange={(e) => setCapacity(e.target.value)}>
                                <MenuItem value="">All</MenuItem>
                                {[1, 2, 3, 4, 5].map(num => <MenuItem key={num} value={num}>{num}</MenuItem>)}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Area</InputLabel>
                            <Select value={area} onChange={(e) => setArea(e.target.value)}>
                                <MenuItem value="">All</MenuItem>
                                {areas.map(area => (
                                    <MenuItem key={area} value={area}>{area}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            label="Min Price"
                            type="number"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Max Price"
                            type="number"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                    </Paper>
                </Grid>

                {/* Available Rooms Column (2/3 width) */}
                <Grid item xs={12} sm={8}>
                    <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                        <Table>
                            <TableHead sx={{ backgroundColor: "#f4f4f4" }}>
                                <TableRow>
                                    {["Hotel", "Booking Type", "Start Date", "End Date", "Capacity", "Price", "Actions"].map(header => (
                                        <TableCell key={header} sx={{ fontWeight: "bold" }}>{header}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredRooms.length > 0 ? (
                                    filteredRooms.map((room) => (
                                        <TableRow key={room.id} sx={{ "&:nth-of-type(odd)": { backgroundColor: "#f9f9f9" } }}>
                                            <TableCell>{room.hotelName}</TableCell>
                                            <TableCell>{room.bookingType}</TableCell>
                                            <TableCell>{room.startDate}</TableCell>
                                            <TableCell>{room.endDate}</TableCell>
                                            <TableCell>{room.capacity}</TableCell>
                                            <TableCell>${room.price}</TableCell>
                                            <TableCell>
                                                <Box display="flex" justifyContent="center" gap={2}>
                                                    <Button variant="contained" color="primary" onClick={() => handleBooking(room.id)}>Book</Button>
                                                    <Button variant="contained" color="secondary" onClick={() => handleRenting(room.id)}>Rent</Button>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">No available rooms found.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Container>
    );
}
