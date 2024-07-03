import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Box, Typography, Stepper, Step, StepLabel, CircularProgress, Paper, Grid, Button } from '@mui/material';
import axios from 'axios';
import { useSelector } from 'react-redux';

const steps = [
  {
    label: 'Pending',
    description: 'Waiting for seller to process your item',
  },
  {
    label: 'Processed',
    description: 'Your item has been processed!',
  },
  {
    label: 'Shipped',
    description: 'Your item has been shipped!',
  },
  {
    label: 'Out for Delivery',
    description: 'Your item is out for delivery!',
  },
  {
    label: 'Delivered',
    description: 'Your item has been delivered to your address successfully!',
  },
];

const OrderStatus = () => {
  const { itemId } = useParams();
  const { token } = useSelector(state => state.auth);
  const [orderItem, setOrderItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderItem = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/shopkart/order/${itemId}`, {
          headers: {
            Token: token
          }
        });

        setOrderItem(response.data);
      } catch (error) {
        console.error('Error fetching order item details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderItem();
  }, [itemId, token]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size={70} />
      </Box>
    );
  }

  if (!orderItem) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography variant="h6" color="error">
          {"Order item not found."}
        </Typography>
      </Box>
    );
  }

  const getStatusIndex = (status) => {
    return steps.findIndex(step => step.label === status);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Order Status
      </Typography>
      <Stepper activeStep={getStatusIndex(orderItem.status)} alternativeLabel>
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h6">{step.label}</Typography>
                <Typography variant="body2">{step.description}</Typography>
              </Box>
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper component={Link} to={`/product/${orderItem.productId.productId}`} elevation={3} sx={{ p: 2, mt: 3, position: 'absolute', width: '90vw', right: 80 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img 
                src={orderItem.productId.thumbnail} 
                alt={orderItem.productId.title} 
                style={{ maxWidth: '100%', maxHeight: '350px', objectFit: 'cover' }} 
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography variant="h5">{orderItem.productId.title}</Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              {orderItem.productId.description}
            </Typography>
            <Typography variant="body1">Size: {orderItem.productSize}</Typography>
            <Typography variant="body1">Color: {orderItem.productColor}</Typography>
            <Typography variant="body1">Price: ₹{orderItem.amount.toFixed(2)}</Typography>
            <Typography variant="body1">Quantity: {orderItem.quantity}</Typography>
            <Typography variant="h6" sx={{ mt: 4}}>
                Product Order ID: {orderItem._id}
            </Typography>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Estimated Delivery: {new Date(orderItem?.estimatedDate).toLocaleDateString()}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default OrderStatus;
