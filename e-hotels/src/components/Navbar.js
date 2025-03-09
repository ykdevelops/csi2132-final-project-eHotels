"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        router.push("/login");
    };

    return (
        <nav style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "15px 40px",
            backgroundColor: "#fff",
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)"
        }}>
            {/* 🔹 Left: Logo */}
            <div
                style={{ fontSize: "24px", fontWeight: "bold", cursor: "pointer", color: "#D32F2F" }}
                onClick={() => router.push("/")}
            >
                eHotels
            </div>

            {/* 🔹 Right: Auth Links */}
            <div>
                {user ? (
                    // ✅ Show logout button if logged in
                    <>
                        <span style={{ marginRight: "15px", fontSize: "16px" }}>
                            Logged in as: <strong>{user.name} ({user.role})</strong>
                        </span>
                        <button
                            onClick={handleLogout}
                            style={{
                                padding: "8px 16px",
                                backgroundColor: "#D32F2F",
                                color: "#fff",
                                border: "none",
                                cursor: "pointer",
                                borderRadius: "4px"
                            }}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    // ✅ Show login/signup buttons if not logged in
                    <>
                        <button
                            onClick={() => router.push("/login")}
                            style={{
                                marginRight: "10px",
                                padding: "8px 16px",
                                backgroundColor: "#D32F2F",
                                color: "#fff",
                                border: "none",
                                cursor: "pointer",
                                borderRadius: "4px"
                            }}
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => router.push("/register")}
                            style={{
                                padding: "8px 16px",
                                backgroundColor: "#1976D2",
                                color: "#fff",
                                border: "none",
                                cursor: "pointer",
                                borderRadius: "4px"
                            }}
                        >
                            Sign Up
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
}
