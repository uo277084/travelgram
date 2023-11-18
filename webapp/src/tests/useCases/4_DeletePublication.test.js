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
import PostView from '../../components/publications/view/PostView';

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
});

jest.mock('react-hot-toast', () => ({
    ...jest.requireActual('react-hot-toast'),
    error: jest.fn(),
}));

jest.mock('axios', () => ({
    get: jest.fn(() => Promise.resolve({ data: {} })),
}));

jest.mock('../../services/userService', () => ({
    checkSavedPost: jest.fn(),
    unsavePost: jest.fn(),
    savePost: jest.fn(),
    findUserByUsername: jest.fn(),
    deletePublicationOfSavedPosts: jest.fn(),
}));

jest.mock('../../services/publicationService', () => ({
    checkLike: jest.fn(),
    countLikes: jest.fn(),
    addCommentToAPublication: jest.fn(),
    addLike: jest.fn(),
    removeLike: jest.fn(),
    removeCommentFromAPublication: jest.fn(),
    deletePublication: jest.fn()
}));

describe('Borrar publicación tests', () => {

    test('la publicación no es del usuario en sesión', async () => {
        const postView = {
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
            description: "Me lo pasé muy bien",
            user: "testUsername123",
            dateTripFinish: new Date(),
            likes: [],
            images: []
        }
        const userSession = {
            username: 'testUsername',
            password: 'testtest',
            birthDate: '2001-06-22T22:00:00.000Z',
            email: 'test@email.com',
            followers: [],
            savedPosts: [],
            name: 'testName',
            profilePic: ""
        };
        await act(async () => {
            render(
                <BrowserRouter>
                    <PostView post={postView} sessionUser={userSession} savedPosts={false} />
                </BrowserRouter>
            );
        });

        expect(screen.queryByRole('button', { name: 'Eliminar publicación' })).not.toBeInTheDocument();
    });

    test('la publicación es del usuario en sesión', async () => {
        const postView = {
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
            description: "Me lo pasé muy bien",
            user: "testUsername",
            dateTripFinish: new Date(),
            likes: [],
            images: []
        }
        const userSession = {
            username: 'testUsername',
            password: 'testtest',
            birthDate: '2001-06-22T22:00:00.000Z',
            email: 'test@email.com',
            followers: [],
            savedPosts: [],
            name: 'testName',
            profilePic: ""
        };
        await act(async () => {
            render(
                <BrowserRouter>
                    <PostView post={postView} sessionUser={userSession} savedPosts={false} />
                </BrowserRouter>
            );
        });

        const deleteButton = screen.getByRole('button', { name: 'Eliminar publicación' });
        expect(deleteButton).toBeInTheDocument();
    });
});