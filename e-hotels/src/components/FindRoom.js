"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Container, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, TextField, MenuItem, Select,
    FormControl, InputLabel, Box
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
                const response = await fetch("/api/rooms");
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

    return (
        <Container maxWidth="lg" style={{ marginTop: "40px", textAlign: "center" }}>
            <Button
                onClick={goBack}
                variant="contained"
                color="secondary"
                sx={{ mb: 3 }}
            >
                ⬅ Back
            </Button>

            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Find a Room
            </Typography>

            {/* Filters Section */}
            <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2} mb={4}>
                {/* Booking Type */}
                <FormControl style={{ minWidth: 170 }}>
                    <InputLabel>Booking Type</InputLabel>
                    <Select value={bookingType} onChange={(e) => setBookingType(e.target.value)}>
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="Booking">Booking</MenuItem>
                        <MenuItem value="Renting">Renting</MenuItem>
                    </Select>
                </FormControl>

                {/* Start Date */}
                <TextField
                    label="Start Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    style={{ minWidth: 170 }}
                />

                {/* End Date */}
                <TextField
                    label="End Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    style={{ minWidth: 170 }}
                />

                {/* Capacity */}
                <FormControl style={{ minWidth: 120 }}>
                    <InputLabel>Capacity</InputLabel>
                    <Select value={capacity} onChange={(e) => setCapacity(e.target.value)}>
                        <MenuItem value="">All</MenuItem>
                        {[1, 2, 3, 4, 5].map(num => <MenuItem key={num} value={num}>{num}</MenuItem>)}
                    </Select>
                </FormControl>

                {/* Area */}
                <FormControl style={{ minWidth: 170 }}>
                    <InputLabel>Area</InputLabel>
                    <Select value={area} onChange={(e) => setArea(e.target.value)}>
                        <MenuItem value="">All</MenuItem>
                        {areas.map(area => (
                            <MenuItem key={area} value={area}>{area}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Hotel Chain */}
                <TextField
                    label="Hotel Chain"
                    value={hotelChain}
                    onChange={(e) => setHotelChain(e.target.value)}
                    style={{ minWidth: 170 }}
                />

                {/* Hotel Category */}
                <FormControl style={{ minWidth: 170 }}>
                    <InputLabel>Hotel Category</InputLabel>
                    <Select value={hotelCategory} onChange={(e) => setHotelCategory(e.target.value)}>
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="Luxury">Luxury</MenuItem>
                        <MenuItem value="Budget">Budget</MenuItem>
                        <MenuItem value="Business">Business</MenuItem>
                    </Select>
                </FormControl>

                {/* Total Rooms */}
                <TextField
                    label="Total Rooms in Hotel"
                    type="number"
                    value={totalRooms}
                    onChange={(e) => setTotalRooms(e.target.value)}
                    style={{ minWidth: 170 }}
                />

                {/* Min & Max Price */}
                <TextField
                    label="Min Price"
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    style={{ minWidth: 150 }}
                />
                <TextField
                    label="Max Price"
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    style={{ minWidth: 150 }}
                />
            </Box>

            {/* Table of Available Rooms */}
            <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                <Table>
                    <TableHead sx={{ backgroundColor: "#f4f4f4" }}>
                        <TableRow>
                            {["Hotel", "Booking Type", "Start Date", "End Date", "Capacity", "Area", "Hotel Category", "Rooms in Hotel", "Price", "Book"].map(header => (
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
                                    <TableCell>{room.area}</TableCell>
                                    <TableCell>{room.hotelCategory}</TableCell>
                                    <TableCell>{room.totalRooms}</TableCell>
                                    <TableCell>${room.price}</TableCell>
                                    <TableCell>
                                        <Button variant="contained" color="primary">
                                            Book
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={10} align="center">No available rooms found.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}
