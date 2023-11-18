const { admin, publicationsCollection } = require('./firebaseConfigTest');

const { getPublicationsByUser, addImagesToAPublication, getPublicationsByCountry,
    addPublication, countPublications, addLike, removeLike, checkLike,
    countLikes, getPublicationById, getCommentsOfPublication, addCommentToAPublication,
    deleteComment, changeUser, recommendThreePostsByRankingNotMine,
    getPublicationsOfFollowedUsersOrderedByDate, deletePublication } = require('../controllers/PublicationController');

beforeAll(async () => {

    await publicationsCollection.doc('publication1').set({
        country: 'country1',
        cities: ['city1', 'city2'],
        datePublication: new Date(new Date().setDate(new Date().getDate() - 2)), //hace dos días
        dateTripFinish: new Date(new Date().setDate(new Date().getDate() - 30)),
        dateTripStart: new Date(new Date().setDate(new Date().getDate() - 35)),
        description: 'description1',
        images: [],
        likes: [],
        rating: 4,
        user: 'testUser1'
    });

    await publicationsCollection.doc('publication2').set({
        country: 'country1',
        cities: ['city1', 'city2', 'city3'],
        datePublication: new Date(new Date().setDate(new Date().getDate() - 3)),
        dateTripFinish: new Date(new Date().setDate(new Date().getDate() - 31)),
        dateTripStart: new Date(new Date().setDate(new Date().getDate() - 36)),
        description: 'description2',
        images: [],
        likes: [],
        rating: 3.5,
        user: 'testUser3'
    });

    await publicationsCollection.doc('publication3').set({
        country: 'country2',
        cities: ['city1', 'city2', 'city3'],
        datePublication: new Date(new Date().setDate(new Date().getDate() - 3)),
        dateTripFinish: new Date(new Date().setDate(new Date().getDate() - 31)),
        dateTripStart: new Date(new Date().setDate(new Date().getDate() - 36)),
        description: 'description3',
        images: [],
        likes: [],
        rating: 4.5,
        user: 'testUser3'
    });

    await publicationsCollection.doc('publication4').set({
        country: 'country4',
        cities: ['city1', 'city2', 'city3'],
        datePublication: new Date(new Date().setDate(new Date().getDate() - 3)),
        dateTripFinish: new Date(new Date().setDate(new Date().getDate() - 31)),
        dateTripStart: new Date(new Date().setDate(new Date().getDate() - 36)),
        description: 'description4',
        images: [],
        likes: [],
        rating: 1.5,
        user: 'testUser3'
    });

    await publicationsCollection.doc('publication5').set({
        country: 'country5',
        cities: ['city1', 'city2', 'city3'],
        datePublication: new Date(new Date().setDate(new Date().getDate() - 3)),
        dateTripFinish: new Date(new Date().setDate(new Date().getDate() - 31)),
        dateTripStart: new Date(new Date().setDate(new Date().getDate() - 36)),
        description: 'description5',
        images: [],
        likes: [],
        rating: 1.5,
        user: 'testUser3'
    });

    await publicationsCollection.doc('publication6').set({
        country: 'country6',
        cities: ['city1', 'city2', 'city3'],
        datePublication: new Date(new Date().setDate(new Date().getDate() - 3)),
        dateTripFinish: new Date(new Date().setDate(new Date().getDate() - 31)),
        dateTripStart: new Date(new Date().setDate(new Date().getDate() - 36)),
        description: 'description6',
        images: [],
        likes: ['testUser1'],
        rating: 2,
        user: 'testUser3'
    });

    await publicationsCollection.doc('publication7').set({
        country: 'country7',
        cities: ['city1', 'city2', 'city3'],
        datePublication: new Date(new Date().setDate(new Date().getDate() - 3)),
        dateTripFinish: new Date(new Date().setDate(new Date().getDate() - 31)),
        dateTripStart: new Date(new Date().setDate(new Date().getDate() - 36)),
        description: 'description7',
        images: [],
        likes: ['testUser1', 'testUser2', 'testuser4'],
        rating: 2,
        user: 'testUser3'
    });

    await publicationsCollection.doc('publication8').set({
        country: 'country8',
        cities: ['city1', 'city2', 'city3'],
        datePublication: new Date(new Date().setDate(new Date().getDate() - 3)),
        dateTripFinish: new Date(new Date().setDate(new Date().getDate() - 31)),
        dateTripStart: new Date(new Date().setDate(new Date().getDate() - 36)),
        description: 'description8',
        images: [],
        likes: [],
        rating: 2,
        user: 'testUser4'
    });

    await publicationsCollection.doc('publication9').set({
        country: 'country9',
        cities: ['city1', 'city2', 'city3'],
        datePublication: new Date(new Date().setDate(new Date().getDate() - 3)),
        dateTripFinish: new Date(new Date().setDate(new Date().getDate() - 31)),
        dateTripStart: new Date(new Date().setDate(new Date().getDate() - 36)),
        description: 'description9',
        images: [],
        likes: [],
        rating: 4,
        user: 'testUser3'
    });

    await publicationsCollection.doc('publication10').set({
        country: 'country10',
        cities: ['city1', 'city2', 'city3'],
        datePublication: new Date(new Date().setDate(new Date().getDate() - 3)),
        dateTripFinish: new Date(new Date().setDate(new Date().getDate() - 31)),
        dateTripStart: new Date(new Date().setDate(new Date().getDate() - 36)),
        description: 'description10',
        images: [],
        likes: [],
        rating: 1,
        user: 'testUser3'
    });
});

