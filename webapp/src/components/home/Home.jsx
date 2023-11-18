import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import { Grid, TextField, Tooltip, Typography } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Fab from '@mui/material/Fab';
import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import countriesData from '../../json/countriesTranslated.json';
import publicationService from '../../services/publicationService';
import Header from '../common/Header';
import PostByCountry from '../publications/view/PostByCountry';

function Home() {

    const navigate = useNavigate();

    const [mapa, setMapa] = useState('');
    const [recommendedPosts, setRecommendedPosts] = useState([]);
    const [user, setUser] = useState(null);
    useEffect(() => {
        setMapa("../../../images/mapamundi.png");
        async function fetchData() {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userLogged'));
                setUser(userInfo);
                const recommendedPosts = await publicationService.getRecommendPosts(userInfo.user.username);
                setRecommendedPosts(recommendedPosts.publications);
            } catch (error) {
                navigate('/error');
            }
        }
        fetchData();
    }, []);

    const [country, setCountry] = useState('');
    const [errorCountry, setErrorCountry] = useState(false);



    const [publications, setPublications] = useState([]);
    const [noPublications, setNoPublications] = useState(false);

    const handleCountryChange = async (event, value) => {
        setCountry(value);
        setErrorCountry(false);
        setNoPublications(false);
        setPublications([])
    };

    const handleInputChange = (event, newValue) => {
        if (!newValue) {
            setCountry('');
            setErrorCountry(true);
        }
    };

    const checkCountry = () => {
        if (country === '') {
            setErrorCountry(true);
            return false;
        }
        return true;
    };

    const handleClickSend = async () => {
        if (!checkCountry) {
            toast.error('Tienes que seleccionar un país', {
                duration: 1500,
            });
        } else {
            var publicationsObject = await publicationService.getPublicationsByCountry(country.name_es, user.user.username);
            setPublications(publicationsObject.publications);
            setNoPublications(publicationsObject.publications.length === 0);
        }
    };

    return (
        <Grid container direction="column" minHeight="70vh" >
            <Toaster />
            <Grid item>
                <Header />
            </Grid>
            <Grid item container xs={12} style={{ height: '33.33%', backgroundColor: '#DAF7A6', maxWidth: '90%', margin: 'auto' }}>
                <Grid item xs={12} sm={6} sx={{ p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ marginTop: '30px' }}></div>
                    <Typography variant="h4" gutterBottom fontWeight="bold">
                        Explora un nuevo lugar
                    </Typography>
                    <div style={{ marginTop: '40px' }}></div>
                    <Typography variant="h7" gutterBottom>
                        Busca el nombre del país o búscalo en el mapa
                    </Typography>
                    <div style={{ marginTop: '40px' }}></div>
                    <Autocomplete
                        disablePortal
                        autoFocus
                        id="countries"
                        data-testid="countries"
                        sx={{ width: '80%' }}
                        options={countriesData.countries}
                        getOptionLabel={(option) => option.name_es}
                        onChange={handleCountryChange}
                        onInputChange={handleInputChange}
                        onKeyDown={(ev) => { if (ev.key === 'Enter') { handleClickSend() } }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Nombre del país"
                                error={errorCountry}
                                helperText={errorCountry ? 'Tienes que seleccionar un país' : ''}
                            />
                        )}
                    />
                    <div style={{ marginTop: '40px' }}></div>
                    <Button
                        variant="contained"
                        endIcon={<SendIcon />}
                        data-testid="sendButton"
                        disabled={country === '' || country === null || errorCountry}
                        onClick={handleClickSend}>
                        Buscar
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img src={mapa} alt="map" style={{ width: '100%', height: '100%' }} />
                </Grid>
            </Grid>
            <Grid item container xs={12} style={{ height: '33.33%', maxWidth: '90%', margin: 'auto', justifyContent: 'center' }}>
                {noPublications && country !== '' &&
                    <div style={{ marginTop: '30px' }}>
                        <Typography
                            variant="h4"
                            fontWeight="bold"
                        >
                            No hay publicaciones de {country.name_es}
                        </Typography>
                    </div>
                }
                {publications && publications.length > 0 && country !== '' &&
                    <div style={{ marginTop: '30px' }}>
                        <Typography
                            variant="h4"
                            fontWeight="bold"
                        >
                            Publicaciones de {country.name_es}
                        </Typography>
                    </div>
                }
                {publications && publications.length > 0 && country !== '' && (
                    publications.map((publication, index) => (
                        <Grid item xs={12} sm={12} sx={{ p: 2 }} key={index}>
                            <PostByCountry publication={publication} savedPosts={false} />
                        </Grid>
                    )))
                }
            </Grid>
            <Grid item container xs={12} style={{ height: '33.33%', maxWidth: '90%', margin: 'auto', justifyContent: 'center' }}>
                {recommendedPosts && recommendedPosts.length > 0 &&
                    <div style={{ marginTop: '30px' }}>
                        <Typography
                            variant="h4"
                            fontWeight="bold"
                        >
                            Publicaciones recomendadas
                        </Typography>
                    </div>
                }
                {recommendedPosts && recommendedPosts.length > 0 && (
                    recommendedPosts.map((publication, index) => (
                        <Grid item xs={12} sm={12} sx={{ p: 2 }} key={index}>
                            <PostByCountry publication={publication} savedPosts={false} />
                        </Grid>
                    )))
                }
            </Grid>
            <Grid item xs={12} style={{ alignSelf: 'flex-end', position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
                <Tooltip title="Añadir publicación" aria-label="add">
                    <Fab color="primary" aria-label="add" href='/addPublication'>
                        <AddIcon />
                    </Fab>
                </Tooltip>
            </Grid>
        </Grid >
    );
}

export default Home;