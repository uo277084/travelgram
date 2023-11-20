const { admin, usersCollection } = require('./firebaseConfigTest');

const bcrypt = require('bcrypt');

const { login, checkPassword, getUserId, addUser, updateUser, updateUserWithPassword, checkEmail,
    findUserByUsername, findUserById, getUsersExceptSessionUser, saveNewPost, unsavePost,
    getSavedPosts, checkSavedPost, followUser, unfollowUser, getFollowers, getFollows, checkFollow,
    changeUserFromFollowers, deletePublicationOfSavedPosts } = require('../controllers/UserController');

beforeAll(async () => {
    await usersCollection.doc('testUser1').set({
        name: 'testUser1',
        email: 'testUser1@email.com',
        username: 'testUser1',
        birthDate: {
            "_seconds": 1696724439,
            "_nanoseconds": 629000000
        },
        password: await bcrypt.hash('testUser1', 10),
        followers: ['testUser2', 'testUser3'],
        savedPosts: ['1', '2', '3', '99'],
        profilePic: ""
    });

    await usersCollection.doc('testUser2').set({
        name: 'testUser2',
        email: 'testUser2@email.com',
        username: 'testUser2',
        birthDate: {
            "_seconds": 1696724439,
            "_nanoseconds": 639000000
        },
        password: await bcrypt.hash('testUser2', 10),
        followers: ['testUser3', 'testUser99'],
        savedPosts: ['1', '2', '3', '99'],
        profilePic: ""
    });

    await usersCollection.doc('testUser3').set({
        name: 'testUser3',
        email: 'testUser3@email.com',
        username: 'testUser3',
        birthDate: {
            "_seconds": 1696724439,
            "_nanoseconds": 649000000
        },
        password: await bcrypt.hash('testUser3', 10),
        followers: [],
        savedPosts: [],
        profilePic: ""
    });

    await usersCollection.doc('testUser4').set({
        name: 'testUser4',
        email: 'testUser4@email.com',
        username: 'testUser4',
        birthDate: {
            "_seconds": 1696724439,
            "_nanoseconds": 649000000
        },
        password: await bcrypt.hash('testUser4', 10),
        followers: [],
        savedPosts: [],
        profilePic: ""
    });

    await usersCollection.doc('testUser5').set({
        name: 'testUser5',
        email: 'testUser5@email.com',
        username: 'testUser5',
        birthDate: {
            "_seconds": 1696724439,
            "_nanoseconds": 649000000
        },
        password: await bcrypt.hash('testUser5', 10),
        followers: [],
        savedPosts: [],
        profilePic: ""
    });

    await usersCollection.doc('testUser22').set({
        name: 'testUser22',
        email: 'testUser22@email.com',
        username: 'testUser22',
        birthDate: {
            "_seconds": 1696724439,
            "_nanoseconds": 649000000
        },
        password: await bcrypt.hash('testUser22', 10),
        followers: [],
        savedPosts: [],
        profilePic: ""
    });

    await usersCollection.doc('testUser200').set({
        name: 'testUser200',
        email: 'testUser200@email.com',
        username: 'testUser200',
        birthDate: {
            "_seconds": 1696724439,
            "_nanoseconds": 649000000
        },
        password: await bcrypt.hash('testUser200', 10),
        followers: ['testUser1', 'testUser2', 'testUser3'],
        savedPosts: [],
        profilePic: ""
    });

    await usersCollection.doc('testUser900').set({
        name: 'testUser900',
        email: 'testUser900@email.com',
        username: 'testUser900',
        birthDate: {
            "_seconds": 1696724439,
            "_nanoseconds": 649000000
        },
        password: await bcrypt.hash('testUser900', 10),
        followers: [],
        savedPosts: [],
        profilePic: ""
    });

    await usersCollection.doc('testUser901').set({
        name: 'testUser901',
        email: 'testUser901@email.com',
        username: 'testUser901',
        birthDate: {
            "_seconds": 1696724439,
            "_nanoseconds": 649000000
        },
        password: await bcrypt.hash('testUser901', 10),
        followers: ['testUser902', 'testUser1'],
        savedPosts: [],
        profilePic: ""
    });

    await usersCollection.doc('testUser902').set({
        name: 'testUser902',
        email: 'testUser902@email.com',
        username: 'testUser902',
        birthDate: {
            "_seconds": 1696724439,
            "_nanoseconds": 649000000
        },
        password: await bcrypt.hash('testUser902', 10),
        followers: [],
        savedPosts: [],
        profilePic: ""
    });
});

