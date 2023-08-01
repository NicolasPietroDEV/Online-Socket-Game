import { MediaLoader } from "../Helpers/MediaLoader.js";

export class Entity {
    constructor(game, info, spriteImg){
        this.game = game;
        this.ctx = this.game.ctx;
        this.x = info.x
        this.y = info.y
        this.height = info.height
        this.width = info.width
        if(spriteImg)this.spriteImg = MediaLoader.getImage(spriteImg);
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