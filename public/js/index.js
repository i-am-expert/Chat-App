let socket = io();
// after connection is made
socket.on('connect', () => {
    console.log('Connected to Server');
    /*
    socket.emit('createMessage', {
        from: "Rishabh",
        text: "Hey! How are you"
    })
    */
});
// server gets disconnected (server is stopped)
socket.on('disconnect', () => {
    console.log('Disconnected from Server');
});

socket.on('newMessage', (message) => {
    console.log("New message", message);
});