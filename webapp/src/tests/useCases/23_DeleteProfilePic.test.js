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

describe('Eliminar foto de perfil tests', () => {
    test('el usuario no tiene foto de perfil', async () => {
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

        expect(screen.getByText('T')).toBeInTheDocument();
        expect(screen.queryByText('Eliminar foto actual')).toBeNull();
    });

    test('el usuario elimina la foto de perfil', async () => {
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
                profilePic: "https://res.cloudinary.com/asw2122/image/upload/v1690741985/tfg/photos/buscador.jpg"
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

        expect(screen.queryByText('T')).toBeNull();

        const button = screen.getByText('Eliminar foto actual');

        await act(async () => {
            fireEvent.click(button);
        });

        expect(screen.queryByText('Eliminar foto actual')).toBeNull();
    });
});