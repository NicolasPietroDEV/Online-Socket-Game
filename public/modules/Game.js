"use strict";
import { InputHandler } from "./InputHandler.js";
import { Player } from "./Player.js";
import { SocketHandler } from "./SocketHandler.js";
import { CollisionEntity } from "./CollisionEntity.js";
import { Wall } from "./Wall.js";

export class Game {
  entities = [];
  devMode = true;

  constructor(ctx, canvas, chat) {
    this.chat = chat
    this.ctx = ctx;
    this.canvas = canvas
    this.mainPlayer = new Player(this, {
      x: Math.floor(Math.random() * 200),
      y: Math.floor(Math.random() * 100),
      width: 40,
      height: 60,
      speed: 2,
      direction: "s",
      color: `rgb(${this.#randomNumber()}, ${this.#randomNumber()}, ${this.#randomNumber()})`,
      name: localStorage.getItem("name") || "João Gomes Da Silva",
    });
    this.connection = new SocketHandler(this);
    this.input = new InputHandler(this, canvas);
    this.input.startMovementChecker()
    this.createWallsCollision()
    if(this.devMode)console.log("Game started")
    this.connection.joinRoom()

    this.sceneryImg = new Image(240,240) 
    this.sceneryImg.src = "../assets/map.png"   
    this.sceneryHeight = 500
    this.sceneryWidth = 500
    this.cameraPositionX = 0
    this.cameraPositionY = 0

    this.ctx.imageSmoothingEnabled = false
    this.drawScenery()  
  }

  createWallsCollision(){
    // left
    new Wall(this,{x: -10+30, y: 30, width: 10, height: 500-90})
    // top
    new Wall(this,{x: 30, y: -10+30, width: 500-60, height: 10})
    // right
    new Wall(this,{x: 500-30, y: 30, width: 10, height: 500-90})
    // bottom
    new Wall(this,{x: 30, y: 500-60, width: 500-60, height: 10})
  }

  drawScenery(){
    this.ctx.drawImage(this.sceneryImg, 0,0, 240,240, 0,0, this.sceneryWidth,this.sceneryWidth)
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
