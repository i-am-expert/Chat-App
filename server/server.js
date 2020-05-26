const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
const {isRealString} = require('./utils/isRealString');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app)
// We create our own server because we need to pass instance of server in below line
let io = socketIO(server);

let users = new Users();

app.use(express.static(publicPath));

// listen for 'connection' event
io.on('connection', (socket) => {
    // when someone hits to index.html
    console.log('A new user just connected');

    socket.on('join', (params, callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and Room are required');
        }

        socket.join(params.room);
        // If user is already in any other room, remove him from that room
        users.removeUser(socket.id);
        // Add user to new room
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUsersList', users.getUserList(params.room));

        // Everyone who connects to home page
        socket.emit('newMessage', generateMessage('Admin', `Welcome to ${params.room}!`));

        // For everyone except curr user
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', 'A new user joined'));

        callback();
    })

    socket.on('createMessage', (message, callback) => {
        console.log('Created message', message);
        
        let user = users.getUser(socket.id);

        if(user && isRealString(message.text)) {
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }
        
        // Broadcast to all including current user
        callback();

        /*
        // Broadcast to all except current user
        socket.broadcast.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdAt: new Date().getTime()
        });
        */
    });

    socket.on('disconnect', () => {
        // when user disconnects (closes tab)
        console.log('User was disconnected');
        let user = users.removeUser(socket.id);
        if(user) {
            io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left ${user.room} chat room`));
        }
    })
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
})