afterAll(async () => {
    const snapshots = await usersCollection.get();
    snapshots.forEach((doc) => {
        doc.ref.delete();
    });

    await admin.app().delete();
});

describe('login tests', () => {
    test('no existe el nombre de usuario', async () => {
        const req = { params: { username: 'testUser1234', password: 'abcdefgh' } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ success: false });
    });

    test('contraseña incorrecta', async () => {
        const req = { params: { username: 'testUser1', password: 'abcdefgh' } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ success: false });
    });

    test('credenciales correctas', async () => {
        const req = { params: { username: 'testUser1', password: 'testUser1' } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await login(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            user: expect.objectContaining({
                name: 'testUser1',
                username: 'testUser1',
                email: 'testUser1@email.com'
            })
        }));
    });
});

describe('checkPassword tests', () => {
    test('no existe el nombre de usuario', async () => {
        const req = { params: { username: 'testUser1234', password: 'abcdefgh' } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await checkPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ success: false });
    });

    test('contraseña incorrecta', async () => {
        const req = { params: { username: 'testUser1', password: 'abcdefgh' } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await checkPassword(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ isPasswordMatch: false }));
    });

    test('contraseña correcta', async () => {
        const req = { params: { username: 'testUser1', password: 'testUser1' } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await checkPassword(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ isPasswordMatch: true }));
    });
});

describe('getUserId tests', () => {
    test('no existe un usuario con ese ID', async () => {
        const req = { params: { username: 'testUser123456' } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await getUserId(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ success: false });
    });

    test('existe un usuario con ese ID', async () => {
        const req = { params: { username: 'testUser1' } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await getUserId(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ userId: 'testUser1' }));
    });
});

describe('addUser tests', () => {
    test('ya existe un usuario con ese nombre de usuario', async () => {
        const req = {
            body: {
                name: 'testUser99',
                email: 'testUser99@email.com',
                username: 'testUser1',
                password: await bcrypt.hash('testUser99', 10),
                birthDate: {
                    "_seconds": 1696724439,
                    "_nanoseconds": 629000000
                }
            }
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await addUser(req, res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });

    test('ya existe un usuario con ese email', async () => {
        const req = {
            body: {
                name: 'testUser99',
                email: 'testUser1@email.com',
                username: 'testUser99',
                password: await bcrypt.hash('testUser99', 10),
                birthDate: {
                    "_seconds": 1696724439,
                    "_nanoseconds": 629000000
                }
            }
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await addUser(req, res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });

    test('se crea correctamente el usuario', async () => {
        const req = {
            body: {
                name: 'testUser99',
                email: 'testUser99@email.com',
                username: 'testUser99',
                password: await bcrypt.hash('testUser99', 10),
                birthDate: {
                    "_seconds": 1696724439,
                    "_nanoseconds": 629000000
                }
            }
        };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await addUser(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            user: expect.objectContaining({
                name: 'testUser99',
                username: 'testUser99',
                birthDate: {
                    "_seconds": 1696724439,
                    "_nanoseconds": 629000000
                }
            })
        }));
    });
});

describe('updateUser tests', () => {
    test('el usuario no existe', async () => {
        const req = {
            params: { username: 'testUser123456' },
            body: {
                username2: 'testUser100',
                name: 'testUser100',
                email: 'testUser100@email.com',
                birthDate: new Date(),
                profilePic: ""
            }
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await updateUser(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });

    test('el usuario existe y se actualiza correctamente', async () => {
        const req = {
            params: { username: 'testUser4' },
            body: {
                username2: 'testUser101',
                name: 'testUser101',
                email: 'testUser101@email.com',
                birthDate: new Date(),
                profilePic: ""
            }
        };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await updateUser(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            name: 'testUser101',
            username: 'testUser101',
            email: 'testUser101@email.com',
            birthDate: expect.any(Object),
        }));
    });
});

describe('updateUserWithPassword tests', () => {
    test('el usuario no existe', async () => {
        const req = {
            params: { username: 'testUser123456' },
            body: {
                username2: 'testUser100',
                name: 'testUser100',
                email: 'testUser100@email.com',
                password: await bcrypt.hash('testUser100', 10),
                birthDate: new Date(),
                profilePic: ""
            }
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await updateUserWithPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });

    test('el usuario existe y se actualiza correctamente', async () => {
        const req = {
            params: { username: 'testUser5' },
            body: {
                username2: 'testUser105',
                name: 'testUser105',
                email: 'testUser105@email.com',
                birthDate: new Date(),
                profilePic: "",
                password: 'testUser105'
            }
        };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await updateUserWithPassword(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            name: 'testUser105',
            username: 'testUser105',
            email: 'testUser105@email.com',
            birthDate: expect.any(Object),
        }));
    });
});

describe('checkEmail tests', () => {
    test('no existe un usuario con ese email', async () => {
        const req = { params: { email: 'testUser123456@email.com' } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await checkEmail(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ emailExists: false }));
    });

    test('existe un usuario con ese email', async () => {
        const req = { params: { email: 'testUser1@email.com' } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await checkEmail(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ emailExists: true }));
    });
});

