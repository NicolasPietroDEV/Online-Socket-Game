import { MediaLoader } from "../Helpers/MediaLoader.js";
import { CollisionEntity } from "./CollisionEntity.js";

export class Explosion extends CollisionEntity {
    constructor(game, user ,info) {
        super(game, true, info, "../../assets/sprites/misc/explosion.png")
        this.user = user
        this.game.addToGame(this)
        this.inverseMap = {
            "up": "down",
            "down": "up",
            "left": "right",
            "right": "left"
        }
        this.disappearIn(500)
        this.game.breakJarsCollidingWith(this.getCollisionInfo())
        this.game.damageMobsCollidingWith(this.getCollisionInfo())
    }

    disappearIn(time){
        setTimeout(()=>{
            this.game.removeFromGame(this)
        }, time)
    }

    draw(){
        this.drawSprite(1,1,41, 37)
    }

    trigger(){
        this.game.mainPlayer.takeDamage(3, 50, this.inverseMap[this.game.mainPlayer.direction], true, this.user.id)
    }
}
