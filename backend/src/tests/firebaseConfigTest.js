const admin = require('firebase-admin');

const serviceAccount = require("../firebaseConfig/testtravelgram-bd8bd-firebase-adminsdk-7rxhk-8fbc4861b7.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://testtravelgram-bd8bd-default-rtdb.europe-west1.firebasedatabase.app"
});

const db = admin.firestore();
const chatsCollection = db.collection('chats');
const usersCollection = db.collection('users');
const publicationsCollection = db.collection('publications');

module.exports = { admin, chatsCollection, usersCollection, publicationsCollection };
