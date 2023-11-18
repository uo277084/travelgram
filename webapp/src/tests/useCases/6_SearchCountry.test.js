import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
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

import { BrowserRouter } from 'react-router-dom';
import Home from '../../components/home/Home';
import publicationService from '../../services/publicationService';

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

jest.mock('../../services/publicationService', () => ({
    getRecommendPosts: jest.fn(),
    getPublicationsByCountry: jest.fn()
}));

describe('Buscar publicación por país tests', () => {

    test('el usuario busca un país del que no hay publicaciones ajenas', async () => {
        publicationService.getRecommendPosts.mockResolvedValueOnce({ publications: [], success: true });
        publicationService.getPublicationsByCountry.mockResolvedValueOnce({ publications: [] }).mockResolvedValueOnce({ publications: [] });

        await act(async () => {
            render(<BrowserRouter>
                <Home />
            </BrowserRouter>);
        });

        const autoCompleteCountries = screen.getByTestId("countries");

        const countriesInput = autoCompleteCountries.querySelector('input');

        autoCompleteCountries.focus();
        fireEvent.change(countriesInput, { target: { value: 'a' } })
        await new Promise(resolve => setTimeout(resolve, 100));
        fireEvent.keyDown(autoCompleteCountries, { key: 'ArrowDown' })
        await new Promise(resolve => setTimeout(resolve, 100));
        fireEvent.keyDown(autoCompleteCountries, { key: 'Enter' })
        await new Promise(resolve => setTimeout(resolve, 100));
        await act(async () => {
            userEvent.click(document.body);
        });

        expect(countriesInput.value).toBe('Afganistán');

        const buttonSearch = screen.getByTestId('sendButton');

        await act(async () => {
            fireEvent.click(buttonSearch);
        });

        waitFor(() => {
            expect(screen.getByText('No hay publicaciones de Afganistán')).toBeInTheDocument();
        }, { timeout: 3000 });
    });

    test('el usuario busca un país del que existen publicaciones ajenas', async () => {
        publicationService.getRecommendPosts.mockResolvedValueOnce({ publications: [], success: true });
        publicationService.getPublicationsByCountry.mockResolvedValueOnce({
            publications: [{
                id: "id1",
                country: "Afganistán",
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
                user: "testUser123",
                dateTripFinish: new Date(),
                likes: [],
                images: []
            }]
        })
            .mockResolvedValueOnce({
                publications: [{
                    id: "id1",
                    country: "Afganistán",
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
                    user: "testUser123",
                    dateTripFinish: new Date(),
                    likes: [],
                    images: []
                }]
            });

        await act(async () => {
            render(<BrowserRouter>
                <Home />
            </BrowserRouter>);
        });

        const autoCompleteCountries = screen.getByTestId("countries");

        const countriesInput = autoCompleteCountries.querySelector('input');

        autoCompleteCountries.focus();
        fireEvent.change(countriesInput, { target: { value: 'a' } })
        fireEvent.keyDown(autoCompleteCountries, { key: 'ArrowDown' })
        fireEvent.keyDown(autoCompleteCountries, { key: 'Enter' })

        await act(async () => {
            userEvent.click(document.body);

            expect(countriesInput.value).toBe('Afganistán');

            const buttonSearch = screen.getByTestId('sendButton')

            await act(async () => {
                fireEvent.click(buttonSearch);
            });

            waitFor(() => {
                expect(screen.getByText('Me lo pasé muy bien')).toBeInTheDocument();
                expect(screen.getByText('testUser123')).toBeInTheDocument();
            }, { timeout: 3000 });
        });
    });
});