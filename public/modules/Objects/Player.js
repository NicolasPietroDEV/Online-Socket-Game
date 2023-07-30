import { CollisionEntity } from "./CollisionEntity.js";
import { Sword } from "../Weapons/Sword.js";
import { Shield } from "../Weapons/Shield.js";
import { MediaLoader } from "../Helpers/MediaLoader.js";
import { Bow } from "../Weapons/Bow.js";
import { Bomb } from "../Weapons/Bomb.js";

export class Player extends CollisionEntity {
  constructor(game, playerInfo, notAdd) {
    super(game, false, playerInfo);
    this.weapons = [];
    this.game = game;
    this.ctx = this.game.ctx;
    this.directionMapping = {
      up: 0,
      left: 1,
      down: 2,
      right: 3,
    };
    this.id = playerInfo.id;
    this.direction = playerInfo.direction;
    this.speed = playerInfo.speed;
    this.color = playerInfo.color;
    this.name = playerInfo.name;
    this.canMove = true;
    this.canTakeDamage = true;
    this.isMoving = false;
    this.blinkState = true;
    this.frame = 1;
    this.life = playerInfo.life;
    this.immuneFrom = false;
    this.canChangeDirection = true
    this.inventory = { arrow: 10, bomb: 10 }
    this.spriteImg = MediaLoader.getImage("../assets/sprites/player/sprite.png", 200,200)
    this.lifeBar = MediaLoader.getImage("../assets/sprites/misc/lifebar.png", 30,10)
    if (!notAdd) this.game.addToGame(this);
    if (this.game.devMode) console.log("Player created");
    this.draw();
    this.animate();
    new Sword(game, this);
    new Shield(game, this);
    new Bow(game, this)
    new Bomb(game, this)
  }

  get collisionY() {
    return this.y + this.height / 2 + this.game.cameraPositionY;
  }

  get collisionHeight() {
    return this.height / 2;
  }

  get collisionX() {
    return this.x + this.width / 4 + this.game.cameraPositionX;
  }

  get collisionWidth() {
    return this.width / 2;
  }

  draw() {
    this.#drawText();
    this.#drawShadow();
    this.blinkState && this.#drawCharacter();
    this.#drawLifeBar();
  }

  changePos(info) {
    this.x = info.x;
    this.y = info.y;
    this.direction = info.direction;
    this.isMoving = info.isMoving;
    this.blinkState = info.blinkState;
  }

  getPlayerInfo() {
    return {
      x: this.x,
      y: this.y,
      direction: this.direction,
      color: this.color,
      id: this.id,
      width: this.width,
      height: this.height,
      speed: this.speed,
      name: this.name,
      isMoving: this.isMoving,
      life: this.life,
      blinkState: this.blinkState,
      inventory: this.inventory
    };
  }

  isYourPlayer() {
    return this == this.game.mainPlayer;
  }

  animate() {
    setInterval(() => {
      if (this.frame + 1 > 3 || !this.isMoving) {
        this.frame = 0;
      } else this.frame++;
    }, 300);
  }

  startBlinking() {
    let counter = 0;
    let blinkAnimation = setInterval(() => {
      if (counter % 5 == 0) {
        this.blinkState = !this.blinkState;
      }
      counter++;
      if (this.canMove) {
        clearInterval(blinkAnimation);
        this.blinkState = true;
        this.isYourPlayer() && this.game.connection.emitMovement();
      }
    });
  }

  respawn() {
    this.life = 10;
    this.changePos({
      x: this.game.spawn.x,
      y: this.game.spawn.y,
      direction: "down",
    });
  }

  startImmunity(time) {
    this.canTakeDamage = false;
    this.canMove = false;
    setTimeout(() => {
      this.canTakeDamage = true;
      this.canMove = true;
    }, time);
  }

  stopMoving(time) {
    this.canMove = false;
    setTimeout(() => {
      this.canMove = true;
    }, time);
  }

