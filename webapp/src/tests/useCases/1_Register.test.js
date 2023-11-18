import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userService from '../../services/userService';

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
import Register from '../../components/register/Register';

jest.mock('react-hot-toast', () => ({
    ...jest.requireActual('react-hot-toast'),
    error: jest.fn(),
}));

jest.mock('axios', () => ({
    get: jest.fn(() => Promise.resolve({ data: {} })),
}));

jest.mock('../../services/userService', () => ({
    checkEmail: jest.fn(),
    findUserByUsername: jest.fn(),
    addUser: jest.fn()
}));

describe('Registro tests', () => {
    describe('faltan campos por rellenar', () => {
        test('no se ingresa nombre', async () => {
            await act(async () => {
                render(<BrowserRouter>
                    <Register />
                </BrowserRouter>);
            });

            const usernameInput = screen.getByTestId("username").querySelector('input');
            const emailInput = screen.getByTestId("email").querySelector('input');
            const passwordInput = screen.getByTestId("password").querySelector('input');
            const birthDateInput = screen.getByPlaceholderText('DD/MM/YYYY');

            fireEvent.change(usernameInput, { target: { value: 'testUsername' } });
            fireEvent.change(emailInput, { target: { value: 'testUser@email.com' } });
            fireEvent.change(passwordInput, { target: { value: 'testuser' } });
            fireEvent.change(birthDateInput, { target: { value: '23/06/2001' } });

            expect(usernameInput.value).toBe('testUsername');
            expect(emailInput.value).toBe('testUser@email.com');
            expect(passwordInput.value).toBe('testuser');
            expect(birthDateInput.value).toBe('23/06/2001');

            const button = screen.getByRole('button', { name: 'Registrarse' });

            await act(async () => {
                fireEvent.click(button);
            });

            const toastText = await screen.findByText("Falta completar algún campo");
            expect(toastText).toBeInTheDocument();

            await waitFor(() => expect(screen.queryByText("Falta completar algún campo")).toBeNull(), { timeout: 3000 });
        });

        test('no se ingresa nombre de usuario', async () => {
            await act(async () => {
                render(<BrowserRouter>
                    <Register />
                </BrowserRouter>);
            });

            const nameInput = screen.getByTestId("name").querySelector('input');
            const emailInput = screen.getByTestId("email").querySelector('input');
            const passwordInput = screen.getByTestId("password").querySelector('input');
            const birthDateInput = screen.getByPlaceholderText('DD/MM/YYYY');

            fireEvent.change(nameInput, { target: { value: 'testName' } });
            fireEvent.change(emailInput, { target: { value: 'testUser@email.com' } });
            fireEvent.change(passwordInput, { target: { value: 'testuser' } });
            fireEvent.change(birthDateInput, { target: { value: '23/06/2001' } });

            expect(nameInput.value).toBe('testName');
            expect(emailInput.value).toBe('testUser@email.com');
            expect(passwordInput.value).toBe('testuser');
            expect(birthDateInput.value).toBe('23/06/2001');

            const button = screen.getByRole('button', { name: 'Registrarse' });

            await act(async () => {
                fireEvent.click(button);
            });

            const toastText = await screen.findByText("Falta completar algún campo");
            expect(toastText).toBeInTheDocument();

            await waitFor(() => expect(screen.queryByText("Falta completar algún campo")).toBeNull(), { timeout: 3000 });
        });

        test('no se ingresa correo electrónico', async () => {
            await act(async () => {
                render(<BrowserRouter>
                    <Register />
                </BrowserRouter>);
            });

            const nameInput = screen.getByTestId("name").querySelector('input');
            const usernameInput = screen.getByTestId("username").querySelector('input');
            const passwordInput = screen.getByTestId("password").querySelector('input');
            const birthDateInput = screen.getByPlaceholderText('DD/MM/YYYY');

            fireEvent.change(nameInput, { target: { value: 'testName' } });
            fireEvent.change(usernameInput, { target: { value: 'testUsername' } });
            fireEvent.change(passwordInput, { target: { value: 'testuser' } });
            fireEvent.change(birthDateInput, { target: { value: '23/06/2001' } });

            expect(nameInput.value).toBe('testName');
            expect(usernameInput.value).toBe('testUsername');
            expect(passwordInput.value).toBe('testuser');
            expect(birthDateInput.value).toBe('23/06/2001');

            const button = screen.getByRole('button', { name: 'Registrarse' });

            await act(async () => {
                fireEvent.click(button);
            });

            const toastText = await screen.findByText("Falta completar algún campo");
            expect(toastText).toBeInTheDocument();

            await waitFor(() => expect(screen.queryByText("Falta completar algún campo")).toBeNull(), { timeout: 3000 });
        });

        test('no se ingresa contraseña', async () => {
            await act(async () => {
                render(<BrowserRouter>
                    <Register />
                </BrowserRouter>);
            });

            const nameInput = screen.getByTestId("name").querySelector('input');
            const usernameInput = screen.getByTestId("username").querySelector('input');
            const emailInput = screen.getByTestId("email").querySelector('input');
            const birthDateInput = screen.getByPlaceholderText('DD/MM/YYYY');

            fireEvent.change(nameInput, { target: { value: 'testName' } });
            fireEvent.change(usernameInput, { target: { value: 'testUsername' } });
            fireEvent.change(emailInput, { target: { value: 'testUser@email.com' } });
            fireEvent.change(birthDateInput, { target: { value: '23/06/2001' } });

            expect(nameInput.value).toBe('testName');
            expect(usernameInput.value).toBe('testUsername');
            expect(emailInput.value).toBe('testUser@email.com');
            expect(birthDateInput.value).toBe('23/06/2001');

            const button = screen.getByRole('button', { name: 'Registrarse' });

            await act(async () => {
                fireEvent.click(button);
            });

            const toastText = await screen.findByText("Falta completar algún campo");
            expect(toastText).toBeInTheDocument();

            await waitFor(() => expect(screen.queryByText("Falta completar algún campo")).toBeNull(), { timeout: 3000 });
        });

        test('no se ingresa fecha de nacimiento', async () => {
            await act(async () => {
                render(<BrowserRouter>
                    <Register />
                </BrowserRouter>);
            });

            const nameInput = screen.getByTestId("name").querySelector('input');
            const usernameInput = screen.getByTestId("username").querySelector('input');
            const emailInput = screen.getByTestId("email").querySelector('input');
            const passwordInput = screen.getByTestId("password").querySelector('input');

            fireEvent.change(nameInput, { target: { value: 'testName' } });
            fireEvent.change(usernameInput, { target: { value: 'testUsername' } });
            fireEvent.change(emailInput, { target: { value: 'testUser@email.com' } });
            fireEvent.change(passwordInput, { target: { value: 'testuser' } });

            expect(nameInput.value).toBe('testName');
            expect(usernameInput.value).toBe('testUsername');
            expect(emailInput.value).toBe('testUser@email.com');
            expect(passwordInput.value).toBe('testuser');

            const button = screen.getByRole('button', { name: 'Registrarse' });

            await act(async () => {
                fireEvent.click(button);
            });

            const toastText = await screen.findByText("Falta completar algún campo");
            expect(toastText).toBeInTheDocument();

            await waitFor(() => expect(screen.queryByText("Falta completar algún campo")).toBeNull(), { timeout: 3000 });
        });

        test('ningún campo rellenado', async () => {
            await act(async () => {
                render(<BrowserRouter>
                    <Register />
                </BrowserRouter>);
            });

            const button = screen.getByRole('button', { name: 'Registrarse' });

            await act(async () => {
                fireEvent.click(button);
            });

            const toastText = await screen.findByText("Falta completar algún campo");
            expect(toastText).toBeInTheDocument();

            await waitFor(() => expect(screen.queryByText("Falta completar algún campo")).toBeNull(), { timeout: 3000 });
        });
    });

    test('se ingresa un nombre de usuario existente', async () => {
        userService.findUserByUsername.mockResolvedValueOnce({
            userExists: true,
            user: {
                username: 'testUsername',
                email: 'testEmail@email.com',
                password: 'testPassword',
                birthDate: new Date('2001-06-22T22:00:00.000Z'),
                profilePic: '',
                name: 'testName',
                savedPosts: [],
                followers: [],
            }
        });

        userService.checkEmail.mockResolvedValueOnce({ emailExists: false });

        await act(async () => {
            render(<BrowserRouter>
                <Register />
            </BrowserRouter>);
        });

        const nameInput = screen.getByTestId("name").querySelector('input');
        const usernameInput = screen.getByTestId("username").querySelector('input');
        const emailInput = screen.getByTestId("email").querySelector('input');
        const passwordInput = screen.getByTestId("password").querySelector('input');
        const birthDateInput = screen.getByPlaceholderText('DD/MM/YYYY');

        fireEvent.change(nameInput, { target: { value: 'testName' } });
        fireEvent.change(usernameInput, { target: { value: 'testUsername' } });
        fireEvent.change(emailInput, { target: { value: 'test@email.com' } });
        fireEvent.change(passwordInput, { target: { value: 'testuser' } });
        fireEvent.change(birthDateInput, { target: { value: '23/06/2001' } });

        expect(nameInput.value).toBe('testName');
        expect(usernameInput.value).toBe('testUsername');
        expect(emailInput.value).toBe('test@email.com');
        expect(passwordInput.value).toBe('testuser');
        expect(birthDateInput.value).toBe('23/06/2001');

        const button = screen.getByRole('button', { name: 'Registrarse' });

        await act(async () => {
            fireEvent.click(button);
        });

        await waitFor(() => {
            const usernameError = screen.getByText('El nombre de usuario no está disponible');
            expect(usernameError).toBeInTheDocument();
        });
    });

    test('se ingresa un correo electrónico existente', async () => {
        userService.findUserByUsername.mockResolvedValueOnce({
            userExists: false,
            user: {
                username: 'testUsername1',
                email: 'testEmail@email.com',
                password: 'testPassword',
                birthDate: new Date('2001-06-22T22:00:00.000Z'),
                profilePic: '',
                name: 'testName',
                savedPosts: [],
                followers: [],
            }
        });

        userService.checkEmail.mockResolvedValueOnce({ emailExists: true });

        await act(async () => {
            render(<BrowserRouter>
                <Register />
            </BrowserRouter>);
        });

        const nameInput = screen.getByTestId("name").querySelector('input');
        const usernameInput = screen.getByTestId("username").querySelector('input');
        const emailInput = screen.getByTestId("email").querySelector('input');
        const passwordInput = screen.getByTestId("password").querySelector('input');
        const birthDateInput = screen.getByPlaceholderText('DD/MM/YYYY');

        fireEvent.change(nameInput, { target: { value: 'testName' } });
        fireEvent.change(usernameInput, { target: { value: 'testUsername' } });
        fireEvent.change(emailInput, { target: { value: 'testEmail@email.com' } });
        fireEvent.change(passwordInput, { target: { value: 'testuser' } });
        fireEvent.change(birthDateInput, { target: { value: '23/06/2001' } });

        expect(nameInput.value).toBe('testName');
        expect(usernameInput.value).toBe('testUsername');
        expect(emailInput.value).toBe('testEmail@email.com');
        expect(passwordInput.value).toBe('testuser');
        expect(birthDateInput.value).toBe('23/06/2001');

        const button = screen.getByRole('button', { name: 'Registrarse' });

        await act(async () => {
            fireEvent.click(button);
        });

        await waitFor(() => {
            const emailError = screen.getByText('El correo ya está en uso');
            expect(emailError).toBeInTheDocument();
        });
    });

    test('se ingresa un correo electrónico con un formato inválido', async () => {
        userService.findUserByUsername.mockResolvedValueOnce({
            userExists: false,
            user: {
                username: 'testUsername1',
                email: 'testEmail@email.com',
                password: 'testPassword',
                birthDate: new Date('2001-06-22T22:00:00.000Z'),
                profilePic: '',
                name: 'testName',
                savedPosts: [],
                followers: [],
            }
        });

        userService.checkEmail.mockResolvedValueOnce({ emailExists: false });

        await act(async () => {
            render(<BrowserRouter>
                <Register />
            </BrowserRouter>);
        });

        const nameInput = screen.getByTestId("name").querySelector('input');
        const usernameInput = screen.getByTestId("username").querySelector('input');
        const emailInput = screen.getByTestId("email").querySelector('input');
        const passwordInput = screen.getByTestId("password").querySelector('input');
        const birthDateInput = screen.getByPlaceholderText('DD/MM/YYYY');

        fireEvent.change(nameInput, { target: { value: 'testName' } });
        fireEvent.change(usernameInput, { target: { value: 'testUsername' } });
        fireEvent.change(emailInput, { target: { value: 'testEmail' } });
        fireEvent.change(passwordInput, { target: { value: 'testuser' } });
        fireEvent.change(birthDateInput, { target: { value: '23/06/2001' } });

        expect(nameInput.value).toBe('testName');
        expect(usernameInput.value).toBe('testUsername');
        expect(emailInput.value).toBe('testEmail');
        expect(passwordInput.value).toBe('testuser');
        expect(birthDateInput.value).toBe('23/06/2001');

        const button = screen.getByRole('button', { name: 'Registrarse' });

        await act(async () => {
            fireEvent.click(button);
        });

        await waitFor(() => {
            const emailError = screen.getByText('El correo no es válido');
            expect(emailError).toBeInTheDocument();
        });
    });

    test('se ingresa una contraseña que no cumple con los requisitos', async () => {
        userService.findUserByUsername.mockResolvedValueOnce({
            userExists: false,
            user: {
                username: 'testUsername1',
                email: 'testEmail@email.com',
                password: 'testPassword',
                birthDate: new Date('2001-06-22T22:00:00.000Z'),
                profilePic: '',
                name: 'testName',
                savedPosts: [],
                followers: [],
            }
        });

        userService.checkEmail.mockResolvedValueOnce({ emailExists: false });

        await act(async () => {
            render(<BrowserRouter>
                <Register />
            </BrowserRouter>);
        });

        const nameInput = screen.getByTestId("name").querySelector('input');
        const usernameInput = screen.getByTestId("username").querySelector('input');
        const emailInput = screen.getByTestId("email").querySelector('input');
        const passwordInput = screen.getByTestId("password").querySelector('input');
        const birthDateInput = screen.getByPlaceholderText('DD/MM/YYYY');

        fireEvent.change(nameInput, { target: { value: 'testName' } });
        fireEvent.change(usernameInput, { target: { value: 'testUsername' } });
        fireEvent.change(emailInput, { target: { value: 'testEmail@email.com' } });
        fireEvent.change(passwordInput, { target: { value: 'test' } });
        fireEvent.change(birthDateInput, { target: { value: '23/06/2001' } });

        expect(nameInput.value).toBe('testName');
        expect(usernameInput.value).toBe('testUsername');
        expect(emailInput.value).toBe('testEmail@email.com');
        expect(passwordInput.value).toBe('test');
        expect(birthDateInput.value).toBe('23/06/2001');

        const button = screen.getByRole('button', { name: 'Registrarse' });

        await act(async () => {
            fireEvent.click(button);
        });

        await waitFor(() => {
            const passwordError = screen.getByText('La contraseña debe tener al menos 8 caracteres.');
            expect(passwordError).toBeInTheDocument();
        });
    });

    test('se ingresan datos válidos', async () => {
        Object.defineProperty(window, "localStorage", {
            value: {
                getItem: jest.fn(() => JSON.stringify(userLogged)),
                setItem: jest.fn(() => JSON.stringify(userLogged)),
            },
            writable: true,
        });

        userService.findUserByUsername.mockResolvedValueOnce({
            userExists: false,
            user: {
                username: 'testUsername1',
                email: 'testEmail@email.com',
                password: 'testPassword',
                birthDate: new Date('2001-06-22T22:00:00.000Z'),
                profilePic: '',
                name: 'testName',
                savedPosts: [],
                followers: [],
            }
        });

        userService.checkEmail.mockResolvedValueOnce({ emailExists: false });

        let userData = {
            name: 'testName',
            email: 'testEmail@email.com',
            username: 'testUsername',
            password: 'testtest',
            birthDate: new Date('2001-06-22T22:00:00.000Z'),
            password: 'testtest',
            followers: [],
            savedPosts: [],
            profilePic: ''
        };

        userService.addUser.mockResolvedValueOnce({
            success: true,
            user: userData,
            token: 'testToken',
            userId: 'testUserId'
        });

        await act(async () => {
            render(<BrowserRouter>
                <Register />
            </BrowserRouter>);
        });

        const nameInput = screen.getByTestId("name").querySelector('input');
        const usernameInput = screen.getByTestId("username").querySelector('input');
        const emailInput = screen.getByTestId("email").querySelector('input');
        const passwordInput = screen.getByTestId("password").querySelector('input');
        const birthDateInput = screen.getByPlaceholderText('DD/MM/YYYY');

        fireEvent.change(nameInput, { target: { value: 'testName' } });
        fireEvent.change(usernameInput, { target: { value: 'testUsername' } });
        fireEvent.change(emailInput, { target: { value: 'testEmail@email.com' } });
        fireEvent.change(passwordInput, { target: { value: 'testtest' } });
        fireEvent.change(birthDateInput, { target: { value: '23/06/2001' } });

        expect(nameInput.value).toBe('testName');
        expect(usernameInput.value).toBe('testUsername');
        expect(emailInput.value).toBe('testEmail@email.com');
        expect(passwordInput.value).toBe('testtest');
        expect(birthDateInput.value).toBe('23/06/2001');

        const button = screen.getByRole('button', { name: 'Registrarse' });

        await act(async () => {
            fireEvent.click(button);
        });

        expect(userService.addUser).toHaveBeenCalledTimes(1);
    });
});