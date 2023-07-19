import { CollisionEntity } from "./CollisionEntity.js";

export class House extends CollisionEntity {
    constructor(game, info){
        super(game, false, info)
        this.game = game
        this.ctx = this.game.ctx
        this.spriteImg = new Image(52,78)
        this.spriteImg.src = "assets/house.png"
        this.game.entities.push(this)
    }

    get collisionY() {
        return this.y + this.height/4 + this.game.cameraPositionY
    }

    get collisionHeight(){
        return this.height - this.height/4
    }

    draw(){
        this.ctx.drawImage(
            this.spriteImg, 1,1,50,76, 
            this.x + this.game.cameraPositionX, 
            this.y + this.game.cameraPositionY, 
            this.width, 
            this.height)
            if(this.game.devMode){this.showBox()}

    }
}