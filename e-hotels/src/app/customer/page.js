"use client";
import { useState } from "react";
import { Container, Typography, Card, CardActionArea, CardContent, Grid, Button } from "@mui/material";

import FindRoom from "@/components/customer/FindRoom";

export default function CustomerPage() {
    const [selectedComponent, setSelectedComponent] = useState(null);

    return (
        <Container maxWidth="lg" style={{ marginTop: "40px", textAlign: "center" }}>
            <Typography variant="h4">Customer Dashboard</Typography>
            <Typography variant="body1" color="textSecondary">Choose an option below:</Typography>

            {/* 🔹 Show Cards if no component is selected */}
            {!selectedComponent && (
                <Grid container spacing={3} justifyContent="center" style={{ marginTop: "20px" }}>


                    <Grid item xs={12} sm={6} md={4}>
                        <Card onClick={() => setSelectedComponent("findRoom")} style={{ cursor: "pointer" }}>
                            <CardActionArea>
                                <CardContent>
                                    <Typography variant="h5">Find a Room</Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        Browse and book available rooms.
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* 🔹 Show Selected Component with a Back Button */}
            {selectedComponent && (
                <Button
                    onClick={() => setSelectedComponent(null)}
                    variant="outlined"
                    color="primary"
                    style={{ margin: "20px 0" }}>
                    Back
                </Button>
            )}
            {selectedComponent === "findRoom" && <FindRoom />}
        </Container>
    );
}
