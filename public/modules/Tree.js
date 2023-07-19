import { CollisionEntity } from "./CollisionEntity.js";

export class Tree extends CollisionEntity {
  constructor(game, info) {
    super(game, false, info);
    this.game = game;
    this.ctx = this.game.ctx;
    this.spriteImg = new Image(42, 51);
    this.spriteImg.src = "../assets/tree.png";
    this.game.addToGame(this);
  }

  get collisionY() {
    return this.y + this.game.cameraPositionY + this.height / 2;
  }

  get collisionHeight() {
    return this.height / 2.3;
  }

  get collisionX() {
    return this.x + this.game.cameraPositionX + this.width / 7;
  }

  get collisionWidth() {
    return (this.width * 5) / 7;
  }

  draw() {
    this.drawSprite(1, 1, 40, 48);
  }
}
