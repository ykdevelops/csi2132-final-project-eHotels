"use client";

import { useState } from "react";
import { Container, Typography, Grid, Card, CardActionArea, CardContent, Button } from "@mui/material";


export default function EmployeeDashboard() {
    const [selectedComponent, setSelectedComponent] = useState(null);

    // Mapping categories to their respective components
    const componentMap = {
        previousBookings: <PreviousBookings goBack={() => setSelectedComponent(null)} />,
        previousRentals: <PreviousRentals goBack={() => setSelectedComponent(null)} />,
        currentBookings: <CurrentBookings goBack={() => setSelectedComponent(null)} />,
        currentRentals: <CurrentRentals goBack={() => setSelectedComponent(null)} />,
    };

    return (
        <Container maxWidth="lg" style={{ textAlign: "center", marginTop: "40px" }}>
            {selectedComponent === null ? (
                <>
                    <Typography variant="h4" gutterBottom>Employee Dashboard</Typography>
                    <Typography variant="subtitle1">Manage bookings, rentals, and room availability</Typography>
                    <Grid container spacing={3} justifyContent="center" style={{ marginTop: "20px" }}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card style={{ cursor: "pointer" }}>
                                <CardActionArea>
                                    <CardContent>
                                        <Typography variant="h6">Previous Bookings</Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <Card style={{ cursor: "pointer" }}>
                                <CardActionArea>
                                    <CardContent>
                                        <Typography variant="h6">Previous Rentals</Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <Card style={{ cursor: "pointer" }}>
                                <CardActionArea>
                                    <CardContent>
                                        <Typography variant="h6">Current Bookings</Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <Card style={{ cursor: "pointer" }}>
                                <CardActionArea>
                                    <CardContent>
                                        <Typography variant="h6">Current Rentals</Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    </Grid>
                </>
            ) : (
                <>
                    <Button onClick={() => setSelectedComponent(null)} variant="outlined" color="primary" style={{ marginBottom: "20px" }}>
                        Back
                    </Button>
                    {componentMap[selectedComponent]}
                </>
            )}
        </Container>
    );
}
