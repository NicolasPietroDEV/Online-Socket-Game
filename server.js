const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let players = [];
let rooms = {};

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/login/login.html");
});

io.on("connection", (socket) => {
  console.log("a user connected: " + socket.id);

  socket.on("moveMyself", (info) => {
    completeInfo = { ...info, id: socket.id };
    rooms[info.to].players[rooms[info.to].players.findIndex((playerInfo) => playerInfo.id === socket.id)] = completeInfo
    socket.broadcast.to(info.to).emit("peopleMoved", completeInfo);
  });
  socket.on("newPlayer", (info) => {
    completeInfo = { ...info, id: socket.id };
    rooms[info.to].players.push(completeInfo)
    socket.broadcast.to(info.to).emit("newPlayer", completeInfo);
  });

  socket.on("disconnect", () => {
    players.splice(
      players.findIndex((playerInfo) => playerInfo.id === socket.id),
      1
    );
  });

  socket.on("sendMessage", (message) => {
    completeInfo = { ...message, id: socket.id };
    io.to(message.to).emit("newMessage", completeInfo);
  });

  socket.on("joinRoom", (info) => {
    socket.join(info.room);
    completeInfo = { ...info.player, id: socket.id };

    console.log("user ",  socket.id, " joined room ", info.room)
    if (!Object.keys(rooms).includes(info.room)) {
      rooms[info.room] = { players: [completeInfo] };
    } else {
      socket.emit("oldPlayers", rooms[info.room].players);
      rooms[info.room].players.push(completeInfo);
    }

    socket.broadcast.to(info.room).emit("newPlayer", completeInfo);
  });

  socket.on("disconnecting", ()=>{
    let roomsToLeave = [...socket.rooms]
    roomsToLeave.splice(roomsToLeave.findIndex(room=>room == socket.id), 1)
    for (let room of roomsToLeave){
      socket.broadcast.to(room).emit("playerLeft", socket.id);
      console.log("user ",  socket.id, " left room ", room)
      let playerIndex = rooms[room].players.findIndex(player => player.id == socket.id)
      rooms[room].players.splice(playerIndex, 1)
      if(rooms[room].players.length == 0){delete rooms[room]}

    }
  })
});

io.on("connect", (socket) => {
  // socket.emit("oldPlayers", players);
  socket.emit("yourId", socket.id);
});



server.listen(3000, "0.0.0.0", () => {
  console.log("listening on *:3000");
});
