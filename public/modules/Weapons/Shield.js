import { MediaLoader } from "../Helpers/MediaLoader.js"
import { Entity } from "../Objects/Entity.js"

export class Shield extends Entity {
    constructor(game, user){
        super(game, {
            x: user.x,
            y: user.y,
            width: 21,
            height: 21
        }, "../../assets/sprites/items/shield.png")
        this.user = user
        this.spriteMap = {
            "up": 3,
            "left": 1,
            "right": 2,
            "down": 0
        }
        this.immunityMap = {
            "up": "down",
            "down": "up",
            "left": "right",
            "right": "left"
        }
        this.abovePlayer = false
        user.addWeapon(this)
        this.canUse = true
        this.itemImg = MediaLoader.getImage("../../assets/sprites/items/shield_item.png")
        this.type = "shield"
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
          case "up":
            return this.user.x - this.width/2;
          case "left":
            return this.user.x - this.width;
          case "down":
            return this.user.x + this.width/2;
          case "right":
            return this.user.x + this.width ;
        }
      }
    
      get positionY() {
        switch (this.user.direction) {
          case "up":
            return this.user.y + this.height / 2;
          case "left":
            return this.user.y + this.height;
          case "down":
            return this.user.y + this.height;
          case "right":
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
              this.abovePlayer = this.user.direction == "down"
              this.user.immuneFrom = this.immunityMap[this.user.direction]
              this.user.canChangeDirection = false
              this.game.addToGame(this)
              this.canUse = false
                this.user.speed = 1
            this.isUsing = true
            }
        
    }
    stop(){
        
        if(this.isUsing){
            this.user.speed = 4; 
            this.user.canChangeDirection = true;
            this.game.removeFromGame(this)
            this.user.immuneFrom = false
            this.canUse = true
            this.isUsing = false
        }
    }
}