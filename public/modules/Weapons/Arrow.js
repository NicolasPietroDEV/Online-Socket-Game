import { MediaLoader } from "../Helpers/MediaLoader.js";
import { CollisionEntity } from "../Objects/CollisionEntity.js";

export class Arrow extends CollisionEntity {
  constructor(game, user, info, speed, direction) {
    super(game, true, info);
    this.direction = direction;
    this.user = user
    this.spriteMap = {
      w: 0,
      a: 1,
      s: 2,
      d: 3,
    };
    this.game.addToGame(this);
    this.active = true
    this.fly(speed)
    this.spriteImg = MediaLoader.getImage(
      "../../assets/sprites/items/arrow.png"
    );
  }

  fly(speed) {
    let flyLoop = setInterval(() => {
      switch (this.direction) {
        case "w":
          this.y -= speed;
          break;
        case "a":
          this.x -= speed;
          break;
        case "s":
          this.y += speed;
          break;
        case "d":
          this.x += speed;
          break;
      }
      if (this.game.checkAllCollisions(this.getCollisionInfo(), false, this.user)) {
        clearInterval(flyLoop);
        this.active = false;
        setTimeout(()=>{
            this.game.removeFromGame(this)
        }, 300)
      }
    }, 25);
  }
  draw() {
    this.ctx.drawImage(
      this.spriteImg,
      1 + this.spriteMap[this.direction] * 15,
      1,
      15,
      15,
      this.x + this.game.cameraPositionX,
        this.y + this.game.cameraPositionY,
        this.width,
        this.height
    );
    if (this.game.devMode){this.showBox()}
  }

  trigger(){
    if(this.active && !this.user.isYourPlayer() ){
        this.game.mainPlayer.takeDamage(1, 20, this.direction)
        this.game.removeFromGame(this)
    }
  }

}
