"use strict";
import { InputHandler } from "./Helpers/InputHandler.js";
import { Player } from "./Objects/Player.js";
import { SocketHandler } from "./Helpers/SocketHandler.js";
import { Jar } from "./Objects/Jar.js";
import { Interface } from "./Helpers/Interface.js";
import { ClassTranslator } from "./Helpers/ClassTranslator.js";
import { Mob } from "./Objects/Mob.js";

export class Game {
  entities = [];
  devMode = false;

  constructor(ctx, canvas, chat) {
    this.chat = chat
    this.ctx = ctx;
    this.canvas = canvas

    this.sceneryImg = new Image(240,240) 
    this.sceneryImg.src = "../assets/sprites/maps/map.png"   
    this.sceneryHeight = 0
    this.sceneryWidth = 0
    
    this.spawn = {
      x: 476,
      y: 280
    }

    this.mainPlayer = new Player(this, {
      x: 476,
      y: 280,
      width: 96,
      height: 96,
      speed: 4,
      life: 10,
      skin: Math.ceil(Math.random()*6),
      direction: "down",
      color: `rgb(${this.#randomNumber()}, ${this.#randomNumber()}, ${this.#randomNumber()})`,
      name: localStorage.getItem("name") || "João Gomes Da Silva",
    });
    this.cameraPositionX = -(this.mainPlayer.x + this.mainPlayer.width/2 - this.canvas.width/2)
    this.cameraPositionY = -(this.mainPlayer.y + this.mainPlayer.height/2 - this.canvas.height/2)
    this.connection = new SocketHandler(this);
    this.input = new InputHandler(this, canvas);
    this.interface = new Interface(this)
    this.input.startMovementChecker()
    if(this.devMode)console.log("Game started")
    this.connection.joinRoom()
    this.ctx.imageSmoothingEnabled = false
  }

  resetCamera(){
    this.cameraPositionX = -(this.mainPlayer.x + this.mainPlayer.width/2 - this.canvas.width/2)
    this.cameraPositionY = -(this.mainPlayer.y + this.mainPlayer.height/2 - this.canvas.height/2)
  }

  changeCameraPosition(direction, speed) {
    switch(direction) {
        case "up":
            if (this.cameraPositionY < 0 &&
                this.mainPlayer.y + this.cameraPositionY < 
                this.canvas.height / 2 - this.mainPlayer.height / 2) {
                this.cameraPositionY += speed;
            }
            break;
            
        case "left":
            if (this.cameraPositionX < 0 &&
                this.mainPlayer.x + this.cameraPositionX < 
                this.canvas.width / 2 - this.mainPlayer.width / 2) {
                this.cameraPositionX += speed;
            }
            break;
            
        case "down":
            if (-this.cameraPositionY < this.sceneryHeight - this.canvas.height &&
                this.mainPlayer.y > this.canvas.height / 2 - this.mainPlayer.height / 2) {
                this.cameraPositionY -= speed;
            }
            break;
            
        case "right":
            if (-this.cameraPositionX < this.sceneryWidth - this.canvas.width &&
                this.mainPlayer.x > this.canvas.width / 2 - this.mainPlayer.width / 2) {
                this.cameraPositionX -= speed;
            }
            break;
    }
}

  loadMap(map){
    this.sceneryHeight = map.scenery.height
    this.sceneryWidth = map.scenery.width
    for(let entity of map.entities){
      new (ClassTranslator.stringToObject(entity.type, "entity"))(this, entity)
    }
  }

  drawScenery(){
    this.ctx.drawImage(this.sceneryImg, 0,0, 240,240, this.cameraPositionX,this.cameraPositionY, this.sceneryWidth,this.sceneryWidth)
  }

  findPlayerIndex(id){
    return this.entities.findIndex((player)=>player.id==id)
  }

  movePlayer(info, index){
    this.entities[index].changePos(info)
    this.entities[index].life = info.life
    this.entities[index].inventory = info.inventory
  }