describe('findUserByUsername tests', () => {
    test('no existe un usuario con ese nombre de usuario', async () => {
        const req = { params: { username: 'testUser123456' } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await findUserByUsername(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ userExists: false }));
    });

    test('existe un usuario con ese nombre de usuario', async () => {
        const req = { params: { username: 'testUser1' } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await findUserByUsername(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ userExists: true }));
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            user: expect.objectContaining({
                name: 'testUser1',
                username: 'testUser1',
                email: 'testUser1@email.com',
                birthDate: expect.any(Object),
                followers: expect.any(Array),
                savedPosts: expect.any(Array),
                profilePic: ""
            })
        }));
    });
});

describe('findUserById tests', () => {
    test('no existe un usuario con ese identificador', async () => {
        const req = { params: { userId: 'testUser123456' } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await findUserById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('existe un usuario con ese identificador', async () => {
        const req = { params: { userId: 'testUser1' } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await findUserById(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            name: 'testUser1',
            username: 'testUser1',
            email: 'testUser1@email.com',
            birthDate: expect.any(Object),
            followers: expect.any(Array),
            savedPosts: expect.any(Array),
            profilePic: ""
        })
        );
    });
});

describe('getUsersExceptSessionUser tests', () => {
    test('se busca la cadena vacía', async () => {
        const req = { query: { username: 'testUser1', search: "" } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await getUsersExceptSessionUser(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.not.objectContaining({ username: 'testUser1' }));
        expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
            expect.objectContaining({ username: 'testUser2' }),
            expect.objectContaining({ username: 'testUser3' }),
            expect.objectContaining({ username: 'testUser22' })
        ]));
    });

    test('se busca una cadena que no coincide con ningún nombre de usuario', async () => {
        const req = { query: { username: 'testUser1', search: "a" } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await getUsersExceptSessionUser(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.not.objectContaining({ username: 'testUser1' }));
        expect(res.json).toHaveBeenCalledWith([]);
    });

    test('se busca una cadena que coincide con algún nombre de usuario', async () => {
        const req = { query: { username: 'testUser1', search: "testuser2" } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await getUsersExceptSessionUser(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.not.objectContaining({ username: 'testUser1' }));
        expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
            expect.objectContaining({ username: 'testUser2' }),
            expect.objectContaining({ username: 'testUser22' })
        ]));
    });
});