afterAll(async () => {
    const snapshots = await publicationsCollection.get();
    snapshots.forEach((doc) => {
        doc.ref.delete();
    });

    await admin.app().delete();
});

describe('getPublicationsByUser tests', () => {
    test('el usuario no tiene ninguna publicación', async () => {
        const req = { params: { username: 'testUser123456789' } };
        const res = {
            json: jest.fn(),
            status: jest.fn()
        };

        await getPublicationsByUser(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ publications: [] }));
    });

    test('el usuario tiene al menos una publicación', async () => {
        const req = { params: { username: 'testUser1' } };
        const res = {
            json: jest.fn(),
            status: jest.fn()
        };

        await getPublicationsByUser(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            publications: expect.arrayContaining([
                expect.objectContaining({
                    country: 'country1',
                    cities: ['city1', 'city2'],
                    datePublication: expect.any(Object),
                    dateTripFinish: expect.any(Object),
                    dateTripStart: expect.any(Object),
                    description: 'description1',
                    images: [],
                    likes: [],
                    rating: 4,
                    user: 'testUser1'
                })
            ])
        }));
    });
});

describe('addImagesToAPublication tests', () => {
    test('la publicación no existe', async () => {
        const req = {
            body: {
                id: 'publication123456789',
                images: ['image1', 'image2']
            }
        };
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        await addImagesToAPublication(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });

    test('la publicación existe', async () => {
        const req = {
            body: {
                id: 'publication4',
                images: ['image1', 'image2']
            }
        };
        const res = {
            json: jest.fn(),
            status: jest.fn()
        };

        await addImagesToAPublication(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });
});

describe('getPublicationsByCountry tests', () => {
    test('no hay publicaciones del país', async () => {
        const req = { params: { country: 'country123456789', username: 'testUser123' } };
        const res = {
            json: jest.fn(),
            status: jest.fn()
        };

        await getPublicationsByCountry(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ publications: [] }));
    });

    test('hay al menos una publicación del país pero no compartida por otro usuario', async () => {
        const req = { params: { country: 'country2', username: 'testUser3' } };
        const res = {
            json: jest.fn(),
            status: jest.fn()
        };

        await getPublicationsByCountry(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ publications: [] }));
    });

    test('hay al menos una publicación del país compartida por otro usuario', async () => {
        const req = { params: { country: 'country1', username: 'testUser123' } };
        const res = {
            json: jest.fn(),
            status: jest.fn()
        };

        await getPublicationsByCountry(req, res);

        expect(res.json).toHaveBeenCalledWith({
            publications: expect.arrayContaining([
                expect.objectContaining({
                    id: 'publication1',
                    country: 'country1',
                    cities: ['city1', 'city2'],
                    description: 'description1',
                    images: [],
                    likes: [],
                    rating: 4,
                    user: 'testUser1',
                    datePublication: expect.any(Object),
                    dateTripFinish: expect.any(Object),
                    dateTripStart: expect.any(Object)
                }),
                expect.objectContaining({
                    id: 'publication2',
                    country: 'country1',
                    cities: ['city1', 'city2', 'city3'],
                    description: 'description2',
                    images: [],
                    likes: [],
                    rating: 3.5,
                    user: 'testUser3',
                    datePublication: expect.any(Object),
                    dateTripFinish: expect.any(Object),
                    dateTripStart: expect.any(Object),
                })
            ])
        });
    });
});

