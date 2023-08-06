import { MediaLoader } from "../Helpers/MediaLoader.js";

export class LifePotion {
    constructor(game, user){
        this.type = "life_potion"
        this.cureAmount = 5
        this.game = game;
        this.user = user;
        this.itemImg = MediaLoader.getImage("../../assets/sprites/items/life_potion_item.png")
        this.user.addWeapon(this)
    }

    use(){
        MediaLoader.playSound("../../assets/sfx/drink_potion.mp3")
        if(this.user.life + this.cureAmount <= this.user.maxLife){this.user.life += this.cureAmount}else{this.user.life = this.user.maxLife}
        this.user.removeWeapon(this)
    }
}