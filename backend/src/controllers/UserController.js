const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const db = admin.firestore();
const usersCollection = db.collection('users');

exports.login = async (req, res) => {
    const { username, password } = req.params;

    try {
        const userQuery = await usersCollection.where('username', '==', username).limit(1).get();
        const userEmailQuery = await usersCollection.where('email', '==', username).limit(1).get();
        if (userQuery.empty && userEmailQuery.empty) {
            return res.status(404).json({ success: false });
        }

        const userData = userQuery.empty ? userEmailQuery.docs[0].data() : userQuery.docs[0].data();

        const isPasswordMatch = await bcrypt.compare(password, userData.password);

        if (!isPasswordMatch) {
            return res.status(409).json({ success: false });
        }

        const userToken = { timestamp: new Date(), userId: userQuery.empty ? userEmailQuery.docs[0].id : userQuery.docs[0].id };
        const token = jwt.sign(userToken, "clave-secretisima", { expiresIn: '1h' });

        return res.json({ success: true, user: userData, token, userId: userQuery.empty ? userEmailQuery.docs[0].id : userQuery.docs[0].id });
    } catch (error) {
        console.error('Error en el login:', error);
        return res.status(500).json({ success: false });
    }
};

exports.checkPassword = async (req, res) => {
    const { username, password } = req.params;

    try {
        const userQuery = await usersCollection.where('username', '==', username).limit(1).get();

        if (userQuery.empty) {
            return res.status(404).json({ success: false });
        }

        const userData = userQuery.docs[0].data();

        const isPasswordMatch = await bcrypt.compare(password, userData.password);
        return res.json({ success: true, isPasswordMatch });
    } catch (error) {
        console.error('Error al verificar la contraseña:', error);
        return res.status(500).json({ success: false });
    }
};

exports.getUserId = async (req, res) => {
    const { username } = req.params;

    try {
        const userQuery = await usersCollection.where('username', '==', username).limit(1).get();
        if (userQuery.empty) {
            return res.status(404).json({ success: false });
        }

        const userId = userQuery.docs[0].id;

        return res.json({ success: true, userId });
    } catch (error) {
        console.error('Error al obtener el id del usuario:', error);
        return res.status(500).json({ success: false });
    }
};

exports.addUser = async (req, res) => {
    const { name, email, username, password, birthDate } = req.body;

    try {
        const querySnapshotEmail = await usersCollection.where('email', '==', email).get();

        if (!querySnapshotEmail.empty) {
            return res.status(409).json({ success: false, mensaje: 'El email ya está en uso' });
        }

        const querySnapshotUsername = await usersCollection.where('username', '==', username).get();

        if (!querySnapshotUsername.empty) {
            return res.status(409).json({ success: false, mensaje: 'El nombre de usuario ya está en uso' });
        }

        const newUser = {
            name,
            email,
            username,
            birthDate,
            password: await bcrypt.hash(password, 10),
            followers: [],
            savedPosts: [],
            profilePic: ""
        };

        const newUserRef = await usersCollection.add(newUser);

        const userToken = { username: newUser.username, timestamp: new Date() };
        const token = jwt.sign(userToken, "clave-secretisima", { expiresIn: '1h' });

        return res.json({ success: true, user: newUser, token, userId: newUserRef.id });
    } catch (error) {
        console.error('Error al agregar usuario:', error);
        return res.status(500).json({ success: false, mensaje: 'Error al agregar usuario' });
    }
};

exports.updateUser = async (req, res) => {
    const { username } = req.params;
    const { username2, name, email, birthDate, profilePic } = req.body;

    try {
        const userQuery = await usersCollection.where('username', '==', username).limit(1).get();

        if (userQuery.empty) {
            return res.status(404).json({ success: false, mensaje: 'Usuario no encontrado' });
        }

        const newUserQuery = await usersCollection.where('username', '==', username2).get();

        if (!newUserQuery.empty) {
            return res.status(409).json({ mensaje: 'El nuevo nombre está en uso' });
        }

        const querySnapshotUsers = await usersCollection.where('followers', 'array-contains', username).get();

        querySnapshotUsers.forEach(async (doc) => {
            const followers = doc.data().followers;
            const index = followers.indexOf(username);
            followers[index] = username2;
            await usersCollection.doc(doc.id).update({ followers });
        }
        );

        const userDoc = userQuery.docs[0].ref;

        await userDoc.update({
            username: username2,
            name,
            email,
            birthDate,
            profilePic
        });

        const user = (await userDoc.get()).data();

        res.json(user);
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ mensaje: 'Error al actualizar usuario' });
    }
};