describe('addPublication tests', () => {
    test('se crea una nueva publicación', async () => {
        const req = {
            body: {
                country: 'country17',
                cities: ['city1', 'city2', 'city3'],
                datePublication: new Date(),
                dateTripFinish: new Date(),
                dateTripStart: new Date(),
                description: 'description17',
                images: [],
                likes: [],
                rating: 1,
                user: 'testUser3'
            }
        };
        const res = {
            json: jest.fn(),
            status: jest.fn()
        };

        await addPublication(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            publication: expect.objectContaining({
                country: 'country17',
                cities: ['city1', 'city2', 'city3'],
                datePublication: expect.any(Object),
                dateTripFinish: expect.any(Object),
                dateTripStart: expect.any(Object),
                description: 'description17',
                images: [],
                likes: [],
                rating: 1,
                user: 'testUser3'
            })
        }));
    });
});

describe('countPublications tests', () => {
    test('el usuario no tiene ninguna publicación', async () => {
        const req = { params: { username: 'testUser123456789' } };
        const res = {
            json: jest.fn(),
            status: jest.fn()
        };

        await countPublications(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ count: 0 }));
    });

    test('el usuario tiene al menos una publicación', async () => {
        const req = { params: { username: 'testUser1' } };
        const res = {
            json: jest.fn(),
            status: jest.fn()
        };

        await countPublications(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ count: 1 }));
    });
});

