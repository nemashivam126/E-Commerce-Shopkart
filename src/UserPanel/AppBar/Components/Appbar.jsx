import { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import { Badge, InputBase, Paper } from '@mui/material';
import { setSearchTerm } from '../../../Redux/SearchTermSlice/SearchTerm';
import { signOut } from '../../../Redux/AuthSlice/auth';
import { getCartCountAsync } from '../../../Redux/CartSlice/cartCount';
import ProfileMenu from '../../../Menu/Components/ProfileMenu';
import CustomTheme from '../../../Theme/CustomTheme/CustomTheme';
import DarkModeToggleButton from '../../../DarkModeToggle/Components/DarkModeToggleButton';

function ResponsiveAppBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector(state => state.auth.user);
  const cartCount = useSelector(state => state.cartCount.count);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const AppTheme = useSelector((state) => state.theme.theme);
  const pages = [
    { text: "Products", path: '/products' },
    { text: "Cart", path: '/cart' },
  ];
  const settings = [
    { text: "Profile", icon: <AccountCircleIcon /> },
    { text: "Logout", icon: <LogoutIcon /> },
  ];
  useEffect(() => {
    if (userInfo) {
      dispatch(getCartCountAsync(userInfo.id));
    }
  }, [dispatch, userInfo]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleUserMenu = (text) => {
    if (text === "Logout") {
      dispatch(signOut());
      localStorage.removeItem('token');
    }
    setAnchorElUser(null);
  };

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
    dispatch(setSearchTerm(e.target.value));
  };

  const handleSearchString = () => {
    if (searchInput.trim() !== "") {
      dispatch(setSearchTerm(searchInput));
      navigate('/products');
    }
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component={NavLink}
            to={'/'}
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              fontFamily: 'monospace',
              fontWeight: 700,
              color: AppTheme === "Dark" ? CustomTheme.CustomColor.Common.dullWhite : CustomTheme.CustomColor[AppTheme].light,
              textDecoration: 'none',
              "&.active": {
                fontWeight: 700,
                color: 'white'
              }
            }}
          >
            <ShoppingCartIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            Shopkart
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            > <Typography
                component={Link}
                to={'/'}
                noWrap
                sx={{
                  padding: '6px 16px'
                }}
              >
                Home
              </Typography>
              {pages.map((page) => (
                <MenuItem key={page.text} onClick={handleCloseNavMenu} component={Link} to={page.path}>
                  <Typography textAlign="center">{page.text}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.filter(item => item.text != 'Cart').map((page) => (
              <Button
                key={page.text}
                LinkComponent={NavLink}
                to={page.path}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, fontWeight: 700, color: AppTheme === "Dark" ? CustomTheme.CustomColor.Common.dullWhite : CustomTheme.CustomColor[AppTheme].light, display: 'block', textTransform:'none', 
                      "&.active": {
                        fontWeight: '700',
                        color:'white'
                      }, 
                    }}
              >
                {page.text}
              </Button>
            ))}
          </Box>
          <Paper
            component="form"
            sx={{ p: '0px 4px', mr: { xs: 2, md: 10 }, display: 'flex', alignItems: 'center', width: { xs: 200, sm: 300, md: 400 }, }}
            onSubmit={(e) => {
              e.preventDefault();
              handleSearchString();
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search Products"
              onChange={handleSearch}
            />
            <IconButton type="submit" sx={{ p: '10px' }}>
              <SearchIcon />
            </IconButton>
          </Paper>
          <IconButton sx={{ display: { xs: 'none', md: 'flex' }, fontSize: '16px', mr: 2, fontWeight: 700, color: AppTheme === "Dark" ? CustomTheme.CustomColor.Common.dullWhite : CustomTheme.CustomColor[AppTheme].light, "&.active": {
                        fontWeight: '700',
                        color:'white'
                      }, "&.MuiButtonBase-root:hover": {
                            bgcolor: 'transparent' }, 
            }} LinkComponent={NavLink} to="/cart" color="inherit">
            <span className='mb-[5px]'>Cart</span>
            <Badge badgeContent={cartCount} color={AppTheme === "Error" ? "secondary" : "error"}>
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mx: 1 }}><DarkModeToggleButton /></Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }}}><DarkModeToggleButton /></Box>
          <Box sx={{ flexGrow: 0 }}>
            <ProfileMenu />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
