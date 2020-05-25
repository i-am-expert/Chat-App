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

    // Everyone who connects to home page
    socket.emit('newMessage', {
        from: 'Admin',
        text: 'Welcome to the Chat App!',
        createdAt: new Date().getTime()
    });

    // For everyone except curr user
    socket.broadcast.emit('newMessage', {
        from: 'Admin',
        text: 'A new user joined',
        createdAt: new Date().getTime()
    });

    socket.on('createMessage', (message) => {
        console.log('Created message', message);
        /*
        // Broadcast to all including current user
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });
        */
        
        /*
        // Broadcast to all except current user
        socket.broadcast.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });
        */
    });

    socket.on('disconnect', (socket) => {
        // when user disconnects (closes tab)
        console.log('User was disconnected');
    })
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
})