import { useState } from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from '../../Redux/AuthSlice/auth';
import { useNavigate } from 'react-router-dom';
import { resetOrders } from '../../Redux/OrderSlice/Orders';
import { resetSelectedAddress } from '../../Redux/AddressSlice/SelectedAddress';
import { resetUserData } from '../../Redux/AccountDetailSlice/getUserDetails';
import { resetAdminData } from '../../Redux/AccountDetailSlice/getAdminDetails';
import { Contrast, Person } from '@mui/icons-material';
import { resetAddresses } from '../../Redux/AddressSlice/Addresses';
import ThemeSelector from '../../Theme/Components/ThemeSelector/ThemeSelector';

export default function ProfileMenu() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {firstName, lastName, avatar, isAdmin, id} = useSelector(state => state.auth.user);
  const [anchorEl, setAnchorEl] = useState(null);
  const [flag, setFlag] = useState(false);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleAccountDetails = () => {
    if(isAdmin) {
      navigate(`/admin/admin-info/${id}`)
    } else {
      navigate(`/user-info/${id}`)
    }
    setAnchorEl(null);
  };
  const handleAddAcc = () => {
    navigate('/admin/add-admin-account')
  };
  const handleNavigate = () => {
    navigate('/my-orders')
    setAnchorEl(null);
  };
  const handleLogout = () => {
    dispatch(signOut());
    dispatch(resetSelectedAddress());
    dispatch(resetAddresses());
    dispatch(resetAdminData());
    dispatch(resetUserData());
    dispatch(resetOrders());
    localStorage.removeItem('token');
    setAnchorEl(null);
  };
  const handleClickOpen = () => {
    setFlag(true);
  }
  const handleClickClose = () => {
    setFlag(false);
  }
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        {/* <Typography sx={{ minWidth: 100 }}>Contact</Typography> */}
        <Typography sx={{  display: { xs: 'none', md: 'flex' }, fontWeight: 'bold', mr:-1.8 }}>{firstName +' '+ lastName}</Typography>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            {/* <Avatar sx={{ width: 35, height: 35 }}>M</Avatar> */}
            <Avatar alt={`${firstName} ${lastName}`} src={avatar} />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&::before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* <MenuItem onClick={handleClose}>
          <Avatar /> Profile
        </MenuItem> */}
        <MenuItem onClick={handleAccountDetails}>
          <Avatar style={{background: 'transparent'}}><Person color='primary' /></Avatar> Profile
        </MenuItem>
        <MenuItem onClick={handleClickOpen}>
          <ListItemIcon>
            <Avatar sx={{bgcolor: 'transparent'}}><Contrast color='primary'/></Avatar>
          </ListItemIcon>
          Change Theme
        </MenuItem>
        {!isAdmin && <MenuItem onClick={handleNavigate}>
          <ListItemIcon>
          <Avatar sx={{bgcolor: 'transparent'}}><ReceiptLongIcon color='primary' /></Avatar>
          </ListItemIcon>
          My Orders
        </MenuItem>}
        <Divider />
        {isAdmin && <MenuItem onClick={handleAddAcc}>
          <ListItemIcon>
            <Avatar sx={{bgcolor: 'transparent'}}><PersonAdd color='primary' /></Avatar>
          </ListItemIcon>
          Add another account
        </MenuItem>}
        {/* <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem> */}
        <MenuItem sx={{color:'red'}} onClick={handleLogout}>
          <ListItemIcon>
            <Avatar style={{background: 'transparent'}}><Logout fontSize="small" color='error' /></Avatar>
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
      <ThemeSelector menuOpen={flag} handleClose={handleClickClose}/>
    </>
  );
}
