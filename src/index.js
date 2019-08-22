const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words')
const { generateMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;

app.use(express.static('public'))


io.on('connection', (socket) => {
  console.log('Incoming Connection')


  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter();
    const user = getUser(socket.id);

    if (filter.isProfane(message)) {
      return callback('Profanity is not allowed!')
    }

    io.to(user.room).emit('message', generateMessage(message, user.username));
    callback(undefined, 'Message delivered')
  })


  socket.on('sendLocation', (location, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('locationMessage', generateMessage(`https://google.com/maps?q=${location.latitude},${location.longtitude}`, user.username))
    return callback(undefined, 'Location shared!')
  })

  socket.on('join', ({ username, room }, callback) => {
    const { user, error } = addUser({ id: socket.id, username, room })

    if (error) return callback(error);

    socket.join(user.room);
    socket.emit('message', generateMessage('Welcome!', 'Bot')) // When socket connects, send the current count
    socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined the room.`, 'Bot'));
    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) })
    callback()
  })

  socket.on('disconnect', (socket) => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', generateMessage(`${user.username} has left.`, 'Bot'));
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) })
    }
  })
})


app.get('/test', function (req, res) {
  res.send('hello')
})

server.listen(port, () => console.log(`Example app listening on port ${port}!`))

/*
    Code examples
*/

/* Count related code */
  // let count = 0
  // socket.emit('countUpdated', count) // When socket connects, send the current count
  // socket.on('increment', () => {
  //   count++;
  //   // socket.emit('countUpdated', count) // To this socket
  //   io.emit('countUpdated', count) // To every connection
  // })

  // socket.on('sendMessage', (message) => {
  //   io.emit('message', message)
  // })

  // socket.on('sendMessage', (message) => {
  //   console.log(message)
  //   io.emit('message', message)
  // })
