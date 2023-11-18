import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import * as React from 'react';
import { useEffect, useState } from 'react';
import Register from './Register';

const defaultTheme = createTheme();
const numPhotos = 11;

function RegisterView() {
    const [backgroundImage, setBackgroundImage] = useState('');

    useEffect(() => {
        setBackgroundImage("../../../images/randomPhotos/" + Math.floor(Math.random() * numPhotos) + ".jpg");
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
                    <Register></Register>
                </Grid>
            </ThemeProvider>
        </div>
    );
}

export default RegisterView;
