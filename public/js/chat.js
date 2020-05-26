let socket = io();

function scrollToBottom() {
    let messages = document.querySelector('#messages').lastElementChild;
    messages.scrollIntoView();
}

// after connection is made
socket.on('connect', () => {
    console.log('Connected to Server');
    let searchQuery = window.location.search.substring(1);
    let params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g,'":"') + '"}');
    // 'join' is predefined event
    socket.emit('join', params, function(err) {
        if(err) {
            alert(err);
            window.location.href = "/";
        } else {
            console.log('No error');
        }
    })
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

socket.on('updateUsersList', function(users) {
    let ol = document.createElement('ol');
    users.forEach(function (user) {
        let li = document.createElement('li');
        li.innerHTML = user;
        ol.appendChild(li);
    })
    let usersList = document.querySelector('#users');
    usersList.innerHTML = '';
    usersList.appendChild(ol);
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