export class InputHandler {
        constructor(game, canvas){
            this.game = game
            this.movementHandler = {
                "w": false,
                "a": false,
                "d": false,
                "s": false,
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
        }

        startMovementChecker(){
            setInterval(()=>{
                let moved = false
                for (let key of Object.keys(this.movementHandler)){
                    if (this.movementHandler[key]){
                        this.mainPlayer.setDirection = key
                        moved = true
                    } 
                }
                let collisionInfo = this.mainPlayer.getCollisionInfo()
                  if(this.movementHandler["w"] && !this.game.checkAllCollisions({...collisionInfo, y: collisionInfo.y-this.mainPlayer.speed})){
                    this.mainPlayer.setDirection = "w"
                    this.mainPlayer.setY = this.mainPlayer.y - this.mainPlayer.speed
                    moved = true
                  }
                  if(this.movementHandler["a"] && !this.game.checkAllCollisions({...collisionInfo, x: collisionInfo.x-this.mainPlayer.speed}) ){
                      this.mainPlayer.setDirection = "a"
                    this.mainPlayer.setX = this.mainPlayer.x - this.mainPlayer.speed
                    moved = true
                  }
                  if(this.movementHandler["s"] && !this.game.checkAllCollisions({...collisionInfo, y: collisionInfo.y+this.mainPlayer.speed}) ){
                      this.mainPlayer.setDirection = "s"
                    this.mainPlayer.setY = this.mainPlayer.y + this.mainPlayer.speed
                    moved = true
                  }
                  if(this.movementHandler["d"] && !this.game.checkAllCollisions({...collisionInfo, x: collisionInfo.x+this.mainPlayer.speed}) ){
                      this.mainPlayer.setDirection = "d"
                    this.mainPlayer.setX = this.mainPlayer.x + this.mainPlayer.speed
                    moved = true
                  } 
                if(moved){
                    this.game.connection.emitMovement()}
            }, 20)
          }
          
        stopAllInputs(){
            for (let input of Object.keys(this.movementHandler)){
              this.movementHandler[input] = false
            }
          }
        
        handleKeyPressing(input, state){
            if (Object.keys(this.movementHandler).includes(input)) this.movementHandler[input] = state
          }
}