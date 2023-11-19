import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Dialog, FormHelperText } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
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
import firebaseUtils from '../../../firebase/firebaseUtils.js';
import chatService from '../../../services/chatService.js';
import publicationService from '../../../services/publicationService.js';
import userService from '../../../services/userService.js';

function Config() {

    const navigate = useNavigate();

    const [logo, setLogo] = useState('');
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const userLogged = JSON.parse(window.localStorage.getItem('userLogged'));
                if (userLogged) {
                    setUser(userLogged.user);
                    setUserId(userLogged.userId);
                    setName(userLogged.user.name);
                    setEmail(userLogged.user.email);
                    setUsername(userLogged.user.username);
                    setBirthDate(dayjs(dayjs(userLogged.user.birthDate).format('YYYY-MM-DD')))
                    setAvatarPic(userLogged.user.profilePic);
                    const urlLogo = await firebaseUtils.getPhoto('/app/logos/logoVerdeOscuro.png');
                    setLogo(urlLogo);
                }
            } catch (error) {
                navigate('/error');
            }
        }
        fetchData();


    }, []);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [birthDate, setBirthDate] = useState(null);
    const [profilePic, setProfilePic] = useState('');
    const [previewPic, setPreviewPic] = useState('');
    const [AvatarPic, setAvatarPic] = useState('');

    const [isValidEmail, setValidEmail] = useState(true);
    const [isValidUsername, setValidUsername] = useState(true);

    const [hasChangedPassword, setHasChangedPassword] = useState(false);
    const [changePassword, setChangePassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [isTheSamePassword, setIsTheSamePassword] = useState(true);
    const [isValidPassword, setIsValidPassword] = useState(true);
    const [isPasswordMatch, setIsPasswordMatch] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    let hasErrors = false;

    const maxDate = dayjs().subtract(16, 'years');

    const openChangePassword = () => {
        setChangePassword(true);
    }

    const closeChangePassword = () => {
        if (!isTheSamePassword || !isValidPassword) {
            setHasChangedPassword(false);
        }
        setChangePassword(false);
    }

    const dontChangePass = () => {
        setHasChangedPassword(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setIsPasswordMatch(true);
        setIsValidPassword(true);
        setIsTheSamePassword(true);
        setShowPassword(false);
        setChangePassword(false);
    }

    const confirmChangePassword = async () => {
        const isTheSame = await userService.checkPassword(user.username, currentPassword);
        if (isTheSame.success && !isTheSame.isPasswordMatch) {
            setIsPasswordMatch(false);
            toast.error('Error al actualizar la contraseña', {
                duration: 1500,
            });
            return;
        } else {
            setIsPasswordMatch(true);
            if (newPassword.length < 8) {
                setIsValidPassword(false);
                toast.error('Error al actualizar la contraseña', {
                    duration: 1500,
                });
                return;
            } else {
                setIsValidPassword(true);
                if (newPassword !== confirmNewPassword) {
                    setIsTheSamePassword(false);
                    toast.error('Error al actualizar la contraseña', {
                        duration: 1500,
                    });
                    return;
                } else {
                    setIsTheSamePassword(true);
                    try {
                        setHasChangedPassword(true);
                        toast.success('Contraseña actualizada correctamente', {
                            duration: 1500,
                        });
                        closeChangePassword();
                    } catch (error) {
                        toast.error('Error al actualizar la contraseña', {
                            duration: 1500,
                        });
                    }
                }
            }
        }
    }

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handleBirthDateChange = (newValue) => {
        setBirthDate(newValue);
    };

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        setProfilePic(file);

        const previewPic = URL.createObjectURL(file);
        setPreviewPic(previewPic);
    };

    const isEmailValid = async (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(email)) {
            const emailExists = await userService.checkEmail(email);
            if (emailExists.emailExists && email !== user.email) {
                return false;
            } else if (email === user.email) {
                return true;
            }
            return !emailExists.emailExists;
        }
        return false;
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
        if (name && email && username && birthDate) {
            const emailValid = await isEmailValid(email);
            if (!emailValid) {
                setValidEmail(false);
                hasErrors = true;
            } else {
                setValidEmail(true);
            }

            let usedUsername;
            try {
                usedUsername = await checkUsedUsername(username);
                if (usedUsername && username !== user.username) {
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

            let updateUser = await checkFields();

            if (updateUser) {
                let url = "";

                setIsUploading(true);
                if (user.profilePic !== '' && (AvatarPic === '' || profilePic !== '')) {
                    await firebaseUtils.removeUserProfileImage(userId);
                }
                if (profilePic !== '') {
                    url = await firebaseUtils.uploadUserProfileImage(profilePic, userId);
                } else if (user.profilePic !== '' && AvatarPic !== '' && profilePic === '') {
                    url = user.profilePic;
                }

                if (hasChangedPassword) {
                    await userService.updateUserWithPassword(user.username, username, name, email, birthDate, url, newPassword);
                } else {
                    await userService.updateUser(user.username, username, name, email, birthDate, url);
                }

                if (user.username !== username) {
                    await publicationService.changeUser(user.username, username);
                    await userService.changeUserFromFollower(user.username, username);
                    await chatService.changeUserFromChat(user.username, username);
                }
                setIsUploading(false);
                window.location.href = '/travelgram/#/feed/' + username;
            }
        } catch (error) {
            toast.error('Error al actualizar los datos', {
                duration: 1500,
            });
        }
    };

    if (!user) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </div>);
    }

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
                <Link href={"/travelgram/#/feed/" + username} variant="body2">
                    Volver
                </Link>
                <img src={logo} alt="Logo de Travelgram" />
                <Typography component="h1" variant="h5">
                    Actualiza tus datos
                </Typography>
                <Avatar
                    alt="Usuario"
                    src={AvatarPic}
                    sx={{ width: 100, height: 100 }}
                >
                    {user.username.charAt(0).toUpperCase()}
                </Avatar>
                {AvatarPic && (
                    <div style={{ marginTop: '5px' }}>
                        <Button
                            variant="contained"
                            color="error"
                            size='small'
                            onClick={() => { setAvatarPic(''); }}
                        >
                            Eliminar foto actual
                        </Button>
                    </div>
                )}

                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <Typography variant="h7">Actualiza tu foto de perfil o elimínala</Typography>
                    <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                        <input
                            type="file"
                            accept="image/*"
                            data-testid="profilePic"
                            onChange={handleImageChange}
                        />
                        {previewPic && (
                            <div style={{ marginTop: '5px' }}>
                                <Avatar
                                    alt="Usuario"
                                    src={previewPic}
                                    sx={{ width: 100, height: 100 }}
                                >
                                    {user.username.charAt(0).toUpperCase()}
                                </Avatar>
                            </div>
                        )}
                        {previewPic && (
                            <div style={{ marginTop: '5px' }}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    size='small'
                                    onClick={() => { setProfilePic(AvatarPic); setPreviewPic(''); }}
                                >
                                    Eliminar foto seleccionada
                                </Button>
                            </div>
                        )}
                    </div>
                    <TextField
                        margin="normal"
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
                        fullWidth
                        id="email"
                        data-testid="email"
                        label="Email"
                        name="email"
                        value={email}
                        autoComplete="email"
                        onChange={handleEmailChange}
                        error={!isValidEmail}
                        helperText={!isValidEmail ? 'El correo no es válido' : ''}
                    />
                    <div style={{ margin: '10px', marginBottom: '20px' }}>
                        <Button
                            variant="contained"
                            size='small'
                            onClick={openChangePassword}
                        >
                            Cambiar contraseña
                        </Button>
                    </div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Fecha de nacimiento"
                            value={birthDate}
                            format='DD/MM/YYYY'
                            onChange={handleBirthDateChange}
                            disableFuture
                            maxDate={maxDate}
                        />
                    </LocalizationProvider>
                    {isUploading && (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
                            <CircularProgress />
                            <Typography variant="body2">
                                Actualizando los datos...
                            </Typography>
                        </div>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Actualizar
                    </Button>
                </Box>
            </Box>
            <Dialog open={changePassword} onClose={closeChangePassword}>
                <DialogTitle>Actualiza tu contraseña</DialogTitle>
                <DialogContent>
                    <FormControl variant="outlined" fullWidth margin='normal'>
                        <InputLabel htmlFor="outlined-adornment-password">Contraseña actual</InputLabel>
                        <OutlinedInput
                            name="password"
                            label="Contraseña actual"
                            value={currentPassword}
                            id="currentPassword"
                            data-testid="currentPassword"
                            onChange={(event) => { setCurrentPassword(event.target.value); }}
                            error={!isPasswordMatch}
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => { setShowPassword(!showPassword); }}
                                        onMouseDown={(event) => { event.preventDefault(); }}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        {isPasswordMatch ? null : (
                            <FormHelperText error>
                                La contraseña no coincide con la actual
                            </FormHelperText>
                        )}
                    </FormControl>
                    <FormControl variant="outlined" fullWidth margin='normal'>
                        <InputLabel htmlFor="outlined-adornment-password">Nueva contraseña</InputLabel>
                        <OutlinedInput
                            name="password"
                            label="Nueva contraseña"
                            value={newPassword}
                            id="newPassword"
                            data-testid="newPassword"
                            onChange={(event) => { setNewPassword(event.target.value); }}
                            error={!isValidPassword}
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => { setShowPassword(!showPassword); }}
                                        onMouseDown={(event) => { event.preventDefault(); }}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        {isValidPassword ? null : (
                            <FormHelperText error>
                                La contraseña debe tener al menos 8 caracteres
                            </FormHelperText>
                        )}
                    </FormControl>
                    <FormControl variant="outlined" fullWidth margin='normal'>
                        <InputLabel htmlFor="outlined-adornment-password">Confirma la nueva contraseña</InputLabel>
                        <OutlinedInput
                            name="password"
                            label="Confirma la nueva contraseña"
                            value={confirmNewPassword}
                            id="confirmPassword"
                            data-testid="confirmPassword"
                            onChange={(event) => { setConfirmNewPassword(event.target.value); }}
                            error={!isTheSamePassword}
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => { setShowPassword(!showPassword); }}
                                        onMouseDown={(event) => { event.preventDefault(); }}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                        {isTheSamePassword ? null : (
                            <FormHelperText error>
                                La contraseña no coincide
                            </FormHelperText>
                        )}
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeChangePassword}>Cancelar</Button>
                    <Button onClick={dontChangePass}>No cambiar</Button>
                    <Button onClick={confirmChangePassword}>Actualizar</Button>
                </DialogActions>
            </Dialog>
        </Grid>
    );
}

export default Config;