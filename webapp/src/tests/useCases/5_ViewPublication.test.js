import { render, screen } from '@testing-library/react';
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

describe('Ver publicación tests', () => {

    test('la publicación no tiene “me gustas”, no está guardada, no tiene imágenes, no tiene descripción y no tiene comentarios', async () => {
        publicationService.checkLike.mockResolvedValueOnce({ success: false });
        publicationService.countLikes.mockResolvedValueOnce({ count: 0 });
        publicationService.getCommentsOfPublication.mockResolvedValueOnce({ comments: [] });

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

        expect(screen.getByText('testUsername123')).toBeInTheDocument();
        expect(screen.getByText('México')).toBeInTheDocument();
        expect(screen.getByText('San Luis Potosí City')).toBeInTheDocument();
        expect(screen.getByText('Monterrey')).toBeInTheDocument();
        expect(screen.getByText('Guadalajara')).toBeInTheDocument();
        expect(screen.getByText('Chihuahua City')).toBeInTheDocument();
        expect(screen.getByText('Cancún')).toBeInTheDocument();
        expect(screen.queryByText('Descripción')).toBeNull();
        expect(screen.queryByText('me gusta')).toBeNull();

        expect(screen.getByTestId('BookmarkBorderIcon')).toBeInTheDocument();

        const images = screen.queryAllByRole('img');
        expect(images.length).toBe(1); //solo rating

        const commentsList = screen.queryAllByRole('listitem');
        expect(commentsList).toHaveLength(5); //solo las ciudades
    });

    test('la publicación está guardada, tiene “me gustas”, tiene imágenes, tiene descripción y tiene comentarios', async () => {
        publicationService.checkLike.mockResolvedValueOnce({ success: false });
        publicationService.countLikes.mockResolvedValueOnce({ count: 1 });
        publicationService.getCommentsOfPublication.mockResolvedValueOnce({
            comments: [
                {
                    id: "idComment1",
                    comment: "me gusta la foto!",
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
                email: 'testEmail@email.com',
                password: 'testPassword',
                birthDate: new Date('2001-06-22T22:00:00.000Z'),
                profilePic: '',
                name: 'testName',
                savedPosts: [],
                followers: [],
            }
        });
        userService.checkSavedPost.mockResolvedValueOnce(true);

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
            description: "Me lo pasé bien",
            user: "testUsername123",
            dateTripFinish: new Date(),
            likes: ['testUsername'],
            images: ['https://res.cloudinary.com/asw2122/image/upload/v1690741985/tfg/photos/buscador.jpg']
        }
        const userSession = {
            username: 'testUsername',
            password: 'testtest',
            birthDate: '2001-06-22T22:00:00.000Z',
            email: 'test@email.com',
            followers: [],
            savedPosts: ['id1'],
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

        expect(screen.getByText('testUsername123')).toBeInTheDocument();
        expect(screen.getByText('México')).toBeInTheDocument();
        expect(screen.getByText('San Luis Potosí City')).toBeInTheDocument();
        expect(screen.getByText('Monterrey')).toBeInTheDocument();
        expect(screen.getByText('Guadalajara')).toBeInTheDocument();
        expect(screen.getByText('Chihuahua City')).toBeInTheDocument();
        expect(screen.getByText('Cancún')).toBeInTheDocument();
        expect(screen.queryByText('Me lo pasé bien')).toBeInTheDocument();
        expect(screen.queryByText('1 me gusta')).toBeInTheDocument();

        expect(screen.getByTestId('BookmarkIcon')).toBeInTheDocument();

        const images = screen.queryAllByRole('img');
        expect(images.length).toBe(1); //el rating

        expect(screen.getByAltText('Imagen de la publicación')).toBeInTheDocument();

        const commentsList = screen.queryAllByRole('listitem');
        expect(commentsList).toHaveLength(6); //ciudades y comentario

        expect(screen.getByText('me gusta la foto!')).toBeInTheDocument();
    });
});