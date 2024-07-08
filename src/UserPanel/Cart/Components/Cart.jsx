import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Typography, Button, Grid, IconButton, Paper, CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { removeFromCartAsync } from '../../../Redux/CartSlice/removefromCart';
import { shortenDescription } from '../../Utils/shortDescription';
import { fetchCartDetailsAsync } from '../../../Redux/CartSlice/fetchCart';

const Cart = () => {
    const dispatch = useDispatch();
    const [cart, setCart] = useState([]);
    const { token, user } = useSelector(state => state.auth);
    const [isEmpty, setIsEmpty] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const fetchCart = async () => {
        try {
            const response = await axios.get(`https://e-commerce-shopkart-backend-rho.vercel.app/shopkart/user/${user.id}/cart`, {
                headers: {
                    Token: token
                }
            });
            dispatch(fetchCartDetailsAsync(user.id))
            setIsEmpty(false);
            const cartData = response.data;

            // Fetch product details for each item in the cart
            const detailedCart = await Promise.all(cartData.map(async (item) => {
                const productResponse = await axios.get(`https://e-commerce-shopkart-backend-rho.vercel.app/shopkart/products/${item.productId}`, {
                    headers: {
                        Token: token
                    }
                });
                return { ...item, productDetails: productResponse.data };
            }));

            setCart(detailedCart);
        } catch (error) {
            console.error('Error fetching cart data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Fetch cart data when component mounts
        fetchCart();
    }, []);
    
    useEffect(() => {
        // Fetch cart data when component mounts
        fetchCart();
    }, [user.id, isEmpty]);

    const updateCartQuantity = async (productId, quantity) => {
        try {
            const response = await axios.put(`https://e-commerce-shopkart-backend-rho.vercel.app/shopkart/user/${user.id}/updatecart`, {
                productId,
                quantity
            }, {
                headers: {
                    Token: token
                }
            });
            const updatedCart = response.data.cart;
            
            // Fetch product details for the updated cart
            const detailedUpdatedCart = await Promise.all(updatedCart.map(async (item) => {
                const productResponse = await axios.get(`https://e-commerce-shopkart-backend-rho.vercel.app/shopkart/products/${item.productId}`, {
                    headers: {
                        Token: token
                    }
                });
                return { ...item, productDetails: productResponse.data };
            }));

            setCart(detailedUpdatedCart);
        } catch (error) {
            console.error('Error updating cart quantity:', error);
        }
    };

    const handleIncrement = (productId, currentQuantity) => {
        updateCartQuantity(productId, currentQuantity + 1);
    };

    const handleDecrement = (productId, currentQuantity) => {
        if (currentQuantity > 1) {
            updateCartQuantity(productId, currentQuantity - 1);
        } else {
            // Handle removing item from cart if quantity is less than 1
            updateCartQuantity(productId, 0);
        }
    };

    // const handleRemoveFromCart = (userId, productId) => {
    //     dispatch(removeFromCartAsync({userId, productId}));
    //     setIsEmpty(true);
    //     fetchCart()
    // };
    const handleRemoveFromCart = async (userId, productId) => {
        try {
            // Dispatch removal action
            await dispatch(removeFromCartAsync({ userId, productId }));
            // Fetch updated cart data after removal
            setIsEmpty(true);
            await fetchCart();
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    const totalPrice = cart.reduce((total, item) => total + (item.productDetails.price * item.quantity), 0);

    if(loading) {
        return (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <Typography color="error"><CircularProgress size={70} /></Typography>
          </Box>
        );
    }

    if (!cart.length) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <Typography variant="h6" color="error"><HourglassEmptyIcon />... {"Looks like you haven't added any product to your cart."}</Typography>
                <Button component={Link} to="/products" variant="contained" color="primary" sx={{ mt: 2 }}>
                    {"Continue Shopping"}
                </Button>
            </Box>
        );
    }

    return (
        <Grid container px={4} py={1} spacing={2} maxHeight={'85vh'} overflow={'auto'}>
            <Grid item xs={8} mb={1}>
                <Typography variant="h5" gutterBottom>
                    Your Shopping Cart
                </Typography>
                {cart.map(item => (
                    <Grid item xs={12} key={item.productId}>
                        <Paper elevation={3} sx={{ padding: 2, display: 'flex', alignItems: 'center' }}>
                            <Grid container spacing={2}>
                                <Grid component={Link} to={`/product/${item.productDetails.productId}`} item xs={2} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                    <img src={item.productDetails.thumbnail} alt={item.productDetails.title} width={80} height={80} />
                                </Grid>
                                <Grid item xs={4}>
                                    <Typography variant="subtitle1">{item.productDetails.title}</Typography>
                                    <Typography variant="body2" color="textSecondary">{shortenDescription(item.productDetails.description)}</Typography>
                                    {item.productDetails.availableSizes.length > 0 && (
                                        <Typography variant="body2">Size: {item.productDetails.availableSizes.find(size => size === item.productSize)}</Typography>
                                    )}
                                    {item.productDetails.availableColors.length > 0 && (
                                        <Typography variant="body2">Color: {item.productDetails.availableColors.find(color => color === item.productColor)}</Typography>
                                    )}
                                </Grid>
                                <Grid item xs={2} sx={{ textAlign: 'center' }}>
                                    <Typography variant="subtitle1" mb={2}>Price</Typography>
                                    <Typography variant="subtitle1">₹{item.productDetails.price.toFixed(2) * item.quantity}</Typography>
                                </Grid>
                                <Grid item xs={2} sx={{ textAlign: 'center' }}>
                                    <Typography variant="body1">Quantity</Typography>
                                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <IconButton onClick={() => handleIncrement(item.productId, item.quantity)} aria-label="Increase Quantity">
                                            <AddIcon color='primary' />
                                        </IconButton>
                                        <Typography color={"green"} fontWeight={"bold"}>{item.quantity}</Typography>
                                        <IconButton onClick={() => handleDecrement(item.productId, item.quantity)} aria-label="Decrease Quantity">
                                            <RemoveIcon color='primary' />
                                        </IconButton>
                                    </Box>
                                </Grid>
                                <Grid item xs={2} sx={{ textAlign: 'center' }}>
                                    <Typography variant="body1">Remove Product</Typography>
                                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <IconButton onClick={() => handleRemoveFromCart(user.id, item.productId)} aria-label="Remove from Cart">
                                            <DeleteIcon color='error' />
                                        </IconButton>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
            <Grid item xs={4} height={'auto'} sx={{ mt: 3, mb:1 }}>
                <Paper elevation={3} sx={{ padding: 3, width: '100%', textAlign: 'center', backgroundColor: '#f5f5f5', borderRadius: '10px' }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Total Price</Typography>
                    <Typography variant="h4" color="primary" sx={{ mb: 3 }}>₹{totalPrice.toFixed(2)}</Typography>
                    <Button component={Link} to="/user-address" variant="contained" color="primary" size="large" sx={{ width: '100%' }}>
                        Proceed to Checkout
                    </Button>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default Cart;
