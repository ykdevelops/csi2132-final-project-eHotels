"use client";

import { useState } from "react";

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div style={{ textAlign: "center", padding: "50px" }}>
            <h1>{isLogin ? "Login" : "Register"}</h1>
            <form>
                {!isLogin && <input type="text" placeholder="Full Name" required />}
                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Password" required />
                <button type="submit" style={{ margin: "10px", padding: "10px 20px" }}>
                    {isLogin ? "Login" : "Register"}
                </button>
            </form>
            <p onClick={() => setIsLogin(!isLogin)} style={{ cursor: "pointer", color: "blue" }}>
                {isLogin ? "Need an account? Register" : "Already have an account? Login"}
            </p>
        </div>
    );
}
