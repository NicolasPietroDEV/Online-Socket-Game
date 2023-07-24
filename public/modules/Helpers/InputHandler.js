export class InputHandler {
        constructor(game, canvas){
            this.game = game
            this.movementHandler = {
                "w": false,
                "a": false,
                "d": false,
                "s": false,
            }

            this.otherKeys = {
              "k": ()=>{this.game.mainPlayer.weapons[0].use();this.game.connection.emitWeaponUsed(0, true)},
              "j": (state)=>{
                if(state){this.game.mainPlayer.weapons[1].use();this.game.connection.emitWeaponUsed(1, true)} else {
                  this.game.mainPlayer.weapons[1].stop()
                  this.game.connection.emitWeaponUsed(1, false)
                }
              }
            }
            this.mainPlayer = this.game.mainPlayer
            this.canvas = this.game.canvas

            if(this.game.devMode)console.log("InputHandler started")

            canvas.addEventListener("keyup", (event)=>{
                this.handleKeyPressing(event.key, false)
              })
              
              canvas.addEventListener("keydown", (event)=>{
                this.handleKeyPressing(event.key, true)
              })
              
              
              canvas.addEventListener("blur", ()=>{
                this.stopAllInputs()
              })

              canvas.addEventListener("mousemove", (evt)=>this.game.devMode && this.game.drawCoords(evt))
        }

        startMovementChecker(){
            setInterval(()=>{
                let moved = false
                if(this.mainPlayer.canMove){for (let key of Object.keys(this.movementHandler)){
                    if (this.movementHandler[key] && !this.mainPlayer.immuneFrom){
                        this.mainPlayer.direction = key
                        moved = true
                    } 
                }
                let collisionInfo = this.mainPlayer.getCollisionInfo()
                let collides = this.game.checkAllCollisions(collisionInfo, true)
                  if(this.movementHandler["w"] && (!this.game.checkAllCollisions({...collisionInfo, y: collisionInfo.y-this.mainPlayer.speed})||collides)){
                    this.mainPlayer.y -= this.mainPlayer.speed
                    if(this.game.cameraPositionY<0 && ((this.game.mainPlayer.y+this.game.cameraPositionY)<(this.game.canvas.height/2 - this.mainPlayer.height/2))) this.game.cameraPositionY += this.mainPlayer.speed
                    moved = true
                  }
                  if(this.movementHandler["a"] && (!this.game.checkAllCollisions({...collisionInfo, x: collisionInfo.x-this.mainPlayer.speed})||collides )){
                    this.mainPlayer.x -= this.mainPlayer.speed
                    if(this.game.cameraPositionX<0 && ((this.game.mainPlayer.x+this.game.cameraPositionX)<(this.game.canvas.width/2 - this.mainPlayer.width/2)))this.game.cameraPositionX += this.mainPlayer.speed
                    moved = true
                  }
                  if(this.movementHandler["s"] && (!this.game.checkAllCollisions({...collisionInfo, y: collisionInfo.y+this.mainPlayer.speed})||collides )){
                    this.mainPlayer.y += this.mainPlayer.speed
                    if((-this.game.cameraPositionY)<this.game.canvas.height && (this.game.mainPlayer.y>(this.game.canvas.height/2 - this.mainPlayer.height/2)))this.game.cameraPositionY -= this.mainPlayer.speed
                    moved = true
                  }
                  if(this.movementHandler["d"] && (!this.game.checkAllCollisions({...collisionInfo, x: collisionInfo.x+this.mainPlayer.speed})||collides )){
                    this.mainPlayer.x += this.mainPlayer.speed
                    if((-this.game.cameraPositionX)<this.game.canvas.width && (this.game.mainPlayer.x>(this.game.canvas.width/2 - this.mainPlayer.width/2)))this.game.cameraPositionX -= this.mainPlayer.speed
                    moved = true
                  } }
                let wasPreviouslyMoving = this.mainPlayer.isMoving
                if(moved){
                  this.mainPlayer.isMoving = true
                }else{
                  this.mainPlayer.isMoving = false
                }
                this.game.refreshEntities();
                    if(wasPreviouslyMoving || this.mainPlayer.isMoving){this.game.connection.emitMovement()}
            }, 20)
          }
          
        stopAllInputs(){
            for (let input of Object.keys(this.movementHandler)){
              this.movementHandler[input] = false
            }
          }
        
        handleKeyPressing(input, state){
            if (Object.keys(this.movementHandler).includes(input) ) this.movementHandler[input] = state
            if (Object.keys(this.otherKeys).includes(input)) this.otherKeys[input](state)
          }
}