import { fireEvent, render, screen } from '@testing-library/react';

beforeAll(() => {
    delete window.location;
    window.location = { href: '' };

    Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: (query) => ({
            media: query,
            matches: query === "(pointer: fine)",
            onchange: () => { },
            addEventListener: () => { },
            removeEventListener: () => { },
            addListener: () => { },
            removeListener: () => { },
            dispatchEvent: () => false,
        }),
    });
});

afterEach(() => {
    jest.restoreAllMocks();
});

afterAll(() => {
    delete window.matchMedia;
});

import { act } from 'react-dom/test-utils';
import { BrowserRouter } from 'react-router-dom';
import Config from '../../components/user/configuration/Config';
import userService from '../../services/userService';


jest.mock('react-hot-toast', () => ({
    ...jest.requireActual('react-hot-toast'),
    error: jest.fn(),
}));

jest.mock('axios', () => ({
    get: jest.fn(() => Promise.resolve({ data: {} })),
}));

jest.mock('../../services/publicationService', () => ({
    changeUser: jest.fn()
}));

jest.mock('../../services/userService', () => ({
    checkPassword: jest.fn(),
    checkEmail: jest.fn(),
    findUserByUsername: jest.fn(),
    updateUserWithPassword: jest.fn(),
    updateUser: jest.fn(),
    changeUserFromFollower: jest.fn()
}));

jest.mock('../../services/chatService', () => ({
    changeUserFromChat: jest.fn()
}));

