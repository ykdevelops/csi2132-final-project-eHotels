"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Container, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, TextField, MenuItem, Select,
    FormControl, InputLabel, Box, Grid, Divider
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star"; // ⭐ Import Star Icon

export default function FindRoom({ goBack }) {
    const router = useRouter();
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [areas, setAreas] = useState(["Downtown", "Suburban", "Countryside"]);
    const [hotelChains, setHotelChains] = useState([]);

    // Filters
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [capacity, setCapacity] = useState("");
    const [area, setArea] = useState("");
    const [hotelChain, setHotelChain] = useState("");
    const [hotelRating, setHotelRating] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await fetch("/api/room/availableRooms");
                if (!response.ok) throw new Error("Failed to fetch rooms.");
                const data = await response.json();

                const processedRooms = data.map(room => ({
                    ...room,
                    hotelRating: Number(room.hotelRating) || 0 // Ensure rating is a number
                }));

                setRooms(processedRooms);
                setFilteredRooms(processedRooms);

                // Extract unique hotel chain names for dropdown
                const uniqueHotelChains = [...new Set(processedRooms.map(room => room.hotelChain))].filter(Boolean);
                setHotelChains(uniqueHotelChains);
            } catch (error) {
                console.error("❌ Error fetching rooms:", error);
            }
        };

        fetchRooms();
    }, []);

    useEffect(() => {
        let updatedRooms = rooms;

        if (startDate || endDate) {
            updatedRooms = updatedRooms.filter(room => {
                if (!room.bookedDates || room.bookedDates.length === 0) {
                    return true; // No bookings, so it's available
                }

                const userStart = startDate ? new Date(startDate) : null;
                const userEnd = endDate ? new Date(endDate) : null;

                return !room.bookedDates.some(({ startDate, endDate }) => {
                    const bookedStart = new Date(startDate);
                    const bookedEnd = new Date(endDate);

                    return (
                        (userStart && userStart <= bookedEnd && userStart >= bookedStart) ||
                        (userEnd && userEnd >= bookedStart && userEnd <= bookedEnd) ||
                        (userStart && userEnd && userStart <= bookedStart && userEnd >= bookedEnd)
                    );
                });
            });
        }

        if (capacity) updatedRooms = updatedRooms.filter(room => room.capacity === parseInt(capacity));
        if (area) updatedRooms = updatedRooms.filter(room => room.area === area);
        if (hotelChain) updatedRooms = updatedRooms.filter(room => room.hotelChain === hotelChain);
        if (hotelRating) updatedRooms = updatedRooms.filter(room => Number(room.hotelRating) === Number(hotelRating));
        if (minPrice) updatedRooms = updatedRooms.filter(room => room.price >= parseInt(minPrice));
        if (maxPrice) updatedRooms = updatedRooms.filter(room => room.price <= parseInt(maxPrice));

        setFilteredRooms(updatedRooms);
    }, [startDate, endDate, capacity, area, hotelChain, hotelRating, minPrice, maxPrice, rooms]);

    return (
        <Container maxWidth="lg" style={{ marginTop: "40px" }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
                Find a Room
            </Typography>

            <Grid container spacing={3}>
                {/* Filters Column (1/3 width) */}
                <Grid item xs={12} sm={4}>
                    <Paper style={{ padding: "20px" }}>
                        <Typography variant="h6" gutterBottom>Filters</Typography>
                        <Divider style={{ marginBottom: "20px" }} />

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

                        {/* Capacity Select */}
                        <FormControl fullWidth margin="normal">
                            <InputLabel shrink sx={{
                                transform: "translateY(-20px)",  // Move label up slightly

                            }}>Capacity</InputLabel>
                            <Select value={capacity} onChange={(e) => setCapacity(e.target.value)} displayEmpty>
                                <MenuItem value="" sx={{
                                    textAlign: "left",              // Left-align text
                                    justifyContent: "flex-start",   // Ensures left alignment
                                    display: "flex",                // Helps with alignment

                                }}><em>All</em></MenuItem>
                                {[1, 2, 3, 4, 5].map(num => <MenuItem key={num} value={num}>{num}</MenuItem>)}
                            </Select>
                        </FormControl>

                        {/* Area Select */}
                        <FormControl fullWidth margin="normal">
                            <InputLabel shrink sx={{
                                transform: "translateY(-20px)",  // Move label up slightly

                            }}>Area</InputLabel>
                            <Select value={area} onChange={(e) => setArea(e.target.value)} displayEmpty>
                                <MenuItem value=""><em>All</em></MenuItem>
                                {areas.map(area => (
                                    <MenuItem key={area} value={area}>{area}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Hotel Chain Select */}
                        <FormControl fullWidth margin="normal">
                            <InputLabel shrink sx={{
                                transform: "translateY(-20px)",  // Move label up slightly

                            }}>Hotel Chain</InputLabel>
                            <Select value={hotelChain} onChange={(e) => setHotelChain(e.target.value)} displayEmpty>
                                <MenuItem value=""><em>All</em></MenuItem>
                                {hotelChains.map(chain => (
                                    <MenuItem key={chain} value={chain}>{chain}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Hotel Rating Select */}
                        <FormControl fullWidth margin="normal">
                            <InputLabel
                                shrink
                                sx={{
                                    transform: "translateY(-20px)",  // Move label up slightly

                                }}
                            >
                                Hotel Rating
                            </InputLabel>
                            <Select
                                value={hotelRating}
                                onChange={(e) => setHotelRating(e.target.value)}
                                displayEmpty
                            >
                                <MenuItem value=""><em>All</em></MenuItem>
                                {[1, 2, 3, 4, 5].map(num => (
                                    <MenuItem key={num} value={num}>{num} Stars</MenuItem>
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
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {["Hotel", "Hotel Chain", "Area", "Capacity", "Rating", "Price"].map(header => (
                                        <TableCell key={header}>{header}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredRooms.map((room) => (
                                    <TableRow key={room.id}>
                                        <TableCell>{room.hotelName}</TableCell>
                                        <TableCell>{room.hotelChain}</TableCell>
                                        <TableCell>{room.area}</TableCell>
                                        <TableCell>{room.capacity}</TableCell>
                                        <TableCell>
                                            {[...Array(room.hotelRating)].map((_, i) => <StarIcon key={i} color="warning" />)}
                                        </TableCell>
                                        <TableCell>${room.price}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Container>
    );
}
