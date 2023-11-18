import { Dialog } from '@mui/material';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PostView from './PostView';

const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
});

function PostByCountry(props) {
    const { publication, savedPosts } = props;

    const [defaultImage, setDefaultImage] = useState('');

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userLogged'));
        setUserSession(user.user);

        setDefaultImage("../../../../images/fotoPorDefecto.jpg");
    }, []);

    const [userSession, setUserSession] = useState(null);
    const [openDialogPost, setOpenDialogPost] = useState(false);

    const handleCloseDialog = () => {
        setOpenDialogPost(false);
    }

    const handleButton = () => {
        setOpenDialogPost(true);
    }

    const handleGetPhoto = () => {
        if (publication.images.length > 0) {
            return publication.images[0];
        } else {
            return defaultImage;
        }
    }

    return (
        <Paper
            sx={{
                p: 2,
                margin: 'auto',
                width: '85%',
                flexGrow: 1,
                backgroundColor: '#f6fef6'
            }}
        >
            <Grid container spacing={2}>
                <Grid item>
                    <Img
                        alt={publication.country}
                        src={handleGetPhoto()}
                        sx={{ width: 128, height: 128, objectFit: 'cover' }}
                    />
                </Grid>
                <Grid item xs={12} sm container>
                    <Grid item xs container direction="column" spacing={2}>
                        <Grid item xs>
                            <Typography gutterBottom variant="subtitle1" component="div">
                                {publication.country}
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                <Link to={`/feed/${publication.user}`} style={{ textDecoration: 'none', color: 'black' }}>
                                    {publication.user}
                                </Link>
                            </Typography>
                            {publication.description !== '' &&
                                <TextField
                                    multiline
                                    maxRows={3}
                                    value={publication.description}
                                    variant='standard'
                                    fullWidth
                                    InputProps={{
                                        readOnly: true,
                                    }}
                                />}

                        </Grid>
                        <Grid item>
                            <Button variant="text" color='success' onClick={handleButton}>Ver</Button>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Rating name="ratingPost" value={publication.rating} precision={0.5} readOnly />
                    </Grid>
                </Grid>
            </Grid>
            <Dialog
                open={openDialogPost}
                onClose={handleCloseDialog}
                fullWidth
                maxWidth="80%"
            >
                <PostView post={publication} sessionUser={userSession} savedPosts={savedPosts} />
            </Dialog>
        </Paper>
    );
}

export default PostByCountry;