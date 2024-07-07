import React from 'react';
import { Box, Button, Container, Paper, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { getCartCountAsync } from '../../../Redux/CartSlice/cartCount';
import { setIsBuyNow } from '../../../Redux/StatesSlice/States';

const Payment = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const cart = useSelector(state => state.getUserCart.data);
    const { token, user } = useSelector(state => state.auth);
    const { selectedAddress } = useSelector(state => state.selectedAddress);
    const { isBuyNow, buyNowData } = useSelector(state => state.shopkartStates);

    const formik = useFormik({
        initialValues: {
            cardHolder: '',
            cardNumber: '',
            expiryDate: '',
            cvv: ''
        },
        validationSchema: Yup.object({
            cardHolder: Yup.string()
                .required('Card holder name is required'),
            cardNumber: Yup.string()
                .matches(/^[0-9]{16}$/, 'Card number must be 16 digits')
                .required('Card number is required'),
            expiryDate: Yup.string()
                .matches(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Expiry date must be in MM/YY format')
                .required('Expiry date is required'),
            cvv: Yup.string()
                .matches(/^[0-9]{3,4}$/, 'CVV must be 3 or 4 digits')
                .required('CVV is required')
        }),
        onSubmit: async (values) => {
            try {
                const orderItems = cart.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    productSize: item.productSize,
                    productColor: item.productColor,
                    status: 'Pending',
                    amount: item.productPrice * item.quantity
                }));
                
                const totalAmount = orderItems.reduce((total, item) => total + item.amount, 0);

                if(isBuyNow) {
                    await axios.post(`https://e-commerce-shopkart-backend.vercel.app/shopkart/user/${user.id}/buynow`, {
                        productId: buyNowData.productId,
                        quantity: buyNowData.quantity,
                        productSize: buyNowData.productSize,
                        productColor: buyNowData.productColor,
                        amount: buyNowData.amount,
                        address: selectedAddress,
                    }, {
                        headers: {
                            Token: token
                        }
                    });
                } else {
                    await axios.post(`https://e-commerce-shopkart-backend.vercel.app/shopkart/user/${user.id}/orders`, {
                        items: orderItems,
                        totalAmount,
                        address: selectedAddress
                    }, {
                        headers: {
                            Token: token
                        }
                    });
                }

                dispatch(getCartCountAsync(user.id));
                // // Empty the cart
                // await axios.delete(`https://e-commerce-shopkart-backend.vercel.app/shopkart/user/${user.id}/cart`, {
                //     headers: {
                //         Token: token
                //     }
                // });
                dispatch(setIsBuyNow(false));
                navigate('/order-confirmation');
            } catch (error) {
                console.error('Error placing order:', error);
            }
        }
    });

    return (
        <Container maxWidth="sm" sx={{ mt: 15, mb: 4 }}>
            <Paper elevation={10} sx={{ padding: 4, borderRadius: 3 }}>
                <Typography variant="h5" gutterBottom textAlign="center" sx={{ mb: 2 }}>
                    Payment Details
                </Typography>
                <Box component="form" onSubmit={formik.handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Card Holder Name"
                        name="cardHolder"
                        value={formik.values.cardHolder}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.cardHolder && Boolean(formik.errors.cardHolder)}
                        helperText={formik.touched.cardHolder && formik.errors.cardHolder}
                        fullWidth
                    />
                    <TextField
                        label="Card Number"
                        name="cardNumber"
                        value={formik.values.cardNumber}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.cardNumber && Boolean(formik.errors.cardNumber)}
                        helperText={formik.touched.cardNumber && formik.errors.cardNumber}
                        fullWidth
                    />
                    <TextField
                        label="Expiry Date (MM/YY)"
                        name="expiryDate"
                        value={formik.values.expiryDate}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.expiryDate && Boolean(formik.errors.expiryDate)}
                        helperText={formik.touched.expiryDate && formik.errors.expiryDate}
                        fullWidth
                    />
                    <TextField
                        label="CVV"
                        name="cvv"
                        value={formik.values.cvv}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.cvv && Boolean(formik.errors.cvv)}
                        helperText={formik.touched.cvv && formik.errors.cvv}
                        fullWidth
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        sx={{ mt: 2 }}
                    >
                        Confirm Order
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default Payment;
