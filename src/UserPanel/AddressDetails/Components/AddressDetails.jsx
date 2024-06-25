import { Edit } from "@mui/icons-material";
import { Box, Button, Grid, IconButton, Paper, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AddressDetails = () => {
    const navigate = useNavigate();
    const { token, user } = useSelector(state => state.auth);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    console.log(addresses.length);

    const fetchAddresses = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/shopkart/user/${user.id}/addresses`, {
                headers: {
                    Token: token
                }
            });
            setAddresses(response.data);
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleAddOrUpdateAddress = () => {
        navigate('/add-address');
    };

    const handleSelectAddress = async (addressId) => {
        try {
            await axios.put(`http://localhost:5000/shopkart/user/${user.id}/selected-address/${addressId}`, {}, {
                headers: {
                    Token: token
                }
            });
            setSelectedAddressId(addressId);
            console.log(addressId);
        } catch (error) {
            console.error('Error setting selected address:', error);
        }
    };

    const handleCheckout = () => {
        if (addresses.length === 0) {
            navigate('/add-address');
        } else {
            if (selectedAddressId) {
                navigate('/checkout');
            } else {
                alert("Please select an address to proceed.");
            }
        }
    };

    return (
        <Box px={10} py={2}>
            <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
                Your Addresses
            </Typography>
            {addresses.map(address => (
                <Grid item xs={12} key={address._id} onClick={() => handleSelectAddress(address._id)}>
                    <Paper elevation={3} sx={{ padding: 2, display: 'flex', alignItems: 'center', backgroundColor: selectedAddressId === address._id ? 'lightblue' : '#fff', cursor: 'pointer' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={10} >
                                <Typography fontWeight={700}>{address.label}</Typography>
                                {/* <Typography variant="body2" color="textSecondary">{address.state}, {address.pincode}</Typography> */}
                            </Grid>
                            <Grid item xs={10}>
                                <Typography variant="subtitle1">{address.street}, {address.city}</Typography>
                                <Typography variant="body2" color="textSecondary">{address.state}, {address.pincode}</Typography>
                            </Grid>
                            <Grid item xs={2} sx={{ textAlign: 'center' }}>
                                <IconButton onClick={() => navigate(`/update-address/${address._id}`)} aria-label="Edit Address">
                                    <Edit color='primary' />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            ))}
            <Button onClick={handleAddOrUpdateAddress} variant="contained" color="primary" sx={{ mt: 2 }}>
                Add Address
            </Button>
            <Button onClick={handleCheckout} variant="contained" color="primary" sx={{ mt: 2, ml: 1 }}>
                Use This Address
            </Button>
        </Box>
    );
};

export default AddressDetails;
