import { MediaLoader } from "../Helpers/MediaLoader.js";
import { CollisionEntity } from "./CollisionEntity.js";

export class DroppedItem extends CollisionEntity {
    constructor(game, info, item){
        super(game, true, info)
        this.itemInfo = {
            "bomb": {
                drop: 5,
                image: "../../assets/sprites/items/bomb_drop.png"
            },
            "arrow": {
                drop: 10,
                image: "../../assets/sprites/items/arrow_drop.png" 
            }
        }
        this.item = item
        this.spriteImg = MediaLoader.getImage(this.itemInfo[item].image, 32, 36)     
        this.game.addToGame(this)
        this.disappearIn(5000)
        this.visible = true
    }

    draw(){
        if(this.visible)this.drawSprite(1,1,16,18)
    }

    trigger(){
        this.game.mainPlayer.addItem(this.item, this.itemInfo[this.item].drop)
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