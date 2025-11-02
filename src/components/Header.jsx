import * as React from 'react';
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
import { FaBookReader } from "react-icons/fa";
import { Link } from 'react-router-dom';

const pages = ['Home', 'MyBooks', 'Wishlist', 'ReadingDashboard'];

const pathMap = {
  Home: '/',
  MyBooks: '/mybooks',
  Wishlist: '/wishlist',
  ReadingDashboard: '/dashboard',
};

function Header() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: '#4F46E5' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>

            {/*  Logo + Title (Desktop)  */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
              <FaBookReader size={26} />
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  letterSpacing: '.1rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                LIBRISPACE
              </Typography>
            </Box>

            {/*  Mobile Menu Icon  */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton size="large" color="inherit" onClick={handleOpenNavMenu}>
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                sx={{ display: { xs: 'block', md: 'none' } }}
              >
                {pages.map((page) => (
                  <MenuItem
                    key={page}
                    onClick={handleCloseNavMenu}
                    component={Link}
                    to={pathMap[page]}
                  >
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/*  Mobile Logo  */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1, flexGrow: 1 }}>
              <FaBookReader size={24} />
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: 600,
                  letterSpacing: '.1rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                LIBRISPACE
              </Typography>
            </Box>

            {/*  Desktop Nav Links  */}
            <Box sx={{ flexGrow: 1, justifyContent: 'flex-end', display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  component={Link}
                  to={pathMap[page]}
                  sx={{
                    my: 2,
                    mx: 1,
                    color: 'white',
                    display: 'block',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 500,
                    textTransform: 'none',
                  }}
                >
                  {page}
                </Button>
              ))}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  )
}

export default Header