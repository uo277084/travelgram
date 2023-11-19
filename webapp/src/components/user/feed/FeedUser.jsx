import AddIcon from '@mui/icons-material/Add';
import { Grid, ListItemAvatar, Tooltip, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Fab from '@mui/material/Fab';
import ImageList from '@mui/material/ImageList';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import * as React from 'react';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import publicationService from '../../../services/publicationService';
import userService from '../../../services/userService';
import Header from '../../common/Header';
import PostUser from '../../publications/view/PostUser';

function Feed() {

    const navigate = useNavigate();

    const { username } = useParams();
    const [sessionUser, setSessionUser] = useState(false);

    const [follows, setFollows] = useState(false);

    const [userSession, setUserSession] = useState(null);
    const [user, setUser] = useState(null);

    const [numPosts, setNumPosts] = useState(0);
    const [numFollowers, setNumFollowers] = useState(0);
    const [numFollowing, setNumFollowing] = useState(0);

    const [posts, setPosts] = useState([]);
    const [noPosts, setNoPosts] = useState(false);

    const [openFollowersDialog, setOpenFollowersDialog] = useState(false);
    const [followers, setFollowers] = useState([]);
    const [openFollowingDialog, setOpenFollowingDialog] = useState(false);
    const [following, setFollowing] = useState([]);

    useEffect(() => {

        async function fetchData() {
            const userLogged = window.localStorage.getItem('userLogged');
            try {
                if (username && username !== JSON.parse(userLogged).user.username) {
                    setSessionUser(false);
                    const userOut = await getUser(username);
                    setUser(userOut.user);
                    const userSession = window.localStorage.getItem('userLogged');
                    const followsUser = await userService.checkFollow(userOut.user.username, JSON.parse(userSession).user.username);
                    setUserSession((JSON.parse(userSession)).user);
                    setFollows(followsUser);
                    const postsUser = await publicationService.getPublicationsByUser(username);
                    setPosts(postsUser.publications.reverse());
                    setNoPosts(postsUser.publications.length === 0)
                    setNumPosts(postsUser.publications.length);
                    getFollowers(userOut.user);
                    getFollowing(userOut.user);
                } else {
                    setSessionUser(true);
                    if (userLogged) {
                        const parseUser = JSON.parse(userLogged);
                        setUser(parseUser.user);
                        setUserSession(parseUser.user);
                        const postsUser = await publicationService.getPublicationsByUser(parseUser.user.username);
                        setPosts(postsUser.publications.reverse());
                        setNoPosts(postsUser.publications.length === 0)
                        setNumPosts(postsUser.publications.length);
                        getFollowers(parseUser.user);
                        getFollowing(parseUser.user);
                    }
                }
            } catch (error) {
                navigate('/travelgram/#/error');
            }
        }
        fetchData();
    }, [username])

    const getUser = async (username) => {
        const user = await userService.findUserByUsername(username);
        return user;
    }

    const getFollowers = async (user) => {
        const followersUsers = await userService.getFollowers(user.username);
        setNumFollowers(followersUsers.length);
        setFollowers(followersUsers);
    }

    const getFollowing = async (user) => {
        const followingUsers = await userService.getFollows(user.username)
        setNumFollowing(followingUsers.length);
        setFollowing(followingUsers);
    }

    const unfollow = async () => {
        try {
            await userService.unfollowUser(user.username, userSession.username)
            setFollows(false);
            getFollowers(user);
        } catch (error) {
            toast.error('Error al dejar de seguir al usuario', {
                duration: 1500,
            });
        }
    }

    const follow = async () => {
        try {
            await userService.followUser(user.username, userSession.username)
            setFollows(true);
            getFollowers(user);
        } catch (error) {
            toast.error('Error al seguir al usuario', {
                duration: 1500,
            });
        }
    }

    const handleClickUser = (username) => () => {
        setOpenFollowersDialog(false);
        setOpenFollowingDialog(false);
        window.location.href = '/travelgram/#/feed/' + username;
    };

    const handleCloseFollowers = () => {
        setOpenFollowersDialog(false);
    }

    const handleCloseFollowing = () => {
        setOpenFollowingDialog(false);
    }

    if (user === null || (username && username !== user.username)) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </div>);
    }

    return (
        <Grid container direction="column" minHeight="70vh">
            <Toaster />
            <Grid item>
                <Header />
            </Grid>
            <Grid container spacing={2} style={{ maxWidth: '90%', margin: 'auto', backgroundColor: '#DAF7A6', padding: 10, marginTop: '5px' }}>                <Grid item xs={12} sm={4} sx={{ p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <Avatar
                    alt="Usuario"
                    src={user.profilePic}
                    sx={{ width: 150, height: 150 }}
                    data-testid="user-avatar"
                >
                    {user.username.charAt(0).toUpperCase()}
                </Avatar>
            </Grid>

                <Grid item xs={12} sm={8} sx={{ display: 'flex', flexDirection: 'column' }}>

                    <Grid item xs={12} sx={{ p: 2, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography variant="h4" fontWeight="bold">{user.username}</Typography>
                    </Grid>
                    {!sessionUser && (
                        <Grid item xs={12} container spacing={3} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Grid item xs={12} sm={4}>
                                {follows ?
                                    (
                                        <Button variant="contained" size="medium" color='success' onClick={unfollow} >Dejar de seguir</Button>
                                    ) : (
                                        <Button variant="contained" size="medium" color='success' onClick={follow}>Seguir</Button>
                                    )}
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Button variant="contained" size="medium" color='success' onClick={() => navigate('/chats/' + user.username)}>Enviar mensaje</Button>
                            </Grid>
                        </Grid>
                    )}
                    <Grid item xs={12} container spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Grid item xs={4} sm={4} align="center">
                            <h3>Publicaciones</h3>
                            <h4>{numPosts}</h4>
                        </Grid>
                        <Grid item xs={4} sm={4} align="center">
                            <span onClick={() => setOpenFollowersDialog(true)} style={{ cursor: 'pointer' }}>
                                <h3>Seguidores</h3>
                                <h4>{numFollowers}</h4>
                            </span>
                        </Grid>
                        <Grid item xs={4} sm={4} align="center">
                            <span onClick={() => setOpenFollowingDialog(true)} style={{ cursor: 'pointer' }}>
                                <h3>Siguiendo</h3>
                                <h4>{numFollowing}</h4>
                            </span>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item container style={{ width: '100%' }} justifyContent="center" alignItems="center" >
                {!posts && (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                        <CircularProgress />
                    </div>
                )}
                {noPosts ? (
                    <div style={{ marginTop: '30px' }}>
                        <Typography
                            variant="h4"
                            fontWeight="bold"
                        >
                            No hay publicaciones
                        </Typography>
                    </div>
                ) : (
                    <ImageList cols={3} gap={8} sx={{ width: '90%', padding: 5 }}>
                        {posts.map((post, index) => (
                            <PostUser ident={index} post={post} user={userSession} />
                        ))}
                    </ImageList>
                )}
            </Grid>

            {/* Diálogo de seguidores */}

            <Dialog open={openFollowersDialog} onClose={handleCloseFollowers}>
                <DialogTitle>Seguidores</DialogTitle>
                <DialogContent dividers>
                    <List>
                        {followers.length === 0 && sessionUser && user.username === userSession.username && <ListItem><ListItemText>No tienes seguidores</ListItemText></ListItem>}
                        {followers.length === 0 && !sessionUser && <ListItem><ListItemText>No tiene seguidores</ListItemText></ListItem>}
                        {followers.length > 0 && followers.map((user) => (
                            <ListItem button key={user.username} onClick={handleClickUser(user.username)}>
                                <ListItemAvatar>
                                    <Avatar src={user.profilePic}>{user.username.charAt(0).toUpperCase()}</Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={user.username} secondary={user.name} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
            </Dialog>

            {/* Diálogo de seguidos */}

            <Dialog open={openFollowingDialog} onClose={handleCloseFollowing}>
                <DialogTitle>Seguidos</DialogTitle>
                <DialogContent dividers>
                    <List>
                        {following.length === 0 && sessionUser && user.username === userSession.username && <ListItem><ListItemText>No tienes seguidos</ListItemText></ListItem>}
                        {following.length === 0 && !sessionUser && <ListItem><ListItemText>No tiene seguidos</ListItemText></ListItem>}
                        {following.length > 0 && following.map((user) => (
                            <ListItem button key={user.username} onClick={handleClickUser(user.username)}>
                                <ListItemAvatar>
                                    <Avatar src={user.profilePic}>{user.username.charAt(0).toUpperCase()}</Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={user.username} secondary={user.name} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
            </Dialog>

            <Grid item xs={12} style={{ alignSelf: 'flex-end', position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
                <Tooltip title="Añadir publicación" aria-label="add">
                    <Fab color="primary" aria-label="add" href='/travelgram/#/addPublication'>
                        <AddIcon />
                    </Fab>
                </Tooltip>
            </Grid>
        </Grid >

    );
}

export default Feed;