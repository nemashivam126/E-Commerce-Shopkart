import { Box, Button, Grid, Paper, Typography, Container } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
    const navigate = useNavigate();
    const { selectedAddress } = useSelector(state => state.selectedAddress);

    const handleProceedToPay = () => {
        navigate('/payment-details');
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 15, mb: 4 }}>
            <Paper elevation={10} sx={{ padding: 4, borderRadius: 3 }}>
                <Typography variant="h5" gutterBottom textAlign="center" sx={{ mb: 2 }}>
                    Checkout
                </Typography>
                {selectedAddress ? (
                    <Paper variant="outlined" sx={{ padding: 2, mb: 4, borderRadius: 2 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Selected Address
                        </Typography>
                        <Typography variant="body1">{selectedAddress.label}</Typography>
                        <Typography variant="body1">{selectedAddress.houseNo}</Typography>
                        <Typography variant="body2">{selectedAddress?.landmark && selectedAddress?.landmark}, {selectedAddress.street}, {selectedAddress.city}</Typography>
                        <Typography variant="body2">{selectedAddress.state}, {selectedAddress.pincode}</Typography>
                    </Paper>
                ) : (
                    <Typography variant="body1" color="error" textAlign="center" sx={{ mb: 4 }}>
                        No address selected.
                    </Typography>
                )}
                <Grid display={'flex'}>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="primary"
                        onClick={() => navigate('/user-address')}
                        disabled={!selectedAddress}
                        sx={{ mr: 0.5 }}
                    >
                        Change Address
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleProceedToPay}
                        disabled={!selectedAddress}
                        sx={{ ml: 0.5 }}
                    >
                        Proceed to Pay
                    </Button>
                </Grid>
            </Paper>
        </Container>
    );
};

export default Checkout;
