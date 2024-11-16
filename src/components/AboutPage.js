import React from 'react';
import { Container, Typography, Grid, Card, Box, Link } from '@mui/material';
import PublicIcon from '@mui/icons-material/Public';
import GroupIcon from '@mui/icons-material/Group';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import './AboutPage.css'; // Link to the CSS file

const AboutPage = () => {
    return (
        <div className="about-page"> {/* Added the outer div with about-page class */}
            <Container maxWidth="xl">
                {/* Main About Us Section */}
                <Box sx={{ textAlign: 'center', marginBottom: 6 }}>
                    <Typography variant="h2" component="h1" gutterBottom>
                        About Us
                    </Typography>
                    <Typography variant="h5" color="text.secondary" className="about-description">
                        Our company and culture are crafted for a delightful experience. We’re passionate about delivering top-notch service to make your experiences memorable.
                    </Typography>
                </Box>

                {/* Team Section */}
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Box className="team-image" />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box>
                            <Typography variant="h4" component="h2" gutterBottom>
                                Our Team
                            </Typography>
                            <Typography variant="h6" color="text.secondary" className="team-description">
                                We are a team dedicated to creating seamless event management solutions. Our mission is to bring people together through events and foster community.
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>

                {/* Mission Section */}
                <Grid container spacing={4} alignItems="center" sx={{ marginTop: 6 }}>
                    <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
                        <Box>
                            <Typography variant="h4" component="h2" gutterBottom>
                                Our Mission: Helping Millions Grow
                            </Typography>
                            <Typography variant="h6" color="text.secondary" className="mission-description">
                                We aim to help people connect, learn, and grow through our platform, providing resources and events that align with our values of growth and collaboration.
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
                        <Box className="mission-image" />
                    </Grid>
                </Grid>

                {/* By the Numbers Section */}
                <Box sx={{ textAlign: 'center', marginTop: 8 }}>
                    <Typography variant="h3" component="h2" gutterBottom>
                        By the Numbers
                    </Typography>
                    <Grid container spacing={4} justifyContent="center" sx={{ marginTop: 4 }}>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card sx={{ padding: 3, textAlign: 'center', backgroundColor: '#88353b', color: 'white' }}>
                                <PublicIcon sx={{ fontSize: 60, color: '#fcd404', marginBottom: 2 }} />
                                <Typography variant="h6" component="p">
                                    14 Global Offices
                                </Typography>
                                <Link href="#" underline="hover">
                                    Learn more
                                </Link>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card sx={{ padding: 3, textAlign: 'center', backgroundColor: '#88353b', color: 'white' }}>
                                <GroupIcon sx={{ fontSize: 60, color: '#fcd404', marginBottom: 2 }} />
                                <Typography variant="h6" component="p">
                                    8,000+ Employees
                                </Typography>
                                <Link href="#" underline="hover">
                                    Learn more
                                </Link>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Card sx={{ padding: 3, textAlign: 'center', backgroundColor: '#88353b', color: 'white' }}>
                                <PeopleAltIcon sx={{ fontSize: 60, color: '#fcd404', marginBottom: 2 }} />
                                <Typography variant="h6" component="p">
                                    228,000+ Customers
                                </Typography>
                                <Link href="#" underline="hover">
                                    Learn more
                                </Link>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </div>
    );
};

export default AboutPage;
