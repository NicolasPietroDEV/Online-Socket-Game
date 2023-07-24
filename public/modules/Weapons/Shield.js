import { Entity } from "../Objects/Entity.js"

export class Shield extends Entity {
    constructor(game, user){
        super(game, {
            x: user.x,
            y: user.y,
            width: 21,
            height: 21
        })
        this.user = user
        this.spriteMap = {
            "w": 3,
            "a": 1,
            "d": 2,
            "s": 0
        }
        this.immunityMap = {
            "w": "s",
            "s": "w",
            "a": "d",
            "d": "a"
        }
        this.spriteImg = new Image(21, 21)
        this.spriteImg.src = "../../assets/shield.png"
        user.addWeapon(this)
        this.canUse = true
    }

    draw(){
        this.ctx.drawImage(
            this.spriteImg,
            1 + this.spriteMap[this.user.direction]*21,
            1,
            21,
            21,
            this.positionX + this.game.cameraPositionX,
            this.positionY + this.game.cameraPositionY,
            42,
            42
        )
    }

    get positionX() {
        switch (this.user.direction) {
          case "w":
            return this.user.x - this.width/2;
          case "a":
            return this.user.x - this.width;
          case "s":
            return this.user.x + this.width/2;
          case "d":
            return this.user.x + this.width ;
        }
      }
    
      get positionY() {
        switch (this.user.direction) {
          case "w":
            return this.user.y + this.height / 2;
          case "a":
            return this.user.y + this.height;
          case "s":
            return this.user.y + this.height;
          case "d":
            return this.user.y + this.height;
        }
      }

    use(){
        if (
            this.game.entities.findIndex((entity) => {
              return entity.use && entity.user == this.user;
            }) == -1 &&
            this.canUse
          ) {
              if(this.user.direction == "s"){this.priorize = true}
              this.user.immuneFrom = this.immunityMap[this.user.direction]
              this.game.addToGame(this)
              this.canUse = false
                this.user.speed = 1
            }
        
    }
    stop(){
        this.game.removeFromGame(this)
        this.user.immuneFrom = false
            this.priorize = false
            this.user.canMove = true
            this.canUse = true
            this.user.speed = 4
    }
}