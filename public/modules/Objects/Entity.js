export class Entity {
    constructor(game, info){
        this.priorize = false
        this.game = game;
        this.ctx = this.game.ctx;
        this.x = info.x
        this.y = info.y
        this.height = info.height
        this.width = info.width
    }

    drawSprite(x, y, width, height) {
        this.ctx.drawImage(
          this.spriteImg,
          x,
          y,
          width,
          height,
          this.x + this.game.cameraPositionX,
          this.y + this.game.cameraPositionY,
          this.width,
          this.height
        );
        if (this.game.devMode) {
          this.showBox();
        }
      }
}