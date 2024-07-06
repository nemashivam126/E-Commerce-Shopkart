import React from 'react';
import { Container, Typography, Grid, Paper } from '@mui/material';
import { Category, ShoppingCart, PeopleAlt, AddShoppingCart, ManageHistory, ViewList } from '@mui/icons-material';
import { NavLink } from 'react-router-dom';

const AdminHomePage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <section className="text-center mb-8">
        <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#333' }}>
          Welcome to ShopKart
        </Typography>
        <Typography variant="h6" sx={{ color: '#777', mt: 1 }}>
          Your one-stop shop for all your needs
        </Typography>
      </section>
      
      <section className="text-center mb-8">
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff6600', mb: 6 }}>
          Admin Dashboard
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          <Grid component={NavLink} to={'/admin/add-product'} item xs={12} md={6} lg={4} my={2} mx={2}>
            <Paper elevation={10} sx={{ borderRadius: '10px', p: 5 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}>
                <AddShoppingCart /> Add Products
              </Typography>
              <Typography variant="body2" sx={{ color: '#777' }}>
                Add products here!
              </Typography>
            </Paper>
          </Grid>
          <Grid component={NavLink} to={'/admin/manage-products'} item xs={12} md={6} lg={4} my={2} mx={2}>
            <Paper elevation={10} sx={{ borderRadius: '10px', p: 5 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}>
                <ManageHistory /> Manage Products
              </Typography>
              <Typography variant="body2" sx={{ color: '#777' }}>
                Add, edit, and delete products
              </Typography>
            </Paper>
          </Grid>
          <Grid component={NavLink} to={'/admin/user-orders'} item xs={12} md={6} lg={4} my={2} mx={2}>
            <Paper elevation={10} sx={{ borderRadius: '10px', p: 5 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}>
                <ViewList /> Manage Orders
              </Typography>
              <Typography variant="body2" sx={{ color: '#777' }}>
                View and process customer orders
              </Typography>
            </Paper>
          </Grid>
          <Grid component={NavLink} to={'/admin/add-admin-account'} item xs={12} md={6} lg={4} my={2} mx={2}>
            <Paper elevation={10} sx={{ borderRadius: '10px', p: 5 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}>
                <PeopleAlt /> Adminstration
              </Typography>
              <Typography variant="body2" sx={{ color: '#777' }}>
                Create administrator account.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </section>
      <footer className="text-center absolute bottom-0 right-[40%] border-t border-gray-300">
        <p className="text-lg text-gray-600">&copy; 2024 ShopKart. All rights reserved.</p>
      </footer>
    </Container>
  );
};

export default AdminHomePage;
