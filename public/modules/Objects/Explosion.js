import { MediaLoader } from "../Helpers/MediaLoader.js";
import { CollisionEntity } from "./CollisionEntity.js";
import { Jar } from "./Jar.js";

export class Explosion extends CollisionEntity {
    constructor(game, info) {
        super(game, true, info)
        this.spriteImg = MediaLoader.getImage("../../assets/sprites/misc/explosion.png")
        this.game.addToGame(this)
        this.inverseMap = {
            "up": "down",
            "down": "up",
            "left": "right",
            "right": "left"
        }
        this.disappearIn(500)
        this.breakJar()
    }

    disappearIn(time){
        setTimeout(()=>{
            this.game.removeFromGame(this)
        }, time)
    }

    breakJar(){
        let jars = this.game.entities.filter((entity)=>entity instanceof Jar)
    
        for (let jar of jars){
          if (jar.collidesWith(this.getCollisionInfo())){
            jar.break()
          }
        }
      }

    draw(){
        this.drawSprite(1,1,41, 37)
    }

    trigger(){
        this.game.mainPlayer.takeDamage(3, 50, this.inverseMap[this.game.mainPlayer.direction], true)
    }
}
