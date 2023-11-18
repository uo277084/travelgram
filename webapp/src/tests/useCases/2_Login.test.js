import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userService from '../../services/userService';

beforeAll(() => {
    delete window.location;
    window.location = { href: '' };

    Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: jest.fn(),
            removeListener: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
        }))
    });
});

import { BrowserRouter } from 'react-router-dom';
import LoginView from '../../components/login/LoginView';

jest.mock('react-hot-toast', () => ({
    ...jest.requireActual('react-hot-toast'),
    error: jest.fn(),
}));

jest.mock('axios', () => ({
    get: jest.fn(() => Promise.resolve({ data: {} })),
}));

jest.mock('../../services/userService', () => ({
    login: jest.fn(),
}));

describe('Inicio de sesión tests', () => {
    test('renderizado del componente Login', async () => {
        await act(async () => {
            render(<BrowserRouter>
                <LoginView />
            </BrowserRouter>);
        });

        expect(screen.getByAltText("Logo de Travelgram")).toBeInTheDocument();
        const loginTextAndButton = screen.getAllByText("Iniciar sesión");
        expect(loginTextAndButton).toHaveLength(2);
        expect(screen.getByTestId("login")).toBeInTheDocument();
        expect(screen.getByTestId("password")).toBeInTheDocument();
        const linkElement = screen.getByText("¿No tienes cuenta? Regístrate");
        expect(linkElement).toBeInTheDocument();
        expect(linkElement.getAttribute('href')).toBe('/register');
    });

    describe('faltan campos por rellenar', () => {
        test('no se ingresa contraseña', async () => {
            await act(async () => {
                render(<BrowserRouter>
                    <LoginView />
                </BrowserRouter>);
            });

            const usernameInput = screen.getByTestId("login").querySelector('input');

            fireEvent.change(usernameInput, { target: { value: 'testUsername' } });

            expect(usernameInput.value).toBe('testUsername');

            const button = screen.getByRole('button', { name: 'Iniciar sesión' });

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
                    <LoginView />
                </BrowserRouter>);
            });

            const passwordInput = screen.getByTestId("password").querySelector('input');

            fireEvent.change(passwordInput, { target: { value: 'testtest' } });

            expect(passwordInput.value).toBe('testtest');

            const button = screen.getByRole('button', { name: 'Iniciar sesión' });

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
                    <LoginView />
                </BrowserRouter>);
            });

            const button = screen.getByRole('button', { name: 'Iniciar sesión' });

            await act(async () => {
                fireEvent.click(button);
            });

            const toastText = await screen.findByText("Falta completar algún campo");
            expect(toastText).toBeInTheDocument();

            await waitFor(() => expect(screen.queryByText("Falta completar algún campo")).toBeNull(), { timeout: 3000 });
        });
    });

    test('el nombre de usuario introducido no existe', async () => {
        userService.login.mockRejectedValueOnce({ response: { status: 404, data: { success: false } } });

        await act(async () => {
            render(<BrowserRouter>
                <LoginView />
            </BrowserRouter>);
        });

        const usernameInput = screen.getByTestId("login").querySelector('input');
        const passwordInput = screen.getByTestId("password").querySelector('input');

        fireEvent.change(usernameInput, { target: { value: 'testUsername' } });
        fireEvent.change(passwordInput, { target: { value: 'testtest' } });

        expect(usernameInput.value).toBe('testUsername');
        expect(passwordInput.value).toBe('testtest');

        const button = screen.getByRole('button', { name: 'Iniciar sesión' });

        await act(async () => {
            fireEvent.click(button);
        });

        const toastText = await screen.findByText("Error al iniciar sesión");
        expect(toastText).toBeInTheDocument();

        await waitFor(() => expect(screen.queryByText("Error al iniciar sesión")).toBeNull(), { timeout: 3000 });
    });

    test('el correo electrónico introducido no existe', async () => {
        userService.login.mockRejectedValueOnce({ response: { status: 404, data: { success: false } } });

        await act(async () => {
            render(<BrowserRouter>
                <LoginView />
            </BrowserRouter>);
        });

        const usernameInput = screen.getByTestId("login").querySelector('input');
        const passwordInput = screen.getByTestId("password").querySelector('input');

        fireEvent.change(usernameInput, { target: { value: 'testUsername@email.com' } });
        fireEvent.change(passwordInput, { target: { value: 'testtest' } });

        expect(usernameInput.value).toBe('testUsername@email.com');
        expect(passwordInput.value).toBe('testtest');

        const button = screen.getByRole('button', { name: 'Iniciar sesión' });

        await act(async () => {
            fireEvent.click(button);
        });

        const toastText = await screen.findByText("Error al iniciar sesión");
        expect(toastText).toBeInTheDocument();

        await waitFor(() => expect(screen.queryByText("Error al iniciar sesión")).toBeNull(), { timeout: 3000 });
    });

    test('el correo electrónico y la contraseña coinciden con una cuenta existente', async () => {
        Object.defineProperty(window, "localStorage", {
            value: {
                getItem: jest.fn(() => null),
                setItem: jest.fn(() => null),
            },
            writable: true,
        });

        const userLogged = {
            success: true,
            timestamp: new Date(),
            token: 'token',
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
            userId: 'testUserId'
        };

        userService.login.mockResolvedValueOnce(userLogged);

        await act(async () => {
            render(<BrowserRouter>
                <LoginView />
            </BrowserRouter>);
        });

        const emailInput = screen.getByTestId("login").querySelector('input');
        const passwordInput = screen.getByTestId("password").querySelector('input');

        fireEvent.change(emailInput, { target: { value: 'test@email.com' } });
        fireEvent.change(passwordInput, { target: { value: 'testtest' } });

        expect(emailInput.value).toBe('test@email.com');
        expect(passwordInput.value).toBe('testtest');

        const button = screen.getByRole('button', { name: 'Iniciar sesión' });

        await act(async () => {
            fireEvent.click(button);
        });

        expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);
    });

    test('el nombre de usuario y la contraseña coinciden con una cuenta existente', async () => {
        Object.defineProperty(window, "localStorage", {
            value: {
                getItem: jest.fn(() => null),
                setItem: jest.fn(() => null),
            },
            writable: true,
        });

        const userLogged = {
            success: true,
            timestamp: new Date(),
            token: 'token',
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
            userId: 'testUserId'
        };

        userService.login.mockResolvedValueOnce(userLogged);

        await act(async () => {
            render(<BrowserRouter>
                <LoginView />
            </BrowserRouter>);
        });

        const emailInput = screen.getByTestId("login").querySelector('input');
        const passwordInput = screen.getByTestId("password").querySelector('input');

        fireEvent.change(emailInput, { target: { value: 'testUsername' } });
        fireEvent.change(passwordInput, { target: { value: 'testtest' } });

        expect(emailInput.value).toBe('testUsername');
        expect(passwordInput.value).toBe('testtest');

        const button = screen.getByRole('button', { name: 'Iniciar sesión' });

        await act(async () => {
            fireEvent.click(button);
        });

        expect(window.localStorage.setItem).toHaveBeenCalledTimes(1);
    });

    test('el nombre de usuario y la contraseña no coinciden con una cuenta existente', async () => {
        userService.login.mockRejectedValueOnce({ response: { status: 409, data: { success: false } } });

        await act(async () => {
            render(<BrowserRouter>
                <LoginView />
            </BrowserRouter>);
        });

        const usernameInput = screen.getByTestId("login").querySelector('input');
        const passwordInput = screen.getByTestId("password").querySelector('input');

        fireEvent.change(usernameInput, { target: { value: 'testUsername' } });
        fireEvent.change(passwordInput, { target: { value: 'testtest' } });

        expect(usernameInput.value).toBe('testUsername');
        expect(passwordInput.value).toBe('testtest');

        const button = screen.getByRole('button', { name: 'Iniciar sesión' });

        await act(async () => {
            fireEvent.click(button);
        });

        const toastText = await screen.findByText("Error al iniciar sesión");
        expect(toastText).toBeInTheDocument();

        await waitFor(() => expect(screen.queryByText("Error al iniciar sesión")).toBeNull(), { timeout: 3000 });
    });

    test('el correo electrónico y la contraseña no coinciden con una cuenta existente', async () => {
        userService.login.mockRejectedValueOnce({ response: { status: 409, data: { success: false } } });

        await act(async () => {
            render(<BrowserRouter>
                <LoginView />
            </BrowserRouter>);
        });

        const usernameInput = screen.getByTestId("login").querySelector('input');
        const passwordInput = screen.getByTestId("password").querySelector('input');

        fireEvent.change(usernameInput, { target: { value: 'testUsername@email.com' } });
        fireEvent.change(passwordInput, { target: { value: 'testtest' } });

        expect(usernameInput.value).toBe('testUsername@email.com');
        expect(passwordInput.value).toBe('testtest');

        const button = screen.getByRole('button', { name: 'Iniciar sesión' });

        await act(async () => {
            fireEvent.click(button);
        });

        const toastText = await screen.findByText("Error al iniciar sesión");
        expect(toastText).toBeInTheDocument();

        await waitFor(() => expect(screen.queryByText("Error al iniciar sesión")).toBeNull(), { timeout: 3000 });
    });
});