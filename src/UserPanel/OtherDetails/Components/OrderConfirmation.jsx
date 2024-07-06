import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const OrderConfirmation = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', textAlign: 'center', p: 3 }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 100, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" color="success.main" gutterBottom>
                Order Confirmed!
            </Typography>
            <Typography variant="body1" gutterBottom>
                Thank you for your purchase. Your order has been placed successfully.
            </Typography>
            <Button component={Link} to="/my-orders" variant="contained" color="primary" sx={{ mt: 3 }}>
                View Orders
            </Button>
        </Box>
    );
};

export default OrderConfirmation;
