import { Player } from "../Objects/Player.js"
import { Mob } from "../Objects/Mob.js"

import { ClassTranslator } from "./ClassTranslator.js"

export class SocketHandler {
    constructor(game){
        this.game = game
        this.chat = game.chat
        if(this.game.devMode)console.log("SocketHandler started")
        this.room = localStorage.getItem("room") || "main"
        this.startConnection()
    }

    startConnection(){
        this.socket = io('/', {reconnection:false})

        this.socket.on("peopleMoved", (info)=>{
     
            let index = this.game.findPlayerIndex(info.id)
            if (index !== -1){
              this.game.movePlayer(info, index)
            } else {
 
              this.game.addPlayer(info)
            }

          })
          
          this.socket.on("newPlayer", (info)=>{
            this.chat.innerHTML += `<p class="warn" style='color: white; background-color: ${info.color}'>O Jogador ${info.name} entrou</p>`
            this.game.addPlayer(info)
          })
          
          this.socket.on("playerLeft", (id)=>{
            let left = this.game.findPlayerIndex(id)
            let player = this.game.entities[left]
            player.weapons.forEach((weapon)=>{weapon.stop && weapon.stop()})
            this.chat.innerHTML += `<p class="warn" style='color: red; background-color: ${player.color}'>O Jogador ${player.name} saiu</p>`
            this.game.entities.splice(left, 1)
          })

          this.socket.on("useWeapon", (info)=>{
            let playerIndex = this.game.findPlayerIndex(info.id)
            let player = this.game.entities[playerIndex]
            if(info.state){player.weapons[info.weapon].use()} else {player.weapons[info.weapon].stop && player.weapons[info.weapon].stop()}
          })
          
          this.socket.on("oldPlayers", (oldPlayers)=>this.game.createPlayers(oldPlayers))
          this.socket.on("loadMapInfo", (map)=>this.game.loadMap(map))
          
          this.socket.on("newMessage", (message)=>{
            let time = new Date()
            let minutes = time.getMinutes().toString().length < 2 ? "0" + time.getMinutes() : time.getMinutes() 
            this.chat.innerHTML += 
            `<div class="${message.id == this.game.mainPlayer.id ? "sended" : "received"}">
              <div class="message box-shadow">
              <div class="message-header">
                <span style="font-weight: 700; color: ${message.color}">${message.name}</span>
                <span>${time.getHours()}:${minutes}</span>
              </div>
              <span class="message-content">${message.message}</span>
              </div>
            </div>`
            this.chat.scrollTop = this.chat.scrollHeight
          })

          this.socket.on("changeInventory", (info)=>{
            let player = this.game.entities.find((entity)=>entity instanceof Player && entity.id == info.id)
            for(let index in info.hotbar){
              if(player.weapons[index].type != info.hotbar[index]){
                player.weapons[index] = new (ClassTranslator.stringToObject(info.hotbar[index]))(this.game, player)
              }
            }
          })

          this.socket.on("newKill", (info)=>{
            let player = this.game.entities.find((entity)=>entity instanceof Player && entity.id == info.killerId)
            player.kills = info.killCount
          })

          this.socket.on("mobNewPosition", (info)=>{
            let mob = this.game.entities.find((entity)=>entity.code==info.code)
            if(mob){mob.updateMob(info)}else{new Mob(this.game, info)}
          })
          
          this.socket.on("yourId", (id)=>{this.game.mainPlayer.id = id})
          this.socket.on("disconnect", ()=>{
            window.OnDisconnect()
          })
          if(this.game.devMode)console.log("Connection established")
    }

    emitNewPlayer(){

        this.socket.emit("newPlayer", {...this.game.mainPlayer.getPlayerInfo(), hotbar: this.game.mainPlayer.getHotbarInfo(), to: this.room})
    }

    emitMovement(){

        this.socket.emit("moveMyself", {...this.game.mainPlayer.getPlayerInfo(), to: this.room})
    }

    emitMessage(message){
        this.socket.emit("sendMessage", {...message, to: this.room})
    }

    joinRoom(room){
      this.socket.emit("joinRoom", {player: {...this.game.mainPlayer.getPlayerInfo(), hotbar: this.game.mainPlayer.getHotbarInfo()}, room: room||this.room})
    }

    emitWeaponUsed(index, state){
      this.socket.emit("useWeapon", {to: this.room, weapon: index, state: state})
    }

    emitNewHotbar(hotbar){
      this.socket.emit("changeInventory", {to: this.room, hotbar: hotbar})
    }

    emitKill(killerId){
      this.socket.emit("newKill", {to: this.room, killerId:killerId})
    }

    emitMobDamage(mobId, amount, direction){
      this.socket.emit("mobDamage", {to: this.room, id: mobId, amount: amount, playerId: this.game.mainPlayer.id, direction: direction})
    }
}