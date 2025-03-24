"use client";

import { useState, useEffect } from "react";
import {
    DialogTitle, DialogContent, DialogActions,
    Button, TextField
} from "@mui/material";

export default function BookingModal({ booking, onClose, refreshData }) {
    const [bookingData, setBookingData] = useState({
        book_ID: "",
        ba_ID: "",
        checkInDate: "",
        checkOutDate: "",
        cus_ID: "",
        room_ID: "",
        checkedIn: false
    });

    useEffect(() => {
        if (booking) {
            setBookingData({
                book_ID: booking.book_ID || "",
                ba_ID: booking.ba_ID || "",
                checkInDate: booking.checkInDate || "",
                checkOutDate: booking.checkOutDate || "",
                cus_ID: booking.cus_ID || "",
                room_ID: booking.room_ID || "",
                checkedIn: booking.checkedIn || false
            });
        }
    }, [booking]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookingData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            const response = await fetch("/api/employee/updateBooking", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookingData)
            });

            const result = await response.json();
            if (response.ok) {
                alert("Booking updated successfully!");
                refreshData();
                onClose();
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error("❌ Error updating booking:", error);
        }
    };

    const handleActivateRent = async () => {
        try {
            const response = await fetch("/api/employee/activateRent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...bookingData, checkedIn: true })
            });

            const result = await response.json();
            if (response.ok) {
                alert("Booking checked in and Rent activated!");
                refreshData();
                onClose();
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error("❌ Error activating rent:", error);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this booking?")) return;

        try {
            const response = await fetch(`/api/employee/bookings?book_ID=${bookingData.book_ID}`, {
                method: "DELETE"
            });

            const result = await response.json();
            if (response.ok) {
                alert("Booking deleted successfully!");
                refreshData();
                onClose();
            } else {
                alert(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error("❌ Error deleting booking:", error);
        }
    };

    const isTodayCheckIn = () => {
        const today = new Date().toISOString().split("T")[0];
        return bookingData.checkInDate === today;
    };

    return (
        <>
            <DialogTitle>Edit Booking</DialogTitle>
            <DialogContent>
                <TextField fullWidth label="Booking ID" name="book_ID" value={bookingData.book_ID} margin="normal" disabled />
                <TextField fullWidth label="Booking Archive ID" name="ba_ID" value={bookingData.ba_ID} margin="normal" disabled />
                <TextField fullWidth label="Check-In Date" name="checkInDate" type="date" value={bookingData.checkInDate} onChange={handleChange} margin="normal" />
                <TextField fullWidth label="Check-Out Date" name="checkOutDate" type="date" value={bookingData.checkOutDate} onChange={handleChange} margin="normal" />
                <TextField fullWidth label="Customer ID" name="cus_ID" value={bookingData.cus_ID} onChange={handleChange} margin="normal" />
                <TextField fullWidth label="Room ID" name="room_ID" value={bookingData.room_ID} onChange={handleChange} margin="normal" />
            </DialogContent>

            <DialogActions>
                <Button onClick={handleDelete} color="error">Delete</Button>
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
                <Button
                    onClick={handleActivateRent}
                    variant="contained"
                    color="success"
                    disabled={!isTodayCheckIn()}
                >
                    Activate Rent
                </Button>
            </DialogActions>
        </>
    );
}
