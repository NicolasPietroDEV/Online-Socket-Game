import { Entity } from "./Entity.js";

export class CollisionEntity extends Entity{
  constructor(game, canPassThrough, info, spriteImg) {
    super(game, info, spriteImg)
    this.canPassThrough = canPassThrough;
    if (this.game.devMode) console.log("Collision Created");
  }

  get collisionY() {
    return this.y + this.game.cameraPositionY;
  }

  get collisionHeight() {
    return this.height;
  }

  get collisionX() {
    return this.x + this.game.cameraPositionX;
  }

  get collisionWidth() {
    return this.width;
  }

  collidesWith(sprite) {
    if (
      sprite.y + sprite.height > this.collisionY &&
      this.collisionY + this.collisionHeight > sprite.y &&
      sprite.x + sprite.width > this.collisionX &&
      this.collisionX + this.collisionWidth > sprite.x &&
      this.id != this.game.mainPlayer.id
    ) {
      return true;
    } else {
      return false;
    }
  }

  getCollisionInfo(){
    return {
        x: this.collisionX,
        y: this.collisionY,
        height: this.collisionHeight,
        width: this.collisionWidth
    }
  }

  showBox() {
    this.ctx.fillStyle = "rgba(255, 0, 0, 0.292)";
    this.ctx.fillRect(this.collisionX , this.collisionY , this.collisionWidth, this.collisionHeight);
  }

}
