import AddIcon from '@mui/icons-material/Add';
import { Grid, Tooltip, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Fab from '@mui/material/Fab';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import publicationService from '../../../services/publicationService';
import userService from '../../../services/userService';
import Header from '../../common/Header';
import PostByCountry from '../view/PostByCountry';

function SavedPosts() {

    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {

        async function fetchData() {
            const loggedUserJSON = window.localStorage.getItem('userLogged');
            try {
                if (loggedUserJSON) {
                    const user = JSON.parse(loggedUserJSON);

                    const savedPostsIds = await userService.getSavedPosts(user.user.username);
                    const savedPosts = [];
                    for (let i = 0; i < savedPostsIds.length; i++) {
                        const publication = await publicationService.getPublicationById(savedPostsIds[i]);
                        savedPosts.push(publication.publication);
                    }
                    setPosts(savedPosts.reverse());
                    setIsLoading(false);
                }
            } catch (error) {
                navigate('/error');
            }
        }

        fetchData();

    }, []);

    return (
        <Grid container direction="column" minHeight="70vh" >
            <Grid item>
                <Header />
            </Grid>
            <Grid item >
                <div style={{ margin: '30px' }}>
                    <Typography
                        variant="h4"
                        fontWeight="bold"
                    >
                        Publicaciones guardadas
                    </Typography>
                </div>
            </Grid>
            {isLoading && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                    <CircularProgress />
                    <Typography variant='h5'>Cargando publicaciones...</Typography>
                </div>)
            }
            {posts.length === 0 && !isLoading && (
                <Grid item align='center'>
                    <div style={{ marginTop: '20px' }}>
                        <Typography variant='h5'>No hay publicaciones guardadas</Typography>
                    </div>
                </Grid>
            )}
            {posts.length > 0 && !isLoading && (
                <Grid item container xs={12} style={{ height: '33.33%', maxWidth: '90%', margin: 'auto', justifyContent: 'center' }}>
                    {posts.map((publication, index) => (
                        <Grid item xs={12} sm={12} sx={{ p: 2 }} key={index}>
                            <PostByCountry publication={publication} savedPosts={true} />
                        </Grid>
                    ))}
                </Grid>
            )}
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

export default SavedPosts;