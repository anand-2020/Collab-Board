const express = require('express');
const cors = require('cors');
const path = require('path');
const { setupSocket } = require('./setupSocket')

const app = express();

app.use(cors());

// REACT BUILD for production
if (process.env.NODE_ENV === 'PROD') {
    app.use(express.static(path.join(__dirname, 'build')));
    app.get('/*', (req, res) => {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });
}

const PORT = 5000;

const server = app.listen(PORT, () => {
    console.log(`Server is running on ${PORT} ...`);
});

setupSocket(server)