describe('Actualizar datos básicos tests', () => {

    test('no se han rellenado todos los campos', async () => {
        const userLogged = {
            success: true,
            user: {
                username: 'testUsername',
                password: 'testtest',
                birthDate: '2001-06-22T22:00:00.000Z',
                email: 'test@email.com',
                followers: [],
                savedPosts: [],
                name: 'testName',
                profilePic: ""
            },
            token: 'token',
            userId: 'testUserId',
            timestamp: new Date()
        };

        Object.defineProperty(window, "localStorage", {
            value: {
                getItem: jest.fn(() => JSON.stringify(userLogged)),
                setItem: jest.fn(() => JSON.stringify(userLogged)),
            },
            writable: true,
        });

        await act(async () => {
            render(<BrowserRouter>
                <Config />
            </BrowserRouter>);
        });

        const nameInput = screen.getByTestId('name').querySelector('input');

        act(() => {
            fireEvent.change(nameInput, { target: { value: '' } });
        });

        const buttonUpdate = screen.getByText('Actualizar');
        await act(async () => {
            fireEvent.click(buttonUpdate);
        });

        const toastText = await screen.findByText("Falta completar algún campo");
        expect(toastText).toBeInTheDocument();
    });

    test('se ingresa un nombre de usuario existente', async () => {
        userService.findUserByUsername.mockResolvedValueOnce({ userExists: true });
        userService.checkEmail.mockResolvedValueOnce({ emailExists: false });

        const userLogged = {
            success: true,
            user: {
                username: 'testUsername',
                password: 'testtest',
                birthDate: '2001-06-22T22:00:00.000Z',
                email: 'test@email.com',
                followers: [],
                savedPosts: [],
                name: 'testName',
                profilePic: ""
            },
            token: 'token',
            userId: 'testUserId',
            timestamp: new Date()
        };

        Object.defineProperty(window, "localStorage", {
            value: {
                getItem: jest.fn(() => JSON.stringify(userLogged)),
                setItem: jest.fn(() => JSON.stringify(userLogged)),
            },
            writable: true,
        });

        await act(async () => {
            render(<BrowserRouter>
                <Config />
            </BrowserRouter>);
        });

        const usernameInput = screen.getByTestId('username').querySelector('input');

        act(() => {
            fireEvent.change(usernameInput, { target: { value: 'testUsername1' } });
        });

        const buttonUpdate = screen.getByText('Actualizar');
        await act(async () => {
            fireEvent.click(buttonUpdate);
        });

        const errorText = await screen.findByText("El nombre de usuario no está disponible");
        expect(errorText).toBeInTheDocument();
    });

    test('se ingresa un correo electrónico existente', async () => {
        userService.findUserByUsername.mockResolvedValueOnce({ userExists: false });
        userService.checkEmail.mockResolvedValueOnce({ emailExists: true });

        const userLogged = {
            success: true,
            user: {
                username: 'testUsername',
                password: 'testtest',
                birthDate: '2001-06-22T22:00:00.000Z',
                email: 'test@email.com',
                followers: [],
                savedPosts: [],
                name: 'testName',
                profilePic: ""
            },
            token: 'token',
            userId: 'testUserId',
            timestamp: new Date()
        };

        Object.defineProperty(window, "localStorage", {
            value: {
                getItem: jest.fn(() => JSON.stringify(userLogged)),
                setItem: jest.fn(() => JSON.stringify(userLogged)),
            },
            writable: true,
        });

        await act(async () => {
            render(<BrowserRouter>
                <Config />
            </BrowserRouter>);
        });

        const emailInput = screen.getByTestId('email').querySelector('input');

        act(() => {
            fireEvent.change(emailInput, { target: { value: 'testUsername1@email.com' } });
        });

        const buttonUpdate = screen.getByText('Actualizar');
        await act(async () => {
            fireEvent.click(buttonUpdate);
        });

        const errorText = await screen.findByText("El correo no es válido");
        expect(errorText).toBeInTheDocument();
    });

    test('se ingresa un correo electrónico con un formato inválido', async () => {
        userService.findUserByUsername.mockResolvedValueOnce({ userExists: false });
        userService.checkEmail.mockResolvedValueOnce({ emailExists: false });

        const userLogged = {
            success: true,
            user: {
                username: 'testUsername',
                password: 'testtest',
                birthDate: '2001-06-22T22:00:00.000Z',
                email: 'test@email.com',
                followers: [],
                savedPosts: [],
                name: 'testName',
                profilePic: ""
            },
            token: 'token',
            userId: 'testUserId',
            timestamp: new Date()
        };

        Object.defineProperty(window, "localStorage", {
            value: {
                getItem: jest.fn(() => JSON.stringify(userLogged)),
                setItem: jest.fn(() => JSON.stringify(userLogged)),
            },
            writable: true,
        });

        await act(async () => {
            render(<BrowserRouter>
                <Config />
            </BrowserRouter>);
        });

        const emailInput = screen.getByTestId('email').querySelector('input');

        act(() => {
            fireEvent.change(emailInput, { target: { value: 'testEmail' } });
        });

        const buttonUpdate = screen.getByText('Actualizar');
        await act(async () => {
            fireEvent.click(buttonUpdate);
        });

        const errorText = await screen.findByText("El correo no es válido");
        expect(errorText).toBeInTheDocument();
    });

    test('se ingresa una contraseña que no coincide con la actual', async () => {
        userService.findUserByUsername.mockResolvedValueOnce({ userExists: false });
        userService.checkEmail.mockResolvedValueOnce({ emailExists: false });
        userService.checkPassword.mockResolvedValueOnce({ success: true, isPasswordMatch: false });

        const userLogged = {
            success: true,
            user: {
                username: 'testUsername',
                password: 'testtest',
                birthDate: '2001-06-22T22:00:00.000Z',
                email: 'test@email.com',
                followers: [],
                savedPosts: [],
                name: 'testName',
                profilePic: ""
            },
            token: 'token',
            userId: 'testUserId',
            timestamp: new Date()
        };

        Object.defineProperty(window, "localStorage", {
            value: {
                getItem: jest.fn(() => JSON.stringify(userLogged)),
                setItem: jest.fn(() => JSON.stringify(userLogged)),
            },
            writable: true,
        });

        await act(async () => {
            render(<BrowserRouter>
                <Config />
            </BrowserRouter>);
        });

        const passwordChangeButton = screen.getByText('Cambiar contraseña');
        act(() => {
            fireEvent.click(passwordChangeButton);
        });

        const password1Input = screen.getByTestId('currentPassword').querySelector('input');
        const password2Input = screen.getByTestId('newPassword').querySelector('input');
        const password3Input = screen.getByTestId('confirmPassword').querySelector('input');

        await act(async () => {
            fireEvent.change(password1Input, { target: { value: 'actualpassword' } });
            fireEvent.change(password2Input, { target: { value: 'newpassword' } });
            fireEvent.change(password3Input, { target: { value: 'newpassword' } });

            const buttonUpdate = screen.getByRole('button', { name: 'Actualizar', type: 'button' });
            fireEvent.click(buttonUpdate);
        });

        const errorText = await screen.findByText("La contraseña no coincide con la actual");
        expect(errorText).toBeInTheDocument();
    });

    test('se ingresa una nueva contraseña que no cumple los requisitos', async () => {
        userService.findUserByUsername.mockResolvedValueOnce({ userExists: false });
        userService.checkEmail.mockResolvedValueOnce({ emailExists: false });
        userService.checkPassword.mockResolvedValueOnce({ success: true, isPasswordMatch: true });

        const userLogged = {
            success: true,
            user: {
                username: 'testUsername',
                password: 'testtest',
                birthDate: '2001-06-22T22:00:00.000Z',
                email: 'test@email.com',
                followers: [],
                savedPosts: [],
                name: 'testName',
                profilePic: ""
            },
            token: 'token',
            userId: 'testUserId',
            timestamp: new Date()
        };

        Object.defineProperty(window, "localStorage", {
            value: {
                getItem: jest.fn(() => JSON.stringify(userLogged)),
                setItem: jest.fn(() => JSON.stringify(userLogged)),
            },
            writable: true,
        });

        await act(async () => {
            render(<BrowserRouter>
                <Config />
            </BrowserRouter>);
        });

        const passwordChangeButton = screen.getByText('Cambiar contraseña');
        act(() => {
            fireEvent.click(passwordChangeButton);
        });

        const password1Input = screen.getByTestId('currentPassword').querySelector('input');
        const password2Input = screen.getByTestId('newPassword').querySelector('input');
        const password3Input = screen.getByTestId('confirmPassword').querySelector('input');

        await act(async () => {
            fireEvent.change(password1Input, { target: { value: 'actualpassword' } });
            fireEvent.change(password2Input, { target: { value: 'new' } });
            fireEvent.change(password3Input, { target: { value: 'new' } });

            const buttonUpdate = screen.getByRole('button', { name: 'Actualizar', type: 'button' });
            fireEvent.click(buttonUpdate);
        });

        const errorText = await screen.findByText("La contraseña debe tener al menos 8 caracteres");
        expect(errorText).toBeInTheDocument();
    });

    test('se ingresa por segunda vez la nueva contraseña, pero no coincide con la primera vez que se ingresó', async () => {
        userService.findUserByUsername.mockResolvedValueOnce({ userExists: false });
        userService.checkEmail.mockResolvedValueOnce({ emailExists: false });
        userService.checkPassword.mockResolvedValueOnce({ success: true, isPasswordMatch: true });

        const userLogged = {
            success: true,
            user: {
                username: 'testUsername',
                password: 'testtest',
                birthDate: '2001-06-22T22:00:00.000Z',
                email: 'test@email.com',
                followers: [],
                savedPosts: [],
                name: 'testName',
                profilePic: ""
            },
            token: 'token',
            userId: 'testUserId',
            timestamp: new Date()
        };

        Object.defineProperty(window, "localStorage", {
            value: {
                getItem: jest.fn(() => JSON.stringify(userLogged)),
                setItem: jest.fn(() => JSON.stringify(userLogged)),
            },
            writable: true,
        });

        await act(async () => {
            render(<BrowserRouter>
                <Config />
            </BrowserRouter>);
        });

        const passwordChangeButton = screen.getByText('Cambiar contraseña');
        act(() => {
            fireEvent.click(passwordChangeButton);
        });

        const password1Input = screen.getByTestId('currentPassword').querySelector('input');
        const password2Input = screen.getByTestId('newPassword').querySelector('input');
        const password3Input = screen.getByTestId('confirmPassword').querySelector('input');

        await act(async () => {
            fireEvent.change(password1Input, { target: { value: 'actualpassword' } });
            fireEvent.change(password2Input, { target: { value: 'newpassword' } });
            fireEvent.change(password3Input, { target: { value: 'newPass' } });

            const buttonUpdate = screen.getByRole('button', { name: 'Actualizar', type: 'button' });
            fireEvent.click(buttonUpdate);
        });

        const errorText = await screen.findByText("La contraseña no coincide");
        expect(errorText).toBeInTheDocument();
    });

    test('se ingresa datos válidos', async () => {
        userService.findUserByUsername.mockResolvedValueOnce({ userExists: false });
        userService.checkEmail.mockResolvedValueOnce({ emailExists: false });

        const userLogged = {
            success: true,
            user: {
                username: 'testUsername',
                password: 'testtest',
                birthDate: '2001-06-22T22:00:00.000Z',
                email: 'test@email.com',
                followers: [],
                savedPosts: [],
                name: 'testName',
                profilePic: ""
            },
            token: 'token',
            userId: 'testUserId',
            timestamp: new Date()
        };

        Object.defineProperty(window, "localStorage", {
            value: {
                getItem: jest.fn(() => JSON.stringify(userLogged)),
                setItem: jest.fn(() => JSON.stringify(userLogged)),
            },
            writable: true,
        });

        await act(async () => {
            render(<BrowserRouter>
                <Config />
            </BrowserRouter>);
        });

        const buttonUpdate = screen.getByText('Actualizar');
        await act(async () => {
            fireEvent.click(buttonUpdate);
        });

        expect(screen.queryByText('Error al actualizar los datos')).toBeNull();
    });
});