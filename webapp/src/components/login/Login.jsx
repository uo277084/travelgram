import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import firebaseUtils from '../../firebase/firebaseUtils.js';
import userService from '../../services/userService.js';
import './Login.css';

function Login() {

    const [logo, setLogo] = useState('');

    useEffect(() => {
        const userLogged = window.localStorage.getItem('userLogged');
        if (userLogged) {
            window.location.href = '/home';
        }

        async function fetchData() {
            const urlLogo = await firebaseUtils.getPhoto('/app/logos/logoVerdeOscuro.png');
            setLogo(urlLogo);
        }
        fetchData();

    }, [])

    const [showPassword, setShowPassword] = useState(false);
    const [isChecking, setIsChecking] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const checkUserAndPassword = async (usernameOrEmail, password) => {

        const response = await userService.login(usernameOrEmail, password);
        return response;

    };

    const checkEmailOrUsername = async () => {
        if (email && password) {
            try {
                let userLogin = await checkUserAndPassword(email, password);
                if (userLogin.success) {
                    userLogin.timestamp = new Date();
                    window.localStorage.setItem('userLogged', JSON.stringify(userLogin));
                }
                return true;
            } catch (error) {
                toast.error('Error al iniciar sesión', {
                    duration: 1500,
                });
                return false;
            }
        } else {
            toast.error('Falta completar algún campo', {
                duration: 1500,
            });
            return false;
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setIsChecking(true);
        let isAllOk = await checkEmailOrUsername();
        setIsChecking(false);
        if (isAllOk) {
            window.location.href = '/home';
        }
    };

    return (
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
            <div><Toaster /></div>
            <Box
                sx={{
                    my: 8,
                    mx: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <img src={logo} alt="Logo de Travelgram" />
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Iniciar sesión
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="login"
                        data-testid="login"
                        label="Email o nombre de usuario"
                        name="email"
                        value={email}
                        autoComplete="email/usuario"
                        onChange={handleEmailChange}
                        autoFocus
                    />
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel htmlFor="outlined-adornment-password">Contraseña *</InputLabel>
                        <OutlinedInput
                            name="password"
                            label="Contraseña"
                            value={password}
                            id="password"
                            data-testid="password"
                            onChange={handlePasswordChange}
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                    {isChecking && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <CircularProgress />
                            <Typography variant="body2">
                                Se están subiendo las imágenes. Este proceso podría tardar.
                            </Typography>
                        </div>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Iniciar sesión
                    </Button>
                    <Grid container>
                        <Grid item>
                            <Link href="/register" variant="body2">
                                ¿No tienes cuenta? Regístrate
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box >
        </Grid >
    );
}

export default Login;