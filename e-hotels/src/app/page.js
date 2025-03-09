"use client";

import { useEffect, useState } from "react";
import { db, collection, getDocs } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardMedia, Typography, Grid, Container } from "@mui/material";

export default function HomePage() {
  const router = useRouter();
  const [hotelChains, setHotelChains] = useState([]);

  useEffect(() => {
    const fetchHotelChains = async () => {
      try {
        console.log("🔥 Fetching hotel chains...");

        const hotelChainsSnapshot = await getDocs(collection(db, "HotelChain"));
        const chains = hotelChainsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("🚀 Hotel Chains:", chains);
        setHotelChains(chains);
      } catch (error) {
        console.error("❌ Error fetching hotel chains:", error);
      }
    };

    fetchHotelChains();
  }, []);

  return (
    <Container maxWidth="md" style={{ textAlign: "center", marginTop: "40px" }}>
      {/* 🔹 Welcome Message */}
      <Typography variant="h4" gutterBottom>Welcome to e-Hotels</Typography>
      <Typography variant="body1" color="textSecondary" style={{ marginBottom: "20px" }}>
        Sign in to explore available rooms in top hotel chains.
      </Typography>

      {/* 🔹 Hotel Chains Listing */}
      <Typography variant="h5" style={{ marginTop: "40px" }}>Featured Hotel Chains</Typography>

      <Grid container spacing={3} justifyContent="center" style={{ marginTop: "20px" }}>
        {hotelChains.length > 0 ? (
          hotelChains.map((hotel) => (
            <Grid item key={hotel.id} xs={12} sm={6} md={4}>
              <Card
                style={{ maxWidth: 300, textAlign: "center", cursor: "pointer" }}
                onClick={() => router.push("/login")} // 🔹 Redirects to login page
              >
                {/* Fake Grey Image Box */}
                <CardMedia
                  style={{ height: 150, backgroundColor: "#e0e0e0" }}
                  title="Hotel Placeholder"
                />
                <CardContent>
                  <Typography variant="h6">{hotel.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {hotel.address}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary" style={{ marginTop: "20px" }}>
            No hotel chains available at the moment.
          </Typography>
        )}
      </Grid>
    </Container>
  );
}
