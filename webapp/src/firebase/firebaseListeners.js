import { initializeApp } from "firebase/app";
import 'firebase/database';
import { collection, doc, getFirestore, onSnapshot, orderBy, query } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCJV5fCZDohffEMHOMQvRsmA9vMDrxDfQM",
    authDomain: "travelgram-db3d8.firebaseapp.com",
    databaseURL: "https://travelgram-db3d8-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "travelgram-db3d8",
    storageBucket: "travelgram-db3d8.appspot.com",
    messagingSenderId: "891482843345",
    appId: "1:891482843345:web:559366ca36a55f845d7df0",
    measurementId: "G-VMR0WNG1XR"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

function configureChatListener(chatId, callback) {
    const chatRef = doc(db, "chats", chatId);
    const messagesRef = collection(chatRef, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const updatedMessages = [];
        snapshot.forEach((doc) => {
            const messageData = doc.data();
            updatedMessages.push(messageData);
        });
        callback(updatedMessages);
    });

    return unsubscribe;
}

function changeChatOrderListener(username, callback) {
    const chatsRef = collection(db, "chats");
    const q = query(chatsRef, orderBy("lastMessage.timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        const updatedChats = [];
        snapshot.forEach((doc) => {
            const chatData = doc.data();
            chatData.id = doc.id;
            if (chatData.user1 === username || chatData.user2 === username) {
                updatedChats.push(chatData);
            }
        });
        callback(updatedChats);
    });

    return unsubscribe;
}

function changeUserListener(userId, callback) {
    const userRef = doc(db, "users", userId);
    const unsubscribe = onSnapshot(userRef, (doc) => {
        const userData = doc.data();
        callback(userData);
    });
    return unsubscribe;
}

const firebaseListeners = { configureChatListener, changeUserListener, changeChatOrderListener };

export default firebaseListeners;