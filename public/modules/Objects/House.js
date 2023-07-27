import { MediaLoader } from "../Helpers/MediaLoader.js";
import { CollisionEntity } from "./CollisionEntity.js";

export class House extends CollisionEntity {
    constructor(game, info){
        super(game, false, info)
        this.spriteImg = MediaLoader.getImage("./assets/sprites/objects/house.png", 52, 78)
        this.game.addToGame(this)
    }

    get collisionY() {
        return this.y + this.height/4 + this.game.cameraPositionY
    }

    get collisionHeight(){
        return this.height - this.height/4
    }

    draw(){
            this.drawSprite(1,1,50,76)
    }
}