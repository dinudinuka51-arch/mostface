import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box
} from '@mui/material';
import {
  Search,
  Notifications,
  Message,
  Home,
  People,
  Storefront,
  SportsEsports,
  AccountCircle,
  Settings,
  Logout
} from '@mui/icons-material';
import { useStateValue } from '../../context/StateContext';
import './Header.css';

const Header = () => {
  const [{ user }, dispatch] = useStateValue();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('mostface_user');
    dispatch({ type: 'SET_USER', payload: null });
    handleMenuClose();
    navigate('/');
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate(`/profile/${user.id}`);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleProfileClick}>
        <AccountCircle sx={{ mr: 2 }} />
        Profile
      </MenuItem>
      <MenuItem onClick={handleMenuClose}>
        <Settings sx={{ mr: 2 }} />
        Settings
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        <Logout sx={{ mr: 2 }} />
        Logout
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: 'white', color: 'black', boxShadow: 'none', borderBottom: '1px solid #e0e0e0' }}>
        <Toolbar>
          {/* Logo */}
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ 
              display: { xs: 'none', sm: 'block' },
              color: '#1877f2',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
            onClick={() => navigate('/')}
          >
            MostFace
          </Typography>

          {/* Search Bar */}
          <Box sx={{ 
            position: 'relative', 
            borderRadius: 20, 
            backgroundColor: '#f0f2f5', 
            marginLeft: 2, 
            width: '100%', 
            maxWidth: 240 
          }}>
            <Box sx={{ 
              padding: '0 16px', 
              height: '100%', 
              position: 'absolute', 
              pointerEvents: 'none', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <Search />
            </Box>
            <InputBase
              placeholder="Search MostFace"
              sx={{
                color: 'inherit',
                padding: '8px 8px 8px 45px',
                width: '100%'
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Desktop Icons */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
            <IconButton size="large" color="inherit" onClick={() => navigate('/')}>
              <Home />
            </IconButton>
            <IconButton size="large" color="inherit">
              <People />
            </IconButton>
            <IconButton size="large" color="inherit">
              <Storefront />
            </IconButton>
            <IconButton size="large" color="inherit">
              <SportsEsports />
            </IconButton>

            <IconButton size="large" color="inherit">
              <Badge badgeContent={4} color="error">
                <Notifications />
              </Badge>
            </IconButton>
            <IconButton size="large" color="inherit">
              <Badge badgeContent={2} color="error">
                <Message />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <Avatar 
                src={user?.profilePicture} 
                sx={{ width: 32, height: 32 }}
              >
                {user?.name?.charAt(0)}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMenu}
    </Box>
  );
};

export default Header;
