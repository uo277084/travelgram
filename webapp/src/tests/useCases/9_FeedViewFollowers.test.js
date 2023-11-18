import { fireEvent, render, screen, waitFor } from '@testing-library/react';

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

    userService.getFollows.mockResolvedValueOnce({ data: [] });

    Object.defineProperty(window, "localStorage", {
        value: {
            getItem: jest.fn(() => JSON.stringify(userLogged)),
            setItem: jest.fn(() => JSON.stringify(userLogged)),
        },
        writable: true,
    });
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

describe('Ver seguidores tests', () => {
    test('el usuario no tiene seguidores', async () => {
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
        userService.getFollowers.mockResolvedValueOnce({ data: [] });
        publicationService.getPublicationsByUser.mockResolvedValueOnce({ publications: [] });

        render(<BrowserRouter>
            <Feed />
        </BrowserRouter>);

        const seguidoresSpan = screen.getByText('Seguidores');

        act(() => {
            fireEvent.click(seguidoresSpan);
        });

        waitFor(() => {
            expect(screen.getByText('No tienes seguidores')).toBeInTheDocument();
        }, { timeout: 3000 });
    });

    test('el usuario tiene seguidores', async () => {
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
        userService.getFollowers.mockResolvedValueOnce(
            [
                {
                    username: 'testUsername123',
                    email: 'testEmail123@email.com',
                    password: 'testPassword',
                    birthDate: new Date('2001-06-22T22:00:00.000Z'),
                    profilePic: '',
                    name: 'testName123',
                    savedPosts: [],
                    followers: [],
                }
            ]);
        publicationService.getPublicationsByUser.mockResolvedValueOnce({ publications: [] });

        render(<BrowserRouter>
            <Feed />
        </BrowserRouter>);

        const seguidoresSpan = screen.getByText('Seguidores');

        fireEvent.click(seguidoresSpan);

        waitFor(() => {
            expect(screen.getByText('test123')).toBeInTheDocument();
        }, { timeout: 3000 });
    });
});