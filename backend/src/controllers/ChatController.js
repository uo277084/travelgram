const admin = require('firebase-admin');

const db = admin.firestore();
const chatsCollection = db.collection('chats');

exports.getChatOrder = async (req, res) => {
    const { username } = req.params;

    try {
        const querySnapshotUser1 = await chatsCollection
            .where('user1', '==', username)
            .get();

        const querySnapshotUser2 = await chatsCollection
            .where('user2', '==', username)
            .get();

        const chatWithLastMessage = [];

        querySnapshotUser1.forEach((doc) => {
            const chatData = doc.data();
            chatData.id = doc.id;
            if (chatData.lastMessage) {
                chatWithLastMessage.push({
                    chat: chatData
                });
            }
        });

        querySnapshotUser2.forEach((doc) => {
            const chatData = doc.data();
            chatData.id = doc.id;
            if (chatData.lastMessage) {
                chatWithLastMessage.push({
                    chat: chatData
                });
            }
        });

        chatWithLastMessage.sort((a, b) => {
            return b.chat.lastMessage.timestamp - a.chat.lastMessage.timestamp
        });

        const last3Chats = chatWithLastMessage.slice(0, 3);

        res.json({ success: true, chats: last3Chats });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
}

exports.getChatByUsers = async (req, res) => {
    const { user1, user2 } = req.params;

    try {
        const querySnapshot = await chatsCollection
            .where('user1', 'in', [user1, user2])
            .where('user2', 'in', [user1, user2])
            .limit(1)
            .get();

        let chatData = null;

        querySnapshot.forEach((doc) => {
            chatData = doc.data();
        });

        res.json({ success: true, chat: chatData });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
}

exports.addMessage = async (req, res) => {
    const { sender, receiver, message } = req.body;

    try {
        const chatQuerySnapshot = await chatsCollection
            .where('user1', 'in', [sender, receiver])
            .where('user2', 'in', [sender, receiver])
            .limit(1)
            .get();

        let chatDoc = null;

        chatQuerySnapshot.forEach((doc) => {
            chatDoc = doc;
        });

        if (chatDoc == null) {
            return res.status(404).json({ success: false, error: 'Chat not found' });
        }

        chatsCollection.doc(chatDoc.id).update({ lastMessage: { message, timestamp: new Date() } });

        const messagesCollectionRef = chatDoc.ref.collection('messages');

        const newMessageRef = await messagesCollectionRef.add({
            sender,
            receiver,
            message,
            timestamp: new Date(),
        });

        const newMessageDoc = await newMessageRef.get();

        return res.json({ success: true, message: newMessageDoc.data() });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
}

exports.getMessages = async (req, res) => {
    const { chatId } = req.params;

    try {
        const chatRef = chatsCollection.doc(chatId);
        const messagesCollectionRef = chatRef.collection('messages');

        const querySnapshot = await messagesCollectionRef.orderBy('timestamp', 'asc').get();

        const messages = [];

        querySnapshot.forEach((doc) => {
            const messageData = doc.data();
            messages.push({ id: doc.id, ...messageData });
        });

        res.json({ success: true, messages });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
}

exports.createChat = async (req, res) => {
    const { user1, user2 } = req.body;

    try {

        const querySnapshot = await chatsCollection
            .where('user1', 'in', [user1, user2])
            .where('user2', 'in', [user1, user2])
            .limit(1)
            .get();

        if (querySnapshot.size > 0) {
            return res.json({ success: true, chat: { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() } });
        }

        const newChat = {
            user1,
            user2,
        };

        const newChatRef = await chatsCollection.add(newChat);
        const newChatId = newChatRef.id;

        res.json({ success: true, chat: { id: newChatId, ...newChat } });
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
}

exports.checkChat = async (req, res) => {
    const { user1, user2 } = req.params;

    try {
        const querySnapshot = await chatsCollection
            .where('user1', 'in', [user1, user2])
            .where('user2', 'in', [user1, user2])
            .limit(1)
            .get();

        const chatData = [];

        querySnapshot.forEach((doc) => {
            const chat = doc.data();
            chat.id = doc.id;
            chatData.push(chat);
        });

        if (chatData.length > 0) {
            return res.json({ success: true, chatExists: true, chat: chatData[0] });
        } else {
            return res.json({ success: true, chatExists: false });
        }
    } catch (error) {
        res.status(500).json({ success: false, error });
    }
}

exports.changeUserFromChat = async (req, res) => {
    const { user, newUser } = req.body;

    try {
        const querySnapshot = await chatsCollection
            .where('user1', '==', user)
            .get();

        querySnapshot.forEach((doc) => {
            chatsCollection.doc(doc.id).update({ user1: newUser });
        });

        const querySnapshot2 = await chatsCollection
            .where('user2', '==', user)
            .get();

        querySnapshot2.forEach((doc) => {
            chatsCollection.doc(doc.id).update({ user2: newUser });
        });

        const messagesSnapshot = await chatsCollection.get();
        messagesSnapshot.forEach(async (doc) => {
            const messagesRef = chatsCollection.doc(doc.id).collection('messages');
            const querySnapshotMessagesSender = await messagesRef.where('sender', '==', user).get();

            querySnapshotMessagesSender.forEach(async (doc) => {
                await messagesRef.doc(doc.id).update({ sender: newUser });
            }
            );

            const querySnapshotMessagesReceiver = await messagesRef.where('receiver', '==', user).get();

            querySnapshotMessagesReceiver.forEach(async (doc) => {
                await messagesRef.doc(doc.id).update({ receiver: newUser });
            });
        }
        );

        res.json({ success: true });
    }
    catch (error) {
        res.status(500).json({ success: false, error });
    }
}