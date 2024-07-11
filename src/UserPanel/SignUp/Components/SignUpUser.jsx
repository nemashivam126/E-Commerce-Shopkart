import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
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
  OutlinedInput,
  Select,
  MenuItem
} from '@mui/material';
import { Visibility, VisibilityOff, Edit } from '@mui/icons-material';
import { userSignUpAsync } from '../../../Redux/AuthSlice/userSignUp';
import { Link } from 'react-router-dom';
import { adminSignUpAsync } from '../../../Redux/AuthSlice/adminSignUp';
import LoginBg from '../../../assets/LoginBg.jpg';

const SignUpUser = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { status } = useSelector((state) => state.userSignUp);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [image, setImage] = useState(null);

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
      fname: '',
      lname: '',
      contactNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
      gender: '',
      image: null,
    },
    validationSchema: Yup.object({
      fname: Yup.string()
        .matches(/^(?!\s)(?!.*\s$)(?!.*\s{2,})[a-zA-Z\s]+$/, 'First name must contain only letters and spaces, cannot start or end with a space, and must not have consecutive spaces')
        .required('First name is required'),
      lname: Yup.string()
        .matches(/^(?!\s)(?!.*\s$)(?!.*\s{2,})[a-zA-Z\s]+$/, 'Last name must contain only letters and spaces, cannot start or end with a space, and must not have consecutive spaces')
        .required('Last name is required'),
      contactNumber: Yup.string()
        .required('Contact number is required')
        .matches(
          /^[0-9]{10}$/,
          'Contact number must be exactly 10 digits'
        ),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      gender: Yup.string().required('Gender is required'),
      password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters long'),
      confirmPassword: Yup.string().required('Confirm password is required').oneOf([Yup.ref('password'), null], 'Passwords must match')
    }),
    onSubmit: (values) => {
      if(user === null) {
        dispatch(userSignUpAsync({ user: values, image }));
      } else {
        dispatch(adminSignUpAsync({ user: values, image }));
      }
      setImage(null)
      formik.resetForm();
    },
  });

  return (
    <Container maxWidth={user === null ? "sm" : "md"} sx={{
      display: 'flex',
      alignItems: 'center',
      height: user === null ? '90vh' : 'auto',
    }}>
      {(user === null) && <img style={{position: 'absolute', height:'110vh', width: '100vw', left:0, zIndex:-1}} src={LoginBg} alt="" />}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: user === null ? 8 : 4,
          boxShadow: 3,
          p: 3,
          borderRadius: 2,
          background: 'white'
        }}
      >
        {/* <Avatar src={image} sx={{ width: 80, height: 80, mb: 2 }} /> */}
        <Box
          sx={{
            position: 'relative',
            display: 'inline-block',
          }}
        >
          <Avatar src={image} sx={{ width: 80, height: 80, mb: 2 }} />
          <IconButton
            component="label"
            sx={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: 'white',
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
        </Box>
        <Typography variant="h4" gutterBottom>
          {user === null ? 'Sign Up' : 'Add Admin'}
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="fname"
                label={<><span>First Name</span> <span style={{ color: 'red' }}>*</span></>}
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
                label={<><span>Last Name</span> <span style={{ color: 'red' }}>*</span></>}
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
                label={<><span>Contact Number</span> <span style={{ color: 'red' }}>*</span></>}
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
                label={<><span>Email</span> <span style={{ color: 'red' }}>*</span></>}
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel><><span>Gender</span> <span style={{ color: 'red' }}>*</span></></InputLabel>
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
                    <InputAdornment sx={{cursor: 'pointer'}} position="end" onClick={handleClickShowPassword}>
                        {showPassword ? <VisibilityOff fontSize='small' /> : <Visibility fontSize='small' />}
                    </InputAdornment>
                  ),
                }}
                label={<><span>Password</span> <span style={{ color: 'red' }}>*</span></>}
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
                    <InputAdornment sx={{cursor: 'pointer'}} position="end" onClick={handleClickShowConfirmPassword}>
                        {showConfirmPassword ? <VisibilityOff fontSize='small' /> : <Visibility fontSize='small' />}
                    </InputAdornment>
                  ),
                }}
                label={<><span>Confirm Password</span> <span style={{ color: 'red' }}>*</span></>}
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
              />
            </Grid>
            {/* <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
                fullWidth
              >
                Upload Image
                <input
                  type="file"
                  hidden
                  onChange={(event) => {
                    formik.setFieldValue('image', event.target.files[0]);
                    handleImageChange(event);
                  }}
                />
              </Button>
            </Grid> */}
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={status === 'loading'}
          >
            {user === null ? 'Sign Up' : 'Add'}
          </Button>
          {/* {status === 'failed' && <Typography color="error">{error}</Typography>} */}
        </Box>
        {user === null && <Link to={'/login'}><span className='flex justify-center text-[13px]'>Already have an account? <span className='text-[#1976d2] font-bold ml-1'>Signin</span></span></Link>}
      </Box>
    </Container>
  );
};

export default SignUpUser;
