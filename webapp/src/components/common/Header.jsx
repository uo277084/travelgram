import AdbIcon from '@mui/icons-material/Adb';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { ListItemAvatar } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import firebaseUtils from '../../firebase/firebaseUtils';
import userService from '../../services/userService';

function Header() {

    const [logo, setLogo] = useState('');

    useEffect(() => {
        async function fetchData() {
            const urlLogo = await firebaseUtils.getPhoto('/app/logos/logoVerdeOscuroPeque.png');
            setLogo(urlLogo);
        }
        fetchData();
    }, []);

    const [user, setUser] = useState(null);

    const [searchUser, setSearchUser] = useState('');
    const [searchResult, setSearchResult] = useState([]);

    const [openDialogResults, setOpenDialogResults] = useState(false);

    useEffect(() => {
        const userLogged = window.localStorage.getItem('userLogged');
        if (userLogged) {
            var userInfo = JSON.parse(userLogged);
            setUser(userInfo);
        } else {
            window.location.href = '/';
        }
    }, [])

    const handleLogout = () => {
        window.localStorage.removeItem('userLogged');
        window.location.href = '/travelgram/#/';
    };

    const handleFeed = () => {
        window.location.href = '/travelgram/#/feed';
    };

    const handleConfig = () => {
        window.location.href = '/travelgram/#/config';
    };

    const handleSearch = async (event) => {
        const searchUserMinusc = searchUser.toLowerCase();
        const usersResult = await userService.getUsersExceptSessionUserSearch(user.user.username, searchUserMinusc);
        setSearchResult(usersResult);
        setOpenDialogResults(true);
    };

    const handleChangeSearch = (event) => {
        setSearchUser(event.target.value);
    };

    const handleCloseDialog = () => {
        setOpenDialogResults(false);
    };

    const handleSaved = () => {
        window.location.href = '/travelgram/#/savedPosts';
    };

    const handleFollowed = () => {
        window.location.href = '/travelgram/#/followed';
    };

    const handleChats = () => {
        window.location.href = '/travelgram/#/chats';
    };

    const pages = ['Chats', 'Seguidos', 'Guardados'];
    const pagesWork = [handleChats, handleFollowed, handleSaved];
    const settings = ['Perfil', 'Configuración', 'Cerrar sesión'];
    const settingsWork = [handleFeed, handleConfig, handleLogout];

    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);

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

    const handleClickUser = (username) => () => {
        window.location.href = '/travelgram/#/feed/' + username;
    };

    if (!user) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </div>);
    }

    return (
        <AppBar position="static" sx={{ backgroundColor: '#6fbf73' }}>
            <Toaster />
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <a href='/travelgram/#/home'>
                        <img src={logo} alt="Logo de Travelgram" width="50" height="50" />
                    </a>
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
                            data-testid="menu-appbar"
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
                            {pages.map((page, index) => (
                                <MenuItem key={page} onClick={pagesWork[pages.indexOf(page)]} data-testid={"menu-appbar" + index}>
                                    <Typography textAlign="center">{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                onClick={pagesWork[pages.indexOf(page)]}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>
                    <Box sx={{ flexGrow: 1 }} >
                        <InputBase
                            sx={{ ml: 1, flex: 1, color: 'white' }}
                            placeholder="Busca un usuario"
                            inputProps={{ 'aria-label': 'search user' }}
                            value={searchUser}
                            data-testid="input-search"
                            onChange={handleChangeSearch}
                            onKeyDown={(event) => event.key === 'Enter' && handleSearch(event)}
                        />
                        <IconButton
                            type="button"
                            sx={{ p: '10px', color: 'white' }}
                            aria-label="search"
                            data-testid="button-search"
                            onClick={handleSearch}
                            disabled={!searchUser.trim()}
                        >
                            <SearchIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Abrir opciones">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar
                                    alt="Usuario"
                                    src={user.user.profilePic}>
                                    {user.user.username.charAt(0).toUpperCase()}
                                </Avatar>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar-user"
                            data-testid="menu-appbar-user"
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
                            {settings.map((setting, index) => (
                                <MenuItem key={setting} onClick={settingsWork[settings.indexOf(setting)]} data-testid={"menu-appbar-user" + index}>
                                    <Typography textAlign="center">{setting}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
            <Dialog open={openDialogResults} onClose={handleCloseDialog}>
                <DialogTitle>Resultados de la búsqueda</DialogTitle>
                <DialogContent dividers>
                    <List>
                        {searchResult.length === 0 && <ListItem><ListItemText>Ningún nombre de usuario coincide con la búsqueda</ListItemText></ListItem>}
                        {searchResult.map((user) => (
                            <ListItem button key={user.username} onClick={handleClickUser(user.username)}>
                                <ListItemAvatar>
                                    <Avatar alt="Usuario resultado" src={user.profilePic}>{user.username.charAt(0).toUpperCase()}</Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={user.username} secondary={user.name} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
            </Dialog>
        </AppBar >
    );
}
export default Header;
