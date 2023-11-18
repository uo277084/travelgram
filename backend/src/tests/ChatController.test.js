const { admin, chatsCollection } = require('./firebaseConfigTest');

const { getChatOrder, addMessage, changeUserFromChat, checkChat, createChat, getChatByUsers, getMessages } = require('../controllers/ChatController');

beforeAll(async () => {
    await chatsCollection.doc('chat1').set({
        user1: 'testUser1',
        user2: 'testUser2',
        lastMessage: {
            message: 'hola1',
            timestamp: {
                "_seconds": 1696724439,
                "_nanoseconds": 629000000
            }
        }
    });

    await chatsCollection.doc('chat2').set({
        user1: 'testUser2',
        user2: 'testUser3',
        lastMessage: {
            message: 'hola2',
            timestamp: {
                "_seconds": 1698956974,
                "_nanoseconds": 629000000
            }
        }
    });

    await chatsCollection.doc('chat3').set({
        user1: 'testUser2',
        user2: 'testUser4',
        lastMessage: {
            message: 'hola3',
            timestamp: {
                "_seconds": 1697576537,
                "_nanoseconds": 117000000
            }
        }
    });

    await chatsCollection.doc('chat4').set({
        user1: 'testUser5',
        user2: 'testUser2',
        lastMessage: {
            message: 'hola4',
            timestamp: {
                "_seconds": 1687576537,
                "_nanoseconds": 117000000
            }
        }
    });

    await chatsCollection.doc('chat5').set({
        user1: 'testUser1',
        user2: 'testUser5',
        lastMessage: {
            message: 'hola5',
            timestamp: {
                "_seconds": 1698956974,
                "_nanoseconds": 629000000
            }
        }
    });

    await chatsCollection.doc('chat6').set({
        user1: 'testUser3',
        user2: 'testUser5',
        lastMessage: null
    });

    await chatsCollection.doc('chat7').set({
        user1: 'testUser15',
        user2: 'testUser16',
        lastMessage: null
    });

    await chatsCollection.doc('chat8').set({
        user1: 'testUser97',
        user2: 'testUser98',
        lastMessage: {
            message: 'hola98',
            timestamp: {
                "_seconds": 1698956974,
                "_nanoseconds": 629000000
            }
        }
    });
});

afterAll(async () => {
    const snapshots = await chatsCollection.get();
    snapshots.forEach((doc) => {
        doc.ref.delete();
    });

    await admin.app().delete();
});

describe('getChatOrder tests', () => {
    test('el usuario no tiene ningún chat', async () => {
        const req = { params: { username: 'testUser6' } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await getChatOrder(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ chats: [] }));
    });

    test('el usuario tiene menos de 3 chats', async () => {
        const req = { params: { username: 'testUser1' } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await getChatOrder(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            chats: expect.arrayContaining([
                expect.objectContaining({
                    chat: expect.objectContaining({
                        user1: 'testUser1',
                        user2: 'testUser2',
                        lastMessage: {
                            message: 'hola1',
                            timestamp: expect.any(Object),
                        },
                    }),
                }),
                expect.objectContaining({
                    chat: expect.objectContaining({
                        user1: 'testUser1',
                        user2: 'testUser5',
                        lastMessage: {
                            message: 'hola5',
                            timestamp: expect.any(Object),
                        },
                    }),
                }),
            ])
        }));
    });

    test('el usuario tiene más de 3 chats', async () => {
        const req = { params: { username: 'testUser2' } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await getChatOrder(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            chats: expect.arrayContaining([
                expect.objectContaining({
                    chat: expect.objectContaining({
                        user1: 'testUser1',
                        user2: 'testUser2',
                        lastMessage: {
                            message: 'hola1',
                            timestamp: expect.any(Object),
                        },
                    }),
                }),
                expect.objectContaining({
                    chat: expect.objectContaining({
                        user1: 'testUser2',
                        user2: 'testUser3',
                        lastMessage: {
                            message: 'hola2',
                            timestamp: expect.any(Object),
                        },
                    }),
                }),
                expect.objectContaining({
                    chat: expect.objectContaining({
                        user1: 'testUser2',
                        user2: 'testUser4',
                        lastMessage: {
                            message: 'hola3',
                            timestamp: expect.any(Object),
                        },
                    }),
                })
            ])
        }));
    });
});

describe('getChatByUsers tests', () => {
    test('no hay chat entre los usuarios', async () => {
        const req = { params: { user1: 'testUser1', user2: 'testUser6' } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await getChatByUsers(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ chat: null }));
    });

    test('hay chat entre los usuarios', async () => {
        const req = { params: { user1: 'testUser1', user2: 'testUser2' } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await getChatByUsers(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            chat: {
                user1: 'testUser1',
                user2: 'testUser2',
                lastMessage: {
                    message: 'hola1',
                    timestamp: expect.any(Object),
                }
            }
        }));
    });
});

