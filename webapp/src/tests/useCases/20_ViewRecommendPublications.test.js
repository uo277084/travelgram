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
import Home from '../../components/home/Home';
import publicationService from '../../services/publicationService';

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

    publicationService.getRecommendPosts.mockResolvedValueOnce({
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
            },
            {
                id: "id3",
                country: "Japón",
                cities: [
                    "Tokio",
                    "Osaka"
                ],
                dateTripStart: new Date(),
                datePublication: {
                    _nanoseconds: 235000000,
                    _seconds: 1697578480
                },
                rating: 4,
                description: "Que bonito Japón",
                user: "testUsername3",
                dateTripFinish: new Date(),
                likes: [],
                images: ['https://res.cloudinary.com/asw2122/image/upload/v1690741985/tfg/photos/buscador.jpg']
            }
        ],
        success: true
    }
    );

    await act(async () => {
        render(<BrowserRouter>
            <Home />
        </BrowserRouter>);
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
    getRecommendPosts: jest.fn(),
    getPublicationsByCountry: jest.fn()
}));

describe('Ver publicaciones recomendadas tests', () => {
    test('el usuario visualiza las publicaciones recomendadas', async () => {
        expect(screen.getByText('México')).toBeInTheDocument();
        expect(screen.getByText('China')).toBeInTheDocument();
        expect(screen.getByText('Japón')).toBeInTheDocument();

        expect(screen.getByText('Que bonito México')).toBeInTheDocument();
        expect(screen.getByText('Que bonita China')).toBeInTheDocument();
        expect(screen.getByText('Que bonito Japón')).toBeInTheDocument();

        expect(screen.getByText('testUsername1')).toBeInTheDocument();
        expect(screen.getByText('testUsername2')).toBeInTheDocument();
        expect(screen.getByText('testUsername3')).toBeInTheDocument();
    });
});