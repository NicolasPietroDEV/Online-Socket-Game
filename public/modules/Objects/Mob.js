import { MediaLoader } from "../Helpers/MediaLoader.js";
import { CollisionEntity } from "./CollisionEntity.js";
import { DroppedItem } from "./DroppedItem.js";

export class Mob extends CollisionEntity {
    constructor(game ,info) {
        super(game, true, info, "../../assets/sprites/mobs/mob1.png");
        this.inverseMap = {
            "up": "down",
            "down": "up",
            "left": "right",
            "right": "left"
        }
        this.frame = 0;
        this.isMoving = false;
        this.animate()
        this.code = info.code
        this.life = info.life
        this.maxLife = info.life
        this.lifeBar = MediaLoader.getImage("../assets/sprites/misc/lifebarMob.png", 30,10)
        this.game.addToGame(this)
    }

    updateMob(info){
        if (info.life <= 0){this.dropItem(); this.game.removeFromGame(this)}
        if(this.x==info.x && this.y==info.y){this.isMoving = false} else {
            this.isMoving = true
            this.x = info.x;
            this.y = info.y;
            this.direction = info.direction
        }
        this.life = info.life
        
    }

    draw(){
        if(this.game.devMode)(this.#drawRange())
        this.drawSprite(
            85*this.frame + 1, 
            ["up", "left"].includes(this.direction) ? 84 : 0, 
            85, 
            85)
        this.#drawLifeBar()
    }

    #drawLifeBar() {
        this.ctx.fillStyle = "green";
        this.ctx.fillRect(
          this.x + this.game.cameraPositionX -4,
          this.y - 10 + this.game.cameraPositionY,
          55/this.maxLife * this.life,
          8
        );
    
        this.ctx.drawImage(
          this.lifeBar,
          1,
          1,
          29,
          9,
          this.x + this.game.cameraPositionX + this.width / 2 - 29,
          this.y - 14 + this.game.cameraPositionY,
          29 * 2,
          9 * 2
        );
        this.ctx.fillStyle = "black"
        this.ctx.font = "8px PixelArt"
        this.ctx.fillText(this.life+"/"+this.maxLife, 
        this.x + this.game.cameraPositionX +12,
        this.y + this.game.cameraPositionY-2,
        )
      }

    #drawRange() {
        this.ctx.fillStyle = "rgba(51, 102, 255, 0.3)";
        this.ctx.beginPath();
        this.ctx.ellipse(
          this.x + this.width / 2 + this.game.cameraPositionX,
          this.y + this.height + this.game.cameraPositionY - 5,
          200,
          200,
          90 * (Math.PI / 180),
          0,
          2 * Math.PI
        );
        this.ctx.fill();
      }

    animate() {
        setInterval(() => {
          if (this.frame + 1 > 3 || !this.isMoving) {
            this.frame = 0;
          } else this.frame++;
        }, 300);
      }

    trigger(){
        this.game.mainPlayer.takeDamage(1, 70, this.inverseMap[this.direction], false, false)
    }

    takeDamage(direction, amount){
        this.game.connection.emitMobDamage(this.code, amount, direction)
        MediaLoader.playSound("../../assets/sfx/damage.wav")
    }

    dropItem() {
      let random = Math.floor(Math.random() * 100);
      if (random < 50) {
        this.createDrop("arrow");
      } else if (random >= 50 && random <= 80) {
        this.createDrop("bomb");
      } else if (random >= 80 && random <=100){
        this.createDrop("life_potion")
      }
    }

    createDrop(type) {
      new DroppedItem(
        this.game,
        {
          x: this.x,
          y: this.y,
          width: 32,
          height: 36,
        },
        type
      );
    }

}