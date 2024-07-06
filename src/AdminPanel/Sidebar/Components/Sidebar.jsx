import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PersonAdd from '@mui/icons-material/PersonAdd';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LogoutIcon from '@mui/icons-material/Logout';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { signOut } from '../../../Redux/AuthSlice/auth';
import { CircularProgress, MenuItem, Select } from '@mui/material';
import ProfileMenu from '../../../Menu/Components/ProfileMenu';
import AdminHomePage from '../../AdminHomePage/Components/AdminHomePage';
import { ShoppingCart } from '@mui/icons-material';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function Sidebar() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogout, setIsLogout] = React.useState(false);
  const [filter, setFilter] = React.useState('ongoing'); // Default filter
  const SideBarMenuItem = [
    { text: "Add Product", icon: <AddShoppingCartIcon />, path: '/admin/add-product' },
    { text: "Manage Products", icon: <ManageHistoryIcon />, path: '/admin/manage-products' },
    { text: "Add Admin Account", icon: <PersonAdd />, path: '/admin/add-admin-account' },
    { text: "User Orders", icon: <FactCheckIcon />, path: '/admin/user-orders' },
  ]
  const SideBarMenuAuthItem = [
    { text: isLogout ? <CircularProgress size={15}/> : "Logout", icon: <LogoutIcon />, path: '/login' },
  ]

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleItemClick = (path) => {
    navigate(path);
  };

  const handleAuthItemClick = (path) => {
    setIsLogout(true);
    try {
      dispatch(signOut());
      localStorage.removeItem('token');
    } finally {
      setIsLogout(false);
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography sx={!open ? {position: 'absolute', left: 100, fontFamily: 'monospace', fontWeight: 700, display: 'flex', alignItems:'center'} : {fontFamily: 'monospace', fontWeight: 700, display: 'flex', alignItems:'center'}} variant="h6" noWrap component={NavLink} to={'/admin'}>
            <ShoppingCart sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            ShopKart
          </Typography>
          <Box display={'flex'} alignItems={'center'}>
            {location.pathname === '/admin/user-orders' && (
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                variant="outlined"
                size='small'
                sx={{ minWidth: 200, bgcolor: 'lightgray', mr:2 }}
              >
                <MenuItem value="recent">Recent Orders</MenuItem>
                <MenuItem value="delivered">Delivered Orders</MenuItem>
                <MenuItem value="cancelled">Cancelled Orders</MenuItem>
                <MenuItem value="ongoing">Current Orders</MenuItem>
              </Select>
            )}
            <ProfileMenu />
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <Typography color={'green'} fontSize={20} fontWeight={'bold'} position={'absolute'} left={50}>
            Admin Panel
          </Typography>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {SideBarMenuItem.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  "&.active": {
                    backgroundColor: "#1976d2",
                    color:'white'
                  },
                  "&:hover": {
                    transition: "0.1s",
                    backgroundColor: '#B3D4E5',
                    color:'#ffffff',
                    borderRadius: '5px'
                  },
                }}
                LinkComponent={NavLink}
                to={item?.path}
                onClick={() => handleItemClick(item?.path)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    "&.active": {
                      color:'white'
                    },
                    color: location.pathname === item?.path ? "white" : "",
                  }}
                >
                  {item?.icon}
                </ListItemIcon>
                <ListItemText primary={item?.text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <List sx={{position:"absolute", bottom:0, width: '100%'}} >
          {SideBarMenuAuthItem.map((item, index) => (
            <ListItem key={item?.text} disablePadding sx={{ display: "block"}}>
              <ListItemButton
                sx={{
                  // minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                  // backgroundColor: '#1976d2',
                  backgroundColor: '#ff4f4b',
                  color: "#ffffff",
                  "&:hover": {
                    transition: "0.1s",
                    backgroundColor: 'red',
                    borderRadius: '5px'
                  },
                }}
                onClick={() => handleAuthItemClick(item?.path)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "#ffffff",
                  }}
                >
                  {item?.icon}
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{
                    fontSize: "14px",
                    fontWeight: "bold",
                    marginLeft: 3
                  }}
                  primary={item?.text} 
                  sx={{ opacity: open ? 1 : 0 }} 
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3, position: "relative", width: "78vw", height: '100vh' }}>
        <DrawerHeader />
        {location.pathname === '/admin' ? <AdminHomePage /> : <Outlet context={{ filter }} />}
      </Box>
    </Box>
  );
}
