import { Edit } from "@mui/icons-material";
import { Box, Button, Checkbox, Grid, IconButton, Paper, Typography } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addSnackbarState } from "../../../Redux/Snackbar/SnackbarSlice";

const AddressDetails = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token, user } = useSelector(state => state.auth);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);

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
            const response = await axios.put(`http://localhost:5000/shopkart/user/${user.id}/selected-address/${addressId}`, {}, {
                headers: {
                    Token: token
                }
            });
            setSelectedAddress(response.data.selectedAddress);
        } catch (error) {
            console.error('Error setting selected address:', error);
        }
    };

    const handleCheckboxClick = (addressId) => {
        if (selectedAddress?._id === addressId) {
            setSelectedAddress(null); // Uncheck the checkbox if already selected
        } else {
            const selected = addresses.find(address => address._id === addressId);
            setSelectedAddress(selected); // Check the checkbox
        }
    };

    const handleCheckout = () => {
        if (addresses.length === 0) {
            navigate('/add-address');
        } else {
            if (selectedAddress) {
                navigate('/checkout');
            } else {
                dispatch(
                    addSnackbarState({
                      snackbarOpen: true,
                      snackbarMessage: 'Please select an address to proceed.',
                      snackbarSeverity: "error",
                    })
                );
            }
        }
    };

    return (
        <Box px={10} py={2}>
            <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
                Your Addresses
            </Typography>
            {addresses.map(address => (
                <Grid item xs={12} key={address._id}>
                    <Paper elevation={3} sx={{ padding: 2, display: 'flex', alignItems: 'center', backgroundColor: selectedAddress?._id === address._id ? 'lightblue' : '#fff', cursor: 'pointer' }}>
                        <Checkbox
                            checked={selectedAddress?._id === address._id}
                            onChange={() => handleCheckboxClick(address._id)}
                            inputProps={{ 'aria-label': 'Select Address' }}
                            sx={{ marginRight: 2 }}
                        />
                        <Grid container spacing={1} onClick={() => handleSelectAddress(address._id)}>
                            <Grid item xs={10} >
                                <Typography fontWeight={700}>{address.label}</Typography>
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
            {addresses.length !== 0 && <Button onClick={handleAddOrUpdateAddress} variant="contained" color="primary" sx={{ mt: 2 }}>
                Add Address
            </Button>}
            <Button onClick={handleCheckout} variant="contained" color="primary" sx={{ mt: 2, ml: 1 }}>
                {addresses.length === 0 ? "Add Address" : "Use This Address"}
            </Button>
        </Box>
    );
};

export default AddressDetails;