describe('addMessage tests', () => {
    test('no existe chat entre los usuarios', async () => {
        const req = { body: { sender: 'testUser1', receiver: 'testUser193382891', message: 'adios' } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await addMessage(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Chat not found' });
    });

    test('existe chat entre los usuarios', async () => {
        const req = { body: { sender: 'testUser1', receiver: 'testUser2', message: 'adios' } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await addMessage(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            message: expect.objectContaining({
                message: 'adios',
                sender: 'testUser1',
                receiver: 'testUser2',
                timestamp: expect.any(Object),
            }),
        }));
    })
});

describe('getMessages tests', () => {
    test('el chat no tiene mensajes', async () => {
        const req = { params: { chatId: 'chat6' } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await getMessages(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ messages: [] }));
    });

    test('el chat tiene mensajes', async () => {
        const messagesCollectionRef = chatsCollection.doc('chat1').collection('messages');
        await messagesCollectionRef.add({
            sender: 'testUser2',
            receiver: 'testUser1',
            message: 'hola1',
            timestamp: {
                "_seconds": 1696724439,
                "_nanoseconds": 629000000
            }
        });
        await messagesCollectionRef.add({
            sender: 'testUser1',
            receiver: 'testUser2',
            message: 'hola2',
            timestamp: {
                "_seconds": 1695772541,
                "_nanoseconds": 629000000
            }
        });

        const req = { params: { chatId: 'chat1' } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await getMessages(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            messages: expect.arrayContaining([
                expect.objectContaining({
                    sender: 'testUser2',
                    receiver: 'testUser1',
                    message: 'hola1',
                    timestamp: expect.any(Object),
                }),
                expect.objectContaining({
                    sender: 'testUser1',
                    receiver: 'testUser2',
                    message: 'hola2',
                    timestamp: expect.any(Object),
                })
            ])
        }));
    });
});

describe('createChat tests', () => {
    test('se crea un chat que ya existe entre dos usuarios', async () => {
        const req = { body: { user1: 'testUser1', user2: 'testUser2' } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await createChat(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            chat: expect.objectContaining({
                user1: 'testUser1',
                user2: 'testUser2'
            })
        }));
    });

    test('se crea un chat que no existe entre dos usuarios', async () => {
        const req = { body: { user1: 'testUser20', user2: 'testUser21' } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await createChat(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            chat: expect.objectContaining({
                user1: 'testUser20',
                user2: 'testUser21'
            })
        }));
    });
});

describe('checkChat tests', () => {
    test('no hay chat entre los usuarios', async () => {
        const req = { params: { user1: 'testUser1', user2: 'testUser6' } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await checkChat(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ chatExists: false }));
    });

    test('hay chat entre los usuarios', async () => {
        const req = { params: { user1: 'testUser1', user2: 'testUser2' } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await checkChat(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ chatExists: true }));
    });
});

describe('changeUserFromChat tests', () => {
    test('el usuario no está en ningún chat', async () => {
        const req = { body: { user: 'testUser30', newUser: 'testUser33' } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await changeUserFromChat(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    test('el usuario está en un chat sin mensajes', async () => {
        const req = { body: { user: 'testUser15', newUser: 'testUser17' } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await changeUserFromChat(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));

        //comprobar que existe el chat entre testUser17 y testUser16
        const req2 = { params: { user1: 'testUser17', user2: 'testUser16' } };
        const res2 = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await checkChat(req2, res2);

        expect(res2.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        expect(res2.json).toHaveBeenCalledWith(expect.objectContaining({ chatExists: true }));

        //comprobar que ya no existe el chat entre testUser15 y testUser16
        const req3 = { params: { user1: 'testUser15', user2: 'testUser16' } };
        const res3 = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await checkChat(req3, res3);

        expect(res3.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        expect(res3.json).toHaveBeenCalledWith(expect.objectContaining({ chatExists: false }));
    });

    test('el usuario está en un chat con mensajes', async () => {
        //Agregamos mensajes al chat
        const messagesCollectionRef = chatsCollection.doc('chat8').collection('messages');
        await messagesCollectionRef.add({
            sender: 'testUser97',
            receiver: 'testUser98',
            message: 'hola98',
            timestamp: {
                "_seconds": 1696724439,
                "_nanoseconds": 629000000
            }
        });
        await messagesCollectionRef.add({
            sender: 'testUser98',
            receiver: 'testUser97',
            message: 'hola97',
            timestamp: {
                "_seconds": 1695772541,
                "_nanoseconds": 629000000
            }
        });

        const req = { body: { user: 'testUser97', newUser: 'testUser99' } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await changeUserFromChat(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));

        //comprobar que existe el chat entre testUser99 y testUser98 y que los mensajes se han actualizado
        const req2 = { params: { user1: 'testUser99', user2: 'testUser98' } };
        const res2 = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await checkChat(req2, res2);

        expect(res2.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        expect(res2.json).toHaveBeenCalledWith(expect.objectContaining({ chatExists: true }));

        const req3 = { params: { chatId: 'chat8' } };
        const res3 = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await getMessages(req3, res3);

        expect(res3.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        expect(res3.json).toHaveBeenCalledWith(expect.objectContaining({
            messages: expect.arrayContaining([
                expect.objectContaining({
                    sender: 'testUser99',
                    receiver: 'testUser98',
                    message: 'hola98',
                    timestamp: expect.any(Object),
                }),
                expect.objectContaining({
                    sender: 'testUser98',
                    receiver: 'testUser99',
                    message: 'hola97',
                    timestamp: expect.any(Object),
                })
            ])
        }));

        //comprobar que ya no existe el chat entre testUser97 y testUser98 y que los mensajes se han actualizado
        const req4 = { params: { user1: 'testUser97', user2: 'testUser98' } };
        const res4 = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await checkChat(req4, res4);

        expect(res4.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        expect(res4.json).toHaveBeenCalledWith(expect.objectContaining({ chatExists: false }));

        const req5 = { params: { chatId: 'chat8' } };
        const res5 = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await getMessages(req5, res5);

        expect(res5.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        expect(res5.json).toHaveBeenCalledWith(expect.objectContaining({
            messages: expect.not.arrayContaining([
                expect.objectContaining({
                    sender: 'testUser97',
                    receiver: 'testUser98',
                    message: 'hola98',
                    timestamp: expect.any(Object),
                }),
                expect.objectContaining({
                    sender: 'testUser98',
                    receiver: 'testUser97',
                    message: 'hola97',
                    timestamp: expect.any(Object),
                })
            ])
        }));
    });
});