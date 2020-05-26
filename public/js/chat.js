let socket = io();

function scrollToBottom() {
    let messages = document.querySelector('#messages').lastElementChild;
    messages.scrollIntoView();
}

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
    const formattedTime = moment(message.createdAt).format('LT');
  const template = document.querySelector('#message-template').innerHTML;
  const html = Mustache.render(template, {
    from: message.from,
    text: message.text,
    createdAt: formattedTime
  });

  const div = document.createElement('div');
  div.innerHTML = html

  document.querySelector('#messages').appendChild(div);
  scrollToBottom();
});

/*
socket.emit('createMessage', {
    from: 'John',
    text: 'Hey'
}, function() {
    console.log("Server got it");
});
*/

document.querySelector('#submit-btn').addEventListener('click', function(e) {
    e.preventDefault();

    socket.emit('createMessage', {
        from: 'User',
        text: document.querySelector('input[name="message"]').value
    }, function() {
        document.querySelector('input[name="message"]').value = '';
    })
})

/*
document.querySelector('#send-location').addEventListener('click', function(e) {
    if(!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser');
    }
    navigator.geolocation.getCurrentPosition(function (position) {
        console.log('hello');
        console.log(position);
        alert('Got it');
    }, function(err) {
        console.log(err)
        alert('Unable to fetch location');
    })
})
*/