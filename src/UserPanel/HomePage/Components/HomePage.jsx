import React from 'react';
import { Container, Typography, Grid, Paper, Box } from '@mui/material';
import Footer from '../../Footer/Components/Footer';
import { Category, ManageAccounts, ShoppingCart, TurnedIn } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';

const HomePage = () => {
  const { user } = useSelector(state => state.auth);
  const AppTheme = useSelector((state) => state.theme.theme);
  
  return (
    <Container maxWidth="lg" sx={{ pt: 3, pb: 8 }}>
      <section className="text-center mb-8">
        <Typography variant="h3" sx={{ fontWeight: 'bold', color: AppTheme === 'Dark' ? 'whitesmoke' : '' }}>
          Welcome to ShopKart
        </Typography>
        <Typography variant="h6" sx={{ color: '#777', mt: 1 }}>
          Your one-stop shop for all your needs
        </Typography>
      </section>
      
      <section className="text-center mb-8">
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff6600', mb: 6 }}>
          User Dashboard
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          <Grid component={NavLink} to={'/products'} item xs={12} md={6} my={2} mx={2} lg={4}>
            <Paper elevation={10} sx={{ borderRadius: '10px', p: 5 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              <Category /> View Products
              </Typography>
              <Typography variant="body2" sx={{ color: '#777' }}>
                Browse and purchase products
              </Typography>
            </Paper>
          </Grid>
          <Grid component={NavLink} to={'/my-orders'} item xs={12} md={6} my={2} mx={2} lg={4}>
            <Paper elevation={10} sx={{ borderRadius: '10px', p: 5 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                <TurnedIn /> My Orders
              </Typography>
              <Typography variant="body2" sx={{ color: '#777' }}>
                Track your orders and view order history
              </Typography>
            </Paper>
          </Grid>
          <Grid component={NavLink} to={`/user-info/${user.id}`} item xs={12} md={6} my={2} mx={2} lg={4}>
            <Paper elevation={10} sx={{ borderRadius: '10px', p: 5 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                <ManageAccounts /> Profile Settings
              </Typography>
              <Typography variant="body2" sx={{ color: '#777' }}>
                Update your personal information
              </Typography>
            </Paper>
          </Grid>
          <Grid component={NavLink} to={'/cart'} item xs={12} md={6} my={2} mx={2} lg={4}>
            <Paper elevation={10} sx={{ borderRadius: '10px', p: 5 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              <ShoppingCart /> View Cart
              </Typography>
              <Typography variant="body2" sx={{ color: '#777' }}>
                Check items that you have added to cart
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </section>

      {/* <footer className="text-center border-t border-gray-300 pt-6 mt-8">
        <p className="text-lg text-gray-600">&copy; 2024 ShopKart. All rights reserved.</p>
      </footer> */}
      
      <div className='fixed w-full left-0 bottom-0'>
        <Footer />
      </div>
    </Container>
  );
};

export default HomePage;
