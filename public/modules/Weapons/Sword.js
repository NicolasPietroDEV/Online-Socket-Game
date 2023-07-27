import { MediaLoader } from "../Helpers/MediaLoader.js";
import { CollisionEntity } from "../Objects/CollisionEntity.js";

export class Sword extends CollisionEntity {
  constructor(game, user) {
    super(
      game,
      true,
      {
        x: user.x,
        y: user.y,
        width: user.width,
        height: user.height,
      },
      false
    );
    this.user = user;
    this.spriteMap = {
      w: 0,
      a: 1,
      s: 2,
      d: 3,
    };
    this.abovePlayer = false

    this.frame = 0;
    this.spriteImg = MediaLoader.getImage("../assets/sprites/items/sword.png", 70,100)
    this.canUse = true;
    this.user.addWeapon(this);
    if (this.game.devMode) {
      console.log("Sword Created");
    }
  }

  get collisionX() {
    switch (this.user.direction) {
      case "w":
      case "s":
        return (
          this.user.x +
          this.width / 4 -
          this.collisionWidth / 4 +
          this.game.cameraPositionX
        );
      case "a":
        return this.user.x - this.collisionWidth + this.game.cameraPositionX;
      case "d":
        return this.user.x + this.user.width + this.game.cameraPositionX;
    }
  }

  get collisionY() {
    switch (this.user.direction) {
      case "w":
        return (
          this.user.y - this.collisionHeight / 2 + this.game.cameraPositionY
        );
      case "a":
      case "d":
        return (
          this.user.y +
          this.user.height / 2 -
          this.collisionWidth / 2 +
          this.game.cameraPositionY
        );
      case "s":
        return this.user.y + this.user.height + this.game.cameraPositionY;
    }
  }

  get collisionWidth() {
    return 40;
  }

  get collisionHeight() {
    return 40;
  }

  get positionX() {
    switch (this.user.direction) {
      case "w":
        if (this.frame == 0) return this.collisionX + 10;
        if (this.frame == 2) return this.collisionX - 10;
        return this.collisionX;
      case "a":
        return this.collisionX + this.collisionWidth / 3;
      case "s":
        if (this.frame == 0) return this.collisionX - 10;
        if (this.frame == 2) return this.collisionX + 10;
        return this.collisionX;
      case "d":
        return this.collisionX - this.collisionWidth / 3;
    }
  }

  get positionY() {
    switch (this.user.direction) {
      case "w":
        return this.collisionY + this.collisionHeight / 2;
      case "a":
        if (this.frame == 0) return this.collisionY - 10;
        if (this.frame == 2) return this.collisionY + 10;
        return this.collisionY;
      case "s":
        return this.collisionY - this.collisionHeight / 2;
      case "d":
        if (this.frame == 0) return this.collisionY + 10;
        if (this.frame == 2) return this.collisionY - 10;
        return this.collisionY;
    }
  }
    

  trigger() {
    this.game.mainPlayer.takeDamage(1, 40, this.user.direction)
    
  }

  animate() {
    let swordAnimation = setInterval(() => {
      if (this.frame + 1 > 2) {
        clearInterval(swordAnimation);
        this.frame = 0;
      } else this.frame++;
    }, 66);
  }

  draw() {
    this.#drawSprite();
    if (this.game.devMode) {
      this.showBox();
    }
  }

  #drawSprite() {
    this.ctx.drawImage(
      this.spriteImg,
      1 + this.frame * 23,
      1 + this.spriteMap[this.user.direction] * 25,
      21,
      21,
      this.positionX,
      this.positionY,
      this.collisionWidth,
      this.collisionHeight
    );
  }

  startCooldown(time){
    this.canUse = false;
    setTimeout(() => {
      this.canUse = true;
    }, time);
  }

  addAsEntityByTime(time){
    this.game.addToGame(this);
      setTimeout(() => {
        this.game.removeFromGame(this);
      }, time);
  }

  use() {
    
    if (
      this.game.entities.findIndex((entity) => {
        return entity.use && entity.user == this.user;
      }) == -1 &&
      this.canUse
    ) {
      MediaLoader.playSound(`../../assets/sfx/swing${Math.ceil(Math.random()*3)}.wav`)
      this.animate();
      this.abovePlayer = this.user.direction == "s";
      this.user.frame = 1;
      this.user.stopMoving(300)
      this.startCooldown(300)
      this.addAsEntityByTime(200)
    }
  }
}
