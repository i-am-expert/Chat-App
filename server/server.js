const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app)
// We create our own server because we need to pass instance of server in below line
let io = socketIO(server);

app.use(express.static(publicPath));

// listen for 'connection' event
io.on('connection', (socket) => {
    // when someone hits to index.html
    console.log('A new user just connected');
    socket.on('disconnect', (socket) => {
        // when user disconnects (closes tab)
        console.log('User was disconnected');
    })
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
})