exports.updateUserWithPassword = async (req, res) => {
    const { username } = req.params;
    const { username2, name, email, birthDate, profilePic, password } = req.body;

    try {
        const userQuery = await usersCollection.where('username', '==', username).limit(1).get();

        if (userQuery.empty) {
            return res.status(404).json({ success: false, mensaje: 'Usuario no encontrado' });
        }

        const newUserQuery = await usersCollection.where('username', '==', username2).get();

        if (!newUserQuery.empty) {
            return res.status(409).json({ mensaje: 'El nuevo nombre está en uso' });
        }

        const querySnapshotUsers = await usersCollection.where('followers', 'array-contains', username).get();

        querySnapshotUsers.forEach(async (doc) => {
            const followers = doc.data().followers;
            const index = followers.indexOf(username);
            followers[index] = username2;
            await usersCollection.doc(doc.id).update({ followers });
        }
        );

        const userDoc = userQuery.docs[0].ref;

        await userDoc.update({
            username: username2,
            name,
            email,
            birthDate,
            profilePic,
            password: await bcrypt.hash(password, 10)
        });

        const user = (await userDoc.get()).data();

        res.json(user);
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ mensaje: 'Error al actualizar usuario' });
    }
};

exports.checkEmail = async (req, res) => {
    const { email } = req.params;

    try {
        const emailQuery = await usersCollection.where('email', '==', email).limit(1).get();

        if (emailQuery.empty) {
            return res.json({ emailExists: false });
        }

        return res.json({ emailExists: true });
    } catch (error) {
        console.error('Error al buscar el email:', error);
        return res.status(500).json({ mensaje: 'Error al buscar el email' });
    }
};

exports.findUserByUsername = async (req, res) => {
    const { username } = req.params;

    try {
        const usernameQuery = await usersCollection.where('username', '==', username).limit(1).get();

        if (usernameQuery.empty) {
            return res.json({ userExists: false, user: null });
        }

        const userData = usernameQuery.docs[0].data();

        return res.json({ userExists: true, user: userData });
    } catch (error) {
        console.error('Error al buscar el usuario:', error);
        return res.status(500).json({ mensaje: 'Error al buscar el usuario' });
    }
};

exports.findUserById = async (req, res) => {
    const { userId } = req.params;

    try {
        const userDoc = await usersCollection.doc(userId).get();

        if (!userDoc.exists) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        const userData = userDoc.data();
        return res.json(userData);
    } catch (error) {
        console.error('Error al buscar el usuario:', error);
        return res.status(500).json({ mensaje: 'Error al buscar el usuario' });
    }
};

exports.getUsersExceptSessionUser = async (req, res) => {
    const { username, search } = req.query;

    try {
        const usersSnapshot = await usersCollection.get();

        const users = usersSnapshot.docs
            .filter(doc => doc.data().username !== username &&
                doc.data().username.toLowerCase().startsWith(search))
            .map(doc => doc.data());

        res.json(users);
    } catch (error) {
        console.error('Error al buscar los usuarios:', error);
        res.status(500).json({ mensaje: 'Error al buscar los usuarios' });
    }
};

exports.saveNewPost = async (req, res) => {
    const { username, postId } = req.params;

    try {
        const userQuery = await usersCollection.where('username', '==', username).limit(1).get();

        if (userQuery.empty) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        const userDoc = userQuery.docs[0].ref;

        await userDoc.update({
            savedPosts: admin.firestore.FieldValue.arrayUnion(postId)
        });

        res.json({ success: true, mensaje: 'Post guardado exitosamente' });
    } catch (error) {
        console.error('Error al guardar el post:', error);
        res.status(500).json({ mensaje: 'Error al guardar el post' });
    }
};

