const socket = io()

socket.on('message', (message) => {
  console.log(message)
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
  e.preventDefault()

  const message = e.target.elements.message.value

  socket.emit('sendMessage', message)
})

document.querySelector('#location').addEventListener('click', () => {
  if (!navigator.geolocation) return alert('Geolocation is not supported by this browser');

  navigator.geolocation.getCurrentPosition((position) => {
    console.log(position)
    socket.emit('sendLocation', {
      latitude: position.coords.latitude,
      longtitude: position.coords.longitude
    })
  })
})


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


