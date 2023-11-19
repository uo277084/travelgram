import SendIcon from '@mui/icons-material/Send';
import { Grid, ListItemAvatar, Paper, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import FilledInput from '@mui/material/FilledInput';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { default as React, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ScrollToBottom from 'react-scroll-to-bottom';
import listeners from '../../firebase/firebaseListeners';
import chatService from '../../services/chatService';
import userService from '../../services/userService';


function ChatView(props) {

    const navigate = useNavigate();

    const { chat, userLogged } = props;

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [user1, setUser1] = useState(null);
    const [user2, setUser2] = useState(null);

    const messagesEndRef = useRef(null);


    useEffect(() => {
        async function fetchData() {
            try {
                const messagesFirebase = await chatService.getMessages(chat.id);
                setMessages(messagesFirebase.messages);
                const user1 = await userService.findUserByUsername(chat.user1);
                setUser1(user1.user);
                const user2 = await userService.findUserByUsername(chat.user2);
                setUser2(user2.user);
            } catch (error) {
                navigate('/error');
            }
        }

        fetchData();

        const unsubscribe = listeners.configureChatListener(chat.id, (updatedMessages) => {
            setMessages(updatedMessages);
        });

        return () => {
            unsubscribe();
        };
    }, [chat]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    function scrollToBottom() {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }

    const handleChangeMessage = (event) => {
        setMessage(event.target.value);
    }

    const handleMessageSubmit = async (event) => {
        event.preventDefault();
        try {
            if (message) {
                await chatService.addMessage(userLogged.username, chat.user1 === userLogged.username ? chat.user2 : chat.user1, message);
                setMessage('');
                const lastMessageElement = document.querySelector('.messages-container > :last-child');

                if (lastMessageElement) {
                    messagesEndRef.current = lastMessageElement;
                }
            }
        } catch (error) {
            navigate('/error');
        }
    }

    const handleGetProfilePic = (username) => {
        return user1.username === username ? user1.profilePic : user2.profilePic;
    }

    const handleCalculteTime = (date) => {
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
        return messageDate.getDate() + '/' + messageDate.getMonth() + '/' + messageDate.getFullYear() + ' ' + messageDate.getHours() + ':' + (messageDate.getMinutes() < 10 ? "0" + messageDate.getMinutes() : messageDate.getMinutes());
    }

    if (!user1 || !user2) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </div>);
    }

    return (
        <Grid container>
            <div style={{ margin: '5px', textAlign: 'center', width: '100%' }}>
                <Typography variant="h6" fontWeight='bold'>
                    {chat.user1 === userLogged.username ?
                        <Link to={`/feed/${chat.user2}`} style={{ textDecoration: 'none', color: 'black' }}>
                            {chat.user2}
                        </Link>
                        :
                        <Link to={`/travelgram/#/feed/${chat.user1}`} style={{ textDecoration: 'none', color: 'black' }}>
                            {chat.user1}
                        </Link>}
                </Typography>
            </div>
            <Paper elevation={0} style={{ height: '300px', overflowY: 'auto', padding: '10px', flexGrow: 1 }}>
                <ScrollToBottom className="messages-container">
                    {messages.length > 0 ? (
                        <List sx={{ width: '100%', bgcolor: 'background.paper', padding: '5px' }}>
                            {messages.map((message, index) => (
                                <ListItem
                                    alignItems="flex-start"
                                    key={index}
                                    sx={{
                                        display: 'flex',
                                        justifyContent: message.sender === userLogged.username ? 'flex-end' : 'flex-start',
                                        '&.user-message': {
                                            flexDirection: 'row-reverse',
                                            '& .avatar': {
                                                marginLeft: '8px',
                                                marginRight: 0,
                                            },
                                            '& .message-text': {
                                                textAlign: 'right'
                                            },
                                        },
                                    }}
                                    className={message.sender === userLogged.username ? 'user-message' : ''}
                                >
                                    <ListItemAvatar className='avatar'>
                                        <Avatar alt={message.sender} src={handleGetProfilePic(message.sender)} />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={message.message} secondary={message.timestamp ? handleCalculteTime(message.timestamp) : 'Tiempo no disponible'} className="message-text"
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography >
                            No hay mensajes
                        </Typography>
                    )}
                    <div ref={messagesEndRef}></div>
                </ScrollToBottom>
            </Paper>
            <div style={{ marginTop: '10px', width: '100%' }}>
                <FilledInput
                    id="filled-adornment-comment"
                    type='text'
                    placeholder='Escribe un mensaje...'
                    fullWidth
                    value={message}
                    onChange={handleChangeMessage}
                    onKeyDown={(event) => event.key === 'Enter' && handleMessageSubmit(event)}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                onClick={handleMessageSubmit}
                                edge="end"
                                disabled={!message.trim()}
                            >
                                <SendIcon />
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </div>
        </Grid>
    );
}

export default ChatView;