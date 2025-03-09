"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RootLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <html lang="en">
      <body>
        <header style={{ textAlign: "center", padding: "20px" }}>
          <h1>Welcome to e-Hotels</h1>
          <p>Find and book rooms from top hotel chains with real-time availability.</p>

          {user ? (
            <>
              <p>Logged in as: {user.name} ({user.role})</p>
              <button onClick={() => {
                localStorage.removeItem("user");
                setUser(null);
                router.push("/auth");
              }} style={{ margin: "10px", padding: "10px 20px" }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => router.push("/auth")} style={{ margin: "10px", padding: "10px 20px" }}>
                Login
              </button>
              <button onClick={() => router.push("/auth")} style={{ margin: "10px", padding: "10px 20px" }}>
                Register
              </button>
            </>
          )}
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}
