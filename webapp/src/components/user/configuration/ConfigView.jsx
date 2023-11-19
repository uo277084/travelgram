import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import * as React from 'react';
import { useEffect, useState } from 'react';
import firebaseUtils from '../../../firebase/firebaseUtils';
import Config from './Config';

const defaultTheme = createTheme();
const numPhotos = 11;

function ConfigView() {
    const [backgroundImage, setBackgroundImage] = useState('');

    useEffect(() => {
        async function fetchData() {
            const urlLogo = await firebaseUtils.getPhoto('/app/randomImages/' + Math.floor(Math.random() * numPhotos) + '.png');
            setBackgroundImage(urlLogo);
        }
        fetchData();
    }, []);

    return (
        <div className="App">
            <ThemeProvider theme={defaultTheme}>
                <Grid container component="main" sx={{ height: '100vh' }}>
                    <CssBaseline />
                    <Grid
                        item
                        xs={false}
                        sm={4}
                        md={7}
                        sx={{
                            backgroundImage: `url(${backgroundImage})`,
                            backgroundRepeat: 'no-repeat',
                            backgroundColor: (t) =>
                                t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                    <Config />
                </Grid>
            </ThemeProvider>
        </div>
    );
}

export default ConfigView;
