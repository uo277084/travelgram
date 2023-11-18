const admin = require('firebase-admin');

const db = admin.firestore();

exports.getPublicationsByUser = async (req, res) => {
    const { username } = req.params;

    try {
        const publicationsRef = db.collection('publications');
        const querySnapshot = await publicationsRef
            .where('user', '==', username)
            .orderBy('datePublication', 'asc')
            .get();

        const publications = [];
        querySnapshot.forEach((doc) => {
            publications.push({ id: doc.id, ...doc.data() });
        });

        return res.json({ publications });
    } catch (error) {
        console.error('Error al buscar las publicaciones:', error);
        return res.status(500).json({ publications: null });
    }
};

exports.addImagesToAPublication = async (req, res) => {
    const { id, images } = req.body;

    try {
        const publicationRef = db.collection('publications').doc(id);

        const publicationSnapshot = await publicationRef.get();
        if (!publicationSnapshot.exists) {
            return res.status(404).json({ error: 'Publicación no encontrada', success: false });
        }

        await publicationRef.update({ images });

        res.json({ message: 'Imágenes actualizadas con éxito', success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Hubo un error al actualizar las imágenes', success: false });
    }
}

exports.getPublicationsByCountry = async (req, res) => {
    const { country, username } = req.params;

    try {
        const publicationsRef = db.collection('publications');
        const querySnapshot = await publicationsRef
            .where('country', '==', country)
            .where('user', '!=', username)
            .get();

        const publications = [];
        querySnapshot.forEach((doc) => {
            publications.push({ id: doc.id, ...doc.data() });
        });

        return res.json({ publications });
    } catch (error) {
        console.error('Error al buscar las publicaciones:', error);
        return res.status(500).json({ publications: null, error });
    }
};

exports.addPublication = async (req, res) => {
    const {
        country,
        cities,
        rating,
        description,
        dateTripStart,
        dateTripFinish,
        user,
    } = req.body;

    try {
        const publicationRef = db.collection('publications').doc();
        const newPublication = {
            country,
            cities,
            rating,
            description,
            dateTripStart,
            dateTripFinish,
            datePublication: new Date(),
            user,
            likes: [],
            images: [],
        };

        newPublication.id = publicationRef.id;

        await publicationRef.set(newPublication);

        return res.json({ mensaje: 'Publicación agregada exitosamente', publication: newPublication });
    } catch (error) {
        console.error('Error al guardar la publicación:', error);
        return res.status(500).json({ mensaje: 'Error al guardar la publicación' });
    }
};

exports.countPublications = async (req, res) => {
    const { username } = req.params;

    try {
        const publicationsRef = db.collection('publications');
        const querySnapshot = await publicationsRef.where('user', '==', username).get();

        const count = querySnapshot.size;

        return res.json({ count });
    } catch (error) {
        console.error('Error al buscar las publicaciones:', error);
        return res.status(500).json({ mensaje: 'Error al buscar las publicaciones' });
    }
};

exports.addLike = async (req, res) => {
    const { publicationId } = req.params;
    const { username } = req.body;

    try {
        const publicationRef = db.collection('publications').doc(publicationId);
        const publicationDoc = await publicationRef.get();

        if (!publicationDoc.exists) {
            return res.status(404).json({ mensaje: 'Publicación no encontrada' });
        }

        const updatedLikes = [...(publicationDoc.data().likes || []), username];
        await publicationRef.update({ likes: updatedLikes });

        const updatedPublication = (await publicationRef.get()).data();

        return res.json(updatedPublication);
    } catch (error) {
        console.error('Error al agregar el like:', error);
        return res.status(500).json({ mensaje: 'Error al agregar el like' });
    }
};

exports.removeLike = async (req, res) => {
    const { publicationId } = req.params;
    const { username } = req.query;

    try {
        const publicationRef = db.collection('publications').doc(publicationId);
        const publicationDoc = await publicationRef.get();

        if (!publicationDoc.exists) {
            return res.status(404).json({ mensaje: 'Publicación no encontrada' });
        }

        const updatedLikes = (publicationDoc.data().likes || []).filter((like) => like !== username);
        await publicationRef.update({ likes: updatedLikes });

        const updatedPublication = (await publicationRef.get()).data();

        return res.json(updatedPublication);
    } catch (error) {
        console.error('Error al eliminar el like:', error);
        return res.status(500).json({ mensaje: 'Error al eliminar el like' });
    }
};

exports.checkLike = async (req, res) => {
    const { publicationId, username } = req.params;

    try {
        const publicationRef = db.collection('publications').doc(publicationId);
        const publicationDoc = await publicationRef.get();

        if (!publicationDoc.exists) {
            return res.status(404).json({ mensaje: 'Publicación no encontrada' });
        }

        const isLiked = (publicationDoc.data().likes || []).includes(username);

        return res.json({ success: isLiked });
    } catch (error) {
        console.error('Error al buscar la publicación:', error);
        return res.status(500).json({ mensaje: 'Error al buscar la publicación' });
    }
};

exports.countLikes = async (req, res) => {
    const { publicationId } = req.params;

    try {
        const publicationRef = db.collection('publications').doc(publicationId);
        const publicationDoc = await publicationRef.get();

        if (!publicationDoc.exists) {
            return res.status(404).json({ mensaje: 'Publicación no encontrada' });
        }

        const likesCount = (publicationDoc.data().likes || []).length;

        return res.json({ count: likesCount });
    } catch (error) {
        console.error('Error al buscar las publicaciones:', error);
        return res.status(500).json({ mensaje: 'Error al buscar las publicaciones' });
    }
};

exports.getPublicationById = async (req, res) => {
    const { publicationId } = req.params;

    try {
        const publicationRef = db.collection('publications').doc(publicationId);
        const publicationDoc = await publicationRef.get();

        if (!publicationDoc.exists) {
            return res.status(404).json({ publication: null });
        }

        const publicationData = publicationDoc.data();

        return res.json({ publication: { id: publicationDoc.id, ...publicationData } });
    } catch (error) {
        console.error('Error al buscar la publicación:', error);
        return res.status(500).json({ publication: null });
    }
};

exports.getCommentsOfPublication = async (req, res) => {
    const { publicationId } = req.params;

    try {
        const publicationRef = db.collection('publications').doc(publicationId);
        const publicationSnapshot = await publicationRef.get();

        if (!publicationSnapshot.exists) {
            return res.status(404).json({ error: 'Publicación no encontrada', comments: null });
        }

        const commentsCollectionRef = publicationRef.collection('comments');
        const commentsQuerySnapshot = await commentsCollectionRef.orderBy('timestamp', 'asc').get();

        const comments = [];
        commentsQuerySnapshot.forEach((doc) => {
            comments.push({
                id: doc.id,
                ...doc.data(),
            });
        });

        return res.json({ comments });
    } catch (error) {
        console.error('Error al buscar los comentarios:', error);
        return res.status(500).json({ comments: null });
    }
};

exports.addCommentToAPublication = async (req, res) => {
    const { publicationId } = req.params;
    const { user, comment } = req.body;

    try {
        const publicationRef = db.collection('publications').doc(publicationId);
        const publicationSnapshot = await publicationRef.get();

        if (!publicationSnapshot.exists) {
            return res.status(404).json({ error: 'Publicación no encontrada', comment: null });
        }

        const commentsCollectionRef = publicationRef.collection('comments');

        const newCommentRef = await commentsCollectionRef.add({ user, comment, timestamp: new Date() });

        const addedCommentId = newCommentRef.id;
        const addedComment = (await newCommentRef.get()).data();

        return res.json({ comment: { id: addedCommentId, ...addedComment } });
    } catch (error) {
        console.error('Error al agregar el comentario:', error);
        return res.status(500).json({ mensaje: 'Error al agregar el comentario' });
    }
};

exports.deleteComment = async (req, res) => {
    const { publicationId, commentId } = req.params;

    try {
        const publicationRef = db.collection('publications').doc(publicationId);
        const publicationSnapshot = await publicationRef.get();

        if (!publicationSnapshot.exists) {
            return res.status(404).json({ error: 'Publicación no encontrada', success: false });
        }

        const commentRef = publicationRef.collection('comments').doc(commentId);
        const commentSnapshot = await commentRef.get();

        if (!commentSnapshot.exists) {
            return res.status(404).json({ error: 'Comentario no encontrado', success: false });
        }

        await commentRef.delete();

        return res.json({ mensaje: 'Comentario eliminado exitosamente', success: true });
    } catch (error) {
        console.error('Error al eliminar el comentario:', error);
        return res.status(500).json({ mensaje: 'Error al eliminar el comentario' });
    }
};

exports.changeUser = async (req, res) => {
    const { user, newUser } = req.body;

    try {
        //Cambiar user de los posts
        const publicationsRef = db.collection('publications');
        const querySnapshot = await publicationsRef
            .where('user', '==', user)
            .get();

        querySnapshot.forEach(async (doc) => {
            await publicationsRef.doc(doc.id).update({ user: newUser });
        }
        );

        //Cambiar user de los comentarios
        const publicationsSnapshot = await publicationsRef.get();
        publicationsSnapshot.forEach(async (doc) => {
            const commentsRef = db.collection('publications').doc(doc.id).collection('comments');
            const querySnapshotComments = await commentsRef.where('user', '==', user).get();

            querySnapshotComments.forEach(async (doc) => {
                await commentsRef.doc(doc.id).update({ user: newUser });
            }
            );
        }
        );

        //Cambiar user de los likes
        const querySnapshotLikes = await publicationsRef.where('likes', 'array-contains', user).get();

        querySnapshotLikes.forEach(async (doc) => {
            const likes = doc.data().likes;
            const index = likes.indexOf(user);
            likes[index] = newUser;
            await publicationsRef.doc(doc.id).update({ likes });
        }
        );

        res.json({ message: 'Información de publicaciones actualizada con éxito', success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Hubo un error al actualizar el usuario', success: false });
    }
}

exports.recommendThreePostsByRankingNotMine = async (req, res) => {

    const { username } = req.params;

    try {
        const publicationsRef = db.collection('publications');

        const otherUserPublicationsQuery = await publicationsRef
            .where('user', '!=', username)
            .get();

        const otherUserPublications = [];
        otherUserPublicationsQuery.forEach((doc) => {
            otherUserPublications.push({ id: doc.id, ...doc.data() });
        });

        const sortedPublications = otherUserPublications
            .sort((a, b) => b.rating - a.rating || b.datePublication - a.datePublication)
            .slice(0, 3);

        return res.json({ publications: sortedPublications, success: true });
    } catch (error) {
        console.error('Error al buscar las publicaciones:', error);
        return res.status(500).json({ publications: null, success: false });
    }
}

exports.getPublicationsOfFollowedUsersOrderedByDate = async (req, res) => {
    const { usernames } = req.query;

    try {
        if (!usernames || usernames.length === 0) {
            const emptyPublications = [];
            return res.json({ publications: [] });
        }

        const publicationsRef = db.collection('publications');
        const querySnapshot = await publicationsRef
            .where('user', 'in', usernames)
            .orderBy('datePublication', 'desc')
            .get();

        const publications = [];
        querySnapshot.forEach((doc) => {
            publications.push(doc.data());
        });

        return res.json({ publications });
    }
    catch (error) {
        console.error('Error al buscar las publicaciones:', error);
        return res.status(500).json({ publications: null });
    }
}

exports.deletePublication = async (req, res) => {
    const { publicationId } = req.params;

    try {
        const publicationRef = db.collection('publications').doc(publicationId);
        const publicationSnapshot = await publicationRef.get();

        if (!publicationSnapshot.exists) {
            return res.status(404).json({ error: 'Publicación no encontrada', success: false });
        }

        await publicationRef.delete();

        return res.json({ mensaje: 'Publicación eliminada exitosamente', success: true });
    } catch (error) {
        console.error('Error al eliminar la publicación:', error);
        return res.status(500).json({ mensaje: 'Error al eliminar la publicación' });
    }
}
