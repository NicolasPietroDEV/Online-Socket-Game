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
    this.game = game;
    this.ctx = this.game.ctx;
    this.spriteMap = {
      w: 0,
      a: 1,
      s: 2,
      d: 3,
    };
    this.frame = 0;
    this.spriteImg = new Image(70, 100);
    this.canUse = true;
    this.spriteImg.src = "../assets/sword.png";
    this.user.addWeapon(this);
    if (this.game.devMode) {
      console.log("Sword Created");
    }
  }

  get collisionX() {
    switch (this.user.direction) {
      case "w":
        return (
          this.user.x +
          this.width / 4 -
          this.collisionWidth / 4 +
          this.game.cameraPositionX
        );
      case "a":
        return this.user.x - this.collisionWidth + this.game.cameraPositionX;
      case "s":
        return (
          this.user.x +
          this.width / 4 -
          this.collisionWidth / 4 +
          this.game.cameraPositionX
        );
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
        return (
          this.user.y +
          this.user.height / 2 -
          this.collisionWidth / 2 +
          this.game.cameraPositionY
        );
      case "s":
        return this.user.y + this.user.height + this.game.cameraPositionY;
      case "d":
        return (
          this.user.y +
          this.user.height / 2 -
          this.collisionWidth / 2 +
          this.game.cameraPositionY
        );
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

  takeKnockbackTo(knockback, direction, parts) {
    let initial = this.game.mainPlayer.getPlayerInfo();
    let stop = false;

    let knockbackPart = parseInt(knockback / parts);
    let animationLoop = setInterval(() => {
      let collision = this.game.mainPlayer.getCollisionInfo();
      switch (direction) {
        case "w":
          if (
            this.game.checkAllCollisions({
              ...collision,
              y: collision.y - knockbackPart,
            })
          ) {
            clearInterval(animationLoop);
            break;
          }
          this.game.mainPlayer.y -= knockbackPart;
          if (this.game.mainPlayer.y <= initial.y - knockback) stop = true;
          if (this.game.cameraPositionY + knockbackPart < 0) {
            this.game.cameraPositionY += knockbackPart;
          }
          break;
        case "a":
          if (
            this.game.checkAllCollisions({
              ...collision,
              x: collision.x - knockbackPart,
            })
          ) {
            clearInterval(animationLoop);
            break;
          }
          this.game.mainPlayer.x -= knockbackPart;
          if (this.game.mainPlayer.x <= initial.x - knockback) stop = true;
          if (this.game.cameraPositionX + knockbackPart < 0) {
            this.game.cameraPositionX += knockbackPart;
          }
          break;
        case "s":
          if (
            this.game.checkAllCollisions({
              ...collision,
              y: collision.y + knockbackPart,
            })
          ) {
            clearInterval(animationLoop);
            break;
          }
          this.game.mainPlayer.y += knockbackPart;
          if (this.game.mainPlayer.y >= initial.y + knockback) stop = true;
          if (
            -(this.game.cameraPositionY - knockbackPart) <
            this.game.canvas.height
          ) {
            this.game.cameraPositionY -= knockbackPart;
          }
          break;
        case "d":
          if (
            this.game.checkAllCollisions({
              ...collision,
              x: collision.x + knockbackPart,
            })
          ) {
            clearInterval(animationLoop);
            break;
          }
          this.game.mainPlayer.x += knockbackPart;
          if (this.game.mainPlayer.x >= initial.x + knockback) stop = true;
          if (
            -(this.game.cameraPositionX - knockbackPart) <
            this.game.canvas.width
          ) {
            this.game.cameraPositionX -= knockbackPart;
          }
          break;
      }
      this.game.connection.emitMovement();
      if (stop) {
        clearInterval(animationLoop);
      }
    }, 10);
  }

  trigger() {
    if (this.game.mainPlayer.canTakeDamage && (this.game.mainPlayer.immuneFrom != this.user.direction)) {
      this.game.mainPlayer.canTakeDamage = false;
      this.game.mainPlayer.canMove = false;
      this.game.mainPlayer.startBlinking()
      if (this.game.mainPlayer.life - 1 > 0) {
        this.game.mainPlayer.life -= 1;
        this.takeKnockbackTo(40, this.user.direction, 10);
      } else {
        this.game.mainPlayer.life = 0;
        this.game.mainPlayer.respawn();
        this.game.resetCamera();
        this.game.connection.emitMovement();
      }
      

      setTimeout(() => {
        this.game.mainPlayer.canTakeDamage = true;
        this.game.mainPlayer.canMove = true;
      }, 200);
    }
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

  use() {
    this.animate();
    if (
      this.game.entities.findIndex((entity) => {
        return entity.use && entity.user == this.user;
      }) == -1 &&
      this.canUse
    ) {
      if (this.user.direction == "s") {
        this.priorize = true;
      } else {
        this.priorize = false;
      }
      this.canUse = false;
      this.user.canMove = false;
      this.user.frame = 1;
      setTimeout(() => {
        this.canUse = true;
        this.user.canMove = true;
      }, 300);
      this.game.addToGame(this);
      setTimeout(() => {
        this.game.removeFromGame(this);
      }, 200);
    }
  }
}
