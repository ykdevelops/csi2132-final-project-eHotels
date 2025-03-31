"use client";

import { useState, useEffect } from "react";
import {
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem
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

    const [showPaymentModal, setShowPaymentModal] = useState(false);

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

    const openPaymentModal = () => setShowPaymentModal(true);
    const closePaymentModal = () => {
        setShowPaymentModal(false);
        onClose(); // Also close main modal after payment
    };

    return (
        <>
            <DialogTitle>Edit Booking</DialogTitle>
            <DialogContent>
                <TextField fullWidth label="Booking ID" name="book_ID" value={bookingData.book_ID} margin="normal" disabled />
                <TextField fullWidth label="Booking Archive ID" name="ba_ID" value={bookingData.ba_ID} margin="normal" disabled />
                <TextField fullWidth label="Check-In Date" name="checkInDate" type="date" value={bookingData.checkInDate} onChange={handleChange} margin="normal" disabled={showPaymentModal} />
                <TextField fullWidth label="Check-Out Date" name="checkOutDate" type="date" value={bookingData.checkOutDate} onChange={handleChange} margin="normal" disabled={showPaymentModal} />
                <TextField fullWidth label="Customer ID" name="cus_ID" value={bookingData.cus_ID} onChange={handleChange} margin="normal" disabled={showPaymentModal} />
                <TextField fullWidth label="Room ID" name="room_ID" value={bookingData.room_ID} onChange={handleChange} margin="normal" disabled={showPaymentModal} />
            </DialogContent>

            {!showPaymentModal && (
                <DialogActions>
                    <Button onClick={handleDelete} color="error">Delete</Button>
                    <Button onClick={onClose} color="secondary">Cancel</Button>
                    <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
                    <Button
                        onClick={openPaymentModal}
                        variant="contained"
                        color="success"
                        disabled={!isTodayCheckIn()}
                    >
                        Activate Rent
                    </Button>
                </DialogActions>
            )}

            {showPaymentModal && (
                <PaymentModal
                    open={showPaymentModal}
                    onClose={closePaymentModal}
                    bookingData={bookingData}
                    refreshData={refreshData}
                />
            )}
        </>
    );
}

function PaymentModal({ open, onClose, bookingData, refreshData }) {
    const [paymentInfo, setPaymentInfo] = useState({
        paymentAmount: "",
        paymentMethod: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPaymentInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleConfirmPayment = async () => {
        const missingFields = Object.entries(paymentInfo).filter(([_, v]) => !v);
        if (missingFields.length > 0) {
            alert("Please fill out all fields before submitting.");
            return;
        }

        const rentData = {
            ...bookingData,
            ...paymentInfo,
            checkedIn: true
        };

        try {
            const response = await fetch("/api/employee/activateRent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(rentData)
            });

            const result = await response.json();
            if (response.ok) {
                alert("✅ Payment successful & Rent activated!");
                refreshData();
                onClose(); // Close both modals
            } else {
                alert(`❌ Error: ${result.error}`);
            }
        } catch (error) {
            console.error("❌ Error creating rent:", error);
            alert("Server error.");
        }
    };

    return (
        <>
            <DialogTitle>Enter Payment Info</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="Payment Amount ($)"
                    name="paymentAmount"
                    type="number"
                    value={paymentInfo.paymentAmount}
                    onChange={handleChange}
                    margin="normal"
                />
                <TextField
                    select
                    fullWidth
                    label="Payment Method"
                    name="paymentMethod"
                    value={paymentInfo.paymentMethod}
                    onChange={handleChange}
                    margin="normal"
                >
                    <MenuItem value="Credit Card">Credit Card</MenuItem>
                    <MenuItem value="Debit">Debit</MenuItem>
                    <MenuItem value="Cash">Cash</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                </TextField>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={handleConfirmPayment} variant="contained" color="primary">Confirm & Activate</Button>
            </DialogActions>
        </>
    );
}
