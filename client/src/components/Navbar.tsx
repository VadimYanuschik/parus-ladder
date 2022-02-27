import React from 'react';
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

import {Link as RouterLink, useNavigate} from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth";
import {useAppDispatch, useAppSelector} from "../hooks/redux";
import {userSlice} from "../redux/features/userSlice";


const Navbar = () => {
    const navigate = useNavigate();
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

    const {isAuth, user} = useAppSelector(state => state.user)
    const {LogOut} = userSlice.actions;
    const dispatch = useAppDispatch();

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleLogOut = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            dispatch(LogOut())
            navigate('/')
        }).catch((error) => {
            console.log(error)
        });
    }

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{mr: 2, display: {xs: 'none', md: 'flex'}}}
                    >
                        ParusLadder
                    </Typography>

                    <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon/>
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
                                display: {xs: 'block', md: 'none'},
                            }}
                        >
                            <MenuItem component={RouterLink} to={'/'} key={'Главная'} onClick={handleCloseNavMenu}>
                                <Typography textAlign="center">Главная</Typography>
                            </MenuItem>
                            <MenuItem component={RouterLink} to={'/table'} key={'Таблица лидеров'} onClick={handleCloseNavMenu}>
                                <Typography textAlign="center">Таблица лидеров</Typography>
                            </MenuItem>
                            <MenuItem component={RouterLink} to={'/contacts'} key={'Контакты'} onClick={handleCloseNavMenu}>
                                <Typography textAlign="center">Контакты</Typography>
                            </MenuItem>
                            <MenuItem component={RouterLink} to={'/faq'} key={'FAQ'} onClick={handleCloseNavMenu}>
                                <Typography textAlign="center">FAQ</Typography>
                            </MenuItem>
                            <MenuItem component={RouterLink} to={'/login'} key={'Войти'} onClick={handleCloseNavMenu}>
                                <Typography textAlign="center">Войти</Typography>
                            </MenuItem>
                            <MenuItem component={RouterLink} to={'/registration'} key={'Зарегистрироваться'} onClick={handleCloseNavMenu}>
                                <Typography textAlign="center">Зарегистрироваться</Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}
                    >
                        ParusLadder
                    </Typography>
                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                        <Button
                            key={'Главная'}
                            component={RouterLink}
                            to={'/'}
                            onClick={handleCloseNavMenu}
                            sx={{my: 2, color: 'white', display: 'block'}}
                        >
                            Главная
                        </Button>
                        <Button
                            key={'Таблица лидеров'}
                            component={RouterLink}
                            to={'/table'}
                            onClick={handleCloseNavMenu}
                            sx={{my: 2, color: 'white', display: 'block'}}
                        >
                            Таблица лидеров
                        </Button>
                        <Button
                            key={'Контакты'}
                            component={RouterLink}
                            to={'/contacts'}
                            onClick={handleCloseNavMenu}
                            sx={{my: 2, color: 'white', display: 'block'}}
                        >
                            Контакты
                        </Button>
                        <Button
                            key={'FAQ'}
                            component={RouterLink}
                            to={'/faq'}
                            onClick={handleCloseNavMenu}
                            sx={{my: 2, color: 'white', display: 'block'}}
                        >
                            FAQ
                        </Button>
                    </Box>

                    <Box sx={{flexGrow: 0}}>
                        {isAuth ?
                            (<>
                                <Tooltip title="Настройки">
                                    <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                        <Avatar alt={user?.name} src="/static/images/avatar/2.jpg"/>
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    sx={{mt: '45px'}}
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
                                    <MenuItem component={RouterLink} to={'/personal-account'} key={'Личный кабинет'} onClick={handleCloseUserMenu}>
                                        <Typography textAlign="center">Личный кабинет</Typography>
                                    </MenuItem>
                                    <MenuItem key={'Выйти'} onClick={() => {
                                        handleCloseUserMenu();
                                        handleLogOut();
                                    }}>
                                        <Typography textAlign="center">Выйти</Typography>
                                    </MenuItem>
                                </Menu>
                            </>)
                            : (<>
                                <Button component={RouterLink} to={'/login'} sx={{display: {xs: "none", md: "inline-block"}}} color="inherit">Войти</Button>
                                <Button component={RouterLink} to={'/registration'} sx={{display: {xs: "none", md: "inline-block"}}} color="inherit">Зарегистрироваться</Button>
                            </>)}
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};
export default Navbar;