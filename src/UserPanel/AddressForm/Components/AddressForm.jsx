import React from 'react';
import { Box, Button, Grid, TextField, Typography, Paper, MenuItem } from '@mui/material';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addSnackbarState } from '../../../Redux/Snackbar/SnackbarSlice';
import { useNavigate } from 'react-router-dom';

const validationSchema = Yup.object().shape({
  label: Yup.string()
    .matches(/^(?!\s)(?!.*\s$)(?!.*\s{2,})[a-zA-Z\s]+$/, 'Label must contain only letters and spaces, cannot start or end with a space, and must not have consecutive spaces')
    .required('Label is required'),
  houseNo: Yup.string()
    .matches(/^(?!\s)(?!.*\s$)(?!.*\s{2,})[\w\s\\/-]+$/, 'House No cannot start or end with a space, and must not have consecutive spaces')
    .required('House No is required'),
  street: Yup.string()
    .matches(/^(?!\s)(?!.*\s$)(?!.*\s{2,})[\w\s\\/-]+$/, 'Street cannot start or end with a space, and must not have consecutive spaces')
    .required('Street is required'),
  landmark: Yup.string()
    .trim(),
  city: Yup.string()
    .matches(/^(?!\s)(?!.*\s$)(?!.*\s{2,})[a-zA-Z\s]+$/, 'City must contain only letters and spaces, cannot start or end with a space, and must not have consecutive spaces')
    .required('City is required'),
  state: Yup.string()
    .matches(/^(?!\s)(?!.*\s$)(?!.*\s{2,})[a-zA-Z\s]+$/, 'State must contain only letters and spaces, cannot start or end with a space, and must not have consecutive spaces')
    .required('State is required'),
  pincode: Yup.string()
    .matches(/^\d{6}$/, 'Pincode must be a 6-digit number')
    .required('Pincode is required'),
  country: Yup.string()
    .matches(/^(?!\s)(?!.*\s$)(?!.*\s{2,})[a-zA-Z\s]+$/, 'Country must contain only letters and spaces, cannot start or end with a space, and must not have consecutive spaces')
    .required('Country is required'),
});

const initialValues = {
  label: '',
  houseNo: '',
  street: '',
  landmark: '',
  city: '',
  state: '',
  pincode: '',
  country: ''
};

const AddressForm = ({isEdit = false, editAddressValues = {}, onClose}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, user } = useSelector(state => state.auth)
  const handleAddressSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const url = isEdit ? `https://e-commerce-shopkart-backend-rho.vercel.app/shopkart/user/${user.id}/addresses/${editAddressValues._id}` : `https://e-commerce-shopkart-backend-rho.vercel.app/shopkart/user/${user.id}/add-address`;
      const method = isEdit ? 'PUT' : 'POST';
      const response = await axios({
        method: method,
        url: url,
        data: values,
        headers: {
          Token: token
        }
      });
      console.log('Address added successfully:', response.data);
      resetForm();
      dispatch(
        addSnackbarState({
          snackbarOpen: true,
          snackbarMessage: isEdit ? 'Address updated successfully!' : 'Address added successfully!',
          snackbarSeverity: "success",
        })
      );
      isEdit ? onClose() : navigate('/user-address')
      return response.data;
    } catch (error) {
      console.error('Error adding address:', error);
      dispatch(
        addSnackbarState({
          snackbarOpen: true,
          snackbarMessage: 'Something went wrong!',
          snackbarSeverity: "error",
        })
      );
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Paper
      elevation={3}
      sx={{
        padding: 4,
        maxWidth: 800,
        margin: 'auto',
        mt: isEdit ? 0 : 15,
        borderRadius: 2,
      }}
    >
      <Typography variant="h4" gutterBottom align="center">
        {isEdit ? 'Update Address' : 'Add New Address'}
      </Typography>
      <Formik
        initialValues={isEdit ? editAddressValues : initialValues}
        validationSchema={validationSchema}
        onSubmit={handleAddressSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <Grid container spacing={2}>
              {/* <Grid item xs={12}>
                <Field name="label">
                  {({ field, meta }) => (
                    <TextField
                      {...field}
                      label={<><span>Label</span> <span style={{ color: 'red' }}>*</span></>}
                      variant="outlined"
                      fullWidth
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error}
                    />
                  )}
                </Field>
              </Grid> */}
              <Grid item xs={12}>
                <Field name="label">
                  {({ field, meta }) => (
                    <TextField
                      {...field}
                      select
                      label={<><span>Label</span> <span style={{ color: 'red' }}>*</span></>}
                      variant="outlined"
                      fullWidth
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error}
                    >
                      <MenuItem value="">Select Label</MenuItem>
                      <MenuItem value="Home">Home</MenuItem>
                      <MenuItem value="Work">Work</MenuItem>
                      <MenuItem value="Friend">Friend</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </TextField>
                  )}
                </Field>
              </Grid>
              <Grid item xs={12}>
                <Field name="houseNo">
                  {({ field, meta }) => (
                    <TextField
                      {...field}
                      label={<><span>House No</span> <span style={{ color: 'red' }}>*</span></>}
                      variant="outlined"
                      fullWidth
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error}
                    />
                  )}
                </Field>
              </Grid>
              <Grid item xs={12}>
                <Field name="street">
                  {({ field, meta }) => (
                    <TextField
                      {...field}
                      label={<><span>Street</span> <span style={{ color: 'red' }}>*</span></>}
                      variant="outlined"
                      fullWidth
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error}
                    />
                  )}
                </Field>
              </Grid>
              <Grid item xs={12}>
                <Field name="landmark">
                  {({ field, meta }) => (
                    <TextField
                      {...field}
                      label="Landmark"
                      variant="outlined"
                      fullWidth
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error}
                    />
                  )}
                </Field>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field name="city">
                  {({ field, meta }) => (
                    <TextField
                      {...field}
                      label={<><span>City</span> <span style={{ color: 'red' }}>*</span></>}
                      variant="outlined"
                      fullWidth
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error}
                    />
                  )}
                </Field>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field name="state">
                  {({ field, meta }) => (
                    <TextField
                      {...field}
                      label={<><span>State</span> <span style={{ color: 'red' }}>*</span></>}
                      variant="outlined"
                      fullWidth
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error}
                    />
                  )}
                </Field>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field name="pincode">
                  {({ field, meta }) => (
                    <TextField
                      {...field}
                      label={<><span>Pincode</span> <span style={{ color: 'red' }}>*</span></>}
                      variant="outlined"
                      fullWidth
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error}
                    />
                  )}
                </Field>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Field name="country">
                  {({ field, meta }) => (
                    <TextField
                      {...field}
                      label={<><span>Country</span> <span style={{ color: 'red' }}>*</span></>}
                      variant="outlined"
                      fullWidth
                      error={meta.touched && Boolean(meta.error)}
                      helperText={meta.touched && meta.error}
                    />
                  )}
                </Field>
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button fullWidth type="submit" variant="contained" color="primary" disabled={isSubmitting} size="large">
                    {isEdit ? 'Update' : 'Submit'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </Paper>
  );
};

export default AddressForm;
