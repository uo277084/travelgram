import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Rating from '@mui/material/Rating';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import esLocale from 'date-fns/locale/es';
import { React, useEffect, useState } from 'react';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import firebaseUtils from '../../../firebase/firebaseUtils';
import countriesData from '../../../json/countriesTranslated.json';
import publicationService from '../../../services/publicationService.js';
import CarouselPhotos from './CarouselPhotos';

function AddPublication() {

    const [logo, setLogo] = useState('');

    useEffect(() => {
        async function fetchData() {
            const urlLogo = await firebaseUtils.getPhoto('/app/logos/logoVerdeOscuro.png');
            setLogo(urlLogo);
        }
        fetchData();
    }, []);

    const navigate = useNavigate();

    //Errors
    const [errorCountry, setErrorCountry] = useState(false);
    const [errorCities, setErrorCities] = useState(false);
    const [errorDateTrip, setErrorDateTrip] = useState(false);
    const [errorRating, setErrorRating] = useState(false);
    const [errorImages, setErrorImages] = useState(false);

    const [user, setUser] = useState(null);
    const [country, setCountry] = useState(null);
    const [cities, setCities] = useState([]);
    const [rating, setRating] = useState(0.0);
    const [description, setDescription] = useState('');
    const [dateTripStart, setDateTripStart] = useState(null);
    const [dateTripFinish, setDateTripFinish] = useState(null);
    const [images, setImages] = useState([]);
    const [selectedDateRange, setSelectedDateRange] = useState([
        {
            startDate: new Date(),
            endDate: null,
            key: 'selection',
        },
    ]);
    const [previewImages, setPreviewImages] = useState([]);

    const handleImageChange = (event) => {
        const selectedImages = Array.from(event.target.files);
        setImages(selectedImages);

        setErrorImages(false);

        const imagePreviews = selectedImages.map((image) => URL.createObjectURL(image));
        setPreviewImages(imagePreviews);
    };

    let hasErrors = false;

    useEffect(() => {
        const userLogged = window.localStorage.getItem('userLogged');
        if (userLogged) {
            setUser((JSON.parse(userLogged)).user);
        }
    }, [])

    useEffect(() => {
        if (country != null) {
            fetch(`http://api.geonames.org/searchJSON?country=${country.code_2}&username=uo277084`)
                .then(response => response.json())
                .then(data => {
                    const citiesAPI = Array.from(new Set(data.geonames
                        .filter(city => city.name !== country.name_en)
                        .map(city => city.name)
                    ));
                    setCitiesOptions(citiesAPI);
                })
                .catch(error => {
                    navigate('/travelgram/#/error');
                });
        }
    }, [country]);

    const [citiesOptions, setCitiesOptions] = useState([]);

    const handleDateRangeChange = (ranges) => {
        setSelectedDateRange([ranges.selection]);
        setDateTripStart(ranges.selection.startDate);
        setDateTripFinish(ranges.selection.endDate);
        setErrorDateTrip(false);
    };

    const handleCountryChange = async (event, value) => {
        let oldcountry = country;
        setCountry(value);
        setErrorCountry(false);
        if (value === null || value === undefined || value === '' || value !== oldcountry) {
            setCitiesOptions([]);
            setCities([]);
        }
    };

    const handleCitiesChange = (event, value) => {
        setCities(value);
        setErrorCities(false);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const handleRatingChange = (event) => {
        const newValue = parseFloat(event.target.value);
        setRating(newValue);
        setErrorRating(false);
    };

    const checkAllFields = () => {
        if (!country) {
            setErrorCountry(true);
            hasErrors = true;
        }
        if (!cities || cities.length === 0) {
            setErrorCities(true);
            hasErrors = true;
        }
        if (!dateTripStart || !dateTripFinish) {
            setErrorDateTrip(true);
            hasErrors = true;
        }
        if (!rating) {
            setErrorRating(true);
            hasErrors = true;
        }
        return !hasErrors;
    }

    const [isUploading, setIsUploading] = useState(false);

    const handleUploadImages = async (publicationId) => {
        try {
            setIsUploading(true);
            const imagesURLs = await firebaseUtils.uploadImagesToPublication(images, publicationId);
            await publicationService.addImagesToAPublication(publicationId, imagesURLs);
            setIsUploading(false);
            toast.success('Imágenes subidas con éxito', {
                duration: 1500,
            });
            window.location.href = '/travelgram/#/feed/' + user.username;
        } catch (error) {
            setIsUploading(false);
            toast.error('Hubo un error al subir las imágenes', {
                duration: 1500,
            });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        let isAllOk = checkAllFields();
        if (isAllOk) {
            if (images.length > 10) {
                setErrorImages(true);
                toast.error('Puedes subir máximo 10 imágenes', {
                    duration: 1500,
                });
                return;
            } else {
                try {
                    const publication = await publicationService.addPublication(country.name_es, cities, rating, description, dateTripStart, dateTripFinish, user.username);
                    if (images.length > 0) {
                        handleUploadImages(publication.publication.id);
                    } else {
                        toast.success('Publicación creada con éxito', {
                            duration: 1500,
                        });
                        window.location.href = '/travelgram/#/feed/' + user.username;
                    }
                } catch (error) {
                    navigate('/travelgram/#/error');
                }
            }
        } else {
            toast.error('Falta completar algún campo obligatorio', {
                duration: 1500,
            });
        }
    }

    return (

        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
            <Toaster />
            <Box
                sx={{
                    my: 8,
                    mx: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'center',
                    alignItems: 'center',
                }}
            >
                <Link href="/travelgram/#/home" variant="body2">
                    Volver
                </Link>
                <img src={logo} alt="Logo de Travelgram" />
                <Typography component="h1" variant="h2">
                    Añade una nueva publicación
                </Typography>
                <p>Los campos marcados con * son obligatorios </p>
                <div style={{ marginTop: '30px' }}></div>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <Grid container spacing={3} >
                        <Grid item xs={12}>
                            <Typography variant="h5">País visitado *</Typography>
                            <Autocomplete
                                disablePortal
                                autoFocus
                                id="countries"
                                data-testid="countries"
                                sx={{ width: '60%', margin: 'auto' }}
                                options={countriesData.countries}
                                getOptionLabel={(option) => option.name_es}
                                onChange={handleCountryChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Nombre del país"
                                        error={errorCountry}
                                        helperText={errorCountry ? 'Tienes que seleccionar un país' : ''}
                                    />
                                )}
                            />

                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h5">Ciudades visitadas *</Typography>
                            <Autocomplete
                                id="cities"
                                sx={{ width: '60%', margin: 'auto' }}
                                multiple
                                data-testid="cities"
                                options={citiesOptions}
                                value={cities}
                                onChange={handleCitiesChange}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Nombre de las ciudades"
                                        error={errorCities}
                                        helperText={errorCities ? 'Tienes que seleccionar al menos una ciudad' : ''}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h5">Periodo del viaje *</Typography>
                            <DateRangePicker
                                locale={esLocale}
                                showSelectionPreview={false}
                                maxDate={new Date()}
                                ranges={selectedDateRange}
                                onChange={handleDateRangeChange}
                            />
                            {errorDateTrip && <p style={{ color: 'red', fontSize: '12px' }}>Tienes que seleccionar un rango de fechas</p>}
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h5">Puntuación del viaje *</Typography>
                            <Rating
                                name="half-rating"
                                precision={0.5}
                                data-testid="rating"
                                size='large'
                                value={rating}
                                onChange={handleRatingChange}
                            />
                            {errorRating && <p style={{ color: 'red', fontSize: '12px' }}>Tienes que seleccionar una puntuación</p>}
                        </Grid>
                        <Grid item xs={12} sx={{ width: '80%' }}>
                            <Typography variant="h5">Imágenes del viaje</Typography>
                            <div style={{ marginTop: '10px' }}></div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                data-testid="images"
                                multiple
                            />
                            <div style={{ marginTop: '15px' }}></div>
                            {images.length > 1 && <Typography variant="h6">Imágenes seleccionadas</Typography>}
                            {images.length === 1 && <Typography variant="h6">Imagen seleccionadas</Typography>}
                            {images.length > 0 && (
                                <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <CarouselPhotos selectedImages={images} imagesPreview={previewImages} />
                                </div>
                            )}
                            {errorImages && <p style={{ color: 'red', fontSize: '12px' }}>Puedes subir máximo 10 imágenes.</p>}
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant="h5">Descripción</Typography>
                            <TextField
                                margin="normal"
                                value={description}
                                onChange={handleDescriptionChange}
                                fullWidth
                                name="description"
                                data-testid="description"
                                label="Descripción"
                                type="text"
                                id="description"
                                multiline
                                maxRows={6}
                                sx={{ width: '60%' }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            {isUploading && (
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
                                    <CircularProgress />
                                    <Typography variant="body2">
                                        Se están subiendo las imágenes. Este proceso podría tardar.
                                    </Typography>
                                </div>
                            )}
                            <Button
                                type="submit"
                                variant="contained"
                                sx={{ mt: 3, mb: 2, width: '60%' }}
                            >
                                Añadir publicación
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Grid >
    );
}

export default AddPublication;