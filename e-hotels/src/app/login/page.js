"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { TextField, Button, Container, Typography, Link } from "@mui/material";
import { UserContext } from "@/context/UserContext";

export default function LoginPage() {
    const router = useRouter();
    const { setUser } = useContext(UserContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error);
                return;
            }

            // Store user in localStorage
            localStorage.setItem("user", JSON.stringify(data.user));

            // Update context user
            setUser(data.user);

            // Redirect user to `/customer` page after login
            router.push("/customer");
        } catch (error) {
            console.error("Login error:", error);
            setError("Something went wrong. Try again.");
        }
    };

    return (
        <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "40px" }}>
            <Typography variant="h4" gutterBottom>Login</Typography>

            {error && <Typography color="error">{error}</Typography>}

            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    fullWidth
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    fullWidth
                />

                <Button type="submit" variant="contained" color="primary">
                    Login
                </Button>

                {/* Don't have an account? Register */}
                <Typography variant="body2" style={{ marginTop: "10px" }}>
                    Don't have an account?{" "}
                    <Link href="/register" style={{ cursor: "pointer", fontWeight: "bold" }}>
                        Register
                    </Link>
                </Typography>
            </form>
        </Container>
    );
}
