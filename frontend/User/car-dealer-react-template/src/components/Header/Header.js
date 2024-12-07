import React, { useState, useEffect } from 'react';
import './Header.style.css';
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
import TextField from '@mui/material/TextField';
import { useDispatch } from "react-redux";
import { changeColor } from '../../store/slices/themeSlice';
import { Link } from 'react-scroll';

const pageMappings = {
  home: "Trang chủ",
  cars: "Xe mới",
  "featured-cars": "Xe",
  service: "So sánh xe",
  topCar: "Top Xe", 
  review: "Nhà phát triển",
};

const pages = Object.keys(pageMappings);

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

export const Header = () => {
  const dispatch = useDispatch();
  const storageColor = localStorage.getItem('color');

  const [color, setColor] = useState(() => {
    return storageColor ?? "";
  });

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const appBarColor = scrollPosition > 1 ? '#000' : 'transparent';

  useEffect(() => {
    dispatch(changeColor(storageColor));
    localStorage.setItem('color', color);
  }, [color, dispatch]);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <AppBar className='navbar' position="sticky" style={{ background: appBarColor, boxShadow: 'none' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              LOGO
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
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    {page === 'topCar' ? (
                      <Link to="topCar" smooth={true} duration={500} offset={-70}>
                        <Typography textAlign="center">{pageMappings[page]}</Typography>
                      </Link>
                    ) : (
                      <Link to={page} smooth={true} duration={500} offset={-70}>
                        <Typography textAlign="center">{pageMappings[page]}</Typography>
                      </Link>
                    )}
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              LOGO
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                page === "topCar" ? (
                  <Link key={page} to="topCar" smooth={true} duration={500} offset={-70}>
                    <Button sx={{ my: 2, color: 'white' }}>
                      {pageMappings[page]}
                    </Button>
                  </Link>
                ) : (
                  <Link key={page} to={page} smooth={true} duration={500} offset={-70}>
                    <Button sx={{ my: 2, color: 'white' }}>
                      {pageMappings[page]}
                    </Button>
                  </Link>
                )
              ))}
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <TextField onChange={(event) => setColor(event.target.value)} id="outlined-basic" label="Set Color" variant="outlined" />
                <Button
                  onClick={() => { dispatch(changeColor(color)) }}
                  sx={{ width: "100%", my: 1, color: 'blue', display: 'block' }}
                >
                  Change Color
                </Button>
                {settings.map((setting) => (
                  <MenuItem key={setting} onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};
