"use strict";
import { InputHandler } from "./InputHandler.js";
import { Player } from "./Player.js";
import { SocketHandler } from "./SocketHandler.js";
import { CollisionEntity } from "./CollisionEntity.js";
import { Wall } from "./Wall.js";

export class Game {
  entities = [];
  devMode = false;

  constructor(ctx, canvas, chat) {
    this.chat = chat
    this.ctx = ctx;
    this.canvas = canvas

    this.sceneryImg = new Image(240,240) 
    this.sceneryImg.src = "../assets/map.png"   
    this.sceneryHeight = 1000
    this.sceneryWidth = 1000
    

    this.mainPlayer = new Player(this, {
      x: Math.floor(Math.random()*(this.sceneryWidth-400))+200,
      y: Math.floor(Math.random()*(this.sceneryHeight-400))+200,
      width: 40,
      height: 60,
      speed: 5,
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
    this.drawScenery()  
  }

  createWallsCollision(){
    //top
    new Wall(this,{x: 60, y: 30, width: this.sceneryWidth-120, height: 20})
    //bottom
    new Wall(this,{x: 60, y: this.sceneryHeight-120, width: this.sceneryWidth-120, height: 20}) 
    //right
    new Wall(this,{x: 30, y: 60, width: 20, height: this.sceneryHeight-180})
    //left
    new Wall(this,{x: this.sceneryWidth-50, y: 60, width: 20, height: this.sceneryHeight-180})
  }

  drawScenery(){
    this.ctx.drawImage(this.sceneryImg, 0,0, 240,240, this.cameraPositionX,this.cameraPositionY, this.sceneryWidth,this.sceneryWidth)
  }

  findPlayerIndex(id){
    return this.entities.findIndex((player)=>player.id==id)
  }

  movePlayer(info, index){
    this.entities[index].changePos(info)
    this.refreshEntities()
  }

  addPlayer(info){
    new Player(this, {
        name: info.name,
        width: info.width,
        height: info.height,
        speed: info.speed,
        x: info.x,
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
    this.refreshEntities()
  }

  refreshEntities(){
    this.drawScenery()
    let sortedEntities = this.sortByY()
    for (let player of sortedEntities){
      if(player.draw)player.draw()
    }
    return sortedEntities
  }

  checkAllCollisions(sprite){
    return !this.entities.every((entity)=>!entity.collidesWith(sprite) || entity.canPassThrough)
  }

  turnDevMode(){
    this.devMode = !this.devMode;
    if(this.devMode){console.log("DevMode started");}else{console.log("DevMode turned off")}
    this.refreshEntities()
}

  #randomNumber() {
    return Math.floor(Math.random() * 155) + 100;
  }

  sortByY(){
    let sorted = [...this.entities]
    while(true){
      let swaps = 0    
    for (let i=0; i<sorted.length-1; i++){
      if(sorted[i].y>sorted[i+1].y){
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
    return sorted
  }
}