  takeKnockbackTo(knockback, direction, parts) {
    let initial = this.getPlayerInfo();
    let stop = false;

    let knockbackPart = parseInt(knockback / parts);
    let animationLoop = setInterval(() => {
      let collision = this.getCollisionInfo();
      switch (direction) {
        case "up":
          if (
            this.game.checkAllCollisions({
              ...collision,
              y: collision.y - knockbackPart,
            })
          ) {
            clearInterval(animationLoop);
            break;
          }
          this.y -= knockbackPart;
          if (this.y <= initial.y - knockback) stop = true;
          if (this.game.cameraPositionY + knockbackPart < 0) {
            this.game.cameraPositionY += knockbackPart;
          }
          break;
        case "left":
          if (
            this.game.checkAllCollisions({
              ...collision,
              x: collision.x - knockbackPart,
            })
          ) {
            clearInterval(animationLoop);
            break;
          }
          this.x -= knockbackPart;
          if (this.x <= initial.x - knockback) stop = true;
          if (this.game.cameraPositionX + knockbackPart < 0) {
            this.game.cameraPositionX += knockbackPart;
          }
          break;
        case "down":
          if (
            this.game.checkAllCollisions({
              ...collision,
              y: collision.y + knockbackPart,
            })
          ) {
            clearInterval(animationLoop);
            break;
          }
          this.y += knockbackPart;
          if (this.y >= initial.y + knockback) stop = true;
          if (
            -(this.game.cameraPositionY - knockbackPart) <
            this.game.canvas.height
          ) {
            this.game.cameraPositionY -= knockbackPart;
          }
          break;
        case "right":
          if (
            this.game.checkAllCollisions({
              ...collision,
              x: collision.x + knockbackPart,
            })
          ) {
            clearInterval(animationLoop);
            break;
          }
          this.x += knockbackPart;
          if (this.x >= initial.x + knockback) stop = true;
          if (
            -(this.game.cameraPositionX - knockbackPart) <
            this.game.canvas.width
          ) {
            this.game.cameraPositionX -= knockbackPart;
          }
          break;
      }
      this.isYourPlayer && this.game.connection.emitMovement();
      if (stop) {
        clearInterval(animationLoop);
      }
    }, 10);
  }

  takeDamage(amount, knockback, direction, ignoreImmunity) {
    if (this.canTakeDamage && (this.immuneFrom != direction || ignoreImmunity)) {
      this.startImmunity(300);
      this.startBlinking();
      if (this.life - amount > 0) {
        this.life -= amount;
        if (knockback) this.takeKnockbackTo(knockback, direction, 10);
      } else {
        this.life = 0;
        this.respawn();
        this.game.resetCamera();
        if (this.game.mainPlayer == this) this.game.connection.emitMovement();
      }
    }
  }

  #drawCharacter() {
    this.drawSprite(
      this.frame * 48,
      this.directionMapping[this.direction] * 68,
      48,
      67
    );
  }

  #drawLifeBar() {
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(
      this.x + this.game.cameraPositionX,
      this.y - 10 + this.game.cameraPositionY,
      this.life * 4.5,
      8
    );

    this.ctx.drawImage(
      this.lifeBar,
      1,
      1,
      29,
      9,
      this.x + this.game.cameraPositionX + this.width / 2 - 29,
      this.y - 14 + this.game.cameraPositionY,
      29 * 2,
      9 * 2
    );
  }

  #drawText() {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.447)";
    this.ctx.font = "bolder 12px Arial";
    this.ctx.fillRect(
      this.x +
        this.width / 2 -
        this.ctx.measureText(this.name).width / 2 +
        this.game.cameraPositionX,
      this.y - 24 + this.game.cameraPositionY,
      this.ctx.measureText(this.name).width,
      12
    );
    this.ctx.fillStyle = this.color;
    this.ctx.fillText(
      this.name,
      this.x +
        this.width / 2 -
        this.ctx.measureText(this.name).width / 2 +
        this.game.cameraPositionX,
      this.y - 14 + this.game.cameraPositionY
    );
  }

  #drawShadow() {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    this.ctx.beginPath();
    this.ctx.ellipse(
      this.x + this.width / 2 + this.game.cameraPositionX,
      this.y + this.height + this.game.cameraPositionY - 5,
      10,
      18,
      90 * (Math.PI / 180),
      0,
      2 * Math.PI
    );
    this.ctx.fill();
  }

  addWeapon(weapon) {
    this.weapons.push(weapon);
  }
}
