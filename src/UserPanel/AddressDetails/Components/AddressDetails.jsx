import { Delete, Edit, LocationOff } from "@mui/icons-material";
import { Alert, Box, Button, Checkbox, Container, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addSnackbarState } from "../../../Redux/Snackbar/SnackbarSlice";
import { fetchAddresses } from "../../../Redux/AddressSlice/Addresses";
import { selectAddress, setSelectedAddress } from "../../../Redux/AddressSlice/SelectedAddress";
import { setBuyNowData } from "../../../Redux/StatesSlice/States";
import AddressForm from "../../AddressForm/Components/AddressForm";
import Loader from "../../../Loader/Components/Loader";
import { removeAddressAsync } from "../../../Redux/AddressSlice/removeAddress";
import CustomTheme from "../../../Theme/CustomTheme/CustomTheme";

const AddressDetails = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);
    const { addresses, loading, error } = useSelector(state => state.addresses);
    const { selectedAddress } = useSelector(state => state.selectedAddress);
    const { buyNowData } = useSelector(state => state.shopkartStates);
    const [openModal, setOpenModal] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const [addressID, setAddressID] = useState(null);
    const AppTheme = useSelector((state) => state.theme.theme);

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

    const handleEditAddress = (addressId) => {
        const selected = addresses.find(address => address._id === addressId);
        dispatch(setSelectedAddress(selected));
        setOpenModal(true);
    };

    const handleOpenDeleteDialog = (addressId) => {
        setAddressID(addressId)
        setIsDelete(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setIsDelete(false);
        dispatch(fetchAddresses(user.id));
    };

    const handleConfirmDelete = () => {
        const userID = user.id;
        dispatch(removeAddressAsync({userId: userID, addressId: addressID}));
        setIsDelete(false);
        handleCloseModal();
        dispatch(fetchAddresses(user.id));
    };

    return (
        <Container maxWidth={"md"}>
            <Box px={10} py={2}>
                <Typography textAlign={'center'} variant="h5" gutterBottom sx={{ mt: 2, mb:2 }}>
                    Your Addresses
                </Typography>
                {/* loader */}
                <Loader loading={loading} text={'Updating...'} />
                {error && <Typography color="error">Error: {error}</Typography>}
                {
                    !loading && addresses.length === 0 ? (
                        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" mt={2}>
                            <LocationOff color="disabled" sx={{ fontSize: 80, marginBottom: 2 }} />
                            <Alert severity="info" sx={{ textAlign: "center" }}>
                                No addresses found. Please add a new address to proceed.
                            </Alert>
                        </Box>
                    ) : (
                        addresses.map(address => (
                        <Grid item xs={12} key={address._id}>
                            <Paper elevation={7} sx={{ padding: 2, display: 'flex', alignItems: 'center', backgroundColor: selectedAddress?._id === address._id ? CustomTheme.CustomColor[AppTheme].light : CustomTheme.CustomColor[AppTheme]?.lighter, cursor: 'pointer' }}>
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
                                        <Typography variant="body1">{address.houseNo}</Typography>
                                        <Typography variant="subtitle1">{address?.landmark && address?.landmark} {address?.landmark && `,`} {address.street}, {address.city}</Typography>
                                        <Typography variant="body2" color="textSecondary">{address.state}, {address.pincode}</Typography>
                                    </Grid>
                                    <Grid item xs={2} sx={{ textAlign: 'center' }}>
                                        <IconButton onClick={() => handleEditAddress(address._id)} aria-label="Edit Address">
                                            <Edit color='warning' />
                                        </IconButton>
                                        <IconButton onClick={() => handleOpenDeleteDialog(address._id)} aria-label="Delete Address">
                                            <Delete color='error' />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    )))
                }
                <Box sx={{textAlign:'center', mt: 2, display: 'flex', justifyContent: 'center'}}>
                    {addresses.length !== 0 && <Button fullWidth onClick={handleAddOrUpdateAddress} variant={AppTheme === 'Dark' ? 'contained' : "outlined"} color="primary" sx={{ mr: 1}}>
                        Add Address
                    </Button>}
                    {!loading && <Button fullWidth={addresses.length === 0 ? false : true} onClick={handleCheckout} variant="contained" color="primary" sx={{ ml: 1 }}>
                        {addresses.length === 0 ? "Add Address" : "Use This Address"}
                    </Button>}
                </Box>
                 {/* Dialog box for Edit Address */}
                 <Dialog
                    open={openModal}
                    onClose={handleCloseModal}
                >
                    <Box><AddressForm isEdit={true} editAddressValues={selectedAddress} onClose={handleCloseModal} /></Box>
                </Dialog>
                 {/* Dialog box for Delete Address */}
                 <Dialog
                    open={isDelete}
                    onClose={handleCloseModal}
                >
                    <DialogTitle sx={{color:'error.main', display: 'flex', alignItems:'center'}} fontWeight={600}>
                        Delete Address?
                    </DialogTitle>
                    <DialogContent>
                        <Typography variant="subtitle1">
                            {`Are you sure you want to delete this address?`} 
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{mr:1.5, mb:1.5}}>
                        <Button color="secondary" variant="outlined" sx={{textTransform:'none'}} onClick={handleCloseModal}>Cancel</Button>
                        <Button variant="contained" sx={{textTransform:'none'}} color="error" onClick={handleConfirmDelete}>Yes, Delete</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Container>
    );
};

export default AddressDetails;
