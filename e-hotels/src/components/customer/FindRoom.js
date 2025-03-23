"use client";
import { useState, useEffect } from "react";
import {
    Container, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, CircularProgress, Dialog, DialogActions,
    DialogContent, DialogTitle, Button, IconButton, Box, Grid
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import CloseIcon from "@mui/icons-material/Close";
import RoomFilter from "./RoomFilter";

export default function FindRoom() {
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [hotelChains, setHotelChains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [dateError, setDateError] = useState(false);
    const [showDateWarning, setShowDateWarning] = useState(false);

    // Filters
    const [filters, setFilters] = useState({
        startDate: "", endDate: "", capacity: "", area: "",
        hotelChain: "", hotelRating: "", minPrice: "", maxPrice: "",
        hotelChains: []
    });

    // 1) EXTRACT the fetch logic into its own function
    const fetchRooms = async () => {
        try {
            setLoading(true);

            // Build query only if we have dates
            const params = new URLSearchParams();
            if (filters.startDate) params.append("startDate", filters.startDate);
            if (filters.endDate) params.append("endDate", filters.endDate);

            const response = await fetch(`/api/room/availableRooms?${params.toString()}`);
            if (!response.ok) throw new Error("Failed to fetch rooms.");
            const data = await response.json();

            const processedRooms = data.map(room => ({
                ...room,
                hotelRating: Number(room.hotelRating) || 0
            }));

            setRooms(processedRooms);
            setFilteredRooms(processedRooms);

            // Build the unique hotel chains list
            const uniqueHotelChains = [
                ...new Set(processedRooms.map(room => room.hotelChain))
            ].filter(Boolean);

            setHotelChains(uniqueHotelChains);
        } catch (error) {
            console.error("❌ Error fetching rooms:", error);
        } finally {
            setLoading(false);
        }
    };

    // 2) RUN fetchRooms once on mount (and whenever dates change, if desired)
    useEffect(() => {
        fetchRooms();
    }, [filters.startDate, filters.endDate]);

    // 3) Filter the in-memory rooms when filters besides date change
    useEffect(() => {
        let updatedRooms = rooms;

        if (filters.capacity) {
            updatedRooms = updatedRooms.filter(room => room.capacity === parseInt(filters.capacity));
        }
        if (filters.area) {
            updatedRooms = updatedRooms.filter(room => room.area === filters.area);
        }
        if (filters.hotelChain) {
            updatedRooms = updatedRooms.filter(room => room.hotelChain === filters.hotelChain);
        }
        if (filters.hotelRating) {
            updatedRooms = updatedRooms.filter(room => Number(room.hotelRating) === Number(filters.hotelRating));
        }
        if (filters.minPrice) {
            updatedRooms = updatedRooms.filter(room => room.price >= parseInt(filters.minPrice));
        }
        if (filters.maxPrice) {
            updatedRooms = updatedRooms.filter(room => room.price <= parseInt(filters.maxPrice));
        }

        setFilteredRooms(updatedRooms);
    }, [filters, rooms]);

    // Handle Row Click
    const handleRowClick = (room) => {
        if (!filters.startDate || !filters.endDate) {
            setDateError(true);
            setShowDateWarning(true);
            return;
        }
        setSelectedRoom(room);
    };

    // 4) After successful booking, clear filters & refresh
    const handleBookingSuccess = async () => {
        // Clear the selected room from modal
        setSelectedRoom(null);

        // Reset your filters
        setFilters({
            startDate: "",
            endDate: "",
            capacity: "",
            area: "",
            hotelChain: "",
            hotelRating: "",
            minPrice: "",
            maxPrice: "",
            hotelChains: []
        });

        // Refresh the rooms list
        await fetchRooms();
    };

    return (
        <Container maxWidth="lg" style={{ marginTop: "40px" }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
                Find a Room
            </Typography>

            <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                    <RoomFilter filters={filters} setFilters={setFilters} dateError={dateError} />
                </Grid>

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
                                        <TableRow
                                            key={room.id}
                                            hover
                                            onClick={() => handleRowClick(room)}
                                            sx={{ cursor: "pointer" }}
                                        >
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
                        )}
                    </TableContainer>
                </Grid>
            </Grid>

            <Dialog open={showDateWarning} onClose={() => setShowDateWarning(false)} fullWidth maxWidth="xs">
                <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography variant="h6" component="span" fontWeight="bold">
                        Date Selection Required
                    </Typography>
                    <IconButton onClick={() => setShowDateWarning(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Typography>Please select a **Start Date** and **End Date** before viewing room details.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={() => setShowDateWarning(false)} variant="contained">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={!!selectedRoom} onClose={() => setSelectedRoom(null)} fullWidth maxWidth="md">
                <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography variant="h6" component="span" fontWeight="bold">
                        Room Details
                    </Typography>
                    <IconButton onClick={() => setSelectedRoom(null)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <Box sx={{ width: "100%", height: 250, backgroundColor: "#ccc", borderRadius: 2, mb: 3 }} />
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
                </DialogContent>

                <DialogActions>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={async () => {
                            if (!selectedRoom) return;
                            try {
                                // Book this room
                                const response = await fetch("/api/book", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        rent_ID: `rent_${Date.now()}`, // Unique rent ID
                                        room_ID: selectedRoom.room_ID,
                                        startDate: filters.startDate,
                                        endDate: filters.endDate,
                                    }),
                                });

                                if (!response.ok) {
                                    const err = await response.json();
                                    throw new Error(err.error || "Booking failed.");
                                }

                                const result = await response.json();
                                alert(`✅ Booking successful! Booking ID: ${result.book_ID}`);

                                // 🟡 4) Once the booking is successful
                                handleBookingSuccess(); // clear filters + refresh
                            } catch (error) {
                                alert(`❌ ${error.message}`);
                            }
                        }}
                    >
                        Book
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
