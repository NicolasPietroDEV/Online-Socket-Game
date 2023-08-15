import { MediaLoader } from "../Helpers/MediaLoader.js";
import { CollisionEntity } from "./CollisionEntity.js";

export class Arrow extends CollisionEntity {
  constructor(game, user, info, speed, direction) {
    super(game, true, info, "../../assets/sprites/items/arrow.png");
    this.direction = direction;
    this.user = user
    this.spriteMap = {
      up: 0,
      left: 1,
      down: 2,
      right: 3,
    };
    this.game.addToGame(this);
    this.active = true
    this.fly(speed)
  }

  fly(speed) {
    let flyLoop = setInterval(() => {
      switch (this.direction) {
        case "up":
          this.y -= speed;
          break;
        case "left":
          this.x -= speed;
          break;
        case "down":
          this.y += speed;
          break;
        case "right":
          this.x += speed;
          break;
      }
      if (this.game.checkAllCollisions(this.getCollisionInfo(), false, this.user)) {
        clearInterval(flyLoop);
        MediaLoader.playSound("../../assets/sfx/arrow_hit.mp3")
        this.active = false;
        setTimeout(()=>{
            this.game.removeFromGame(this)
        }, 300)
      }
    }, 25);
  }
  draw() {
    this.drawSprite(
      1 + this.spriteMap[this.direction] * 15,
      1,
      15,
      15
    );
    if (this.game.devMode){this.showBox()}
  }

  trigger(){
    if(this.active && !this.user.isYourPlayer() ){
        this.game.mainPlayer.takeDamage(1, 20, this.direction, false, this.user.id || false)
        this.game.removeFromGame(this)
    }
  }

}
