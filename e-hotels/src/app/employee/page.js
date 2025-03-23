"use client";

import { useState } from "react";
import { Container, Typography, Grid, Card, CardActionArea, CardContent, Button, Box } from "@mui/material";
import EditRooms from "../../components/employee/EditRooms/EditRooms";
import EditHotels from "../../components/employee/EditHotels/EditHotels";
import EditEmployees from "../../components/employee/EditEmployees/EditEmployees";
import EditCustomers from "../../components/employee/EditCustomers/EditCustomers";
import CheckIn from "../../components/employee/CheckIn/CheckIn";

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
            case "checkin":
                return <CheckIn />;
            default:
                return null;
        }
    };

    return (
        <Container maxWidth="lg" style={{ marginTop: "40px" }}>
            {!activeTab ? (
                <>
                    <Typography variant="h4" align="center" gutterBottom>
                        Employee Dashboard
                    </Typography>
                    <Grid container spacing={2} direction="column" alignItems="center" style={{ marginTop: "20px" }}>
                        {[
                            { key: "rooms", label: "Edit Rooms" },
                            { key: "hotels", label: "Edit Hotels" },
                            { key: "employees", label: "Edit Employees" },
                            { key: "customers", label: "Edit Customers" },
                            { key: "checkin", label: "Check In" }
                        ].map((tab) => (
                            <Grid item xs={12} key={tab.key} style={{ width: "100%" }}>
                                <Card style={{ cursor: "pointer", width: "100%" }} onClick={() => setActiveTab(tab.key)}>
                                    <CardActionArea>
                                        <CardContent>
                                            <Typography variant="h6" align="center">
                                                {tab.label}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </>
            ) : (
                <>
                    <Box display="flex" justifyContent="flex-end" mb={2}>
                        <Button
                            onClick={() => setActiveTab(null)}
                            variant="outlined"
                            color="primary"
                        >
                            Back
                        </Button>
                    </Box>
                    <Box width="100%">
                        {renderComponent()}
                    </Box>
                </>
            )}
        </Container>
    );
}
