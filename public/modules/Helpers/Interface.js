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
        this.inventoryImg = MediaLoader.getImage("../../assets/sprites/gui/inventory.png")
        this.hudImg = MediaLoader.getImage("../../assets/sprites/gui/hotbar.png")
        this.pointerImg = MediaLoader.getImage("../../assets/sprites/gui/pointer.png")
        this.playerInv = this.game.mainPlayer.inventory
        this.inventoryOpen = false
        this.inventoryChanged = false
        this.inventoryPos = {
            x: this.game.canvas.width/2 - 376/2,
            y:this.game.canvas.height/2 - 352/2,
            width: 376, 
            height: 352
        }
        this.pointerPos = {
            slotX: 0,
            slotY: 0,
        }
        this.hotbarIndexes = {
            "a": 0,
            "s": 1,
            "d": 2,
        }
    }

    openInventory(){
        this.inventoryOpen && this.inventoryChanged && this.game.connection.emitNewHotbar(this.game.mainPlayer.getHotbarInfo())
        if(this.inventoryChanged)this.inventoryChanged = false
        this.inventoryOpen = !this.inventoryOpen
    }

    selectItem(key){
        let itemIndex = this.pointerPos.slotX + this.pointerPos.slotY * 7
        let changeInventory = this.game.mainPlayer.itemInventory[itemIndex]
        let changeHotbar = this.game.mainPlayer.weapons[this.hotbarIndexes[key]]
        this.game.mainPlayer.weapons[this.hotbarIndexes[key]] = changeInventory || {}
        this.game.mainPlayer.itemInventory[itemIndex] = changeHotbar || {}
        this.inventoryChanged = true
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
        this.ctx.drawImage(this.inventoryImg, 1, 1, 94, 88, this.inventoryPos.x, this.inventoryPos.y, this.inventoryPos.width, this.inventoryPos.height)
        this.ctx.drawImage(this.game.mainPlayer.spriteImg, 0,136, 48, 67, this.inventoryPos.x+ 32, this.inventoryPos.y+32,80, 120)
        this.ctx.drawImage(this.pointerImg, 1,1, 12,12,this.inventoryPos.x+20+this.pointerPos.slotX*48,this.inventoryPos.y+175+this.pointerPos.slotY*48,48,48)
        let initial = this.inventoryPos.x+161
        for(let i = 0; i < 3; i++){
            if(this.game.mainPlayer.weapons[i].itemImg)this.ctx.drawImage(this.game.mainPlayer.weapons[i].itemImg, 0,0,25,25, initial, this.inventoryPos.y+68, 50, 50)
            initial+=58
        }
        initial = this.inventoryPos.x +20
        let layer = 0
        for (let i=0; i<this.game.mainPlayer.itemInventory.length; i++){
            if(initial>370){
                initial = 82
                layer += 1
            }
            if(this.game.mainPlayer.itemInventory[i].itemImg)this.ctx.drawImage(this.game.mainPlayer.itemInventory[i].itemImg, 0,0,25,25, initial, this.inventoryPos.y + 177 + layer*48, 50, 50)
            initial+=48
        }
    }

    drawHud(){
        this.ctx.drawImage(this.hudImg, 1, 1, 40, 12, this.game.canvas.width - 10 - 160,10, 160, 48)
        let initial = this.game.canvas.width - 10 - 160
        for(let i = 0; i < 3; i++){
            if(this.game.mainPlayer.weapons[i].itemImg)this.ctx.drawImage(this.game.mainPlayer.weapons[i].itemImg, 0,0,25,25, initial, 10, 50, 50)
            initial+=55
        }
    }


}