import axios from 'axios';

const baseUrl = 'https://travelgrambackend.onrender.com/api/chat';

const getChatOrder = async (username) => {
    try {
        const response = await axios.get(`${baseUrl}/chats/${username}`);
        return response.data;
    } catch (error) {
        console.error('Error al buscar los chats:', error);
        throw error;
    }
}

const getChatByUsers = async (user1, user2) => {
    try {
        const response = await axios.get(`${baseUrl}/users/${user1}/${user2}`);
        return response.data;
    } catch (error) {
        console.error('Error al buscar el chat:', error);
        throw error;
    }
}

const createChat = async (user1, user2) => {
    try {
        const response = await axios.post(`${baseUrl}/create`, { user1, user2 });
        return response.data;
    } catch (error) {
        console.error('Error al crear el chat:', error);
        throw error;
    }
}

const addMessage = async (sender, receiver, message) => {
    try {
        const response = await axios.post(`${baseUrl}/addMessage`, { sender, receiver, message });
        return response.data;
    } catch (error) {
        console.error('Error al enviar el mensaje:', error);
        throw error;
    }
}

const getMessages = async (chatId) => {
    try {
        const response = await axios.get(`${baseUrl}/messages/${chatId}`);
        return response.data;
    } catch (error) {
        console.error('Error al buscar los mensajes:', error);
        throw error;
    }
}

const checkChat = async (user1, user2) => {
    try {
        const response = await axios.get(`${baseUrl}/checkChat/${user1}/${user2}`);
        return response.data;
    } catch (error) {
        console.error('Error al buscar el chat:', error);
        throw error;
    }
}

const changeUserFromChat = async (user, newUser) => {
    try {
        const response = await axios.put(`${baseUrl}/updateUser`, { user, newUser });
        return response.data;
    } catch (error) {
        console.error('Error al cambiar el usuario del chat:', error);
        throw error;
    }
}

const chatService = { getChatOrder, getChatByUsers, createChat, addMessage, checkChat, getMessages, changeUserFromChat };

export default chatService;