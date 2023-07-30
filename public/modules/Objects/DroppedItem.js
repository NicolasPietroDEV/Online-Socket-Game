import { MediaLoader } from "../Helpers/MediaLoader.js";
import { CollisionEntity } from "./CollisionEntity.js";

export class DroppedItem extends CollisionEntity {
    constructor(game, info, item){
        super(game, true, info)
        this.dropQuantity = {
            "bomb": 5,
            "arrow": 10
        }
        this.item = item
        switch(item){
            case "arrow":
                this.spriteImg = MediaLoader.getImage("../../assets/sprites/items/arrow_drop.png", 32, 36)
                break
            case "bomb":
                this.spriteImg = MediaLoader.getImage("../../assets/sprites/items/bomb_drop.png", 32, 36)
                break
        }
        this.game.addToGame(this)
        this.disappearIn(5000)
        this.visible = true
    }

    draw(){
        if(this.visible)this.drawSprite(1,1,16,18)
    }

    trigger(){
        this.game.mainPlayer.inventory[this.item] += this.dropQuantity[this.item]
        this.game.removeFromGame(this)
    }

    disappearIn(time){
        setTimeout(()=>{
            setInterval(()=>{
                this.visible = !this.visible
            }, 50)
        }, time*2/3)
        setTimeout(()=>{
            this.game.removeFromGame(this)
        }, time)
    }
}