exports.unsavePost = async (req, res) => {
    const { username, postId } = req.params;

    try {
        const userQuery = await usersCollection.where('username', '==', username).limit(1).get();

        if (userQuery.empty) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        const userDoc = userQuery.docs[0].ref;

        await userDoc.update({
            savedPosts: admin.firestore.FieldValue.arrayRemove(postId)
        });

        res.json({ success: true, mensaje: 'Post eliminado de los guardados exitosamente' });
    } catch (error) {
        console.error('Error al eliminar el post guardado:', error);
        res.status(500).json({ mensaje: 'Error al eliminar el post guardado' });
    }
};

exports.getSavedPosts = async (req, res) => {
    const { username } = req.params;

    try {
        const usernameQuery = await usersCollection.where('username', '==', username).limit(1).get();

        if (usernameQuery.empty) {
            return res.status(404).json({ user: null, userExists: false, mensaje: 'Usuario no encontrado' });

        }

        const userData = usernameQuery.docs[0].data();

        const savedPostIds = userData.savedPosts || [];

        res.json(savedPostIds);
    } catch (error) {
        console.error('Error al buscar los posts guardados:', error);
        res.status(500).json({ mensaje: 'Error al buscar los posts guardados' });
    }
};

exports.checkSavedPost = async (req, res) => {
    const { username, postId } = req.params;

    try {
        const usernameQuery = await usersCollection.where('username', '==', username).limit(1).get();

        if (usernameQuery.empty) {
            return res.status(404).json({ user: null, userExists: false, mensaje: 'Usuario no encontrado' });
        }

        const userData = usernameQuery.docs[0].data();

        const isSaved = (userData.savedPosts || []).includes(postId);

        res.json(isSaved);
    } catch (error) {
        console.error('Error al verificar si el post está guardado:', error);
        res.status(500).json({ mensaje: 'Error al verificar si el post está guardado' });
    }
};

exports.followUser = async (req, res) => {
    const { username, followed } = req.params;

    try {
        const followedUserQuery = await usersCollection.where('username', '==', username).get();

        if (followedUserQuery.empty) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        const userFollowedQuery = await usersCollection.where('username', '==', followed).get();

        if (userFollowedQuery.empty) {
            return res.status(404).json({ mensaje: 'Usuario a seguir no encontrado' });
        }

        const followedUserDoc = followedUserQuery.docs[0].ref;

        await followedUserDoc.update({
            followers: admin.firestore.FieldValue.arrayUnion(followed)
        });

        const userSnapshot = await usersCollection.doc(username).get();
        const user = userSnapshot.data();

        res.json(user);
    } catch (error) {
        console.error('Error al seguir al usuario:', error);
        res.status(500).json({ mensaje: 'Error al seguir al usuario' });
    }
};

exports.unfollowUser = async (req, res) => {
    const { username, followed } = req.params;

    try {
        const followedUserQuery = await usersCollection.where('username', '==', username).get();

        if (followedUserQuery.empty) {
            return res.status(404).json({ mensaje: 'Usuario  no encontrado' });
        }

        const userFollowedQuery = await usersCollection.where('username', '==', followed).get();

        if (userFollowedQuery.empty) {
            return res.status(404).json({ mensaje: 'Usuario que deja de seguir no encontrado' });
        }

        const followedUserDoc = followedUserQuery.docs[0].ref;

        await followedUserDoc.update({
            followers: admin.firestore.FieldValue.arrayRemove(followed)
        });

        const userSnapshot = await usersCollection.doc(username).get();
        const user = userSnapshot.data();

        res.json(user);
    } catch (error) {
        console.error('Error al dejar de seguir al usuario:', error);
        res.status(500).json({ mensaje: 'Error al dejar de seguir al usuario' });
    }
};