describe('saveNewPost tests', () => {
    test('no existe el usuario', async () => {
        const req = { params: { username: 'testUser123456', postId: '1' } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await saveNewPost(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('existe el usuario', async () => {
        const req = { params: { username: 'testUser1', postId: '4' } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await saveNewPost(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });
});

describe('unsavePost tests', () => {
    test('no existe el usuario', async () => {
        const req = { params: { username: 'testUser123456', postId: '1' } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await unsavePost(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('existe el usuario', async () => {
        const req = { params: { username: 'testUser1', postId: '1' } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await saveNewPost(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });
});

describe('getSavedPosts tests', () => {
    test('no existe el usuario', async () => {
        const req = { params: { username: 'testUser123456' } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await getSavedPosts(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('el usuario no tiene publicaciones guardadas', async () => {
        const req = { params: { username: 'testUser3' } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await getSavedPosts(req, res);

        expect(res.json).toHaveBeenCalledWith([]);
    });

    test('el usuario tiene publicaciones guardadas', async () => {
        const req = { params: { username: 'testUser2' } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await getSavedPosts(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.arrayContaining(['1', '2', '3']));
    });
});

describe('checkSavedPost tests', () => {
    test('no existe el usuario', async () => {
        const req = { params: { username: 'testUser123456', postId: '1' } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await checkSavedPost(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('el usuario no tiene la publicación guardada', async () => {
        const req = { params: { username: 'testUser2', postId: '150' } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await checkSavedPost(req, res);

        expect(res.json).toHaveBeenCalledWith(false);
    });

    test('el usuario tiene la publicación guardada', async () => {
        const req = { params: { username: 'testUser2', postId: '1' } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await checkSavedPost(req, res);

        expect(res.json).toHaveBeenCalledWith(true);
    });
});

describe('followUser tests', () => {
    test('no existe el usuario al que siguen', async () => {
        const req = { params: { username: 'testUser123456', followed: 'testUser1' } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await followUser(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('no existe el usuario que sigue', async () => {
        const req = { params: { username: 'testUser1', followed: 'testUser123456' } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await followUser(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('existen los dos usuarios', async () => {
        const req = { params: { username: 'testUser3', followed: 'testUser2' } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await followUser(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ followers: expect.arrayContaining(['testUser2']) }));
    });
});

describe('unfollowUser tests', () => {
    test('no existe el usuario al que dejan de seguir', async () => {
        const req = { params: { username: 'testUser123456', followed: 'testUser1' } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await unfollowUser(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('no existe el usuario que deja de seguir', async () => {
        const req = { params: { username: 'testUser1', followed: 'testUser123456' } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await unfollowUser(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('existen los dos usuarios', async () => {
        const req = { params: { username: 'testUser2', followed: 'testUser99' } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await unfollowUser(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ followers: expect.not.arrayContaining(['testUser99']) }));
    });
});

describe('getFollowers tests', () => {
    test('no existe el usuario', async () => {
        const req = { params: { username: 'testUser123456' } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await getFollowers(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('el usuario no tiene seguidores', async () => {
        const req = { params: { username: 'testUser900' } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await getFollowers(req, res);

        expect(res.json).toHaveBeenCalledWith([]);
    });

    test('el usuario tiene seguidores', async () => {
        const req = { params: { username: 'testUser200' } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await getFollowers(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
            expect.objectContaining({ username: 'testUser1' }),
            expect.objectContaining({ username: 'testUser2' }),
            expect.objectContaining({ username: 'testUser3' })
        ]));
    });
});

describe('getFollows tests', () => {
    test('no existe el usuario', async () => {
        const req = { params: { username: 'testUser123456' } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await getFollows(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('el usuario no sigue a nadie', async () => {
        const req = { params: { username: 'testUser900' } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await getFollows(req, res);

        expect(res.json).toHaveBeenCalledWith([]);
    });

    test('el usuario sigue a alguien', async () => {
        const req = { params: { username: 'testUser3' } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await getFollows(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.arrayContaining([
            expect.objectContaining({ username: 'testUser2' }),
            expect.objectContaining({ username: 'testUser200' })
        ]));
    });
});

describe('checkFollow tests', () => {
    test('no existe el usuario 1', async () => {
        const req = { params: { username: 'testUser123456', followed: 'testUser2' } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await checkFollow(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('no existe el usuario 2', async () => {
        const req = { params: { username: 'testUser1', followed: 'testUser123456' } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await checkFollow(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('los usuarios no se siguen', async () => {
        const req = { params: { username: 'testUser2', followed: 'testUser1' } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await checkFollow(req, res);

        expect(res.json).toHaveBeenCalledWith(false);
    });

    test('los usuarios se siguen', async () => {
        const req = { params: { username: 'testUser2', followed: 'testUser3' } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await checkFollow(req, res);

        expect(res.json).toHaveBeenCalledWith(true);
    });
});

describe('changeUserFromFollowers tests', () => {
    test('no existe el usuario', async () => {
        const req = { params: { user: 'testUser123456', newUser: 'testUser28181811' } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await changeUserFromFollowers(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('el nuevo nombre ya está en uso', async () => {
        const req = { params: { user: 'testUser1', newUser: 'testUser2' } };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
        };

        await changeUserFromFollowers(req, res);

        expect(res.status).toHaveBeenCalledWith(409);
    });

    test('existe el usuario y se actualiza correctamente', async () => {
        const req = { params: { user: 'testUser902', newUser: 'testUser903' } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await changeUserFromFollowers(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });
});

describe('deletePublicationOfSavedPosts tests', () => {
    test('borrar una publicación que se ha guardado', async () => {
        const req = { params: { publicationId: '99' } };
        const res = {
            json: jest.fn(),
            status: jest.fn(),
        };

        await deletePublicationOfSavedPosts(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });
});