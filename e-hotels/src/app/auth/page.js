"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
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

            console.log("✅ Logged in:", data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
            alert(`Welcome ${data.user.email}, Role: ${data.user.role}`);

            router.push("/");
        } catch (error) {
            setError("Something went wrong. Try again.");
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "50px" }}>
            <h1>Login to e-Hotels</h1>
            <form onSubmit={handleLogin} style={{ display: "inline-block", textAlign: "left" }}>
                <div style={{ marginBottom: "10px" }}>
                    <label>Email:</label><br />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{ padding: "8px", width: "250px" }}
                    />
                </div>
                <div style={{ marginBottom: "10px" }}>
                    <label>Password:</label><br />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={{ padding: "8px", width: "250px" }}
                    />
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit" style={{ padding: "10px 20px", marginTop: "10px" }}>Login</button>
            </form>
        </div>
    );
}
