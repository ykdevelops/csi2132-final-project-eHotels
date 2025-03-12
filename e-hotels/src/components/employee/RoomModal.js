"use client";

import { useState, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function RoomModal({ open, room, onClose, refreshData }) {
    const [formData, setFormData] = useState({});
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        if (room) {
            setFormData(room);

            // ✅ Pre-fill start and end dates if they exist
            if (room.bookedDates && room.bookedDates.length > 0) {
                setStartDate(room.bookedDates[0].startDate || "");
                setEndDate(room.bookedDates[0].endDate || "");
            } else {
                setStartDate("");
                setEndDate("");
            }
        }
    }, [room]);

    // ✅ Handle Input Changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // ✅ Handle Save (Update Room)
    const handleSave = async () => {
        const updatedRoom = { ...formData };

        // ✅ Add formatted booked dates
        updatedRoom.bookedDates = startDate && endDate
            ? [{ startDate, endDate, book_ID: room?.bookedDates?.[0]?.book_ID || "new_booking_id" }]
            : [];

        try {
            const response = await fetch("/api/employee/editDatabase", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "rooms", id: room.id, data: updatedRoom }),
            });

            const result = await response.json();
            if (response.ok) {
                alert("Room updated successfully");
                refreshData();
                onClose();
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error("❌ Error saving room data:", error);
            alert("Failed to save entry.");
        }
    };

    // ✅ Handle Delete Room
    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this room?")) return;

        try {
            const response = await fetch("/api/employee/editDatabase", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "rooms", id: room.id }),
            });

            const result = await response.json();
            if (response.ok) {
                alert("Room deleted successfully");
                refreshData();
                onClose();
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error("❌ Error deleting room:", error);
            alert("Failed to delete entry.");
        }
    };

    if (!room) return null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                Edit Room
                <IconButton
                    style={{ position: "absolute", right: 10, top: 10 }}
                    onClick={onClose}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                {Object.keys(room).map((key) =>
                    key !== "bookedDates" ? (
                        <TextField
                            key={key}
                            label={key.toUpperCase()}
                            name={key}
                            value={formData[key] || ""}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            disabled={key === "id"} // Prevent editing Room ID
                        />
                    ) : null
                )}

                {/* ✅ Booking Dates as Start & End Date Fields */}
                <TextField
                    label="Start Date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="End Date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDelete} color="error">
                    Delete
                </Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}
