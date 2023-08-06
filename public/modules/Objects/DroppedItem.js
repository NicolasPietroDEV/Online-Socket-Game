import { ClassTranslator } from "../Helpers/ClassTranslator.js";
import { MediaLoader } from "../Helpers/MediaLoader.js";
import { CollisionEntity } from "./CollisionEntity.js";

export class DroppedItem extends CollisionEntity {
    constructor(game, info, item){
        super(game, true, info)
        this.itemInfo = {
            "bomb": {
                type: "consumable",
                drop: 5,
                image: "../../assets/sprites/items/bomb_drop.png"
            },
            "arrow": {
                type: "consumable",
                drop: 10,
                image: "../../assets/sprites/items/arrow_drop.png" 
            },
            "life_potion": {
                type: "item",
                image: "../../assets/sprites/items/life_potion_drop.png"
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
        if(this.itemInfo[this.item].type == "consumable"){this.game.mainPlayer.addItem(this.item, this.itemInfo[this.item].drop)} else 
        if(this.itemInfo[this.item].type == "item"){new (ClassTranslator.stringToObject(this.item))(this.game, this.game.mainPlayer)}

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