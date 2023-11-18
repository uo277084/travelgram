import { render, screen, waitFor } from '@testing-library/react';

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

    userService.getFollowers.mockResolvedValueOnce({ data: [] });
    userService.getFollows.mockResolvedValueOnce({ data: [] });
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

describe('Ver publicaciones tests', () => {
    test('el usuario no ha compartido ninguna publicación', async () => {
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

        await act(async () => {
            render(<BrowserRouter>
                <Feed />
            </BrowserRouter>);
        });

        waitFor(() => {
            expect(screen.getByText('No hay publicaciones')).toBeInTheDocument();
        }, { timeout: 3000 });
    });

    test('el usuario ha compartido publicaciones', async () => {
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
        publicationService.getPublicationsByUser.mockResolvedValueOnce({
            publications: [
                {
                    id: "H2tRv0qYbnhxz2KLqb65",
                    country: "México",
                    cities: [
                        "San Luis Potosí City",
                        "Monterrey",
                        "Guadalajara",
                        "Chihuahua City",
                        "Cancún"
                    ],
                    dateTripStart: new Date(),
                    datePublication: new Date(),
                    rating: 5,
                    description: "Me lo pasé muy bien",
                    user: "testUsername",
                    dateTripFinish: new Date(),
                    likes: [],
                    images: []
                }
            ]
        });

        render(<BrowserRouter>
            <Feed />
        </BrowserRouter>);

        waitFor(() => {
            expect(screen.getByText('México')).toBeInTheDocument();
        }, { timeout: 3000 });
    });
});