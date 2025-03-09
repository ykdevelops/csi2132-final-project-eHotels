"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Container, Typography, Link } from "@mui/material";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    // ✅ Handle Login
    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("/api/auth/login", { // ✅ Correct API route
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error);
                return;
            }

            console.log("✅ Logged in:", data.user);
            localStorage.setItem("user", JSON.stringify(data.user));

            alert(`Welcome ${data.user.name}, Role: ${data.user.role}`);

            // ✅ Redirect user to `/customer` page after login
            router.push("/customer");
        } catch (error) {
            setError("Something went wrong. Try again.");
        }
    };

    return (
        <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "40px" }}>
            <Typography variant="h4" gutterBottom>Login</Typography>

            {error && <Typography color="error">{error}</Typography>}

            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth />
                <TextField label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required fullWidth />

                <Button type="submit" variant="contained" color="primary">Login</Button>

                {/* Don't have an account? Register */}
                <Typography variant="body2" style={{ marginTop: "10px" }}>
                    Don't have an account?{" "}
                    <Link href="/auth/register" style={{ cursor: "pointer", fontWeight: "bold" }}>Register</Link>
                </Typography>
            </form>
        </Container>
    );
}
