import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { FormHelperText } from '@mui/material';
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
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import firebaseUtils from '../../firebase/firebaseUtils.js';
import userService from '../../services/userService.js';

function Register() {

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [logo, setLogo] = useState('');

    useEffect(() => {
        async function fetchData() {
            const urlLogo = await firebaseUtils.getPhoto('/app/logos/logoVerdeOscuro.png');
            setLogo(urlLogo);
        }
        fetchData();
    }, []);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [birthDate, setBirthDate] = useState(null);

    const [isFormatValidEmail, setFormatValidEmail] = useState(true);
    const [isValidEmail, setValidEmail] = useState(true);
    const [isValidPassword, setValidPassword] = useState(true);
    const [isValidUsername, setValidUsername] = useState(true);

    let hasErrors = false;

    const maxDate = dayjs().subtract(16, 'year');

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleBirthDateChange = (newValue) => {
        setBirthDate(newValue);
    };

    const isEmailValid = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const checkUsedEmail = async (email) => {
        try {
            const response = await userService.checkEmail(email);
            return response.emailExists;
        } catch (error) {
            console.error(error);
        }
    };

    const checkUsedUsername = async (username) => {
        try {
            const response = await userService.findUserByUsername(username);
            return response.userExists;
        } catch (error) {
            console.error(error);
        }
    };

    const checkFields = async () => {
        if (name && email && username && password && birthDate) {
            if (!isEmailValid(email)) {
                setFormatValidEmail(false);
                hasErrors = true;
            } else {
                setFormatValidEmail(true);
            }
            const emailExists = await checkUsedEmail(email);
            if (emailExists) {
                setValidEmail(false);
                hasErrors = true;
            } else {
                setValidEmail(true);
            }
            if (password.length < 8) {
                setValidPassword(false);
                hasErrors = true;
            } else {
                setValidPassword(true);
            }
            let usedUsername;
            try {
                usedUsername = await checkUsedUsername(username);
                if (usedUsername) {
                    setValidUsername(false);
                    hasErrors = true;
                } else {
                    setValidUsername(true);
                }
            } catch (error) {
                console.error(error);
            }
            if (!hasErrors) {
                return true;
            }
        } else {
            toast.error('Falta completar algún campo', {
                duration: 1500,
            });
        }
        return false;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            let addUser = await checkFields();

            if (addUser) {
                setIsUploading(true);
                let userRegister = await userService.addUser(name, email, username, password, birthDate);
                window.localStorage.setItem('userLogged', JSON.stringify(userRegister));
                setIsUploading(false);
                window.location.href = '/travelgram/#/home';
            }
        } catch (error) {
            navigate('/error');
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
                <Link href="/travelgram/#/" variant="body2">
                    Volver
                </Link>
                <img src={logo} alt="Logo de Travelgram" />
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Regístrate
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        data-testid="name"
                        label="Nombre completo"
                        name="name"
                        value={name}
                        autoComplete="name"
                        onChange={handleNameChange}
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        data-testid="username"
                        label="Nombre de usuario"
                        name="username"
                        value={username}
                        autoComplete="username"
                        onChange={handleUsernameChange}
                        error={!isValidUsername}
                        helperText={!isValidUsername ? 'El nombre de usuario no está disponible' : ''}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        data-testid="email"
                        label="Email"
                        name="email"
                        value={email}
                        autoComplete="email"
                        onChange={handleEmailChange}
                        error={!isFormatValidEmail || !isValidEmail}
                        helperText={!isFormatValidEmail ? 'El correo no es válido' : '' || !isValidEmail ? 'El correo ya está en uso' : ''}
                    />
                    <FormControl variant="outlined" fullWidth margin='normal'>
                        <InputLabel htmlFor="outlined-adornment-password">Contraseña *</InputLabel>
                        <OutlinedInput
                            name="password"
                            label="Contraseña"
                            value={password}
                            id="password"
                            data-testid="password"
                            onChange={handlePasswordChange}
                            error={!isValidPassword}
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
                        {isValidPassword ? null : (
                            <FormHelperText error>
                                La contraseña debe tener al menos 8 caracteres.
                            </FormHelperText>
                        )}
                    </FormControl>
                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                        <DatePicker
                            required
                            label="Fecha de nacimiento *"
                            value={birthDate}
                            onChange={handleBirthDateChange}
                            disableFuture
                            maxDate={maxDate}
                            format='DD/MM/YYYY'
                        />
                    </LocalizationProvider>
                    {isUploading && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
                            <CircularProgress />
                            <Typography variant="body2">
                                Se está creando la cuenta...
                            </Typography>
                        </div>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Registrarse
                    </Button>
                </Box>
            </Box>
        </Grid>
    );
}

export default Register;