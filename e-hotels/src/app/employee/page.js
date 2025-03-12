"use client";

import { useState } from "react";
import { Container, Typography, Grid, Card, CardActionArea, CardContent, Button } from "@mui/material";
import EditDatabase from "../../components/employee/EditDatabase"; // Import the CRUD component

export default function EmployeeDashboard() {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <Container maxWidth="lg" style={{ textAlign: "center", marginTop: "40px" }}>
            {!isEditing ? (
                <>
                    <Typography variant="h4" gutterBottom>Employee Dashboard</Typography>
                    {/* Single Card for "Edit Database" */}
                    <Grid container justifyContent="center" style={{ marginTop: "20px" }}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card style={{ cursor: "pointer" }} onClick={() => setIsEditing(true)}>
                                <CardActionArea>
                                    <CardContent>
                                        <Typography variant="h6">Edit Database</Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    </Grid>
                </>
            ) : (
                <>
                    <Button onClick={() => setIsEditing(false)} variant="outlined" color="primary" style={{ marginBottom: "20px" }}>
                        Back
                    </Button>
                    <EditDatabase />
                </>
            )}
        </Container>
    );
}
