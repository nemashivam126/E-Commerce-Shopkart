import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Button, Grid, Paper, CircularProgress, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { fetchOrdersAsync } from '../../../Redux/OrderSlice/Orders';
import { shortenDescription } from '../../Utils/shortDescription';

const MyOrders = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector(state => state.auth);
  const orders = useSelector(state => state.orders.data);
  const loading = useSelector(state => state.orders.loading);
  const [detailedOrders, setDetailedOrders] = useState([]);
  const [detailedLoading, setDetailedLoading] = useState(true);

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
          const productResponse = await axios.get(`http://localhost:5000/shopkart/products/${item.productId}`, {
            headers: {
              Token: token
            }
          });
          return { ...item, productDetails: productResponse.data };
        }));
        return { ...order, items: itemsWithDetails };
      });

      const detailedOrdersResults = await Promise.all(detailedOrdersPromises);
      setDetailedOrders(detailedOrdersResults);
      setDetailedLoading(false);
    };

    if (orders.length > 0) {
      fetchOrderDetails();
    } else {
      setDetailedLoading(false);
    }
  }, [orders, token]);

  if (loading || detailedLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size={70} />
      </Box>
    );
  }

  return (
    <Box sx={{ px: 4, py: 2 }}>
      {detailedOrders.length === 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Typography variant="h6" color="error">
            {"Looks like you haven't placed any orders yet."}
          </Typography>
          <Button component={Link} to="/products" variant="contained" color="primary" sx={{ mt: 2 }}>
            {"Continue Shopping"}
          </Button>
        </Box>
      ) : (
        <>
          <Typography variant="h5" gutterBottom>
            Your Orders
          </Typography>
          <Grid container spacing={4} sx={{ maxHeight: '85vh', overflowY: 'auto' }}>
            {detailedOrders.map((order) => (
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
                            {/* component={Link} to={`/product/${item.productId}`} */}
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
                                  <Typography variant="subtitle1">{item.status}</Typography>
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
                          <Typography variant="body2">{order.address.street}, {order.address.city}</Typography>
                          <Typography variant="body2">{order.address.state}, {order.address.pincode}</Typography>
                        </Paper>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default MyOrders;
