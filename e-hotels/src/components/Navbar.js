"use client";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { UserContext } from "@/context/UserContext";

export default function Navbar() {
    const router = useRouter();
    const { user, setUser } = useContext(UserContext);

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
