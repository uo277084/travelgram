import axios from "axios";

const baseUrl = "https://travelgrambackend.onrender.com/api/user";

const login = async (username, password) => {
    try {
        const response = await axios.get(`${baseUrl}/login/${username}/${password}`);
        return response.data;
    } catch (error) {
        console.error('Error en el login:', error);
        throw error;
    }
}

const checkPassword = async (username, password) => {
    try {
        const response = await axios.get(`${baseUrl}/checkPassword/${username}/${password}`);
        return response.data;
    } catch (error) {
        console.error('Error al comprobar la contraseña:', error);
        throw error;
    }
}

const addUser = async (name, email, username, password, birthDate) => {
    try {
        const response = await axios.post(`${baseUrl}/add`, { name, email, username, password, birthDate });
        return response.data;
    } catch (error) {
        console.error('Error al guardar el usuario:', error);
        throw error;
    }
}

const getUserId = async (username) => {
    try {
        const response = await axios.get(`${baseUrl}/id/${username}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener el id del usuario:', error);
        throw error;
    }
}

const updateUser = async (username, username2, name, email, birthDate, profilePic) => {
    try {
        const response = await axios.put(`${baseUrl}/update/${username}`, { username2, name, email, birthDate, profilePic });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        throw error;
    }
}

const updateUserWithPassword = async (username, username2, name, email, birthDate, profilePic, password) => {
    try {
        const response = await axios.put(`${baseUrl}/updatePass/${username}`, { username2, name, email, birthDate, profilePic, password });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        throw error;
    }
}

const checkEmail = async (email) => {
    try {
        const response = await axios.get(`${baseUrl}/checkEmail/${email}`);
        return response.data;
    } catch (error) {
        console.error('Error al comprobar el email:', error);
        throw error;
    }
}

const findUserByUsername = async (username) => {
    try {
        const response = await axios.get(`${baseUrl}/${username}`);
        return response.data;
    } catch (error) {
        console.error('Error al buscar el usuario:', error);
        throw error;
    }
}

const findUserById = async (userId) => {
    try {
        const response = await axios.get(`${baseUrl}/${userId}`);
        return response.data;
    } catch (error) {
        console.error('Error al buscar el usuario:', error);
        throw error;
    }
}

const getUsersExceptSessionUserSearch = async (username, search) => {
    try {
        const response = await axios.get(`${baseUrl}/users/${search}`, { params: { username, search } });
        return response.data;
    } catch (error) {
        console.error('Error al buscar los usuarios:', error);
        throw error;
    }
}

const savePost = async (username, postId) => {
    try {
        const response = await axios.post(`${baseUrl}/savePost/${username}/${postId}`);
        return response.data;
    } catch (error) {
        console.error('Error al guardar el post:', error);
        throw error;
    }
}

const unsavePost = async (username, postId) => {
    try {
        const response = await axios.delete(`${baseUrl}/unsavePost/${username}/${postId}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar el post:', error);
        throw error;
    }
}

const getSavedPosts = async (username) => {
    try {
        const response = await axios.get(`${baseUrl}/savedPosts/${username}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener los posts guardados:', error);
        throw error;
    }
}

const checkSavedPost = async (username, postId) => {
    try {
        const response = await axios.get(`${baseUrl}/checkSaved/${username}/${postId}`);
        return response.data;
    } catch (error) {
        console.error('Error al comprobar si el post está guardado:', error);
        throw error;
    }
}

const followUser = async (username, followed) => {
    try {
        const response = await axios.post(`${baseUrl}/follow/${username}/${followed}`);
        return response.data;
    } catch (error) {
        console.error('Error al seguir al usuario:', error);
        throw error;
    }
}

const unfollowUser = async (username, followed) => {
    try {
        const response = await axios.delete(`${baseUrl}/unfollow/${username}/${followed}`);
        return response.data;
    } catch (error) {
        console.error('Error al dejar de seguir al usuario:', error);
        throw error;
    }
}

const getFollowers = async (username) => {
    try {
        const response = await axios.get(`${baseUrl}/followers/${username}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener los seguidores:', error);
        throw error;
    }
}

const getFollows = async (username) => {
    try {
        const response = await axios.get(`${baseUrl}/follows/${username}`);
        return response.data;
    } catch (error) {
        console.error('Error al obtener los seguidos:', error);
        throw error;
    }
}

const checkFollow = async (username, followed) => {
    try {
        const response = await axios.get(`${baseUrl}/checkFollow/${username}/${followed}`);
        return response.data;
    } catch (error) {
        console.error('Error al comprobar si el usuario está seguido:', error);
        throw error;
    }
}

const changeUserFromFollower = async (user, newUser) => {
    try {
        const response = await axios.put(`${baseUrl}/updateFollower`, { user, newUser });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar el usuario de la publicación:', error);
        throw error;
    }
}

const deletePublicationOfSavedPosts = async (publicationId) => {
    try {
        const response = await axios.delete(`${baseUrl}/deletePost/${publicationId}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar la publicación de los posts guardados:', error);
        throw error;
    }
}

const userService = {
    login, addUser, getUserId, updateUser, checkEmail, findUserByUsername,
    findUserById, getUsersExceptSessionUserSearch, savePost, unsavePost, getSavedPosts,
    checkSavedPost, getFollowers, getFollows, checkFollow, followUser, unfollowUser,
    changeUserFromFollower, deletePublicationOfSavedPosts, checkPassword, updateUserWithPassword
};

export default userService;