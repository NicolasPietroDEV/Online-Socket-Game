import { MediaLoader } from "../Helpers/MediaLoader.js";
import { CollisionEntity } from "./CollisionEntity.js";
import { DroppedItem } from "./DroppedItem.js";

export class Jar extends CollisionEntity {
  constructor(game, info) {
    super(game, false, info, "../../assets/sprites/objects/jar1.png");
    this.game.addToGame(this);
    this.broken = false;
    this.frame = 0
  }

  draw() {
    this.drawSprite(
        1 + (this.frame * 36), 
        1, 
        34, 
        41);
  }

  animate(){
    let breakLoop = setInterval(()=>{
        if(this.frame<3){this.frame++}else clearInterval(breakLoop)
    }, 100)
  }

  break() {
    if (!this.broken) {
        MediaLoader.playSound("../../assets/sfx/jar_breaking.oga")
        this.animate()
      this.dropItem();
      this.broken = true;
      this.canPassThrough = true;
      setTimeout(() => {
        this.broken = false;
        this.canPassThrough = false;
        this.frame = 0
      }, 10000);
    }
  }

  dropItem() {
    let random = Math.floor(Math.random() * 100);
    if (random < 30) {
      this.createDrop("arrow");
    } else if (random >= 30 && random <= 50) {
      this.createDrop("bomb");
    } else if (random >= 50 && random <=60){
      this.createDrop("life_potion")
    }
  }

  createDrop(type) {
    new DroppedItem(
      this.game,
      {
        x: this.x,
        y: this.y,
        width: 32,
        height: 36,
      },
      type
    );
  }
}
