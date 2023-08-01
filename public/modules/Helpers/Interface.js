import { MediaLoader } from "./MediaLoader.js";

export class Interface {
    constructor(game){
        this.game = game;
        this.ctx = game.ctx
        this.bombImg = MediaLoader.getImage("../../assets/sprites/items/bomb_item.png", 60, 64)
        this.arrowImg = MediaLoader.getImage("../../assets/sprites/items/arrow_item.png", 60, 62)
        this.items = {
            "bomb": MediaLoader.getImage("../../assets/sprites/items/bomb_item.png"),
            "arrow": MediaLoader.getImage("../../assets/sprites/items/arrow_item.png")
        }
        this.playerInv = this.game.mainPlayer.inventory
        this.inventoryOpen = false
    }

    drawInterface(){
        this.ctx.font = "bolder 30px PixelArt"
        if(this.playerInv.bomb.current == this.playerInv.bomb.limit){this.ctx.fillStyle = "red"} else {this.ctx.fillStyle = "white"}
        this.ctx.drawImage(this.bombImg, 10, 10, 40, 42)
        this.ctx.fillText(this.game.mainPlayer.inventory.bomb.current, 60, 50)
        if(this.playerInv.arrow.current == this.playerInv.arrow.limit){this.ctx.fillStyle = "red"} else {this.ctx.fillStyle = "white"}
        this.ctx.drawImage(this.arrowImg, 10, 60, 40, 44)
        this.ctx.fillText(this.game.mainPlayer.inventory.arrow.current, 60, 100)

        if(this.inventoryOpen)this.drawInventory()
    }

    drawInventory() {
        this.ctx.fillStyle = "grey"
        this.ctx.fillRect(100, 100, 300, 300)
    }


}