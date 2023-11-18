const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');

var serviceAccount = require("./src/firebaseConfig/travelgram-db3d8-firebase-adminsdk-39zki-484b6a060e.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://travelgram-db3d8-default-rtdb.europe-west1.firebasedatabase.app"
});

const apiRoutes = require('./src/api/api');

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', apiRoutes);

// Iniciar el servidor
const port = 3001;
app.listen(port, () => {
    console.log(`Servidor backend escuchando en el puerto ${port}`);
});
