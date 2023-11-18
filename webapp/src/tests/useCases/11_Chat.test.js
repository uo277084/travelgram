import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
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
import Chat from '../../components/chats/Chats';
import firebaseListeners from '../../firebase/firebaseListeners';
import chatService from '../../services/chatService';
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

    firebaseListeners.changeChatOrderListener.mockReturnValue(jest.fn());
    firebaseListeners.configureChatListener.mockReturnValue(jest.fn());
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

jest.mock('../../firebase/firebaseListeners', () => ({
    ...jest.requireActual('../../firebase/firebaseListeners'),
    changeChatOrderListener: jest.fn(),
    configureChatListener: jest.fn(),
}));

jest.mock('../../services/chatService', () => ({
    getChatOrder: jest.fn(),
    checkChat: jest.fn(),
    createChat: jest.fn(),
    getMessages: jest.fn(),
    addMessage: jest.fn(),
}));

jest.mock('../../services/userService', () => ({
    findUserByUsername: jest.fn(),
    getUsersExceptSessionUserSearch: jest.fn()
}));

describe('Chatear tests', () => {
    test('el usuario no tiene chats recientes', async () => {
        const mockedUsername = 'testUsername1';
        useParams.mockReturnValue({ username: mockedUsername });
        chatService.getChatOrder.mockResolvedValueOnce({ success: true, chats: [] });

        await act(async () => {
            render(<BrowserRouter>
                <Chat />
            </BrowserRouter>);
        });

        expect(screen.getByText('No hay chats. Busca un usuario y comienza a chatear')).toBeInTheDocument();
    });

    test('el usuario tiene chats recientes', async () => {
        const mockedUsername = 'testUsername1';
        useParams.mockReturnValue({ username: mockedUsername });
        chatService.getChatOrder.mockResolvedValueOnce({
            success: true,
            chats: [
                {
                    chat: {
                        user1: "testUsername1",
                        lastMessage: {
                            message: "Hola!",
                            timestamp: {
                                _seconds: 1698957357,
                                _nanoseconds: 475000000
                            }
                        },
                        user2: "testUsername",
                        id: "id1"
                    }
                },
                {
                    chat: {
                        user1: "testUsername2",
                        lastMessage: {
                            message: "hola",
                            timestamp: {
                                _seconds: 1698956974,
                                _nanoseconds: 629000000
                            }
                        },
                        user2: "testUsername",
                        id: "id2"
                    }
                },
                {
                    chat: {
                        user1: "testUsername3",
                        lastMessage: {
                            message: "qué tal??",
                            timestamp: {
                                _seconds: 1697576537,
                                _nanoseconds: 117000000
                            }
                        },
                        user2: "testUsername",
                        id: "id3"
                    }
                }
            ]
        });
        userService.findUserByUsername.mockImplementationOnce(() => ({
            userExists: true,
            user: {
                username: 'testUsername1',
                email: 'testEmail1@email.com',
                password: 'testPassword',
                birthDate: new Date('2001-06-22T22:00:00.000Z'),
                profilePic: '',
                name: 'testName1',
                savedPosts: [],
                followers: [],
            }
        }));
        userService.findUserByUsername.mockImplementationOnce(() => ({
            userExists: true,
            user: {
                username: 'testUsername2',
                email: 'testEmail2@email.com',
                password: 'testPassword',
                birthDate: new Date('2001-06-22T22:00:00.000Z'),
                profilePic: '',
                name: 'testName2',
                savedPosts: [],
                followers: [],
            }
        }));
        userService.findUserByUsername.mockImplementationOnce(() => ({
            userExists: true,
            user: {
                username: 'testUsername3',
                email: 'testEmail3@email.com',
                password: 'testPassword',
                birthDate: new Date('2001-06-22T22:00:00.000Z'),
                profilePic: '',
                name: 'testName3',
                savedPosts: [],
                followers: [],
            }
        }));

        await act(async () => {
            render(<BrowserRouter>
                <Chat />
            </BrowserRouter>);
        });

        expect(screen.getByText('testUsername1')).toBeInTheDocument();
        expect(screen.getByText('testUsername2')).toBeInTheDocument();
        expect(screen.getByText('testUsername3')).toBeInTheDocument();
    });

    test('el chat seleccionado por el usuario tiene mensajes anteriores', async () => {
        window.HTMLElement.prototype.scrollIntoView = function () { };

        const mockedUsername = 'testUsername1';
        useParams.mockReturnValue({ username: mockedUsername });

        chatService.getChatOrder.mockResolvedValueOnce({ success: true, chats: [] });
        chatService.checkChat.mockResolvedValueOnce({
            chatExists: true,
            chat: {
                user1: "testUsername1",
                lastMessage: {
                    message: "Hola!",
                    timestamp: {
                        _seconds: 1698957357,
                        _nanoseconds: 475000000
                    }
                },
                user2: "testUsername",
                id: "id1"
            }
        });
        userService.findUserByUsername.mockImplementationOnce(() => ({
            userExists: false,
            user: {
                username: 'testUsername1',
                email: 'testEmail@email.com',
                password: 'testPassword',
                birthDate: new Date('2001-06-22T22:00:00.000Z'),
                profilePic: '',
                name: 'testName',
                savedPosts: [],
                followers: [],
            }
        }));
        userService.findUserByUsername.mockImplementationOnce(() => ({
            userExists: false,
            user: {
                username: 'testUsername',
                password: 'testtest',
                birthDate: new Date('2001-06-22T22:00:00.000Z'),
                email: 'test@email.com',
                followers: [],
                savedPosts: [],
                name: 'testName',
                profilePic: ""
            }
        }));
        chatService.getMessages.mockResolvedValueOnce({
            success: true, messages: [
                {
                    message: "Hola testUsername!",
                    timestamp: {
                        _seconds: 1696938364,
                        _nanoseconds: 475000000
                    },
                    sender: "testUsername1",
                    receiver: "testUsername"
                },
                {
                    message: "Hola testUsername1!",
                    timestamp: {
                        _seconds: 1696957427,
                        _nanoseconds: 475000000
                    },
                    sender: "testUsername",
                    receiver: "testUsername1"
                }
            ]
        });

        await act(async () => {
            render(<BrowserRouter>
                <Chat />
            </BrowserRouter>);
        });

        expect(screen.getByText('Hola testUsername!')).toBeInTheDocument();
        expect(screen.getByText('Hola testUsername1!')).toBeInTheDocument();
    });

    test('el chat seleccionado por el usuario no tiene mensajes anteriores', async () => {
        window.HTMLElement.prototype.scrollIntoView = function () { };

        const mockedUsername = 'testUsername1';
        useParams.mockReturnValue({ username: mockedUsername });

        chatService.getChatOrder.mockResolvedValueOnce({ success: true, chats: [] });
        chatService.checkChat.mockResolvedValueOnce({
            chatExists: true,
            chat: {
                user1: "testUsername1",
                lastMessage: null,
                user2: "testUsername",
                id: "id1"
            }
        });
        userService.findUserByUsername.mockImplementationOnce(() => ({
            userExists: false,
            user: {
                username: 'testUsername1',
                email: 'testEmail@email.com',
                password: 'testPassword',
                birthDate: new Date('2001-06-22T22:00:00.000Z'),
                profilePic: '',
                name: 'testName',
                savedPosts: [],
                followers: [],
            }
        }));
        userService.findUserByUsername.mockImplementationOnce(() => ({
            userExists: false,
            user: {
                username: 'testUsername',
                password: 'testtest',
                birthDate: new Date('2001-06-22T22:00:00.000Z'),
                email: 'test@email.com',
                followers: [],
                savedPosts: [],
                name: 'testName',
                profilePic: ""
            }
        }));
        chatService.getMessages.mockResolvedValueOnce({
            success: true, messages: []
        });

        await act(async () => {
            render(<BrowserRouter>
                <Chat />
            </BrowserRouter>);
        });

        expect(screen.getByText('No hay mensajes')).toBeInTheDocument();
    });
});