exports.getFollowers = async (req, res) => {
    const { username } = req.params;

    try {
        const userSnapshot = await usersCollection.where('username', '==', username).limit(1).get();

        if (userSnapshot.empty) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        const userData = userSnapshot.docs[0].data();
        const followersUsernames = userData.followers || [];

        const followers = await Promise.all(
            followersUsernames.map(async (followerUsername) => {
                const followerSnapshot = await usersCollection.where('username', '==', followerUsername).limit(1).get();
                if (!followerSnapshot.empty) {
                    return followerSnapshot.docs[0].data();
                }
                return null;
            })
        );

        const filteredFollowers = followers.filter((follower) => follower !== null);

        res.json(filteredFollowers);
    } catch (error) {
        console.error('Error al buscar los seguidores:', error);
        res.status(500).json({ mensaje: 'Error al buscar los seguidores' });
    }
};


exports.getFollows = async (req, res) => {
    const { username } = req.params;

    try {
        const userSnapshot = await usersCollection.where('username', '==', username).limit(1).get();

        if (userSnapshot.empty) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        const allUsersQuery = await usersCollection.get();
        const allUsers = [];

        allUsersQuery.forEach((userDoc) => {
            allUsers.push(userDoc.data());
        });

        const follows = allUsers.filter((user) => user.followers && user.followers.includes(username));

        res.json(follows);
    } catch (error) {
        console.error('Error al buscar los seguidos:', error);
        res.status(500).json({ mensaje: 'Error al buscar los seguidos' });
    }
};

exports.checkFollow = async (req, res) => {
    const { username, followed } = req.params;

    try {
        const followedUserQuery = await usersCollection.where('username', '==', username).get();

        if (followedUserQuery.empty) {
            return res.status(404).json({ mensaje: 'Usuario a verificar no encontrado' });
        }

        const userFollowedQuery = await usersCollection.where('username', '==', followed).get();

        if (userFollowedQuery.empty) {
            return res.status(404).json({ mensaje: 'Usuario a seguir no encontrado' });
        }

        const followedUserDoc = followedUserQuery.docs[0].data();

        const isFollowing = followedUserDoc.followers && followedUserDoc.followers.includes(followed);

        res.json(isFollowing);
    } catch (error) {
        console.error('Error al verificar si el usuario está siendo seguido:', error);
        res.status(500).json({ mensaje: 'Error al verificar si el usuario está siendo seguido' });
    }
};

exports.changeUserFromFollowers = async (req, res) => {
    const { user, newUser } = req.params;

    try {
        const userQuery = await usersCollection.where('username', '==', user).get();

        if (userQuery.empty) {
            return res.status(404).json({ mensaje: 'Usuario a seguir no encontrado' });
        }

        const newUserQuery = await usersCollection.where('username', '==', newUser).get();

        if (!newUserQuery.empty) {
            return res.status(409).json({ mensaje: 'El nuevo nombre está en uso' });
        }

        const querySnapshotUsers = await usersCollection.where('followers', 'array-contains', user).get();

        querySnapshotUsers.forEach(async (doc) => {
            const followers = doc.data().followers;
            const index = followers.indexOf(user);
            followers[index] = newUser;
            await usersCollection.doc(doc.id).update({ followers });
        }
        );

        res.json({ mensaje: 'Usuario actualizado correctamente', success: true });
    }
    catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ mensaje: 'Error al actualizar el usuario', success: false });
    }
}

exports.deletePublicationOfSavedPosts = async (req, res) => {
    const { publicationId } = req.params;

    try {
        const querySnapshotUsers = await usersCollection.get();

        querySnapshotUsers.forEach(async (doc) => {
            if (doc.data().savedPosts.includes(publicationId)) {
                const savedPosts = doc.data().savedPosts;
                const index = savedPosts.indexOf(publicationId);
                savedPosts.splice(index, 1);
                await usersCollection.doc(doc.id).update({ savedPosts });
            }
        });

        res.json({ mensaje: 'Publicación eliminada de los guardados exitosamente', success: true });
    }
    catch (error) {
        console.error('Error al eliminar la publicación:', error);
        res.status(500).json({ mensaje: 'Error al eliminar la publicación', success: false });
    }
}