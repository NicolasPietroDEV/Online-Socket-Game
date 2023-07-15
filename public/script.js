let sprite = {
  x: Math.floor(Math.random()*200),
  y: Math.floor(Math.random()*100),
  width: 40,
  height: 60,
  speed: 2,
  direction: "s",
  name: "João Gomes Da Silva"
}

let nickname = localStorage.getItem("name")
  if(nickname){
    var socket = io()
    sprite.name = nickname
  } else {
    window.location.replace("/login")

  }



let campo = document.getElementById("campomensagem")
let chat = document.getElementById("messages")
let canvas = document.getElementById("canvas")
let spriteImg = document.getElementById("sprite")
let ctx = canvas.getContext("2d")
var stylew = window.getComputedStyle(canvas);
canvas.width = parseInt(stylew.width.substring(0,stylew.width.search("px")));
canvas.height = parseInt(stylew.height.substring(0,stylew.height.search("px")));


let myId

let directionMapping = {
  "w": 4,
  "s": 2,
  "a": 3,
  "d": 1
}

let movementHandler = {
  "w": false,
  "a": false,
  "d": false,
  "s": false,
}

let players = []

// ----------------------------------------------------------------------------------------------------
// ----------------------------------------EVENT LISTENERS--------------------------------------------
// ----------------------------------------------------------------------------------------------------

canvas.addEventListener("keyup", (event)=>{
  handleInput(event.key, false)
})

canvas.addEventListener("keydown", (event)=>{
  handleInput(event.key, true)
})

campo.addEventListener("keypress", (event)=>{
  enterMessage(event)
})

canvas.addEventListener("blur", ()=>{
  stopAllInputs()
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
  chat.innerHTML += `<p class="warn" style='color: white; background-color: ${info.color}'>O Jogador ${info.name} entrou</p>`
  addPlayer(info)
})

socket.on("playerLeft", (id)=>{
  let left = players.find(player=>player.id === id)
  chat.innerHTML += `<p class="warn" style='color: red; background-color: ${left.color}'>O Jogador ${left.name} saiu</p>`
  
  let index = players.findIndex(playerInfo=>playerInfo.id === id)
  ctx.clearRect(players[index].x, players[index].y, players[index].width, players[index].height)
  clearText(players[index])

  players.splice(index, 1)
  remount(sprite)
})

socket.on("oldPlayers", remountPlayers)

socket.on("newMessage", (message)=>{
  let time = new Date()
  let minutes = time.getMinutes().toString().length < 2 ? "0" + time.getMinutes() : time.getMinutes() 
  chat.innerHTML += 
  `<div class="${message.id == myId ? "sended" : "received"}">
    <div class="message box-shadow">
    <div class="message-header">
      <span style="font-weight: 700; color: ${message.color}">${message.name}</span>
      <span>${time.getHours()}:${minutes}</span>
    </div>
    <span class="message-content">${message.message}</span>
    </div>
  </div>`
})

socket.on("yourId", (id)=>{myId = id})

// ----------------------------------------------------------------------------------------------------
// ---------------------------------------- FUNCTIONS -------------------------------------------------
// ----------------------------------------------------------------------------------------------------

function startMovementChecker(){
  setInterval(()=>{
      let previous = {...sprite}
      let moved = false
        if(movementHandler["w"] && !(sprite.y - sprite.speed < 0)){
          sprite.y -= sprite.speed
          sprite.direction = "w"
          moved = true
        }
        if(movementHandler["a"] && !(sprite.x - sprite.speed < 0) ){
          sprite.x -= sprite.speed
          sprite.direction = "a"
          moved = true
        }
        if(movementHandler["s"] && !(sprite.y + sprite.speed >= canvas.height-sprite.height)){
          sprite.y += sprite.speed
          sprite.direction = "s"
          moved = true
        }
        if(movementHandler["d"] && !(sprite.x + sprite.speed >= canvas.width-sprite.width) ){
          sprite.x += sprite.speed
          sprite.direction = "d"
          moved = true
        } 
      if(moved){socket.emit("moveMyself", sprite)
      remount(previous)}
  }, 20)
}

function stopAllInputs(){
  for (input of Object.keys(movementHandler)){
    movementHandler[input] = false
  }
}


function drawSprite(sprite){
  drawText(sprite)
  drawCharacter(sprite)
}

function drawCharacter(sprite){
  ctx.drawImage(spriteImg, 50+(113*(directionMapping[sprite.direction]-1)), 30, 100, 160, sprite.x, sprite.y, sprite.width, sprite.height);
}

function drawText(sprite){
  ctx.fillStyle = "rgba(0, 0, 0, 0.447)"
  ctx.font = "bolder 12px Arial";
  ctx.fillRect(sprite.x+(sprite.width/2)-(ctx.measureText(sprite.name).width/2), sprite.y-14, ctx.measureText(sprite.name).width, 12)
  ctx.fillStyle = sprite.color
  ctx.fillText(sprite.name, sprite.x+(sprite.width/2)-(ctx.measureText(sprite.name).width/2), sprite.y-4);
}

function clearSprite(sprite){
  ctx.clearRect(sprite.x, sprite.y, sprite.width, sprite.height)
}

function clearText(sprite){
  ctx.font = "bolder 12px Arial";
  ctx.clearRect(sprite.x+(sprite.width/2)-(ctx.measureText(sprite.name).width/2)-1, sprite.y-14, ctx.measureText(sprite.name).width+2, 12);
}

function handleInput(input, state){
  if (Object.keys(directionMapping).includes(input)) movementHandler[input] = state
}

function randomNumber(){
  return Math.floor(Math.random()*155)+100
}

function onStart(){
  sprite.color = `rgb(${randomNumber()}, ${randomNumber()}, ${randomNumber()})`
  ctx.fillStyle= sprite.color;
  socket.emit("newPlayer", {...sprite})
  drawSprite(sprite)
  startMovementChecker()
  }

function addPlayer(sprite, notPush){
  ctx.fillStyle= sprite.color;
  if (!notPush) players.push(sprite)
  drawSprite(sprite)
}

function movePlayer(playerSprite, index){
  clearText(players[index])
  clearSprite(players[index])
  ctx.fillStyle = playerSprite.color
  drawSprite(playerSprite)
}

function remount(previous){
  clearText(previous)
  clearSprite(previous)
  remountPlayers(players, true)
  ctx.fillStyle = sprite.color
  drawSprite(sprite)

}

function remountPlayers(players, notPush){
  for (let player of players) {
    clearSprite(player)
    clearText(player)
  }
  for (let player of players) {
    addPlayer(player, notPush)
  }
}

function sendMessage(){
  if(campo.value){socket.emit("sendMessage", {color: sprite.color, message: campo.value, name: sprite.name})
  campo.value = ""}
}

function enterMessage(event){
  if (event.key == "Enter") sendMessage()
}

function goToLogin(){
  window.location.replace("/login")
}

window.onload = onStart

