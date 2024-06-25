import { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
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
// const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function ResponsiveAppBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector(state => state.auth.user);
  const cartCount = useSelector(state => state.cartCount.count);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const pages = [
    { text: "Products", path: '/products' },
    // { text: "Cart", path: '/cart' },
  ];
  const settings = [
      { text: "Profile", icon: <AccountCircleIcon /> },
      { text: "Logout", icon: <LogoutIcon /> },
  ];
  useEffect(() => {
    dispatch(getCartCountAsync(userInfo.id));
  },[])
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
    if(text === "Logout") {
      dispatch(signOut());
      localStorage.removeItem('token')
    }
    setAnchorElUser(null);
  };
  const handleSearch = (e) => {
    setSearchInput(e.target.value);
    dispatch(setSearchTerm(e.target.value));
  }
  const handleSearchString = () => {
    if (searchInput.trim() !== "") { // Ensure the search input is not empty
      dispatch(setSearchTerm(searchInput));
      navigate('/products');
    }
  }

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <ShoppingCartIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
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
            >
              {pages.map((page) => (
                <MenuItem key={page.text} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page.text}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <ShoppingCartIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Shopkart
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.text}
                LinkComponent={NavLink}
                to={page.path}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block', textTransform:'none', 
                      "&.active": {
                        fontWeight: '700',
                        color:'darkgrey'
                      }, 
                    }}
              >
                {page.text}
              </Button>
            ))}
          </Box>
          <Paper
            sx={{ p: '2px 4px', mr: 10, display: 'flex', alignItems: 'center', width: 400,  }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search Products"
              onChange={handleSearch}
            />
            <IconButton onClick={handleSearchString} sx={{ p: '10px' }}>
              <SearchIcon />
            </IconButton>
          </Paper>
          <IconButton sx={{fontSize: '16px', mr: 2, "&.active": {
                        fontWeight: '700',
                        color:'darkgrey'
                      }, }} LinkComponent={NavLink} to="/cart" color="inherit">
            <span className='mb-[5px]'>Cart</span>
            <Badge badgeContent={cartCount} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          <Box sx={{ flexGrow: 0 }}>
            <ProfileMenu />
            {/* <span className='mr-2 font-bold'>{userInfo && `${userInfo.firstName} ${userInfo.lastName}`}</span>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={`${userInfo.firstName} ${userInfo.lastName}`} src={userInfo.avatar} />
              </IconButton>
            </Tooltip>
            <Menu
              id="account-menu"
              anchorEl={anchorElUser}
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
              open={Boolean(anchorElUser)}
              onClose={handleUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting.text} onClick={() => handleUserMenu(setting.text)}>
                  <Typography marginRight={1}>{setting.icon}</Typography><Typography textAlign="center">{setting.text}</Typography>
                </MenuItem>
              ))}
            </Menu> */}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
