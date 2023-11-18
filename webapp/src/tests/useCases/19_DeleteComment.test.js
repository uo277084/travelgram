import { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

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
import PostView from '../../components/publications/view/PostView';
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
    deletePublication: jest.fn(),
    getCommentsOfPublication: jest.fn(),
}));

describe('Eliminar comentario tests', () => {

    test('el usuario borra un comentario que ha publicado en una publicación que solo tiene un comentario', async () => {
        window.HTMLElement.prototype.scrollIntoView = function () { };

        publicationService.checkLike.mockResolvedValueOnce({ success: false });
        publicationService.countLikes.mockResolvedValueOnce({ count: 0 });
        publicationService.getCommentsOfPublication.mockResolvedValueOnce({
            comments: [
                {
                    id: "idComment1",
                    comment: "buen post",
                    user: "testUsername",
                    timestamp: {
                        _seconds: 1697578592,
                        _nanoseconds: 318000000
                    }
                }
            ]
        });
        userService.findUserByUsername.mockResolvedValueOnce({
            userExists: true,
            user: {
                username: 'testUsername',
                email: 'test@email.com',
                password: 'testtest',
                birthDate: new Date('2001-06-22T22:00:00.000Z'),
                profilePic: '',
                name: 'testName',
                savedPosts: [],
                followers: [],
            }
        });
        publicationService.removeCommentFromAPublication.mockResolvedValueOnce({ success: true });

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
            description: "",
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

        expect(screen.getByTestId('DeleteForeverIcon')).toBeInTheDocument();
        const deleteCommentButton = screen.getByTestId('DeleteForeverIcon');
        await act(async () => {
            fireEvent.click(deleteCommentButton);
        });

        expect(screen.getByText('No hay comentarios')).toBeInTheDocument();
    });

    test('el usuario borra un comentario que ha publicado otro usuario', async () => {
        window.HTMLElement.prototype.scrollIntoView = function () { };

        publicationService.checkLike.mockResolvedValueOnce({ success: false });
        publicationService.countLikes.mockResolvedValueOnce({ count: 0 });
        publicationService.getCommentsOfPublication.mockResolvedValueOnce({
            comments: [
                {
                    id: "idComment1",
                    comment: "buen post",
                    user: "testUsername123",
                    timestamp: {
                        _seconds: 1697578592,
                        _nanoseconds: 318000000
                    }
                }
            ]
        });
        userService.findUserByUsername.mockResolvedValueOnce({
            userExists: true,
            user: {
                username: 'testUsername',
                email: 'test@email.com',
                password: 'testtest',
                birthDate: new Date('2001-06-22T22:00:00.000Z'),
                profilePic: '',
                name: 'testName',
                savedPosts: [],
                followers: [],
            }
        });
        publicationService.removeCommentFromAPublication.mockResolvedValueOnce({ success: true });

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
            description: "",
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

        expect(screen.getByTestId('DeleteForeverIcon')).toBeInTheDocument();
        const deleteCommentButton = screen.getByTestId('DeleteForeverIcon');
        await act(async () => {
            fireEvent.click(deleteCommentButton);
        });

        expect(screen.getByText('No hay comentarios')).toBeInTheDocument();
    });
});