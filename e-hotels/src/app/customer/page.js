"use client";

import { useState } from "react";
import { Container, Typography, Card, CardActionArea, CardContent, Grid, Button, Box } from "@mui/material";

import FindRoom from "@/components/customer/FindRoom";

export default function CustomerPage() {
    const [selectedComponent, setSelectedComponent] = useState(null);

    return (
        <Container maxWidth="lg" style={{ marginTop: "40px" }}>
            {/* 🔹 Title */}
            <Typography variant="h4" align="center">Customer Dashboard</Typography>
            <Typography variant="body1" color="textSecondary" align="center">
                Choose an option below:
            </Typography>

            {/* 🔹 Show Cards if no component is selected */}
            {!selectedComponent && (
                <Grid container spacing={3} justifyContent="center" style={{ marginTop: "20px" }}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card onClick={() => setSelectedComponent("findRoom")} style={{ cursor: "pointer" }}>
                            <CardActionArea>
                                <CardContent>
                                    <Typography variant="h5" align="center">Find a Room</Typography>
                                    <Typography variant="body2" color="textSecondary" align="center">
                                        Browse and book available rooms.
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* 🔹 Show Selected Component with Back Button on Top-Right */}
            {selectedComponent && (
                <>
                    <Box display="flex" justifyContent="flex-end" mb={2}>
                        <Button
                            onClick={() => setSelectedComponent(null)}
                            variant="outlined"
                            color="primary"
                        >
                            Back
                        </Button>
                    </Box>
                    <Box width="100%">
                        {selectedComponent === "findRoom" && <FindRoom />}
                    </Box>
                </>
            )}
        </Container>
    );
}
