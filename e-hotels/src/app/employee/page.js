"use client";

import { useState } from "react";
import { Container, Typography, Grid, Card, CardActionArea, CardContent, Button } from "@mui/material";
import EditRooms from "../../components/employee/EditRooms/EditRooms";
import EditHotels from "../../components/employee/EditHotels/EditHotels";
import EditEmployees from "../../components/employee/EditEmployees/EditEmployees";
import EditCustomers from "../../components/employee/EditCustomers/EditCustomers";

export default function EmployeeDashboard() {
    const [activeTab, setActiveTab] = useState(null);

    const renderComponent = () => {
        switch (activeTab) {
            case "rooms":
                return <EditRooms />;
            case "hotels":
                return <EditHotels />;
            case "employees":
                return <EditEmployees />;
            case "customers":
                return <EditCustomers />;
            default:
                return null;
        }
    };

    return (
        <Container maxWidth="lg" style={{ textAlign: "center", marginTop: "40px" }}>
            {!activeTab ? (
                <>
                    <Typography variant="h4" gutterBottom>Employee Dashboard</Typography>
                    <Grid container spacing={3} justifyContent="center" style={{ marginTop: "20px" }}>
                        {["rooms", "hotels", "employees", "customers"].map((tab) => (
                            <Grid item xs={12} sm={6} md={4} key={tab}>
                                <Card style={{ cursor: "pointer" }} onClick={() => setActiveTab(tab)}>
                                    <CardActionArea>
                                        <CardContent>
                                            <Typography variant="h6">Edit {tab.charAt(0).toUpperCase() + tab.slice(1)}</Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </>
            ) : (
                <>
                    <Button onClick={() => setActiveTab(null)} variant="outlined" color="primary" style={{ marginBottom: "20px" }}>
                        Back
                    </Button>
                    {renderComponent()}
                </>
            )}
        </Container>
    );
}
