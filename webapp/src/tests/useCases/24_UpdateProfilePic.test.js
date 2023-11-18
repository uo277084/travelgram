import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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

describe('Actualizar foto de perfil tests', () => {
    test('el usuario selecciona una nueva foto de perfil', async () => {
        global.URL.createObjectURL = jest.fn().mockImplementation((file) => {
            return "https://res.cloudinary.com/asw2122/image/upload/v1690741985/tfg/photos/buscador.jpg";
        });
        const user = userEvent.setup();

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

        await act(async () => {
            const profilePicInput = screen.getByTestId("profilePic");
            const file = new File(['hello'], 'hello.png', { type: 'image/png' });
            fireEvent.change(profilePicInput, { target: { files: [file] } });
        });

        expect(screen.queryAllByAltText('Usuario')).toHaveLength(1);
        expect(screen.getByText('Eliminar foto seleccionada')).toBeInTheDocument();
    });

    test('el usuario selecciona una nueva foto de perfil y posteriormente la elimina', async () => {
        global.URL.createObjectURL = jest.fn().mockImplementation((file) => {
            return "https://res.cloudinary.com/asw2122/image/upload/v1690741985/tfg/photos/buscador.jpg";
        });
        const user = userEvent.setup();

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

        await act(async () => {
            const profilePicInput = screen.getByTestId("profilePic");
            const file = new File(['hello'], 'hello.png', { type: 'image/png' });
            fireEvent.change(profilePicInput, { target: { files: [file] } });
        });

        expect(screen.queryAllByAltText('Usuario')).toHaveLength(1);
        expect(screen.getByText('Eliminar foto seleccionada')).toBeInTheDocument();

        await act(async () => {
            fireEvent.click(screen.getByText('Eliminar foto seleccionada'));
        });

        expect(screen.queryByText('Eliminar foto seleccionada')).toBeNull();
    });
});