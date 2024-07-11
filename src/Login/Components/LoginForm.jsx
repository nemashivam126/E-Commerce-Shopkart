import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, Button, TextField, FormControl, Paper, Box, Typography, Container, CircularProgress, InputAdornment, FormControlLabel, Switch } from '@mui/material';
import { LockOutlined, Visibility, VisibilityOff, AdminPanelSettings } from '@mui/icons-material';
import { userSignInAsync } from '../../Redux/AuthSlice/userSignIn';
import { Link } from 'react-router-dom';
import { adminSignInAsync } from '../../Redux/AuthSlice/adminSignIn';
import LoginBg from '../../assets/LoginBg.jpg';
import CustomTheme from '../../Theme/CustomTheme/CustomTheme';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.userSignIn);
  const [showPassword, setShowPassword] = useState(false);
  const [admin, setAdmin] = useState(false);
  const AppTheme = useSelector((state) => state.theme.theme);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(admin) {
      dispatch(adminSignInAsync({ email, password }));
    } else {
      dispatch(userSignInAsync({ email, password }));
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{display:'flex', justifyContent: 'center', alignItems:'center', flexDirection:'column', height:'90vh'}}>
      {/* <Button onClick={() => setAdmin(!admin)} sx={{position: 'absolute', top:15, right:15,}} variant='contained' size='small' color={!admin ? 'error' : 'primary'}>{!admin ? 'Admin Panel' : 'Shopkart User'}</Button> */}
      {!admin && <img style={{position: 'absolute', height:'110vh', width: '100vw', left:0, zIndex:-1}} src={LoginBg} alt="" />}
      <Paper elevation={3} sx={{ padding: 3, mt: 8 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: admin ? 'error.main' : 'secondary.main' }}>
            { admin ? <AdminPanelSettings /> : <LockOutlined /> }
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <FormControl margin="normal" required fullWidth>
              <TextField
                label="Email Address"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                    endAdornment: (
                      <InputAdornment sx={{cursor: 'pointer'}} position="end" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <VisibilityOff fontSize='small' /> : <Visibility fontSize='small' />}
                      </InputAdornment>
                    ),
                }}
            />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              disabled={auth.loading}
            >
              {auth.loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
            {/* {auth.error && <Typography color="error">{auth.error}</Typography>} */}
          </Box>
        </Box>
        {/* text-[#1976d2] first color this comment is just for developers memo */}
        {!admin && <Link to={'/signup'}><span className='flex justify-center text-[13px]'>Don't have an account? <span className='font-bold ml-1' style={{ color: AppTheme === 'Dark' ? CustomTheme.CustomColor[AppTheme].light : CustomTheme.CustomColor[AppTheme].main }}>Signup</span></span></Link>}
      </Paper>
      <FormControlLabel
        control={
          <Switch
            checked={admin}
            onChange={() => setAdmin(!admin)}
            // color="error"
            sx={{ color: CustomTheme.CustomColor[AppTheme].main }}
          />
        }
        label='Login As Admin'
        sx={{mt: 2}}
      />
    </Container>
  );
};

export default LoginForm;
