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
        startDate: "", endDate: "", capacity: "", area: "", hotelChain: "", hotelRating: "", minPrice: "", maxPrice: "", hotelChains: []
    });

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

        if (filters.capacity) updatedRooms = updatedRooms.filter(room => room.capacity === parseInt(filters.capacity));
        if (filters.area) updatedRooms = updatedRooms.filter(room => room.area === filters.area);
        if (filters.hotelChain) updatedRooms = updatedRooms.filter(room => room.hotelChain === filters.hotelChain);
        if (filters.hotelRating) updatedRooms = updatedRooms.filter(room => Number(room.hotelRating) === Number(filters.hotelRating));
        if (filters.minPrice) updatedRooms = updatedRooms.filter(room => room.price >= parseInt(filters.minPrice));
        if (filters.maxPrice) updatedRooms = updatedRooms.filter(room => room.price <= parseInt(filters.maxPrice));

        setFilteredRooms(updatedRooms);
    }, [filters, rooms]);

    // ✅ Handle Row Click (Check if dates are filled)
    const handleRowClick = (room) => {
        if (!filters.startDate || !filters.endDate) {
            setDateError(true);
            setShowDateWarning(true);
            return;
        }
        setSelectedRoom(room);
    };

    return (
        <Container maxWidth="lg" style={{ marginTop: "40px" }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
                Find a Room
            </Typography>

            <Grid container spacing={3}>
                {/* Filters Column */}
                <Grid item xs={12} sm={4}>
                    <RoomFilter filters={filters} setFilters={setFilters} dateError={dateError} />
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
                                        <TableRow key={room.id} hover onClick={() => handleRowClick(room)} sx={{ cursor: "pointer" }}>
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

            {/* ❌ Date Warning Pop-up */}
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

            {/* ✅ Room Details Modal */}
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
                </DialogContent>

                {/* Action Buttons */}
                <DialogActions>
                    <Button color="secondary" onClick={() => setSelectedRoom(null)} variant="outlined">
                        Return
                    </Button>
                    <Button color="primary" variant="contained">
                        Book
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
