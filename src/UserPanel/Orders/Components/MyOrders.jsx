import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Button, Grid, Paper, CircularProgress, Divider, Chip, Select, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { fetchOrdersAsync } from '../../../Redux/OrderSlice/Orders';
import { shortenDescription } from '../../Utils/shortDescription';
import { SentimentVeryDissatisfied } from '@mui/icons-material';

const MyOrders = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector(state => state.auth);
  const orders = useSelector(state => state.orders.data);
  const loading = useSelector(state => state.orders.loading);
  const [detailedOrders, setDetailedOrders] = useState([]);
  const [detailedLoading, setDetailedLoading] = useState(true);
  const [filter, setFilter] = useState('ongoing'); // Default filter

  useEffect(() => {
    if (user.id) {
      dispatch(fetchOrdersAsync(user.id));
    }
  }, [dispatch, user.id]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setDetailedLoading(true);
      const detailedOrdersPromises = orders.map(async (order) => {
        const itemsWithDetails = await Promise.all(order.items.map(async (item) => {
          const productResponse = await axios.get(`https://e-commerce-shopkart-backend-rho.vercel.app/shopkart/products/${item.productId}`, {
            headers: {
              Token: token
            }
          });
          return { ...item, productDetails: productResponse.data };
        }));
        return { ...order, items: itemsWithDetails };
      });

      const detailedOrdersResults = await Promise.all(detailedOrdersPromises);
      setDetailedOrders(detailedOrdersResults?.reverse());
      setDetailedLoading(false);
    };

    if (orders.length > 0) {
      fetchOrderDetails();
    } else {
      setDetailedLoading(false);
    }
  }, [orders, token]);

  const filterOrders = (order) => {
    if (filter === 'recent') {
      return true; // Show all orders
    } else if (filter === 'delivered') {
      return order.items.some(item => item.status === 'Delivered');
    } else if (filter === 'cancelled') {
      return order.items.some(item => item.status === 'Cancelled');
    } else if (filter === 'ongoing') {
      return order.items.every(item => item.status !== 'Delivered' && item.status !== 'Cancelled');
    }
    return true; // Default to show all orders
  };

  if (loading || detailedLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size={70} />
      </Box>
    );
  }

  return (
    <Box sx={{ px: 4, py: 2, height: '85vh', overflow: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight={600} textTransform={'uppercase'} color={'brown'}>
          Your Orders
        </Typography>
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          variant="outlined"
          size='small'
          sx={{ minWidth: 200, bgcolor: '#f2f3f4' }}
        >
          <MenuItem value="recent">Recent Orders</MenuItem>
          <MenuItem value="delivered">Delivered Orders</MenuItem>
          <MenuItem value="cancelled">Cancelled Orders</MenuItem>
          <MenuItem value="ongoing">Current Orders</MenuItem>
        </Select>
      </Box>
      <Grid container spacing={5} sx={{ maxHeight: '85vh', overflowY: 'auto' }}>
        {detailedOrders.length === 0 ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '70vh', width: '100%' }}>
          <SentimentVeryDissatisfied color="error" sx={{ fontSize: 100, mb: 2 }} />
          <Typography variant="h6" color="error" sx={{ textAlign: 'center' }}>
            {"Looks like you haven't placed any orders yet."}
          </Typography>
          <Button component={Link} to="/products" variant="contained" color="primary" sx={{ mt: 2 }}>
            {"Continue Shopping"}
          </Button>
        </Box>
        ) : detailedOrders.filter(filterOrders).length < 1 ?
            <Typography variant="h6" color="error" sx={{height:'50vh', width: '100%', display:'flex', justifyContent:'center', alignItems:'center', flexDirection: 'column'}}>
              {`No order found under the selected category "${filter === "ongoing" ? 'Current' : filter.charAt(0).toLocaleUpperCase()+filter.slice(1)} Orders"`}
            </Typography>
        :
        (
          detailedOrders.filter(filterOrders).map((order) => (
            <Grid item xs={12} key={order._id}>
               <Paper elevation={3} sx={{ padding: 3 }}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                      <Typography variant="h6" gutterBottom>
                        Order ID: {order._id}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        Date: {new Date(order.date).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        Total Amount: ₹{order.totalAmount.toFixed(2)}
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      {order.items.map((item) => (
                        <Paper key={item._id} elevation={1} sx={{ padding: 2, marginBottom: 2 }}>
                          <Grid component={Link} to={`/order-status/${item._id}`} container spacing={2}>
                            <Grid item xs={3} display="flex" justifyContent="center" alignItems="center">
                              <img src={item.productDetails.thumbnail} alt={item.productDetails.title} width={80} height={80} style={{ objectFit: 'cover', borderRadius: 8 }} />
                            </Grid>
                            <Grid item xs={9}>
                              <Typography variant="subtitle1">{item.productDetails.title}</Typography>
                              <Typography variant="body2" color="textSecondary" paragraph>
                                {shortenDescription(item.productDetails.description)}
                              </Typography>
                              <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={3}>
                                  <Typography variant="subtitle1">Size: {item.productSize}</Typography>
                                  <Typography variant="subtitle1">Color: {item.productColor}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                  <Typography variant="subtitle1">Price</Typography>
                                  <Typography variant="subtitle1">₹{item.amount.toFixed(2)}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                  <Typography variant="subtitle1">Quantity</Typography>
                                  <Typography variant="subtitle1">{item.quantity}</Typography>
                                </Grid>
                                <Grid item xs={3}>
                                  <Typography variant="subtitle1">Status</Typography>
                                  <Typography variant="subtitle1">
                                    {item.status === 'Delivered' && (
                                      <Chip label="Delivered" color="success" size="small" />
                                    )}
                                    {item.status === 'Cancelled' && (
                                      <Chip label="Cancelled" color="error" size="small" />
                                    )}
                                    {item.status === 'Pending' && (
                                      <Chip label="Pending" color="warning" size="small" />
                                    )}
                                    {item.status === 'Processed' && (
                                      <Chip label="Processed" color="info" size="small" />
                                    )}
                                    {item.status === 'Shipped' && (
                                      <Chip label="Shipped" color="primary" size="small" />
                                    )}
                                    {item.status === 'Out for Delivery' && (
                                      <Chip label="Out for Delivery" color="secondary" size="small" />
                                    )}
                                    {/* {item.status !== 'Delivered' && item.status !== 'Cancelled' && item.status &&
                                      <Chip label={item.status} color="warning" size="small" />
                                    } */}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Paper>
                      ))}
                    </Grid>
                    {order.address && (
                      <Grid item xs={12} md={4} display={'flex'} justifyContent={"center"} alignItems={"center"}>
                        <Paper variant="outlined" sx={{ padding: 3, borderRadius: 2 }}>
                          <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Selected Address
                          </Typography>
                          <Typography variant="body1">{order.address.label}</Typography>
                          <Typography variant="body1">{order.address.houseNo}</Typography>
                          <Typography variant="body1">{order.address?.landmark && order.address?.landmark}</Typography>
                          <Typography variant="body1">{order.address.street}, {order.address.city}</Typography>
                          <Typography variant="body1">{order.address.state}, {order.address.pincode}</Typography>
                        </Paper>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default MyOrders;
