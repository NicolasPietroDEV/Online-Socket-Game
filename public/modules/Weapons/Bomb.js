import { MediaLoader } from "../Helpers/MediaLoader.js";
import { BombEntity } from "../Objects/BombEntity.js";

export class Bomb {
    constructor(game, user){
        this.user = user;
        this.game = game;
        this.width = 30
        this.height = 34
        this.user.addWeapon(this)
        this.itemImg = MediaLoader.getImage("../../assets/sprites/items/bomb_item.png");
        this.type = "bomb"
    }

        get positionX() {
        switch (this.user.direction) {
          case "up":
            return this.user.x + 30;
          case "left":
            return this.user.x;
          case "down":
            return this.user.x + this.width;
          case "right":
            return this.user.x + 70 ;
        }
      }
    
      get positionY() {
        switch (this.user.direction) {
          case "up":
            return this.user.y ;
          case "left":
            return this.user.y + this.height +20;
          case "down":
            return this.user.y + this.height +50;
          case "right":
            return this.user.y + this.height +20;
        }
      }

   
    use() {
        if (
            this.game.entities.findIndex((entity) => {
              return entity.use && entity.user == this.user;
            }) == -1 && this.user.inventory.bomb.current
          ) {
            this.user.inventory.bomb.current -= 1
        new BombEntity(this.game,this.user, {
            x: this.positionX,
            y: this.positionY,
            width: this.width,
            height: this.height,
          })}
      }
}