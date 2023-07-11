const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let players = [];

app.use(express.static("public"))

app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/index.html');
})

io.on('connection', (socket) => {
  console.log('a user connected: '+ socket.id);

  socket.on('moveMyself', (info)=>{
    completeInfo = {...info, id: socket.id}
    players[players.findIndex(playerInfo=>playerInfo.id === socket.id)] = completeInfo
    socket.broadcast.emit("peopleMoved", completeInfo)
  })
  socket.on('newPlayer', (info)=>{
    completeInfo = {...info, id: socket.id}
    players.push(completeInfo)
    socket.broadcast.emit("newPlayer", completeInfo)
  })

  socket.on('disconnect', ()=>{
    socket.broadcast.emit("playerLeft", socket.id)
    players.splice(players.findIndex(playerInfo=>playerInfo.id === socket.id), 1)
  })

  socket.on("sendMessage", (message)=>{
    io.emit("newMessage", message)
  })
});

io.on('connect', (socket)=>{
    socket.emit('oldPlayers', players)
})

server.listen(3000, '0.0.0.0', () => {
  console.log('listening on *:3000');
});