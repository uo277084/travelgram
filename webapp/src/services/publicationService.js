import axios from "axios";

const baseUrl = "https://travelgrambackend.onrender.com/api/publication";

const addPublication = async (country, cities, rating, description, dateTripStart, dateTripFinish, user) => {
    try {
        const response = await axios.post(`${baseUrl}/add`, { country, cities, rating, description, dateTripStart, dateTripFinish, user });
        return response.data;
    } catch (error) {
        console.error('Error al guardar la publicación:', error);
        throw error;
    }
}

const getPublicationsByUser = async (username) => {
    try {
        const response = await axios.get(`${baseUrl}/user/${username}`);
        return response.data;
    } catch (error) {
        console.error('Error al buscar las publicaciones:', error);
        throw error;
    }
}

const getPublicationsByCountry = async (country, username) => {
    try {
        const response = await axios.get(`${baseUrl}/country/${country}/${username}`);
        return response.data;
    } catch (error) {
        console.error('Error al buscar las publicaciones:', error);
        throw error;
    }
}

const changeUser = async (user, newUser) => {
    try {
        const response = await axios.put(`${baseUrl}/updateUser`, { user, newUser });
        return response.data;
    } catch (error) {
        console.error('Error al actualizar el usuario de la publicación:', error);
        throw error;
    }
}

const countPosts = async (username) => {
    try {
        const response = await axios.get(`${baseUrl}/countPosts/${username}`);
        return response.data;
    } catch (error) {
        console.error('Error al buscar las publicaciones:', error);
        throw error;
    }
}

const addLike = async (publicationId, username) => {
    try {
        const response = await axios.put(`${baseUrl}/addLike/${publicationId}`, { username });
        return response.data;
    } catch (error) {
        console.error('Error al agregar el like:', error);
        throw error;
    }
}

const removeLike = async (publicationId, username) => {
    try {
        const response = await axios.delete(`${baseUrl}/removeLike/${publicationId}?username=${username}`);
        return response.data;
    } catch (error) {
        console.error('Error al agregar el like:', error);
        throw error;
    }
}

const checkLike = async (publicationId, username) => {
    try {
        const response = await axios.get(`${baseUrl}/hasLiked/${publicationId}/${username}`);
        return response.data;
    } catch (error) {
        console.error('Error al buscar si el usuario ha dado like:', error);
        throw error;
    }
}

const countLikes = async (publicationId) => {
    try {
        const response = await axios.get(`${baseUrl}/likes/${publicationId}`);
        return response.data;
    } catch (error) {
        console.error('Error al buscar los likes:', error);
        throw error;
    }
}

const getPublicationById = async (publicationId) => {
    try {
        const response = await axios.get(`${baseUrl}/id/${publicationId}`);
        return response.data;
    } catch (error) {
        console.error('Error al buscar la publicación:', error);
        throw error;
    }
}

const getCommentsOfPublication = async (publicationId) => {
    try {
        const response = await axios.get(`${baseUrl}/comments/${publicationId}`);
        return response.data;
    } catch (error) {
        console.error('Error al buscar los comentarios:', error);
        throw error;
    }
}

const addCommentToAPublication = async (publicationId, user, comment) => {
    try {
        const response = await axios.put(`${baseUrl}/addComment/${publicationId}`, { user, comment });
        return response.data;
    } catch (error) {
        console.error('Error al agregar el comentario:', error);
        throw error;
    }
}

const removeCommentFromAPublication = async (publicationId, commentId) => {
    try {
        const response = await axios.delete(`${baseUrl}/removeComment/${publicationId}/${commentId}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar el comentario:', error);
        throw error;
    }
}

const addImagesToAPublication = async (id, images) => {
    try {
        const response = await axios.put(`${baseUrl}/images`, { id, images });
        return response.data;
    } catch (error) {
        console.error('Error al añadir las imágenes:', error);
        throw error;
    }
}

const getRecommendPosts = async (username) => {
    try {
        const response = await axios.get(`${baseUrl}/recommend/${username}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

const getPublicationsOfFollowedusersOrderedByDate = async (usernames) => {
    try {
        const response = await axios.get(`${baseUrl}/followed`, { params: { usernames } });
        return response.data;
    } catch (error) {
        console.error('Error al buscar las publicaciones de los usuarios seguidos:', error);
        throw error;
    }
}

const deletePublication = async (publicationId) => {
    try {
        const response = await axios.delete(`${baseUrl}/delete/${publicationId}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar la publicación:', error);
        throw error;
    }
}

const publicationService = {
    addPublication, getPublicationsByUser, getPublicationsByCountry, changeUser,
    countPosts, addLike, removeLike, checkLike, countLikes, getPublicationById, getCommentsOfPublication,
    addCommentToAPublication, removeCommentFromAPublication, addImagesToAPublication, getRecommendPosts,
    getPublicationsOfFollowedusersOrderedByDate, deletePublication
}

export default publicationService;