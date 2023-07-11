console.log("cu de grilo")

let socket = io()

let canvas = document.getElementById("canvas")
let campo = document.getElementById("campomensagem")
let chat = document.getElementById("messages")
let ctx = canvas.getContext("2d")

let sprite = {
  x: Math.floor(Math.random()*200),
  y: Math.floor(Math.random()*100),
  speed: 5
}

let players = []

// ----------------------------------------------------------------------------------------------------
// ----------------------------------------SOCKET LISTENERS--------------------------------------------
// ----------------------------------------------------------------------------------------------------


socket.on("peopleMoved", (info)=>{
  let index = players.findIndex(playerInfo=>playerInfo.id === info.id)
  if (index !== -1){
    movePlayer(info, index)
    players[index] = info
  } else {
    addPlayer(info)
  }
})

socket.on("newPlayer", (info)=>{
  console.log("new player: " + JSON.stringify(info))
  addPlayer(info)
})

socket.on("playerLeft", (id)=>{
  console.log(id + " saiu")
  
  let index = players.findIndex(playerInfo=>playerInfo.id === id)
  ctx.clearRect(players[index].x, players[index].y, 20,10)
  players.splice(index, 1)
})

socket.on("oldPlayers", remountPlayers)

socket.on("newMessage", (message)=>{
  let time = new Date()
  chat.innerHTML += `<p class="message" style="background-color: ${message.color}">${time.getHours()}:${time.getMinutes()} - ${message.message}</p>`
})

// ----------------------------------------------------------------------------------------------------
// ---------------------------------------- FUNCTIONS -------------------------------------------------
// ----------------------------------------------------------------------------------------------------

canvas.addEventListener("keypress", (event)=>{
  walk(event.key)
})

campo.addEventListener("keypress", (event)=>{
  enterMessage(event)
})

function onStart(){
  sprite.color = "#" + Math.floor(Math.random()*16777215).toString(16)
  ctx.fillStyle= sprite.color;
  ctx.fillRect(sprite.x,sprite.y,20,10)
  socket.emit("newPlayer", {...sprite})
}

function addPlayer(sprite){
  ctx.fillStyle= sprite.color;
  ctx.fillRect(sprite.x,sprite.y,20,10)
  players.push(sprite)

}

function movePlayer(sprite, index){
  ctx.fillStyle = sprite.color
  ctx.clearRect(players[index].x, players[index].y, 20,10)
  ctx.fillRect(sprite.x, sprite.y, 20, 10)
}

function walk(direction){
  let previous = {...sprite}
  switch(direction){
    case "w":
      if (sprite.y - sprite.speed < 0) break
      sprite.y -= sprite.speed
      break
    case "a":
      if (sprite.x - sprite.speed < 0) break
      sprite.x -= sprite.speed
      break
    case "s":
      if (sprite.y + sprite.speed >= 140) break
      sprite.y += sprite.speed
      break
    case "d":
      if (sprite.x + sprite.speed >= 280) break
      sprite.x += sprite.speed
      break
  }
  socket.emit("moveMyself", sprite)
  remount(previous)
}

function remount(previous){
  ctx.fillStyle = sprite.color
  ctx.clearRect(previous.x, previous.y, 20,10)
  ctx.fillRect(sprite.x, sprite.y, 20, 10)
}

function remountPlayers(players){
  for (let player of players) {
    addPlayer(player)
  }
}

function sendMessage(){
  socket.emit("sendMessage", {color: sprite.color, message: campo.value})
  campo.value = ""
}

function enterMessage(event){
  if (event.key == "Enter") sendMessage()
}



window.onload = onStart

