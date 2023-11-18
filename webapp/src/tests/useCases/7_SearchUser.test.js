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
import Header from '../../components/common/Header';
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

    render(<BrowserRouter>
        <Header />
    </BrowserRouter>);
});

jest.mock('react-hot-toast', () => ({
    ...jest.requireActual('react-hot-toast'),
    error: jest.fn(),
}));

jest.mock('axios', () => ({
    get: jest.fn(() => Promise.resolve({ data: {} })),
}));

jest.mock('../../services/userService', () => ({
    getUsersExceptSessionUserSearch: jest.fn()
}));

describe('Buscar usuario por nombre de usuario tests', () => {
    test('el usuario busca un nombre de usuario que no coincide con ningún usuario ', async () => {
        userService.getUsersExceptSessionUserSearch.mockResolvedValueOnce([]);
        const input = screen.getByTestId('input-search').querySelector('input');

        fireEvent.change(input, { target: { value: 'test' } });
        expect(input.value).toBe('test');

        const buttonSearch = screen.getByTestId('button-search');

        act(() => {
            fireEvent.click(buttonSearch);
        });

        waitFor(() => {
            expect(screen.getByText('Ningún nombre de usuario coincide con la búsqueda')).toBeInTheDocument();
        }, { timeout: 3000 });
    });

    test('el usuario busca un nombre de usuario que coincide con algún usuario', async () => {
        userService.getUsersExceptSessionUserSearch.mockResolvedValueOnce([
            {
                "savedPosts": [],
                "password": "testtesttest",
                "followers": [],
                "profilePic": "",
                "name": "testUser123",
                "birthDate": "2001-07-28T22:00:00.000Z",
                "email": "testUser123@gmail.com",
                "username": "testUser123"
            }
        ]);
        const input = screen.getByTestId('input-search').querySelector('input');

        fireEvent.change(input, { target: { value: 'test' } });
        expect(input.value).toBe('test');

        const buttonSearch = screen.getByTestId('button-search');

        act(() => {
            fireEvent.click(buttonSearch);
        });

        waitFor(() => {
            expect(screen.getByText('testUser123')).toBeInTheDocument();
        }, { timeout: 3000 });
    });
});