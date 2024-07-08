import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Divider, CircularProgress, Select, MenuItem, Card, CardContent, CardHeader, Avatar, List, ListItem, ListItemAvatar, ListItemText, TextField } from '@mui/material';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { updateOrderStatusAsync } from '../../Redux/OrderSlice/OrderStatus';
import { shortenDescription } from '../../UserPanel/Utils/shortDescription';
import filterOrders from '../../Utils/OrderFilter';

const UserOrdersList = () => {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector(state => state.auth);
  const [selectedUser, setSelectedUser] = useState('all'); // Default to 'all' to show all orders

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://e-commerce-shopkart-backend-rho.vercel.app/shopkart/orders', {
          headers: {
            Token: token
          }
        });
        const sortedUsers = response.data.map(user => ({
          ...user,
          orders: user.orders.sort((a, b) => new Date(b.date) - new Date(a.date))
        }));
        sortedUsers.sort((a, b) => new Date(b.orders[0].date) - new Date(a.orders[0].date));
        setUsers(sortedUsers);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const [estimatedDates, setEstimatedDates] = useState({});

  const handleDateChange = (itemId, newDate) => {
    setEstimatedDates(prevDates => ({
      ...prevDates,
      [itemId]: newDate // Update or add the new date for the item
    }));
  };

  const handleStatusChange = async (userId, itemId, newStatus) => {
    try {
      await axios.put(`https://e-commerce-shopkart-backend-rho.vercel.app/shopkart/orders/${userId}/items/${itemId}`,
        { status: newStatus, estimatedDate: estimatedDates[itemId] },
        { headers: { Token: token } }
      );
      dispatch(updateOrderStatusAsync({ userId, itemId, newStatus }));

      setUsers(prevUsers =>
        prevUsers.map(user => {
          return {
            ...user,
            orders: user.orders.map(order => {
              if (user._id === userId) {
                return {
                  ...order,
                  items: order.items.map(item =>
                    item._id === itemId ? { ...item, status: newStatus } : item
                  )
                };
              }
              return order;
            })
          };
        })
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleUserChange = (event) => {
    setSelectedUser(event.target.value);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress size={70} />
      </Box>
    );
  }

  if (users.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography variant="h6" color="error">
          No orders found.
        </Typography>
      </Box>
    );
  }

  let ordersToDisplay = users.flatMap(user => {
    if (selectedUser === 'all' || user._id === selectedUser) {
      return user.orders.map(order => ({ ...order, user }));
    }
    return [];
  });

  return (
    <Box sx={{ p: 2, height: '85vh', overflow: 'auto' }}>
      <Grid container spacing={3} px={5}>
        <Grid display={'flex'} justifyContent={'space-between'} alignItems={'baseline'} item xs={12}>
          <Typography variant="h5" mb={2} fontWeight={600} textTransform="uppercase" color="brown" gutterBottom>
            User Orders
          </Typography>
          <Select
            size='small'
            value={selectedUser}
            onChange={handleUserChange}
            sx={{ minWidth: 200, bgcolor: 'lightgray' }}
          >
            <MenuItem value="all">All Users</MenuItem>
            {users.map(user => (
              <MenuItem key={user._id} value={user._id}>{`${user.fname} ${user.lname}`}</MenuItem>
            ))}
          </Select>
        </Grid>
        {
          ordersToDisplay.filter(filterOrders).length === 0 ?
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', width: '100%' }}>
              <Typography variant="h6" color="error">
                No order found under the selected category.
              </Typography>
            </Box>
          :
          ordersToDisplay.filter(filterOrders).map(order => (
            <Grid item xs={12} key={order._id}>
              <Card sx={{ mb: 2 }}>
                <CardHeader
                  avatar={<Avatar src={order.user.image} />}
                  title={`${order.user.fname} ${order.user.lname}`}
                  subheader={`Order ID: ${order._id} | Order Date: ${new Date(order.date).toLocaleDateString()}`}
                />
                <CardContent>
                  <List>
                    {order.items.map(item => (
                      <ListItem key={item._id} sx={{ display: 'flex', alignItems: 'center' }}>
                        <ListItemAvatar>
                          <Avatar variant="square" src={item.productId.thumbnail} sx={{ width: 100, height: 100, marginRight: 2, borderRadius: 2 }} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={item.productId.title}
                          secondary={
                            <>
                              <Typography variant="body2" component="span" color="textSecondary">
                                {shortenDescription(item.productId.description)}
                              </Typography>
                              <Typography variant="body2">Size: {item.productSize}</Typography>
                              <Typography variant="body2">Color: {item.productColor}</Typography>
                              <Typography variant="body2">Quantity: {item.quantity}</Typography>
                              <Typography variant="body2">Price: ₹{item.amount.toFixed(2)}</Typography>
                            </>
                          }
                        />
                        <TextField
                          size='small'
                          id={`estimated-date-${item._id}`}
                          label="Estimated Delivery"
                          type="date"
                          value={estimatedDates[item._id] || new Date(item.estimatedDate).toISOString().substr(0, 10)}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          onChange={(e) => handleDateChange(item._id, e.target.value)}
                          sx={{ ml: 2, width: 180 }}
                        />
                        <Select
                          size='small'
                          value={item.status}
                          onChange={(e) => handleStatusChange(order.user._id, item._id, e.target.value)}
                          displayEmpty
                          sx={{ ml: 2, width: '15%', bgcolor: (item.status === 'Cancelled' && 'error.main') || (item.status === 'Delivered' && 'success.main') || (item.status === 'Pending' && 'warning.main') || (item.status === 'Processed' && 'info.light') || (item.status === 'Shipped' && 'primary.dark') || (item.status === 'Out for Delivery' && 'secondary.main'), color: 'white' }}
                        >
                          <MenuItem value="Pending">Pending</MenuItem>
                          <MenuItem value="Processed">Processed</MenuItem>
                          <MenuItem value="Shipped">Shipped</MenuItem>
                          <MenuItem value="Out for Delivery">Out for Delivery</MenuItem>
                          <MenuItem value="Delivered">Delivered</MenuItem>
                          <MenuItem value="Cancelled">Cancelled</MenuItem>
                        </Select>
                      </ListItem>
                    ))}
                  </List>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6">Total Amount: ₹{order.totalAmount.toFixed(2)}</Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6">Delivery Address</Typography>
                  <Typography variant="body2">{order.address.houseNo}, {order.address.street}</Typography>
                  <Typography variant="body2">{order.address.landmark}</Typography>
                  <Typography variant="body2">{order.address.city}, {order.address.state}, {order.address.pincode}</Typography>
                  <Typography variant="body2">{order.address.country}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        }
      </Grid>
    </Box>
  );
};

export default UserOrdersList;
