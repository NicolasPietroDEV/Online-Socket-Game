"use strict";
import { InputHandler } from "./Helpers/InputHandler.js";
import { Player } from "./Objects/Player.js";
import { SocketHandler } from "./Helpers/SocketHandler.js";
import { Wall } from "./Objects/Wall.js";
import { House } from "./Objects/House.js";
import { Tree } from "./Objects/Tree.js";

export class Game {
  entities = [];
  devMode = false;

  constructor(ctx, canvas, chat) {
    this.chat = chat
    this.ctx = ctx;
    this.canvas = canvas

    this.sceneryImg = new Image(240,240) 
    this.sceneryImg.src = "../assets/sprites/maps/map.png"   
    this.sceneryHeight = 1000
    this.sceneryWidth = 1000
    
    this.spawn = {
      x: 476,
      y: 280
    }

    this.mainPlayer = new Player(this, {
      x: 476,
      y: 280,
      width: 40,
      height: 60,
      speed: 4,
      life: 10,
      direction: "s",
      color: `rgb(${this.#randomNumber()}, ${this.#randomNumber()}, ${this.#randomNumber()})`,
      name: localStorage.getItem("name") || "João Gomes Da Silva",
    });
    this.cameraPositionX = -(this.mainPlayer.x + this.mainPlayer.width/2 - this.canvas.width/2)
    this.cameraPositionY = -(this.mainPlayer.y + this.mainPlayer.height/2 - this.canvas.height/2)
    this.connection = new SocketHandler(this);
    this.input = new InputHandler(this, canvas);
    this.input.startMovementChecker()
    this.createWallsCollision()
    if(this.devMode)console.log("Game started")
    this.connection.joinRoom()
    this.ctx.imageSmoothingEnabled = false
  }

  resetCamera(){
    this.cameraPositionX = -(this.mainPlayer.x + this.mainPlayer.width/2 - this.canvas.width/2)
    this.cameraPositionY = -(this.mainPlayer.y + this.mainPlayer.height/2 - this.canvas.height/2)
  }

  createWallsCollision(){
    //top
    new Wall(this,{x: 60, y: 10, width: this.sceneryWidth-120, height: 40})
    //bottom
    new Wall(this,{x: 60, y: this.sceneryHeight-120, width: this.sceneryWidth-120, height: 40}) 
    //right
    new Wall(this,{x: 10, y: 60, width: 40, height: this.sceneryHeight-180})
    //left
    new Wall(this,{x: this.sceneryWidth-50, y: 60, width: 40, height: this.sceneryHeight-180})

    new House(this, {x: 422, y: 30, width:150, height:228})
    
    new Tree(this, {x: 200, y: 100, width:120, height: 144})
    new Tree(this, {x: 670, y: 100, width:120, height: 144})
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
        direction: info.direction
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

  checkAllCollisions(sprite, triggerEvent, ignore){
    return !this.entities.every((entity)=>{
      if (((entity.collidesWith||false) && entity.collidesWith(sprite)) && triggerEvent && entity.trigger) entity.trigger()
      return (!(entity.collidesWith && entity.collidesWith(sprite)) || entity==ignore) || entity.canPassThrough
    })
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
}
