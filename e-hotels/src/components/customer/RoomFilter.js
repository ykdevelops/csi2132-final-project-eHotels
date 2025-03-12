"use client";
import { useState, useEffect } from "react";
import { Paper, Typography, Divider, TextField, MenuItem, Select, FormControl, InputLabel, Box } from "@mui/material";

export default function RoomFilter({ filters, setFilters }) {
    // Extracting filter values from parent state
    const { startDate, endDate, capacity, area, hotelChain, hotelRating, minPrice, maxPrice, hotelChains } = filters;

    // Function to update filter values
    const handleChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Paper style={{ padding: "20px" }}>
            <Typography variant="h6" gutterBottom>Filters</Typography>
            <Divider style={{ marginBottom: "20px" }} />

            {/* Date Filters */}
            <TextField label="Start Date" type="date" InputLabelProps={{ shrink: true }} value={startDate} onChange={(e) => handleChange("startDate", e.target.value)} fullWidth margin="normal" />
            <TextField label="End Date" type="date" InputLabelProps={{ shrink: true }} value={endDate} onChange={(e) => handleChange("endDate", e.target.value)} fullWidth margin="normal" />

            {/* Capacity Filter */}
            <FormControl fullWidth margin="normal">
                <InputLabel>Capacity</InputLabel>
                <Select value={capacity} onChange={(e) => handleChange("capacity", e.target.value)} displayEmpty>
                    <MenuItem value=""><em>All</em></MenuItem>
                    {[1, 2, 3, 4, 5].map(num => <MenuItem key={num} value={num}>{num}</MenuItem>)}
                </Select>
            </FormControl>

            {/* Area Filter */}
            <FormControl fullWidth margin="normal">
                <InputLabel>Area</InputLabel>
                <Select value={area} onChange={(e) => handleChange("area", e.target.value)} displayEmpty>
                    <MenuItem value=""><em>All</em></MenuItem>
                    {["Downtown", "Suburban", "Countryside"].map(area => (
                        <MenuItem key={area} value={area}>{area}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Hotel Chain Filter */}
            <FormControl fullWidth margin="normal">
                <InputLabel>Hotel Chain</InputLabel>
                <Select value={hotelChain} onChange={(e) => handleChange("hotelChain", e.target.value)} displayEmpty>
                    <MenuItem value=""><em>All</em></MenuItem>
                    {hotelChains.map(chain => (
                        <MenuItem key={chain} value={chain}>{chain}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Hotel Rating Filter */}
            <FormControl fullWidth margin="normal">
                <InputLabel>Hotel Rating</InputLabel>
                <Select value={hotelRating} onChange={(e) => handleChange("hotelRating", e.target.value)} displayEmpty>
                    <MenuItem value=""><em>All</em></MenuItem>
                    {[1, 2, 3, 4, 5].map(num => (
                        <MenuItem key={num} value={num}>{num} Stars</MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Price Filters */}
            <TextField label="Min Price" type="number" value={minPrice} onChange={(e) => handleChange("minPrice", e.target.value)} fullWidth margin="normal" />
            <TextField label="Max Price" type="number" value={maxPrice} onChange={(e) => handleChange("maxPrice", e.target.value)} fullWidth margin="normal" />
        </Paper>
    );
}
