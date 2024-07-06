import { Edit, LocationOff } from "@mui/icons-material";
import { Alert, Box, Button, Checkbox, Container, Grid, IconButton, Paper, Typography } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addSnackbarState } from "../../../Redux/Snackbar/SnackbarSlice";
import { fetchAddresses } from "../../../Redux/AddressSlice/Addresses";
import { selectAddress, setSelectedAddress } from "../../../Redux/AddressSlice/SelectedAddress";
import { setBuyNowData } from "../../../Redux/StatesSlice/States";

const AddressDetails = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    const { addresses, loading, error } = useSelector(state => state.addresses);
    const { selectedAddress } = useSelector(state => state.selectedAddress);
    const { buyNowData } = useSelector(state => state.shopkartStates);

    useEffect(() => {
        dispatch(fetchAddresses(user.id));
    }, [dispatch, user.id]);

    const handleAddOrUpdateAddress = () => {
        navigate('/add-address');
    };

    const handleSelectAddress = (addressId) => {
        dispatch(selectAddress({ userId: user.id, addressId }));
    };

    const handleCheckboxClick = (addressId) => {
        if (selectedAddress?._id === addressId) {
            dispatch(setSelectedAddress(null)); // Uncheck the checkbox if already selected
        } else {
            const selected = addresses.find(address => address._id === addressId);
            dispatch(setSelectedAddress(selected)); // Check the checkbox
        }
    };

    const handleCheckout = () => {
        if (addresses.length === 0) {
            navigate('/add-address');
        } else {
            if (selectedAddress) {
                dispatch(setBuyNowData({...buyNowData,
                    address: selectedAddress}))
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
        <Container maxWidth={"md"}>
            <Box px={10} py={2}>
                <Typography textAlign={'center'} variant="h5" gutterBottom sx={{ mt: 2, mb:2 }}>
                    Your Addresses
                </Typography>
                {loading && <Typography>Loading addresses...</Typography>}
                {error && <Typography color="error">Error: {error}</Typography>}
                {
                    addresses.length === 0 ? (
                        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" mt={2}>
                            <LocationOff color="disabled" sx={{ fontSize: 80, marginBottom: 2 }} />
                            <Alert severity="info" sx={{ textAlign: "center" }}>
                                No addresses found. Please add a new address to proceed.
                            </Alert>
                        </Box>
                    ) : (
                        addresses.map(address => (
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
                    )))
                }
                <Box sx={{textAlign:'center', mt: 2}}>
                    {addresses.length !== 0 && <Button onClick={handleAddOrUpdateAddress} variant="contained" color="primary" sx={{ mt: 2 }}>
                        Add Address
                    </Button>}
                    <Button onClick={handleCheckout} variant="contained" color="primary" sx={{ mt: 2, ml: 1 }}>
                        {addresses.length === 0 ? "Add Address" : "Use This Address"}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default AddressDetails;
