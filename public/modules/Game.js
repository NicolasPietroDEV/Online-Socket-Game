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
    this.scenery = new Image(240,240) 
    this.scenery.src = "../assets/map.png"   
    this.ctx.imageSmoothingEnabled = false
    this.drawScenery()  
  }

  createWallsCollision(){
    // left
    new Wall(this,{x: -10, y: 0, width: 10, height: this.canvas.height})
    // top
    new Wall(this,{x: 0, y: -10, width: this.canvas.width, height: 10})
    // right
    new Wall(this,{x: this.canvas.width, y: 0, width: 10, height: this.canvas.height})
    // bottom
    new Wall(this,{x: 0, y: this.canvas.height, width: this.canvas.width, height: 10})
  }

  drawScenery(){
    this.ctx.drawImage(this.scenery, 0,0, 240,240, 0,0, 500,500)
  }

  findPlayerIndex(id){
    return this.entities.findIndex((player)=>player.id==id)
  }

  movePlayer(info, index){
    // this.mainPlayer.remove()
    // this.removeAll()
    this.entities[index].changePos(info)
    this.drawAll()
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
    this.updateAll()
  }


  removeAll(){
    for (let player of this.entities){
        if(player.draw)player.remove()
    }
  }

  drawAll(){
    this.drawScenery()
    let sortedEntities = this.sortByY()
    for (let player of sortedEntities){
      if(player.draw)player.draw()
    }
    return sortedEntities
  }

  updateAll(){
    // this.removeAll()
    this.drawAll()
  }

  checkAllCollisions(sprite){
    return !this.entities.every((entity)=>!entity.collidesWith(sprite) || entity.canPassThrough)
  }

  refreshGame(){
    // this.mainPlayer.remove()
    this.updateAll()
  }

  turnDevMode(){
    this.devMode = !this.devMode;
    if(this.devMode){console.log("DevMode started");}else{console.log("DevMode turned off")}
    this.refreshGame()
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
