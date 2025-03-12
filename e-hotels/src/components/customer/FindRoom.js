"use client";
import { useEffect, useState } from "react";
import { Container, Typography, Grid, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, CircularProgress } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import RoomFilter from "./RoomFilter";

export default function FindRoom() {
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [hotelChains, setHotelChains] = useState([]);
    const [loading, setLoading] = useState(true);
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
                setFilters(prev => ({ ...prev, hotelChains: [...new Set(processedRooms.map(room => room.hotelChain))].filter(Boolean) }));
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

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" fontWeight="bold" textAlign="center">
                Find a Room
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                    <RoomFilter filters={filters} setFilters={setFilters} />
                </Grid>
                <Grid item xs={12} sm={8}>
                    <TableContainer component={Paper}>
                        {loading ? (
                            <CircularProgress sx={{ margin: "auto", display: "block", padding: 2 }} />
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
                                        <TableRow key={room.id}>
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
        </Container>
    );
}
