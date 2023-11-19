import SearchIcon from '@mui/icons-material/Search';
import { Grid, ListItemAvatar, Paper, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import listeners from '../../firebase/firebaseListeners';
import chatService from '../../services/chatService';
import userService from '../../services/userService';
import Header from '../common/Header';
import ChatView from './ChatView';

function Chat() {

    const navigate = useNavigate();
    const { username } = useParams();

    const [user, setUser] = useState(null);
    const [chatSelected, setChatSelected] = useState(null);
    const [chats, setChats] = useState([]);

    const [searchUser, setSearchUser] = useState('');
    const [searchResult, setSearchResult] = useState([]);

    const [openDialogResults, setOpenDialogResults] = useState(false);

    useEffect(() => {

        async function fetchData() {
            const loggedUserJSON = window.localStorage.getItem('userLogged');
            try {
                if (loggedUserJSON) {
                    const user = JSON.parse(loggedUserJSON);
                    setUser(user.user);

                    const chats = await chatService.getChatOrder(user.user.username);
                    const chats2 = [];

                    for (const chat of chats.chats) {
                        const userChat = await userService.findUserByUsername(chat.chat.user1 === user.user.username ? chat.chat.user2 : chat.chat.user1);
                        chats2.push({ ...chat.chat, userProfilePic: userChat.user.profilePic });
                    }

                    setChats(chats2);

                    if (username && (!chatSelected || (chatSelected.user1 !== username && chatSelected.user2 !== username))) {
                        const chatCheck = await chatService.checkChat(user.user.username, username);
                        if (chatCheck.chatExists) {
                            setChatSelected(chatCheck.chat);
                        } else {
                            const chat = await chatService.createChat(user.user.username, username);
                            setChatSelected(chat.chat)
                        }
                    }
                }
            } catch (error) {
                navigate('/error');
            }
        }

        fetchData();
    }, [username]);

    useEffect(() => {
        const infoUser = JSON.parse(window.localStorage.getItem('userLogged'));

        const getProfilePics = async (chats) => {
            try {
                const chatsWithProfilePics = [];

                const firstThreeChats = chats.slice(0, 3);

                for (const chat of firstThreeChats) {
                    const otherUserUsername = chat.user1 === infoUser.user.username ? chat.user2 : chat.user1;
                    const userChat = await userService.findUserByUsername(otherUserUsername);
                    const chatWithProfilePic = { ...chat, userProfilePic: userChat.user.profilePic };
                    chatsWithProfilePics.push(chatWithProfilePic);
                }

                setChats(chatsWithProfilePics);
            } catch (error) {
                navigate('/error');
            }
        };

        const unsubscribe = listeners.changeChatOrderListener(infoUser.user.username, (updatedChats) => {
            getProfilePics(updatedChats);
        }
        );

        return () => {
            unsubscribe();
        }
    }, [user]);

    const handleChatUser = (chat) => async () => {
        setChatSelected(chat);
    }

    const handleChangeSearch = (event) => {
        setSearchUser(event.target.value);
    };

    const handleSearch = async (event) => {
        if (!searchUser || searchResult === '') return;
        try {
            const usersResult = await userService.getUsersExceptSessionUserSearch(user.username, searchUser);
            setSearchResult(usersResult);
            setOpenDialogResults(true);
        } catch (error) {
            navigate('/error');
        }
    };

    const handleCloseDialog = () => {
        setOpenDialogResults(false);
    };

    const handleClickChat = (username) => () => {
        setOpenDialogResults(false);
        window.location.href = '/travelgram/#/chats/' + username;
    };

    const handleInfoLastMessage = (message) => {
        let messageString = '';
        if (message.message.length > 20) {
            messageString = message.message.substring(0, 20) + '...';
        } else {
            messageString = message.message;
        }
        return messageString + ' ' + calculateTimeLastMessage(message.timestamp);
    }

    const calculateTimeLastMessage = (date) => {
        let seconds, nanoseconds;

        if (date.seconds && date.nanoseconds) {
            seconds = date.seconds;
            nanoseconds = date.nanoseconds;
        } else if (date._seconds && date._nanoseconds) {
            seconds = date._seconds;
            nanoseconds = date._nanoseconds;
        } else {
            console.error("Formato de fecha no reconocido");
            return '';
        }
        const messageTimeInMillis = seconds * 1000 + Math.round(nanoseconds / 1e6);
        const messageDate = new Date(messageTimeInMillis);
        const currentDate = new Date();

        const timeInSeconds = Math.round((currentDate.getTime() - messageDate.getTime()) / 1000);

        if (timeInSeconds < 60) {
            return "(hace " + timeInSeconds + " segundos)";
        } else if (timeInSeconds < 3600) {
            return "(hace " + Math.round(timeInSeconds / 60) + " minutos)";
        } else if (timeInSeconds < 86400) {
            return "(hace " + Math.round(timeInSeconds / 3600) + " horas)";
        } else if (timeInSeconds < 604800) {
            return "(hace " + Math.round(timeInSeconds / 86400) + " días)";
        } else {
            const day = messageDate.getDate();
            const month = messageDate.getMonth() + 1;
            const year = messageDate.getFullYear();
            return "(" + day + "/" + month + "/" + year + ")";
        }
    }

    return (
        <Grid container direction="column" minHeight="70vh" >
            <Grid item>
                <Header />
            </Grid>
            <Grid item >
                <div style={{ margin: '20px' }}>
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                    >
                        Chats
                    </Typography>
                </div>
            </Grid>
            <Grid item style={{ flex: 1, display: 'flex' }}>
                <Grid item xs={6} md={4} style={{ flex: 1, margin: '10px' }}>
                    <div style={{ margin: '10px' }}>
                        <Typography
                            variant='h6'
                            fontWeight="bold"
                        >
                            Chats
                        </Typography>
                    </div>
                    <Paper elevation={3} style={{ flex: '1', marginRight: '20px', marginLeft: '10px' }}>
                        {/* Aquí se muestran los chats */}
                        {chats.length === 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <Typography >No hay chats. Busca un usuario y comienza a chatear</Typography>
                            </div>
                        ) : (
                            <List>
                                {chats.map((chat, index) => (
                                    <ListItem button key={index} onClick={handleChatUser(chat)}>
                                        <ListItemAvatar>
                                            <Avatar alt="Usuario" src={chat.userProfilePic}></Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={chat.user1 === user.username ? chat.user2 : chat.user1}
                                            secondary={chat.lastMessage ? handleInfoLastMessage(chat.lastMessage) : 'No hay mensajes'}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )}

                    </Paper>
                    <div style={{ marginTop: '20px', marginLeft: '10px', marginRight: '20px' }}>
                        <Box sx={{ flexGrow: 1, backgroundColor: '#e0fbe0' }} >
                            <InputBase
                                sx={{ ml: 1, flex: 1, color: 'black' }}
                                placeholder="Busca un usuario"
                                inputProps={{ 'aria-label': 'search user' }}
                                value={searchUser}
                                onChange={handleChangeSearch}
                            />
                            <IconButton
                                type="button"
                                sx={{ p: '10px', color: 'black' }}
                                aria-label="search"
                                onClick={handleSearch}
                                disabled={!searchUser.trim()}
                            >
                                <SearchIcon />
                            </IconButton>
                        </Box>
                    </div>
                </Grid>
                {chatSelected &&
                    <Grid item xs={6} md={8} style={{ flex: 2, margin: '10px' }}>
                        <div style={{ margin: '10px' }}>
                            <Typography
                                variant='h6'
                                fontWeight="bold"
                            >
                                Chat seleccionado
                            </Typography>
                        </div>
                        <Paper elevation={3} style={{ flex: '2', marginRight: '10px' }}>
                            <ChatView chat={chatSelected} userLogged={user} />
                        </Paper>
                    </Grid>
                }
            </Grid>
            <Dialog open={openDialogResults} onClose={handleCloseDialog}>
                <DialogTitle>Resultados de la búsqueda</DialogTitle>
                <DialogContent dividers>
                    <List>
                        {searchResult.length === 0 && <ListItem><ListItemText>Ningún nombre de usuario coincide con la búsqueda</ListItemText></ListItem>}
                        {searchResult.map((user) => (
                            <ListItem button key={user.username} onClick={handleClickChat(user.username)}>
                                <ListItemAvatar>
                                    <Avatar src={user.profilePic}>{user.username.charAt(0).toUpperCase()}</Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={user.username} secondary={user.name} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
            </Dialog>
        </Grid >
    );
}

export default Chat;