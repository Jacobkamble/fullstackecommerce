
import logo from "../../../images/logo.png";
import profile from "../../../images/Profile.png"
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import SearchIcon from '@mui/icons-material/Search';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
const pages = [{ lable: "Home", url: "/" }, { lable: 'Products', url: "/products" }, { lable: 'Contact', url: "/conact" }, { lable: 'About', url: "/about" }];

const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];






const Header = () => {

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <>
            <AppBar position="static">
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
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
                            <img src={logo} alt="Logo" style={{ width: '150px', maxHeight: '70px' }} />
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
                                {pages.map((page) =>
                                (
                                    <Link key={page.url} className="link" to={page.url}>
                                        <MenuItem key={page.lable} onClick={handleCloseNavMenu}>
                                            <Typography sx={{ fontFamily: "Roboto" }} textAlign="center">{page.lable}</Typography>
                                        </MenuItem>
                                    </Link>

                                ))}
                            </Menu>
                        </Box>

                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            <img src={logo} alt="Logo" style={{ width: '150px', maxHeight: '70px' }} />
                            {pages.map((page) => (
                                <Link key={page.url} style={{ textDecoration: "none" }} className="link" to={page.url}>
                                    <Button
                                        key={page.lable}
                                        onClick={handleCloseNavMenu}
                                        sx={{ my: 2, color: 'white', display: 'block', fontFamily: "Roboto" }}
                                    >
                                        {page.lable}
                                    </Button>
                                </Link>

                            ))}
                        </Box>

                        <Box sx={{ flexGrow: 0, }}>
                            <Tooltip title="Search Product">
                                <Link to={"/search"}>
                                    <IconButton sx={{ p: 1 }}>
                                        <SearchIcon />
                                    </IconButton>
                                </Link>

                            </Tooltip>
                            <Tooltip title="Cart">
                                <Link to={"/cart"}>
                                    <IconButton sx={{ p: 1 }}>
                                        <AddShoppingCartIcon />
                                    </IconButton>
                                </Link>
                            </Tooltip>
                            <Tooltip title="User">
                                <Link to={"/login"}>
                                    <IconButton sx={{ p: 1 }}>
                                        <Avatar alt="Remy Sharp" src={profile} />
                                    </IconButton>
                                </Link>

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
    )
}

export default Header
