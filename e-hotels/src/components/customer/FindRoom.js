"use client";
import { useEffect, useState } from "react";
import {
    Container, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, TextField, MenuItem, Select,
    FormControl, InputLabel, Box, Grid, Divider, CircularProgress,
    Dialog, DialogActions, DialogContent, DialogTitle, Button, IconButton
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import CloseIcon from "@mui/icons-material/Close";

export default function FindRoom() {
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [hotelChains, setHotelChains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState(null);

    // ✅ All Filters Included
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
                setLoading(true);
                const response = await fetch("/api/room/availableRooms");
                if (!response.ok) throw new Error("Failed to fetch rooms.");
                const data = await response.json();

                const processedRooms = data.map(room => ({
                    ...room,
                    hotelRating: Number(room.hotelRating) || 0
                }));

                setRooms(processedRooms);
                setFilteredRooms(processedRooms);

                const uniqueHotelChains = [...new Set(processedRooms.map(room => room.hotelChain))].filter(Boolean);
                setHotelChains(uniqueHotelChains);
            } catch (error) {
                console.error("❌ Error fetching rooms:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    useEffect(() => {
        let updatedRooms = rooms;

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
                {/* Filters Column */}
                <Grid item xs={12} sm={4}>
                    <Paper style={{ padding: "20px" }}>
                        <Typography variant="h6" gutterBottom>Filters</Typography>
                        <Divider style={{ marginBottom: "20px" }} />

                        <TextField label="Start Date" type="date" InputLabelProps={{ shrink: true }} value={startDate} onChange={(e) => setStartDate(e.target.value)} fullWidth margin="normal" />
                        <TextField label="End Date" type="date" InputLabelProps={{ shrink: true }} value={endDate} onChange={(e) => setEndDate(e.target.value)} fullWidth margin="normal" />

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Capacity</InputLabel>
                            <Select value={capacity} onChange={(e) => setCapacity(e.target.value)} displayEmpty>
                                <MenuItem value=""><em>All</em></MenuItem>
                                {[1, 2, 3, 4, 5].map(num => <MenuItem key={num} value={num}>{num}</MenuItem>)}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Area</InputLabel>
                            <Select value={area} onChange={(e) => setArea(e.target.value)} displayEmpty>
                                <MenuItem value=""><em>All</em></MenuItem>
                                {["Downtown", "Suburban", "Countryside"].map(area => (
                                    <MenuItem key={area} value={area}>{area}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Hotel Chain</InputLabel>
                            <Select value={hotelChain} onChange={(e) => setHotelChain(e.target.value)} displayEmpty>
                                <MenuItem value=""><em>All</em></MenuItem>
                                {hotelChains.map(chain => (
                                    <MenuItem key={chain} value={chain}>{chain}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal">
                            <InputLabel>Hotel Rating</InputLabel>
                            <Select value={hotelRating} onChange={(e) => setHotelRating(e.target.value)} displayEmpty>
                                <MenuItem value=""><em>All</em></MenuItem>
                                {[1, 2, 3, 4, 5].map(num => (
                                    <MenuItem key={num} value={num}>{num} Stars</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField label="Min Price" type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} fullWidth margin="normal" />
                        <TextField label="Max Price" type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} fullWidth margin="normal" />
                    </Paper>
                </Grid>

                {/* Available Rooms Column */}
                <Grid item xs={12} sm={8}>
                    <TableContainer component={Paper}>
                        {loading ? (
                            <Box sx={{ display: "flex", justifyContent: "center", padding: 2 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
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
                                        <TableRow key={room.id} hover onClick={() => setSelectedRoom(room)} sx={{ cursor: "pointer" }}>
                                            <TableCell>{room.hotelName}</TableCell>
                                            <TableCell>{room.hotelChain}</TableCell>
                                            <TableCell>{room.area}</TableCell>
                                            <TableCell>{room.capacity}</TableCell>
                                            <TableCell>{[...Array(room.hotelRating)].map((_, i) => <StarIcon key={i} color="warning" />)}</TableCell>
                                            <TableCell>${room.price}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </TableContainer>
                </Grid>
            </Grid>

            {/* Room Details Modal */}
            <Dialog open={!!selectedRoom} onClose={() => setSelectedRoom(null)} fullWidth maxWidth="md">
                <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    {/* Fix: Change component="span" to avoid nesting conflict */}
                    <Typography variant="h6" component="span" fontWeight="bold">
                        Room Details
                    </Typography>
                    <IconButton onClick={() => setSelectedRoom(null)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    {/* Placeholder Image */}
                    <Box sx={{ width: "100%", height: 250, backgroundColor: "#ccc", borderRadius: 2, mb: 3 }} />

                    {/* Room Information */}
                    <Typography variant="h5" fontWeight="bold" gutterBottom>{selectedRoom?.hotelName}</Typography>
                    <Typography variant="subtitle1" color="textSecondary">{selectedRoom?.hotelChain}</Typography>

                    <Grid container spacing={2} sx={{ mt: 2 }}>
                        <Grid item xs={6}>
                            <Typography><strong>Location:</strong> {selectedRoom?.area}</Typography>
                            <Typography><strong>Capacity:</strong> {selectedRoom?.capacity} People</Typography>
                            <Typography><strong>Room Type:</strong> {selectedRoom?.type || "N/A"}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography><strong>Price:</strong> ${selectedRoom?.price} per night</Typography>
                            <Typography><strong>Rating:</strong> {selectedRoom?.hotelRating} Stars</Typography>
                            <Typography><strong>View:</strong> {selectedRoom?.view || "N/A"}</Typography>
                        </Grid>
                    </Grid>

                    {/* Room Features */}
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>Room Features:</Typography>
                        <Typography>- {selectedRoom?.bedType || "N/A"} Bed</Typography>
                        <Typography>- {selectedRoom?.wifi ? "Free Wi-Fi" : "No Wi-Fi"}</Typography>
                        <Typography>- {selectedRoom?.ac ? "Air Conditioning" : "No A/C"}</Typography>
                        <Typography>- {selectedRoom?.tv ? "Television Included" : "No TV"}</Typography>
                    </Box>
                </DialogContent>

                {/* Action Buttons */}
                <DialogActions sx={{ justifyContent: "space-between", padding: "20px" }}>
                    <Button color="secondary" onClick={() => setSelectedRoom(null)} variant="outlined">
                        Return
                    </Button>
                    <Box>
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={async () => {
                                if (!selectedRoom) return;
                                try {
                                    const response = await fetch("/api/book", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({
                                            cus_ID: "c1", // Replace with logged-in user's ID
                                            room_ID: selectedRoom.room_ID,
                                            startDate: "2025-06-01", // Replace with selected dates
                                            endDate: "2025-06-07"
                                        }),
                                    });

                                    const result = await response.json();
                                    if (response.ok) {
                                        alert(`Booking successful! Booking ID: ${result.book_ID}`);
                                        setSelectedRoom(null); // Close modal after booking
                                    } else {
                                        alert(`Booking failed: ${result.error}`);
                                    }
                                } catch (error) {
                                    console.error("❌ Booking Error:", error);
                                    alert("Failed to book the room.");
                                }
                            }}
                        >
                            Book
                        </Button>

                    </Box>
                </DialogActions>
            </Dialog>



        </Container>
    );
}
