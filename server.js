const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5501",
    methods: ["GET", "POST"]
  }
});
const uuidv4 = require("./services/uuidv4.js")
const maploader = require("./services/maploader.js")


let players = [];
let rooms = {};

function checkCollision(room, mob, mobXmodifier, mobYmodifier){
  return rooms[room].entities.filter((entity)=>(entity.y + entity.height > mob.y + mobYmodifier &&
      mob.y + mob.height  + mobYmodifier > entity.y 
      && entity.x + entity.width > mob.x  + mobXmodifier 
      && mob.x + mob.width  + mobXmodifier > entity.x 
      && mob.code != entity.code
      && entity.type != "mob"
      )).length != 0
}

async function mobMove(){
  setInterval(()=>
  {for(let room of Object.keys(rooms)){
    for(let mob of rooms[room].entities.filter(en=>en.type=="mob") || []){
      let isAggroNear = false;
      let moved = false;
   
      for(let player of rooms[room].players){
        let centerY = player.y+player.height/4
        let centerX = player.x+player.width/4
        let distance = Math.sqrt(Math.pow(mob.x + mob.width/2 - (centerX), 2) + Math.pow(mob.y + mob.height/2 - (centerY), 2));
        if(distance < 200 && mob.canMove ){
          if (!mob.aggro){mob.aggro = player.id}
          if(mob.aggro == player.id){isAggroNear = true}
          if (((mob.aggro == player.id) || !mob.aggro)){
          
          let speed = 2
          
          if (mob.y>centerY+speed*2 && !checkCollision(room, mob, 0, -speed)){
            mob.y-=speed; mob.direction = "down"; moved = true;
          } else if(mob.y<centerY-speed*2 && !checkCollision(room, mob, 0, speed)){
            mob.y+=speed; mob.direction = "up"; moved = true;
          }
          if (mob.x>centerX+speed*2 && !checkCollision(room, mob, -speed, 0)){
            mob.x-=speed; mob.direction = "right"; moved = true;
          }else if(mob.x<centerX-speed*2 && !checkCollision(room, mob, speed, 0)){
            mob.x+=speed; mob.direction = "left"; moved = true;
          }
          
        }}
      }
      io.to(room).emit("mobNewPosition", mob)
      
      if(!isAggroNear){
        mob.aggro = false
      }
    }
  }}, 20)
}

async function mobKnock(mob, room, amount, direction){
  let i = 0
  let step = 1
  let interval = setInterval(()=>{
    i++
    if (direction == "up" && !checkCollision(room, mob, 0, -step)){mob.y-=i}
    if (direction == "down" && !checkCollision(room, mob, 0, step)){mob.y+=i}
    if (direction == "left" && !checkCollision(room, mob, -step, 0)){mob.x-=i}
    if (direction == "right" && !checkCollision(room, mob, step, 0)){mob.x+=i}
    if (i > amount){
      clearInterval(interval)
    }
  }, 5)
}

async function spawnMob(){
  setInterval(()=>{
    Object.keys(rooms).forEach(r=>{
      if (rooms[r].entities.filter(m=>m.type=="mob").length < 4){rooms[r].entities.push({x: Math.random()*500 + 250, y: Math.random()*500 + 250, height: 50, width: 50, life: 10, canMove: true , type: "mob", code: uuidv4()})
    }})
  }, 8000)
}


mobMove()
spawnMob()

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/rooms", (req, res) =>{
  res.send(Object.keys(rooms).map((room)=>{
    return {
      name: room,
      players: rooms[room].players.length
    }
  }))
})

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/login/login.html");
});

io.on("connection", (socket) => {
  console.log("a user is connecting: " + socket.id);
  socket.on("moveMyself", (info) => {
    completeInfo = { ...info, id: socket.id };
    let index = rooms[info.to].players.findIndex((playerInfo) => playerInfo.id === socket.id)
    rooms[info.to].players[index] = {...rooms[info.to].players[index],...completeInfo}
    socket.broadcast.to(info.to).emit("peopleMoved", completeInfo);
  });
  socket.on("newPlayer", (info) => {
    completeInfo = { ...info, id: socket.id };
    rooms[info.to].players.push(completeInfo)
    socket.broadcast.to(info.to).emit("newPlayer", completeInfo);
  });

  socket.on("useWeapon", (info)=>{
    completeInfo = { ...info, id: socket.id };
    socket.broadcast.to(info.to).emit("useWeapon", completeInfo)
  })

  socket.on("changeInventory", (info)=>{
    completeInfo = {...info, id: socket.id}
    rooms[info.to].players[rooms[info.to].players.findIndex((playerInfo) => playerInfo.id === socket.id)].hotbar = info.hotbar
    socket.broadcast.to(info.to).emit("changeInventory", completeInfo)
  })

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

  socket.on("newKill", (info)=>{
    let player = rooms[info.to].players.find(player=>player.id == info.killerId)
    player.kills += 1 
    completeInfo = { ...info, id: socket.id, killerId: info.killerId, killCount: player.kills };
    io.to(info.to).emit("newKill", completeInfo);
  })

  socket.on("joinRoom", (info) => {
    socket.join(info.room);
    completeInfo = { ...info.player, id: socket.id };
    console.log("user ",  socket.id, `(${info.player.name})`, " joined room ", info.room)
    if (!Object.keys(rooms).includes(info.room)) {
      let map = maploader("map1")
      rooms[info.room] = { players: [completeInfo], entities: map.entities, scenery: map.scenery };
      socket.emit("loadMapInfo", {entities: map.entities, scenery: map.scenery})
    } else {
      socket.emit("oldPlayers", rooms[info.room].players);
      socket.emit("loadMapInfo", {entities: rooms[info.room].entities, scenery: rooms[info.room].scenery})
      rooms[info.room].players.push(completeInfo);
    }

    socket.broadcast.to(info.room).emit("newPlayer", completeInfo);
  });

  socket.on("mobDamage", (info)=>{
    let mob = rooms[info.to].entities.find(entity=>entity.code == info.id)
    if(mob){mob.life -= info.amount
    if(info.direction)(mobKnock(mob, info.to, 5, info.direction))
    mob.canMove = false
    setTimeout(()=>{mob.canMove = true}, 300)
    if (mob.life <= 0){
      rooms[info.to].entities.splice(rooms[info.to].entities.indexOf(mob), 1)
      io.to(info.to).emit("mobNewPosition", mob) 
    }}
    
  })

  socket.on("disconnecting", ()=>{
    let roomsToLeave = [...socket.rooms]
    roomsToLeave.splice(roomsToLeave.findIndex(room=>room == socket.id), 1)
    for (let room of roomsToLeave){
      socket.broadcast.to(room).emit("playerLeft", socket.id);
      let playerIndex = rooms[room].players.findIndex(player => player.id == socket.id)
      console.log("user ",  socket.id, `(${rooms[room].players[playerIndex].name})`, " left room ", room)
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
