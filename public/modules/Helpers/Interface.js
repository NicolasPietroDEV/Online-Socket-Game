import { MediaLoader } from "./MediaLoader.js";

export class Interface {
    constructor(game){
        this.game = game;
        this.ctx = game.ctx
        this.bombImg = MediaLoader.getImage("../../assets/sprites/items/bomb_item.png", 60, 64)
        this.arrowImg = MediaLoader.getImage("../../assets/sprites/items/arrow_item.png", 60, 62)
    }

    drawInterface(){
        this.ctx.font = "bolder 30px arial"
        this.ctx.fillStyle = "white"
        this.ctx.drawImage(this.bombImg, 10, 10, 40, 42)
        this.ctx.fillText(this.game.mainPlayer.inventory.bomb, 60, 50)
        this.ctx.drawImage(this.arrowImg, 10, 60, 40, 44)
        this.ctx.fillText(this.game.mainPlayer.inventory.arrow, 60, 100)
    }


}