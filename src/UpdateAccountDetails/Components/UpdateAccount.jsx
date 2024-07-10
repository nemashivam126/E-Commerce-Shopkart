import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import axios from 'axios';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Avatar,
  IconButton,
  InputAdornment,
  FormHelperText,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Visibility, VisibilityOff, Edit } from '@mui/icons-material';
import { getUserDetailsAsync } from '../../Redux/AccountDetailSlice/getUserDetails';
import { setAuthState } from '../../Redux/AuthSlice/auth';
import { addSnackbarState } from '../../Redux/Snackbar/SnackbarSlice';
import { deleteUserAccountAsync } from '../../Redux/AccountDetailSlice/deleteAccount';
import { getAdminDetailsAsync } from '../../Redux/AccountDetailSlice/getAdminDetails';
import { deleteAdminAccountAsync } from '../../Redux/AccountDetailSlice/deleteAdminAccount';
import Loader from '../../Loader/Components/Loader';

const UpdateAccount = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector(state => state.auth);
  const { data, loading } = user.isAdmin ? useSelector(state => state.getAdminDetails) : useSelector(state => state.getUserDetails);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState('idle');
  const [loadingModalOpen, setLoadingModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // State for delete confirmation modal

  useEffect(() => {
    if(user.isAdmin) {
        dispatch(getAdminDetailsAsync(user.id));
    } else{
        dispatch(getUserDetailsAsync(user.id));
    }
  }, [dispatch, user.id, user.isAdmin]);

  useEffect(() => {
    if( loading ) {
        setLoadingModalOpen(true);
    } else {
        setLoadingModalOpen(false);
    }
  }, [loading])

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
    }
  };

  const formik = useFormik({
    initialValues: {
      fname: data?.fname || '',
      lname: data?.lname || '',
      contactNumber: data?.contactNumber || '',
      email: data?.email || '',
      password: data?.password || '',
      confirmPassword: data?.password || '',
      gender: data?.gender || '',
      image: null,
    },
    validationSchema: Yup.object({
      fname: Yup.string().required('First name is required'),
      lname: Yup.string().required('Last name is required'),
      contactNumber: Yup.string()
        .required('Contact number is required')
        .matches(
          /^[0-9]{10}$/,
          'Contact number must be exactly 10 digits'
        ),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      gender: Yup.string().required('Gender is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters long'),
      confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
    }),
    enableReinitialize: true,
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        if (key === 'image' && values[key]) {
          formData.append(key, values[key]);
        } else {
          formData.append(key, values[key]);
        }
      });

      setStatus('loading');
      setLoadingModalOpen(true);

      try {
        const url = user.isAdmin ? `https://e-commerce-shopkart-backend-rho.vercel.app/shopkart/update/${user.id}/update-admin` : `https://e-commerce-shopkart-backend-rho.vercel.app/shopkart/update/${user.id}/update-user`;
        const response = await axios.put(
          url,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Token: token
            },
          }
        );
        dispatch(setAuthState({
            token: token,
            isAuthenticated: true,
            user: response.data.user // Update with the new user data received from API
        }));
        dispatch(
            addSnackbarState({
                snackbarOpen: true,
                snackbarMessage: user.isAdmin ? 'Admin info updated successfully!' : 'User info updated successfully!',
                snackbarSeverity: 'success',
            })
        );
        user.isAdmin ? dispatch(getAdminDetailsAsync(response.data.user.id)) : dispatch(getUserDetailsAsync(response.data.user.id));
        setStatus('success');
        formik.resetForm();
      } catch (error) {
        console.error('Error updating user:', error);
        dispatch(
            addSnackbarState({
                snackbarOpen: true,
                snackbarMessage: 'Something went wrong, please try again',
                snackbarSeverity: 'error',
            })
        );
        setStatus('error');
      } finally {
        setStatus('idle');
        setLoadingModalOpen(false);
      }
    },
  });

  const handleDeleteAccount = () => {
    if (user.isAdmin) {
        dispatch(deleteAdminAccountAsync(user?.id));  
    } else {
        dispatch(deleteUserAccountAsync(user?.id));
    }
    setDeleteModalOpen(false);
  }

  return (
    <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', height: '85vh' }}>
      <Box
        sx={{
          flexDirection: 'column',
          alignItems: 'center',
          mt: 5,
          boxShadow: 3,
          p: 3,
          borderRadius: 2,
          background: 'white',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            zIndex: 1,
          }}
        >
          <Avatar src={image || data?.image} sx={{ width: 200, height: 200, mb: 2 }} />
          <IconButton
            component="label"
            sx={{
              position: 'absolute',
              bottom: 30,
              left: 140,
              backgroundColor: 'lightgray',
              '&:hover': { backgroundColor: 'white' },
            }}
          >
            <Edit fontSize='small' />
            <input
              type="file"
              hidden
              onChange={(event) => {
                formik.setFieldValue('image', event.target.files[0]);
                handleImageChange(event);
              }}
            />
          </IconButton>
          <Typography variant="h4" ml={6} gutterBottom>
            Update Profile
          </Typography>
        </Box>
        <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="fname"
                label="First Name"
                name="fname"
                value={formik.values.fname}
                onChange={formik.handleChange}
                error={formik.touched.fname && Boolean(formik.errors.fname)}
                helperText={formik.touched.fname && formik.errors.fname}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="lname"
                label="Last Name"
                name="lname"
                value={formik.values.lname}
                onChange={formik.handleChange}
                error={formik.touched.lname && Boolean(formik.errors.lname)}
                helperText={formik.touched.lname && formik.errors.lname}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="contactNumber"
                label="Contact Number"
                name="contactNumber"
                value={formik.values.contactNumber}
                onChange={formik.handleChange}
                error={formik.touched.contactNumber && Boolean(formik.errors.contactNumber)}
                helperText={formik.touched.contactNumber && formik.errors.contactNumber}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="email"
                label="Email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  label="Gender"
                  value={formik.values.gender}
                  onChange={formik.handleChange}
                  error={formik.touched.gender && Boolean(formik.errors.gender)}
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
                <FormHelperText error={formik.touched.gender && Boolean(formik.errors.gender)}>
                  {formik.touched.gender && formik.errors.gender}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formik.values.password}
                onChange={formik.handleChange('password')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment sx={{ cursor: 'pointer' }} position="end" onClick={handleClickShowPassword}>
                      {showPassword ? <VisibilityOff fontSize='small' /> : <Visibility fontSize='small' />}
                    </InputAdornment>
                  ),
                }}
                label="Password"
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formik.values.confirmPassword}
                onChange={formik.handleChange('confirmPassword')}
                InputProps={{
                  endAdornment: (
                    <InputAdornment sx={{ cursor: 'pointer' }} position="end" onClick={handleClickShowConfirmPassword}>
                      {showConfirmPassword ? <VisibilityOff fontSize='small' /> : <Visibility fontSize='small' />}
                    </InputAdornment>
                  ),
                }}
                label="Confirm Password"
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              />
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, mb: 2, display: 'flex' }}>
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mr:1 }}
                disabled={status === 'loading'}
            >
                Update
            </Button>
            <Button
                onClick={() => setDeleteModalOpen(true)} // Open delete confirmation modal
                fullWidth
                color='error'
                variant="contained"
                sx={{ ml:1 }}
                disabled={status === 'loading'}
            >
                Delete Account
            </Button>
          </Box>
        </Box>

        {/* Loader backdrop */}
        <Loader loading={loadingModalOpen} text={'Updating...'} />

        {/* Delete confirmation dialog */}
        <Dialog
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          aria-labelledby="delete-account-dialog-title"
          fullWidth
        >
          <DialogTitle id="delete-account-dialog-title">Delete Account</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              Are you sure you want to delete your account? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteModalOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteAccount} color="error">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default UpdateAccount;
