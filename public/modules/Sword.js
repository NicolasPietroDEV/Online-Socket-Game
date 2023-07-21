import { CollisionEntity } from "./CollisionEntity.js";

export class Sword extends CollisionEntity {
    constructor(game, user){
        super(game, true, {
            x: user.x,
            y: user.y,
            width: user.width,
            height: user.height
        }, false)
        this.user = user
        this.game = game
        this.ctx = this.game.ctx
        this.spriteMap = {
            "w": {x: 0, y: 0},
            "a": {x: 1, y: 0},
            "s": {x: 0, y: 1},
            "d": {x: 1, y: 1}
        }
        this.spriteImg = new Image(44,44)
        this.canUse = true
        this.spriteImg.src = "../assets/sword.png"
        this.user.addWeapon(this)
        if(this.game.devMode){console.log("Sword Created")}
    }

    get collisionX(){
        switch(this.user.direction){
            case "w":
                return this.user.x + this.width/4 - this.collisionWidth/4 + this.game.cameraPositionX
            case "a":
                return this.user.x - this.collisionWidth + this.game.cameraPositionX
            case "s":
                return this.user.x + this.width/4 - this.collisionWidth/4 + this.game.cameraPositionX
            case "d":
                return this.user.x + this.user.width + this.game.cameraPositionX
        }
        
    }

    get collisionY(){
        switch(this.user.direction){
            case "w":
                return this.user.y - this.collisionHeight + this.game.cameraPositionY
            case "a":
                return this.user.y + this.user.height/2 - this.collisionWidth/2 + this.game.cameraPositionY
            case "s":
                return this.user.y + this.user.height + this.game.cameraPositionY
            case "d":
                return this.user.y + this.user.height/2 - this.collisionWidth/2 + this.game.cameraPositionY
        }

        
    }

    get collisionWidth(){
        return 40
    }

    get collisionHeight(){
        return 40
    }

    get positionX(){
        switch(this.user.direction){
            case "w":
                return this.collisionX
            case "a":
                return this.collisionX + this.collisionWidth/3
            case "s":
                return this.collisionX
            case "d":
                return this.collisionX - this.collisionWidth/3
        }
    }

    get positionY(){
        switch(this.user.direction){
            case "w":
                return this.collisionY + this.collisionHeight/2
            case "a":
                return this.collisionY
            case "s":
                return this.collisionY - this.collisionHeight/2
            case "d":
                return this.collisionY
        }
    }

    trigger(){
        let knockback = 40
        switch(this.user.direction){
            case "w":
                this.game.mainPlayer.y -= knockback
                this.game.cameraPositionY += knockback
                break
            case "a":
                this.game.mainPlayer.x -= knockback
                this.game.cameraPositionX += knockback
                break
            case "s":
                this.game.mainPlayer.y += knockback
                this.game.cameraPositionY -= knockback
                break
            case "d":
                this.game.mainPlayer.x += knockback
                this.game.cameraPositionX -= knockback
                break
        }
        
        this.game.connection.emitMovement()
    }

    draw(){
        this.#drawSprite()
        if(this.game.devMode){this.showBox()}
    }

    #drawSprite(){
        this.ctx.drawImage(
            this.spriteImg,
            1 + this.spriteMap[this.user.direction].x*21,
            1 + this.spriteMap[this.user.direction].y*21,
            21,
            21,
            this.positionX,
            this.positionY,
            this.collisionWidth,
            this.collisionHeight

        )
    }

    use(){
        if((this.game.entities.findIndex((entity)=>{return entity instanceof Sword && entity.user == this.user})==-1) && this.canUse){
            if(this.user.direction == "s"){this.priorize = true} else {this.priorize = false}
            this.canUse = false
            setTimeout(()=>{
                this.canUse = true
            }, 500)
            this.game.addToGame(this)
            setTimeout(()=>{
                this.game.removeFromGame(this)
            }, 100)
        }
        
    }
}