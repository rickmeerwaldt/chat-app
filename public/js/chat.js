const socket = io()

// Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $locationButton = document.querySelector('#location')
const $messages = document.querySelector('#messages');

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
  // New message element
  const $newMessage = $messages.lastElementChild

  // Height of the new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // Visible height
  const visibleHeight = $messages.offsetHeight;

  // Height of messages container
  const containerHeight = $messages.scrollHeight;

  // How for have I scrolles?
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) $messages.scrollTop = $messages.scrollHeight;
}

socket.on('message', (message) => {
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format('H:mm')
  });
  $messages.insertAdjacentHTML('beforeend', html);
  autoscroll();
})

socket.on('locationMessage', (message) => {
  const html = Mustache.render(locationTemplate, {
    username: message.username,
    url: message.text,
    createdAt: moment(message.createdAt).format('H:mm')
  });
  $messages.insertAdjacentHTML('beforeend', html);
  autoscroll();
})

socket.on('roomData', ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  })
  document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (e) => {
  e.preventDefault()

  $messageFormButton.setAttribute('disabled', 'disabled')

  const message = e.target.elements.message.value

  socket.emit('sendMessage', message, (error, success) => {

    // After acknowledgement enable the button, remove the input and focus the cursor in the input field
    $messageFormButton.removeAttribute('disabled');
    $messageFormInput.value = ''
    $messageFormInput.focus();

    if (error) return console.log('Error:', error)
    console.log(success)
  })
})

$locationButton.addEventListener('click', () => {
  if (!navigator.geolocation) return alert('Geolocation is not supported by this browser');

  $locationButton.setAttribute('disabled', 'disabled')

  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit('sendLocation', {
      latitude: position.coords.latitude,
      longtitude: position.coords.longitude
    }, (error, success) => {

      // After acknowledgement enable the button again
      $locationButton.removeAttribute('disabled');

      if (error) return console.log('Error:', error)
      console.log(success)
    })
  })
})

socket.emit('join', { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = '/'
  }
});

/*
    Code examples
*/


// Add selector on message input form
// const messageForm = document.querySelector('#messageForm').addEventListener('submit', (e) => {
//   e.preventDefault();
//   const message = e.target.elements.message
//   socket.emit('sendMessage', message)
// })


// socket.on('countUpdated', (count) => {
//   console.log('Count has been updated:', count)
// })

// document.querySelector('#increment').addEventListener('click', () => {
//   console.log('clicked')
//   socket.emit('increment')
// })


// e.preventDefault();
// const message = e.target.elements.message
// socket.emit('sendMessage', message)


// const message = document.querySelector('#message')

// document.querySelector('#send').addEventListener('click', () => {
//   console.log('clicked')
//   const value = message.value;
//   socket.emit('sendMessage', value)
// })


