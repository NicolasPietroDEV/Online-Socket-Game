export class SocketHandler {
    constructor(game){
        this.game = game
        this.chat = game.chat
        if(this.game.devMode)console.log("SocketHandler started")
        this.startConnection()
    }

    startConnection(){
        this.socket = io()

        this.socket.on("peopleMoved", (info)=>{
            let index = this.game.findPlayerIndex(info.id)
            if (index !== -1){
              this.game.movePlayer(info, index)
            } else {
              this.game.players.push(info)
            }

          })
          
          this.socket.on("newPlayer", (info)=>{
            this.chat.innerHTML += `<p class="warn" style='color: white; background-color: ${info.color}'>O Jogador ${info.name} entrou</p>`
            this.game.addPlayer(info)
          })
          
          this.socket.on("playerLeft", (id)=>{
            let left = this.game.findPlayerIndex(id)
            let player = this.game.players[left]
            this.chat.innerHTML += `<p class="warn" style='color: red; background-color: ${player.color}'>O Jogador ${player.name} saiu</p>`
            player.remove()
            this.game.players.splice(left, 1)
            this.game.updateAll()
            this.game.mainPlayer.update()
          })
          
          this.socket.on("oldPlayers", (oldPlayers)=>this.game.createPlayers(oldPlayers))
          
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
          })
          
          this.socket.on("yourId", (id)=>{this.game.mainPlayer.id = id})
          if(this.game.devMode)console.log("Connection established")
    }

    emitNewPlayer(){
        this.socket.emit("newPlayer", this.game.mainPlayer.getPlayerInfo())
    }

    emitMovement(){
        this.socket.emit("moveMyself", this.game.mainPlayer.getPlayerInfo())
    }

    emitMessage(message){
        this.socket.emit("sendMessage", message)
    }
}