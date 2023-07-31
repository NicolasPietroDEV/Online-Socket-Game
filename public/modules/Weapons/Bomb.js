import { BombEntity } from "../Objects/BombEntity.js";

export class Bomb {
    constructor(game, user){
        this.user = user;
        this.game = game;
        this.width = 30
        this.height = 34
        this.user.addWeapon(this)
    }

    get positionX(){
        switch(this.user.direction){
            case "up":
            case "down":
                return this.user.x
            case "left":
                return this.user.x - this.width
            case "right":
                return this.user.x + this.width
        }
    }

    get positionY(){
        switch(this.user.direction){
            case "left":
            case "right":
                return this.user.y + (this.user.height - this.height)
            case "down":
                return this.user.y + this.user.height
            case "up":
                return this.user.y - (this.height/2)
        }
    }

   
    use() {
        if (
            this.game.entities.findIndex((entity) => {
              return entity.use && entity.user == this.user;
            }) == -1 && this.user.inventory.bomb
          ) {
            this.user.inventory.bomb -= 1
        new BombEntity(this.game, {
            x: this.positionX,
            y: this.positionY,
            width: this.width,
            height: this.height,
          })}
      }
}