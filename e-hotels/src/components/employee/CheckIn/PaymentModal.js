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
                onClose(); // close payment modal
            } else {
                alert(`❌ Error: ${result.error}`);
            }
        } catch (error) {
            console.error("❌ Error creating rent:", error);
            alert("Server error.");
        }
    };

    return (
        open && (
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
        )
    );
}