  addPlayer(info){
    new Player(this, {
        name: info.name,
        width: info.width,
        height: info.height,
        speed: info.speed,
        x: info.x,
        life: info.life,
        y: info.y,
        id: info.id,
        color: info.color,
        direction: info.direction,
        hotbar: info.hotbar,
        kills: info.kills,
        skin: info.skin
    })
  }

  createPlayers(oldPlayers){
    for (let player of oldPlayers){
        this.addPlayer(player)
    }
  }

  refreshEntities(){
    this.clearScreen()
    this.drawScenery()
    let sortedEntities = this.sortByY()
    for (let player of sortedEntities){
      if(player.draw)player.draw()
    }
    this.interface.drawHud()
    this.interface.drawInterface()
    return sortedEntities
  }

  clearScreen(){
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
  }

  drawCoords(evt) {
    let rect = this.canvas.getBoundingClientRect() 
    let scaleX = this.canvas.width / rect.width    
    let scaleY = this.canvas.height / rect.height
    let posX = ((evt.clientX - rect.left) * scaleX) 
    let posY = ((evt.clientY - rect.top) * scaleY) 
    this.ctx.fillStyle = "yellow"
    this.ctx.fillText(`X: ${parseInt(posX)- this.cameraPositionX} Y: ${parseInt(posY)- this.cameraPositionY}`, posX, posY)
  }
  checkAllCollisions(sprite, triggerEvent = true, ignoreObject, returnFalseToTypesArray) {
  return this.entities.some((entity) => {
    const canCollide = entity.collidesWith && entity.collidesWith(sprite);
    if (canCollide && triggerEvent && entity.trigger) {
      entity.trigger();
    }
    if (entity === ignoreObject) {
      return false;
    }
    return canCollide && 
           !entity.canPassThrough && 
           (!returnFalseToTypesArray || returnFalseToTypesArray.includes(entity.type));
  });
}

  turnDevMode(){
    this.devMode = !this.devMode;
    if(this.devMode){console.log("DevMode started");}else{console.log("DevMode turned off")}
}

  #randomNumber() {
    return Math.floor(Math.random() * 155) + 100;
  }

  sortByY(){
    let weapons = this.entities.filter((entity)=>entity.use)
    let sorted = this.entities.filter((entity)=>!entity.use)
    while(true){
      let swaps = 0    
    for (let i=0; i<sorted.length-1; i++){
      if(((sorted[i].y+sorted[i].height)>(sorted[i+1].y+sorted[i+1].height))){
        let pointer = sorted[i]
        sorted[i] = sorted[i+1]
        sorted[i+1] = pointer
        swaps += 1
      }
    }
    if (swaps==0){
      break
    }
  }
    for (let weapon of weapons){
      let index = sorted.findIndex((entity)=>(entity instanceof Player) && (weapon.user.id == entity.id))
      if(weapon.abovePlayer) index += 1
      sorted = [
        ...sorted.slice(0, index),
        weapon,
        ...sorted.slice(index)
      ]

    }

    return sorted
  }

  addToGame(entity){
    this.entities.push(entity)
  }

  removeFromGame(entity){
    let index = this.entities.findIndex((gameEntity) => gameEntity == entity)
    if (index == -1) return
    if(this.entities[index]==entity){this.entities.splice(index,1)}
  }

  breakJarsCollidingWith(sprite){
    let jars = this.entities.filter((entity)=>entity instanceof Jar)
    for (let jar of jars){
      if (jar.collidesWith(sprite)){
        jar.break()
      }
    }
  }

  damageMobsCollidingWith(sprite, direction, damage){
    let mobs = this.entities.filter((entity)=>entity instanceof Mob)
    let hit = false
    for (let mob of mobs){
      if (mob.collidesWith(sprite)){
        mob.takeDamage(direction, damage || 2)
        hit = true
      }
    }
    return hit
  }
}
