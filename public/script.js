console.log("cu de grilo")

let socket = io()

let campo = document.getElementById("campomensagem")
let chat = document.getElementById("messages")
let canvas = document.getElementById("canvas")
let spriteImg = document.getElementById("sprite")
let ctx = canvas.getContext("2d")
var stylew = window.getComputedStyle(canvas);
canvas.width = parseInt(stylew.width.substring(0,stylew.width.search("px")));
canvas.height = parseInt(stylew.height.substring(0,stylew.height.search("px")));


let sprite = {
  x: Math.floor(Math.random()*200),
  y: Math.floor(Math.random()*100),
  width: 30,
  height: 30,
  speed: 5
}

let players = []

// ----------------------------------------------------------------------------------------------------
// ----------------------------------------EVENT LISTENERS--------------------------------------------
// ----------------------------------------------------------------------------------------------------

canvas.addEventListener("keypress", (event)=>{
  walk(event.key)
})

campo.addEventListener("keypress", (event)=>{
  enterMessage(event)
})

// ----------------------------------------------------------------------------------------------------
// ----------------------------------------SOCKET LISTENERS--------------------------------------------
// ----------------------------------------------------------------------------------------------------


socket.on("peopleMoved", (info)=>{
  let index = players.findIndex(playerInfo=>playerInfo.id === info.id)
  if (index !== -1){
    movePlayer(info, index)
    players[index] = info
    remount(sprite)

  } else {
    addPlayer(info)
  }
})

socket.on("newPlayer", (info)=>{
  console.log("new player: " + JSON.stringify(info))
  chat.innerHTML += `<p style='text-align: center; color: white; background-color: ${info.color}'>O Jogador ${info.id} entrou</p>`
  addPlayer(info)
})

socket.on("playerLeft", (id)=>{
  let left = players.find(player=>player.id === id)
  chat.innerHTML += `<p style='text-align: center; color: red; background-color: ${left.color}'>O Jogador ${id} saiu</p>`
  
  let index = players.findIndex(playerInfo=>playerInfo.id === id)
  ctx.clearRect(players[index].x, players[index].y, players[index].width, players[index].height)
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

function onStart(){
  sprite.color = "#" + Math.floor(Math.random()*16777215).toString(16)
  ctx.fillStyle= sprite.color;
  ctx.fillRect(sprite.x,sprite.y,sprite.width, sprite.height)
  socket.emit("newPlayer", {...sprite})
  ctx.imagecSmoothingEnabled = false
  ctx.drawImage(spriteImg, 50, 30, 100, 160, 40, 40, 50, 80);}

function addPlayer(sprite, notPush){
  ctx.fillStyle= sprite.color;
  ctx.fillRect(sprite.x,sprite.y,sprite.width, sprite.height)
  if (!notPush) players.push(sprite)
}

function movePlayer(playerSprite, index){
  ctx.clearRect(players[index].x, players[index].y, players[index].width, players[index].height)
  ctx.fillStyle = playerSprite.color
  ctx.fillRect(playerSprite.x, playerSprite.y, playerSprite.width, playerSprite.height)
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
      if (sprite.y + sprite.speed >= canvas.height-sprite.height) break
      sprite.y += sprite.speed
      break
    case "d":
      if (sprite.x + sprite.speed >= canvas.width-sprite.width) break
      sprite.x += sprite.speed
      break
  }
  socket.emit("moveMyself", sprite)
  remount(previous)
}

function remount(previous){
  ctx.clearRect(previous.x, previous.y, previous.width, previous.height)
  remountPlayers(players, true)
  ctx.fillStyle = sprite.color
  ctx.fillRect(sprite.x, sprite.y, sprite.width, sprite.height)
}

function remountPlayers(players, notPush){
  for (let player of players) {
    addPlayer(player, notPush)
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

