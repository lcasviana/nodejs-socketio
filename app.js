const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

app.set('views', path.join(__dirname, 'views'));
app.use('/scripts', express.static(__dirname + '/scripts'));
app.use('/styles', express.static(__dirname + '/styles'));
app.set('view engine', 'hbs');

let people = [];

io.on('connection', (socket) => {
  const id = socket.id;

  console.log(`Connection: ${id}`);

  socket.on('insertPersonName', ({ name }) => {
    people = [...people, { id, name }]
  });

  socket.on('sendMessageToServer', ({ message }) => {
    const { name } = people.find(person => person.id == id);
    const date = new Date().toISOString();
    io.sockets.emit('receiveMessageFromServer', { id, name, message, date });
  });

  socket.on('disconnect', () => {
    console.error(`Disconnection: ${id}`);
  });
});

app.get('/', (req, res) => {
  res.render('index');
});

http.listen(3000, () => {
  console.log(`Listening: 3000`);
});
