import { MediaLoader } from "../Helpers/MediaLoader.js";
import { CollisionEntity } from "./CollisionEntity.js";
import { Explosion } from "./Explosion.js";

export class BombEntity extends CollisionEntity {
  constructor(game, info) {
    super(game, false, info, "../../assets/sprites/items/bomb.png");
    this.type = "bomb_entity"
    this.red = false
    this.canUse = true;
    this.game.addToGame(this);
    this.explodeInTime(3000)
    this.exploded = false
  }

  explodeInTime(time){
    setTimeout(()=>{
        let redLoop = setInterval(()=>{
          this.red = !this.red
          if (this.exploded) clearInterval(redLoop)
        }, 50)
    }, time*4/5)
    setTimeout(()=>{
        this.red = false
        this.exploded = true
        this.game.removeFromGame(this)
        MediaLoader.playSound("../../assets/sfx/bomb_blow.wav")
        new Explosion(this.game, {
          x: this.x - 120/2 + this.width/2,
          y: this.y - 120/2 + this.height/2,
          width: 120,
          height: 120
        })
    }, time)
  }

  draw() {
    this.drawSprite(
      1 * 15*(this.red?0:1),
      1,
      15,
      17,
    );
  }
}
