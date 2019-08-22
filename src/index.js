const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

app.use(express.static('public'))

let count = 0

io.on('connection', (socket) => {
  console.log('Incoming Connection')

  /* Count related code */
  // socket.emit('countUpdated', count) // When socket connects, send the current count
  // socket.on('increment', () => {
  //   count++;
  //   // socket.emit('countUpdated', count) // To this socket
  //   io.emit('countUpdated', count) // To every connection
  // })

  socket.emit('message', 'Welcome!') // When socket connects, send the current count

  socket.broadcast.emit('message', 'A new user has joined')

  // socket.on('sendMessage', (message, callback) => {
  //   io.emit('message', message)
  //   return callback('Delivered');
  // })

  // socket.on('sendMessage', (message) => {
  //   console.log(message)
  //   io.emit('message', message)
  // })

  socket.on('sendMessage', (message) => {
    io.emit('message', message)
  })

  socket.on('sendLocation', (location) => {
    io.emit('message', `Location: https://google.com/maps?q=${location.latitude},${location.longtitude}`)
  })

  socket.on('disconnect', (socket) => {
    console.log('Disconnected')
    io.emit('message', 'A user has left')
  })
})


app.get('/test', function (req, res) {
  res.send('hello')
})

server.listen(port, () => console.log(`Example app listening on port ${port}!`))