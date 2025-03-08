"use client";
import Image from "next/image";
import styles from "./page.module.css";



import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Welcome to e-Hotels</h1>
      <p>Find and book rooms from top hotel chains in real time.</p>
      <button onClick={() => router.push("/auth")} style={{ margin: "10px", padding: "10px 20px" }}>
        Login
      </button>
      <button onClick={() => router.push("/auth")} style={{ margin: "10px", padding: "10px 20px" }}>
        Register
      </button>
    </div>
  );
}