describe('addLike tests', () => {
    test('la publicación no existe', async () => {
        const req = {
            params: {
                publicationId: 'publication123456789'
            },
            body: {
                username: 'testUser1'
            }
        }
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        await addLike(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('la publicación existe', async () => {
        const req = {
            params: {
                publicationId: 'publication5'
            },
            body: {
                username: 'testUser1'
            }
        }
        const res = {
            json: jest.fn(),
            status: jest.fn()
        };

        await addLike(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ likes: ['testUser1'] }));
    });
});

describe('removeLike tests', () => {
    test('la publicación no existe', async () => {
        const req = {
            params: {
                publicationId: 'publication123456789'
            },
            query: {
                username: 'testUser1'
            }
        }
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        await removeLike(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('la publicación existe', async () => {
        const req = {
            params: {
                publicationId: 'publication6'
            },
            query: {
                username: 'testUser1'
            }
        }
        const res = {
            json: jest.fn(),
            status: jest.fn()
        };

        await removeLike(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ likes: [] }));
    });
});

describe('checkLike tests', () => {
    test('la publicación no existe', async () => {
        const req = { params: { publicationId: 'publication123456789', username: 'testUser1' } }
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        await checkLike(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('la publicación no tiene el like del usuario', async () => {
        const req = { params: { publicationId: 'publication1', username: 'testUser1' } }
        const res = {
            json: jest.fn(),
            status: jest.fn()
        };

        await checkLike(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });

    test('la publicación tiene el like del usuario', async () => {
        const req = { params: { publicationId: 'publication7', username: 'testUser1' } }
        const res = {
            json: jest.fn(),
            status: jest.fn()
        };

        await checkLike(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });
});

describe('countLikes tests', () => {
    test('la publicación no existe', async () => {
        const req = { params: { publicationId: 'publication123456789' } }
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        await countLikes(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('la publicación no tiene likes', async () => {
        const req = { params: { publicationId: 'publication2' } }
        const res = {
            json: jest.fn(),
            status: jest.fn()
        };

        await countLikes(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ count: 0 }));
    });

    test('la publicación tiene al menos un like', async () => {
        const req = { params: { publicationId: 'publication7' } }
        const res = {
            json: jest.fn(),
            status: jest.fn()
        };

        await countLikes(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ count: 3 }));
    });
});

describe('getPublicationById tests', () => {
    test('la publicación no existe', async () => {
        const req = { params: { publicationId: 'publication123456789' } }
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        await getPublicationById(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('la publicación existe', async () => {
        const req = { params: { publicationId: 'publication2' } }
        const res = {
            json: jest.fn(),
            status: jest.fn()
        };

        await getPublicationById(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            publication: expect.objectContaining({
                country: 'country1',
                cities: ['city1', 'city2', 'city3'],
                datePublication: expect.any(Object),
                dateTripFinish: expect.any(Object),
                dateTripStart: expect.any(Object),
                description: 'description2',
                images: [],
                likes: [],
                rating: 3.5,
                user: 'testUser3'
            })
        }));
    });
});

describe('getCommentsOfPublication tests', () => {
    test('la publicación no existe', async () => {
        const req = { params: { publicationId: 'publication123456789' } }
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        await getCommentsOfPublication(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('la publicación no tiene comentarios', async () => {
        const req = { params: { publicationId: 'publication7' } }
        const res = {
            json: jest.fn(),
            status: jest.fn()
        };

        await getCommentsOfPublication(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ comments: [] }));
    });

    test('la publicación tiene al menos un comentario', async () => {
        const commentsCollectionRef = publicationsCollection.doc('publication3').collection('comments');
        await commentsCollectionRef.add({
            user: 'testUser1',
            comment: 'que buen post',
            timestamp: new Date()
        });

        const req = { params: { publicationId: 'publication3' } }
        const res = {
            json: jest.fn(),
            status: jest.fn()
        };

        await getCommentsOfPublication(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            comments: expect.arrayContaining([
                expect.objectContaining({
                    user: 'testUser1',
                    comment: 'que buen post',
                    timestamp: expect.any(Object)
                })
            ])
        }));
    });
});

describe('addCommentToAPublication tests', () => {
    test('la publicación no existe', async () => {
        const req = {
            params: { publicationId: 'publication123456789' },
            body: {
                user: 'testUser1',
                comment: 'commnent1'
            }
        }
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        await addCommentToAPublication(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('la publicación existe', async () => {
        const req = {
            params: { publicationId: 'publication2' },
            body: {
                user: 'testUser2',
                comment: 'commnent2'
            }
        }
        const res = {
            json: jest.fn(),
            status: jest.fn()
        };

        await addCommentToAPublication(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            comment: expect.objectContaining({
                user: 'testUser2',
                comment: 'commnent2',
                timestamp: expect.any(Object)
            })
        }))
    });
});

describe('deleteComment tests', () => {
    test('la publicación no existe', async () => {
        const req = {
            params: { publicationId: 'publication123456789', commentId: 'comment1' },
        }
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        await deleteComment(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('el comentario no existe', async () => {
        const req = {
            params: { publicationId: 'publication7', commentId: 'comment1' },
        }
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        await deleteComment(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('la publicación y el comentario existen', async () => {
        const commentsCollectionRef = publicationsCollection.doc('publication8').collection('comments');
        await commentsCollectionRef.doc('comment8').set({
            user: 'testUser8',
            comment: 'buen post',
            timestamp: new Date()
        });

        const req = { params: { publicationId: 'publication8', commentId: 'comment8' } }
        const res = {
            json: jest.fn(),
            status: jest.fn()
        };

        await deleteComment(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });
});

describe('changeUser tests', () => {
    test('el usuario ha compartido, dado like y comentado', async () => {
        const commentsCollectionRef = publicationsCollection.doc('publication2').collection('comments');
        await commentsCollectionRef.add({
            user: 'testUser4',
            comment: 'que buena publicación',
            timestamp: new Date()
        });

        const req = { body: { user: 'testUser4', newUser: 'testUser99' } };
        const res = {
            json: jest.fn(),
            status: jest.fn()
        };

        await changeUser(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });
});

describe('recommendThreePostsByRankingNotMine tests', () => {
    test('hay menos de tres publicaciones que hayan compartido otros usuarios', async () => {
        const req = { params: { username: 'testUser3' } };
        const res = {
            json: jest.fn(),
            status: jest.fn()
        };

        await recommendThreePostsByRankingNotMine(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            publications: expect.arrayContaining([
                expect.objectContaining({
                    country: 'country1',
                    cities: ['city1', 'city2'],
                    datePublication: expect.any(Object),
                    dateTripFinish: expect.any(Object),
                    dateTripStart: expect.any(Object),
                    description: 'description1',
                    images: [],
                    likes: [],
                    rating: 4,
                    user: expect.any(String)
                }),
                expect.objectContaining({
                    country: 'country8',
                    cities: ['city1', 'city2', 'city3'],
                    datePublication: expect.any(Object),
                    dateTripFinish: expect.any(Object),
                    dateTripStart: expect.any(Object),
                    description: 'description8',
                    images: [],
                    likes: [],
                    rating: 2,
                    user: expect.any(String)
                }),
                expect.not.objectContaining({
                    user: 'testuser3'
                })
            ])
        }));
    });

    test('hay más de tres publicaciones que hayan compartido otros usuarios', async () => {
        const req = { params: { username: 'testUser1' } };
        const res = {
            json: jest.fn(),
            status: jest.fn()
        };

        await recommendThreePostsByRankingNotMine(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            publications: expect.arrayContaining([
                expect.objectContaining({
                    country: 'country1',
                    cities: ['city1', 'city2', 'city3'],
                    datePublication: expect.any(Object),
                    dateTripFinish: expect.any(Object),
                    dateTripStart: expect.any(Object),
                    description: 'description2',
                    images: [],
                    likes: [],
                    rating: 3.5,
                    user: expect.any(String),
                    id: 'publication2'
                }),
                expect.objectContaining({
                    country: 'country2',
                    cities: ['city1', 'city2', 'city3'],
                    datePublication: expect.any(Object),
                    dateTripFinish: expect.any(Object),
                    dateTripStart: expect.any(Object),
                    description: 'description3',
                    images: [],
                    likes: [],
                    rating: 4.5,
                    user: expect.any(String),
                    id: 'publication3'
                }),
                expect.objectContaining({
                    country: 'country9',
                    cities: ['city1', 'city2', 'city3'],
                    datePublication: expect.any(Object),
                    dateTripFinish: expect.any(Object),
                    dateTripStart: expect.any(Object),
                    description: 'description9',
                    images: [],
                    likes: [],
                    rating: 4,
                    user: expect.any(String),
                    id: 'publication9'
                }),
                expect.not.objectContaining({
                    user: 'testuser1'
                })
            ])
        }));
    });
});

describe('getPublicationsOfFollowedUsersOrderedByDate tests', () => {
    test('no sigue a ningún usuario', async () => {
        const req = { query: { usernames: [] } };
        const res = {
            json: jest.fn(),
            status: jest.fn()
        };

        await getPublicationsOfFollowedUsersOrderedByDate(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ publications: [] }));
    });

    test('los usuarios no han compartido ninguna publicación', async () => {
        const req = { query: { usernames: ['testUser100', 'testUser101', 'testUser102'] } };
        const res = {
            json: jest.fn(),
            status: jest.fn()
        };

        await getPublicationsOfFollowedUsersOrderedByDate(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ publications: [] }));
    });

    test('los usuarios han compartido al menos una publicación', async () => {
        const req = { query: { usernames: ['testUser1', 'testUser2'] } };
        const res = {
            json: jest.fn(),
            status: jest.fn()
        };

        await getPublicationsOfFollowedUsersOrderedByDate(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            publications: expect.arrayContaining([
                expect.objectContaining({
                    country: 'country1',
                    cities: ['city1', 'city2'],
                    datePublication: expect.any(Object),
                    dateTripFinish: expect.any(Object),
                    dateTripStart: expect.any(Object),
                    description: 'description1',
                    images: [],
                    likes: [],
                    rating: 4,
                    user: 'testUser1'
                })
            ])
        }));
    });
});

describe('deletePublication tests', () => {
    test('la publicación no existe', async () => {
        const req = { params: { publicationId: 'publication123456789' } }
        const res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };

        await deletePublication(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
    });

    test('la publicación existe', async () => {
        const req = { params: { publicationId: 'publication10' } }
        const res = {
            json: jest.fn(),
            status: jest.fn()
        };

        await deletePublication(req, res);

        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });
});