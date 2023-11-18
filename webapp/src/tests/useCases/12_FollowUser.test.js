import { render, screen, waitFor } from '@testing-library/react';
import { useParams } from 'react-router-dom';

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

import { BrowserRouter } from 'react-router-dom';
import Feed from '../../components/user/feed/FeedUser';
import publicationService from '../../services/publicationService';
import userService from '../../services/userService';

beforeEach(() => {
    const userLogged = {
        success: true,
        user: {
            username: 'testUsername',
            password: 'testtest',
            birthDate: '2001-06-22T22:00:00.000Z',
            email: 'test@email.com',
            followers: ['test1', 'test2'],
            savedPosts: [],
            name: 'testName',
            profilePic: ""
        },
        token: 'token',
        userId: 'testUserId',
        timestamp: new Date()
    };

    userService.getFollowers.mockResolvedValueOnce([]);
    userService.getFollows.mockResolvedValueOnce([]);

    Object.defineProperty(window, "localStorage", {
        value: {
            getItem: jest.fn(() => JSON.stringify(userLogged)),
            setItem: jest.fn(() => JSON.stringify(userLogged)),
        },
        writable: true,
    });
});

jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');

    return {
        ...originalModule,
        useParams: jest.fn(),
    };
});

jest.mock('react-hot-toast', () => ({
    ...jest.requireActual('react-hot-toast'),
    error: jest.fn(),
}));

jest.mock('axios', () => ({
    get: jest.fn(() => Promise.resolve({ data: {} })),
}));

jest.mock('../../services/publicationService', () => ({
    getPublicationsByUser: jest.fn(),
}));

jest.mock('../../services/userService', () => ({
    findUserByUsername: jest.fn(),
    checkFollow: jest.fn(),
    getFollowers: jest.fn(),
    getFollows: jest.fn(),
}));

describe('Seguir tests', () => {
    test('el perfil que se visualiza es del usuario en sesión', async () => {
        const mockedUsername = 'testUsername';
        useParams.mockReturnValue({ username: mockedUsername });
        render(
            <BrowserRouter>
                <Feed />
            </BrowserRouter>
        );
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
        publicationService.getPublicationsByUser.mockResolvedValueOnce({ publications: [] });

        waitFor(() => {
            expect(screen.getByText('Seguir')).toBeNull();
        }, { timeout: 3000 });
    });

    test('el usuario en sesión no sigue al usuario y aparece el botón de seguir', async () => {
        const mockedUsername = 'testUsername12345';
        useParams.mockReturnValue({ username: mockedUsername });
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
        userService.checkFollow.mockResolvedValueOnce(false);
        publicationService.getPublicationsByUser.mockResolvedValueOnce({ publications: [] });

        render(
            <BrowserRouter>
                <Feed />
            </BrowserRouter>
        );

        waitFor(() => {
            expect(screen.getByText('Seguir')).toBeInTheDocument();
        }, { timeout: 3000 });
    });
});