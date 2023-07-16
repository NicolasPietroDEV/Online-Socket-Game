export class CollisionEntity {
    constructor(game, canPassThrough){
        this.game = game;
        this.ctx = this.game.ctx;
        this.canPassThrough = canPassThrough
        this.game.collisors.push(this)
        if(this.game.devMode)console.log("Collision Created")
    }

    collidesWith(sprite){
        if(((((sprite.y+sprite.height)>this.y))&&((this.y+this.height)>sprite.y))&&((((sprite.x+sprite.width)>this.x))&&((this.x+this.width)>sprite.x))&&(this.id!=this.game.mainPlayer.id)){
            return true;
        } else {
            return false
        }
    }


    showBox(){
        this.ctx.fillStyle = "rgba(255, 0, 0, 0.292)"
        this.ctx.fillRect(this.x, this.y, this.width, this.height)
    }
}