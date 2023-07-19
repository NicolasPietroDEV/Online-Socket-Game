import { CollisionEntity } from "./CollisionEntity.js";

export class House extends CollisionEntity {
    constructor(game, info){
        super(game, false, info)
        this.game = game
        this.ctx = this.game.ctx
        this.spriteImg = new Image(52,78)
        this.spriteImg.src = "assets/house.png"
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