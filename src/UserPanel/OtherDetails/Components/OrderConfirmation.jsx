import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const OrderConfirmation = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <Typography variant="h4" color="success.main" gutterBottom>
                Order Confirmed!
            </Typography>
            <Typography variant="body1" gutterBottom>
                Thank you for your purchase. Your order has been placed successfully.
            </Typography>
            <Button component={Link} to="/products" variant="contained" color="primary" sx={{ mt: 2 }}>
                Continue Shopping
            </Button>
        </Box>
    );
};

export default OrderConfirmation;
