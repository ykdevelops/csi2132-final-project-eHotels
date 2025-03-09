"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Container, Typography, Link } from "@mui/material";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            console.log("🚀 Sending registration request...");

            const response = await fetch("/api/register", {  // ✅ Correct API route
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("❌ Registration error:", errorData.error);
                setError(errorData.error || "Failed to register.");
                setLoading(false);
                return;
            }

            const data = await response.json();
            console.log("✅ Registration successful:", data);
            setSuccess("Account created successfully!");
            setTimeout(() => router.push("/login"), 2000);
        } catch (error) {
            console.error("❌ Network or API error:", error);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "40px" }}>
            <Typography variant="h4" gutterBottom>Register</Typography>

            {error && <Typography color="error">{error}</Typography>}
            {success && <Typography color="success.main">{success}</Typography>}

            <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <TextField label="Name" name="name" value={formData.name} onChange={handleChange} required fullWidth />
                <TextField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required fullWidth />
                <TextField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} required fullWidth />

                <Button type="submit" variant="contained" color="primary" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </Button>

                <Typography variant="body2" style={{ marginTop: "10px" }}>
                    Already have an account?{" "}
                    <Link href="/login" style={{ cursor: "pointer", fontWeight: "bold" }}>Login</Link>
                </Typography>
            </form>
        </Container>
    );
}
