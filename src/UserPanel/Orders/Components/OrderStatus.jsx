import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Box, Typography, Stepper, Step, StepLabel, CircularProgress, Paper, Grid, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { updateOrderStatusAsync } from '../../../Redux/OrderSlice/OrderStatus';

const OrderStatus = () => {
  const dispatch = useDispatch();
  const { itemId } = useParams();
  const { token, user } = useSelector(state => state.auth);
  const [orderItem, setOrderItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const handleClickOpen = (e) => {
    e.preventDefault();
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const steps = [
    {
      label: 'Pending',
      description: orderItem?.status === "Pending" ? 'Waiting for seller to process your item' : 'Your item has been checked in by seller.',
    },
    {
      label: 'Processed',
      description: 'Your item has been processed!',
    },
    ...(orderItem?.status === 'Cancelled'
      ? []
      : [
        {
          label: 'Shipped',
          description: 'Your item has been shipped!',
        },
      ]
    ),
    ...(orderItem?.status === 'Cancelled'
      ? []
      : [
        {
          label: 'Out for Delivery',
          description: 'Your item is out for delivery!',
        },
      ]
    ),
    ...(orderItem?.status === 'Cancelled'
      ? []
      : [
        {
          label: 'Delivered',
          description: 'Your item has been delivered to your address successfully!',
        },
      ]
    ),
    ...(orderItem?.status === 'Cancelled'
      ? [
          {
            label: 'Cancelled',
            description: 'Your item has been cancelled!',
          },
        ]
      : []
    ),
  ];

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

  const handleCancelOrder = (e) => {
    e.preventDefault();
    const userId = user.id;
    const newStatus = 'Cancelled'
    dispatch(updateOrderStatusAsync({ userId, itemId, newStatus }));
    setOrderItem(prevOrderItem => ({
      ...prevOrderItem,
      status: newStatus  // Update the local orderItem status
    }));
    setOpen(false);
  }

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

  const currentStepIndex = getStatusIndex(orderItem.status);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Order Status
      </Typography>
      <Stepper activeStep={currentStepIndex} alternativeLabel 
        // sx={{
        //   '& .MuiStepConnector-root': {
        //     borderBottom: '2px solid green', // Sets the border color of the stepper
        // }}}
      >
        {steps.map((step, index) => (
          <Step key={step.label} completed={index <= currentStepIndex} active={ index == currentStepIndex+1 } 
            sx={{
              '& .MuiStepLabel-root .Mui-completed': {
                color: index === currentStepIndex && step.label === 'Cancelled' ? 'error.dark' : 'success.dark', // circle color (COMPLETED)
              },
              '& .MuiStepLabel-root .Mui-active': {
                color: 'warning.main', // circle color (ACTIVE)
              },
            }}
          >
            <StepLabel>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h6">{step.label}</Typography>
                {index <= currentStepIndex && (
                  <Typography variant="body2">{step.description}</Typography>
                )}
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
        {["Cancelled", "Delivered"].includes(orderItem.status) ? null : <Button onClick={(e) => handleClickOpen(e)} variant='outlined' color='error' sx={{float: 'right'}}>Cancel Order</Button>}
      </Paper>

      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>
          <Typography variant='h5' fontWeight={600}>{`Cancel Order: ${orderItem.productId.title}`}</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText variant='h6'>
            {`Are you sure you want to cancel the order?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={handleClose} color="primary">
            No
          </Button>
          <Button variant='contained' onClick={handleCancelOrder} color="error" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderStatus;
