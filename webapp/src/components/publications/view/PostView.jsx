import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import SendIcon from '@mui/icons-material/Send';
import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Rating, Tooltip, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FilledInput from '@mui/material/FilledInput';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MobileStepper from '@mui/material/MobileStepper';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';
import { format } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import ScrollToBottom from 'react-scroll-to-bottom';
import firebaseUtils from '../../../firebase/firebaseUtils';
import publicationService from '../../../services/publicationService';
import userService from '../../../services/userService';

const PostView = (props) => {

    const navigate = useNavigate();

    const theme = useTheme();
    const [activeStep, setActiveStep] = useState(0);
    const [maxSteps, setMaxSteps] = useState(0);

    const [loading, setLoading] = useState(true);
    const [loadingComments, setLoadingComments] = useState(true);

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setLoading(true)
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
        setLoading(true)
    };

    function scrollToBottom() {
        if (commentEndRef.current) {
            commentEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }

    const { post, sessionUser, savedPosts } = props;

    const dateTripStart = format(new Date(post.dateTripStart), 'dd/MM/yyyy');
    const dateTripFinish = format(new Date(post.dateTripFinish), 'dd/MM/yyyy');
    const [comment, setComment] = useState('');
    const [like, setLike] = useState(false);
    const [likes, setLikes] = useState(0);
    const [saved, setSaved] = useState(false);
    const [comments, setComments] = useState([]);
    const [user, setUser] = useState(null);
    const [imagesUrl, setImagesUrl] = useState([]);

    useEffect(() => {

        async function fetchData() {
            try {
                const userSession = window.localStorage.getItem('userLogged');
                const userParsed = JSON.parse(userSession);
                setUser(userParsed.user);
                const liked = await publicationService.checkLike(post.id, userParsed.user.username);
                setLike(liked.success);
                const likesPost = await publicationService.countLikes(post.id);
                setLikes(likesPost.count);
                const isSaved = await userService.checkSavedPost(userParsed.user.username, post.id);
                setSaved(isSaved);
                setImagesUrl(post.images);
                setMaxSteps(post.images.length);

                const commentsPost = await publicationService.getCommentsOfPublication(post.id);

                const avatarUrlPromises = commentsPost.comments.map(comment => handleGetProfilePic(comment.user));
                const avatarUrls = await Promise.all(avatarUrlPromises);
                const commentsWithAvatarUrls = commentsPost.comments.map((comment, index) => {
                    return { ...comment, commenterAvatarUrl: avatarUrls[index] };
                });

                setComments(commentsWithAvatarUrls);
                setLoadingComments(false);
            } catch (error) {
                navigate('/travelgram/#/error');
            }
        }

        fetchData();
    }, [post.id, sessionUser.username])

    const commentEndRef = useRef(null);

    useEffect(() => {
        scrollToBottom();
    }, [comments]);

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    }

    const handleCommentSubmit = async (event) => {
        event.preventDefault();
        try {
            const commentAdded = await publicationService.addCommentToAPublication(post.id, sessionUser.username, comment);
            const commenterAvatarUrl = await handleGetProfilePic(sessionUser.username);
            setComments([...comments, { ...commentAdded.comment, commenterAvatarUrl }]);
            setComment('');
            const lastCommentElement = document.querySelector('.comments-container > :last-child');
            if (lastCommentElement) {
                commentEndRef.current = lastCommentElement;
            }
        } catch (error) {
            toast.error("No se ha podido añadir el comentario", {
                duration: 1500,
            })
        }
    }

    const handleLike = async () => {
        if (!like) {
            try {
                await publicationService.addLike(post.id, sessionUser.username);
                setLike(!like);
                setLikes(likes + 1);
            } catch (error) {
                toast.error("No se ha podido dar like a la publicación", {
                    duration: 1500,
                })
            }
        } else {
            try {
                await publicationService.removeLike(post.id, sessionUser.username);
                setLike(!like);
                setLikes(likes - 1);
            } catch (error) {
                toast.error("No se ha podido quitar el like a la publicación", {
                    duration: 1500,
                })
            }
        }
    }

    const handleSave = async () => {
        if (saved) {
            try {
                await userService.unsavePost(user.username, post.id);
                setSaved(!saved);
                if (savedPosts) {
                    window.location.reload();
                }
            } catch (error) {
                toast.error("No se ha podido descartar la publicación", {
                    duration: 1500,
                })
            }
        } else {
            try {
                await userService.savePost(user.username, post.id);
                setSaved(!saved);
            } catch (error) {
                toast.error("No se ha podido guardar la publicación", {
                    duration: 1500,
                })
            }
        }
    }

    const handleRemoveComment = (idComment) => async () => {
        try {
            const commentRemoved = await publicationService.removeCommentFromAPublication(post.id, idComment);
            if (commentRemoved.success) {
                setComments(comments.filter(comment => comment.id !== idComment));
            }
        } catch (error) {
            toast.error("No se ha podido eliminar el comentario", {
                duration: 1500,
            })
        }
    }

    const getUser = async (username) => {
        try {
            const user = await userService.findUserByUsername(username);
            return user.user;
        } catch (error) {
            navigate('/travelgram/#/error');
        }
    }

    const handleGetProfilePic = async (username) => {
        try {
            const user = await getUser(username);
            const profilePic = user.profilePic;
            return profilePic;
        } catch (error) {
            toast.error("No se ha podido obtener la imagen de perfil", {
                duration: 1500,
            })
            return '';
        }
    };

    const handleRemovePost = (idPost) => async () => {
        try {
            await publicationService.deletePublication(idPost);
            await userService.deletePublicationOfSavedPosts(idPost);
            if (post.images.length > 0) {
                await firebaseUtils.removePublicationPhotos(idPost);
            }
            window.location.reload();
        } catch (error) {
            window.location.href = '/travelgram/#/error';
        }
    }

    const calculateTimeComment = (date) => {
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
        const commentTimeInMillis = seconds * 1000 + Math.round(nanoseconds / 1e6);
        const commentDate = new Date(commentTimeInMillis);
        const currentDate = new Date();

        const timeInSeconds = Math.round((currentDate.getTime() - commentDate.getTime()) / 1000);

        if (timeInSeconds < 60) {
            return "(hace " + timeInSeconds + " segundos)";
        } else if (timeInSeconds < 3600) {
            return "(hace " + Math.round(timeInSeconds / 60) + " minutos)";
        } else if (timeInSeconds < 86400) {
            return "(hace " + Math.round(timeInSeconds / 3600) + " horas)";
        } else if (timeInSeconds < 604800) {
            return "(hace " + Math.round(timeInSeconds / 86400) + " días)";
        } else {
            const day = commentDate.getDate();
            const month = commentDate.getMonth() + 1;
            const year = commentDate.getFullYear();
            return "(" + day + "/" + month + "/" + year + ")";
        }
    }

    if (!user) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </div>);
    }

    return (
        <>
            <DialogTitle>
                <Toaster />
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        Publicación de&nbsp;
                        <Link to={`/travelgram/#/feed/${post.user}`} style={{ textDecoration: 'none', color: 'black' }}>
                            {post.user}
                        </Link>
                        &nbsp;
                        {calculateTimeComment(post.datePublication)}
                    </Grid>
                    {post.user === user.username && (
                        <Grid item>
                            <Tooltip title="Eliminar publicación" placement="top">
                                <IconButton onClick={handleRemovePost(post.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    )}
                </Grid>
            </DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Paper elevation={0} style={{ height: '400px', overflowY: 'auto', padding: '10px' }}>
                            <div style={{ margin: '10px' }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Typography variant='h3'>{post.country}</Typography>
                                        <Rating name="read-only" value={post.rating} readOnly precision={0.5} />
                                    </Grid>

                                    {likes > 0 &&
                                        <Grid item xs={12} container>
                                            <Typography variant='h7'>{likes} me gusta</Typography>

                                        </Grid>
                                    }
                                    <Grid item xs={12} container>
                                        <IconButton
                                            onClick={handleLike}
                                        >
                                            {like ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                        </IconButton>
                                        <IconButton
                                            onClick={handleSave}
                                        >
                                            {saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                                        </IconButton>
                                    </Grid>
                                </Grid>
                                {imagesUrl.length > 0 && (
                                    <Box sx={{ maxWidth: '80%', flexGrow: 1 }}>
                                        <div style={{ marginTop: '20px' }}>
                                            {loading && <Skeleton variant="rectangular" width="100%" height={200} />}
                                            <img
                                                src={imagesUrl[activeStep]}
                                                alt="Imagen de la publicación"
                                                style={{ visibility: loading ? 'hidden' : 'visible', height: loading ? '0px' : 'auto', width: loading ? '0px' : '100%' }}
                                                onLoad={() => setLoading(false)}
                                            />
                                        </div>
                                        <MobileStepper
                                            sx={{ bgcolor: 'grey.200' }}
                                            steps={maxSteps}
                                            position="static"
                                            activeStep={activeStep}
                                            nextButton={
                                                <Button size="small" onClick={handleNext} disabled={activeStep === imagesUrl.length - 1}>
                                                    Next
                                                    {theme.direction === 'rtl' ? (
                                                        <KeyboardArrowLeft />
                                                    ) : (
                                                        <KeyboardArrowRight />
                                                    )}
                                                </Button>
                                            }
                                            backButton={
                                                <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                                                    {theme.direction === 'rtl' ? (
                                                        <KeyboardArrowRight />
                                                    ) : (
                                                        <KeyboardArrowLeft />
                                                    )}
                                                    Back
                                                </Button>
                                            }
                                        />
                                    </Box>
                                )}
                                <div style={{ marginTop: '20px' }}>
                                    <Typography variant='h4'>Ciudades</Typography>
                                    <ul>
                                        {post.cities.map((city, index) => (
                                            <li key={index}>
                                                {city}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div style={{ marginTop: '20px' }}>
                                    <Typography variant='h4'>Periodo del viaje</Typography>
                                    <p>Desde: {dateTripStart}</p>
                                    <p>Hasta: {dateTripFinish}</p>
                                </div>

                                {post.description !== "" &&
                                    <div style={{ marginTop: '20px' }}>
                                        <Typography variant='h4'>Descripción</Typography>
                                        <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                                            {post.description}
                                        </pre>
                                    </div>
                                }
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <div style={{ margin: '10px' }}>
                            <Typography variant='h3'>Comentarios</Typography>
                        </div>
                        <Paper elevation={0} style={{ height: '300px', overflowY: 'auto', padding: '10px' }}>
                            <ScrollToBottom className="comments-container">
                                <div style={{ margin: '10px' }}>
                                    {loadingComments && (
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                                            <CircularProgress />
                                        </div>
                                    )}
                                    {(!post || comments === null || comments.length === 0) && !loadingComments ? (
                                        <h3>No hay comentarios</h3>
                                    ) : (
                                        <List>
                                            {
                                                comments.map((comment, index) => (
                                                    <ListItem key={index}>
                                                        <ListItemAvatar >
                                                            <Avatar alt="Usuario" src={comment.commenterAvatarUrl}>{comment.user.charAt(0).toUpperCase()}</Avatar>
                                                        </ListItemAvatar>
                                                        <ListItemText primary={comment.comment} secondary={comment.user + " " + calculateTimeComment(comment.timestamp)} />
                                                        {(comment.user === user.username ||
                                                            post.user === user.username) && (
                                                                <Tooltip title="Eliminar comentario" placement="top">
                                                                    <IconButton edge="end" aria-label="delete" onClick={handleRemoveComment(comment.id)}>
                                                                        <DeleteForeverIcon />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            )}
                                                    </ListItem>
                                                ))
                                            }
                                        </List>
                                    )}
                                </div>
                            </ScrollToBottom>
                        </Paper>
                        <div style={{ marginTop: '10px' }}>
                            <FilledInput
                                id="filled-adornment-comment"
                                type='text'
                                placeholder='Escribe un comentario...'
                                fullWidth
                                value={comment}
                                onChange={handleCommentChange}
                                onKeyDown={(event) => event.key === 'Enter' && handleCommentSubmit(event)}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleCommentSubmit}
                                            edge="end"
                                            disabled={!comment.trim()}
                                        >
                                            <SendIcon />
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </div>
                    </Grid>
                </Grid>
            </DialogContent >
        </>
    );
};

export default PostView;
