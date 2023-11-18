import { render, screen } from '@testing-library/react';

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
import FollowedPosts from '../../components/publications/follows/FollowedPosts';
import publicationService from '../../services/publicationService';
import userService from '../../services/userService';

beforeEach(async () => {
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
});

jest.mock('react-hot-toast', () => ({
    ...jest.requireActual('react-hot-toast'),
    error: jest.fn(),
}));

jest.mock('axios', () => ({
    get: jest.fn(() => Promise.resolve({ data: {} })),
}));

jest.mock('../../services/publicationService', () => ({
    getPublicationsOfFollowedusersOrderedByDate: jest.fn()
}));

jest.mock('../../services/userService', () => ({
    getFollows: jest.fn()
}));

describe('Ver publicaciones de seguidos tests', () => {
    test('el usuario visualiza las publicaciones de seguidos sin tener ningún seguido', async () => {
        userService.getFollows.mockResolvedValueOnce([]);

        await act(async () => {
            render(<BrowserRouter>
                <FollowedPosts />
            </BrowserRouter>);
        });

        expect(screen.getByText('No hay publicaciones')).toBeInTheDocument();
    });

    test('el usuario visualiza las publicaciones de seguidos sin que ninguno de sus seguidos haya compartido ninguna publicación', async () => {
        userService.getFollows.mockResolvedValueOnce([
            {
                password: "testtest",
                name: "testUsername1",
                birthDate: "2001-07-11T22:00:00.000Z",
                email: "test1@gmail.com",
                username: "testUsername1",
                profilePic: "",
                savedPosts: [],
                followers: []
            },
            {
                password: "testtest",
                name: "testUsername2",
                birthDate: "2001-07-11T22:00:00.000Z",
                email: "test2@gmail.com",
                username: "testUsername2",
                profilePic: "",
                savedPosts: [],
                followers: []
            }
        ]);
        publicationService.getPublicationsOfFollowedusersOrderedByDate.mockResolvedValueOnce([]);

        await act(async () => {
            render(<BrowserRouter>
                <FollowedPosts />
            </BrowserRouter>);
        });

        expect(screen.getByText('No hay publicaciones')).toBeInTheDocument();
    });

    test('el usuario visualiza las publicaciones que sus seguidos han compartido', async () => {
        userService.getFollows.mockResolvedValueOnce([
            {
                password: "testtest",
                name: "testUsername1",
                birthDate: "2001-07-11T22:00:00.000Z",
                email: "test1@gmail.com",
                username: "testUsername1",
                profilePic: "",
                savedPosts: [],
                followers: []
            },
            {
                password: "testtest",
                name: "testUsername2",
                birthDate: "2001-07-11T22:00:00.000Z",
                email: "test2@gmail.com",
                username: "testUsername2",
                profilePic: "",
                savedPosts: [],
                followers: []
            }
        ]);
        publicationService.getPublicationsOfFollowedusersOrderedByDate.mockResolvedValueOnce({
            publications: [
                {
                    id: "id1",
                    country: "México",
                    cities: [
                        "San Luis Potosí City",
                        "Monterrey",
                        "Guadalajara",
                        "Chihuahua City",
                        "Cancún"
                    ],
                    dateTripStart: new Date(),
                    datePublication: {
                        _nanoseconds: 235000000,
                        _seconds: 1697578480
                    },
                    rating: 5,
                    description: "Que bonito México",
                    user: "testUsername1",
                    dateTripFinish: new Date(),
                    likes: [],
                    images: ['https://res.cloudinary.com/asw2122/image/upload/v1690741985/tfg/photos/buscador.jpg']
                },
                {
                    id: "id2",
                    country: "China",
                    cities: [
                        "Shanghái",
                        "Pekín"
                    ],
                    dateTripStart: new Date(),
                    datePublication: {
                        _nanoseconds: 235000000,
                        _seconds: 1697578480
                    },
                    rating: 4.5,
                    description: "Que bonita China",
                    user: "testUsername2",
                    dateTripFinish: new Date(),
                    likes: [],
                    images: ['https://res.cloudinary.com/asw2122/image/upload/v1690741985/tfg/photos/buscador.jpg']
                }
            ]
        });

        await act(async () => {
            render(<BrowserRouter>
                <FollowedPosts />
            </BrowserRouter>);
        });

        expect(screen.getByText('México')).toBeInTheDocument();
        expect(screen.getByText('China')).toBeInTheDocument();

        expect(screen.getByText('Que bonito México')).toBeInTheDocument();
        expect(screen.getByText('Que bonita China')).toBeInTheDocument();

        expect(screen.getByText('testUsername1')).toBeInTheDocument();
        expect(screen.getByText('testUsername2')).toBeInTheDocument();
    });
});