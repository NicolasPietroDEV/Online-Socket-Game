import { CollisionEntity } from "./CollisionEntity.js";

export class Player extends CollisionEntity {
  constructor(game, playerInfo, notAdd) {
    super(game, false)
    this.game = game;
    this.ctx = this.game.ctx;
    this.directionMapping = {
        "w": 4,
        "s": 2,
        "a": 3,
        "d": 1
      }
    this.id = playerInfo.id;
    this.x = playerInfo.x;
    this.y = playerInfo.y;
    this.width = playerInfo.width;
    this.height = playerInfo.height;
    this.direction = playerInfo.direction;
    this.speed = playerInfo.speed;
    this.color = playerInfo.color;
    this.name = playerInfo.name;
    this.spriteImg = new Image(200,200);
    this.spriteImg.src = "../assets/sprite.png";
    if(!notAdd)this.game.entities.push(this)
    if(this.game.devMode)console.log("Player created");
    this.draw();
  }

  /**
     * @param {number} newX
     */
  set setX(newX){
    this.remove()  
    this.x = newX
    this.game.removeAll()
    this.game.drawAll()
    this.draw()
  }

  /**
     * @param {number} newY
     */
  set setY(newY){
    this.remove()
    this.y = newY
    this.game.removeAll()
    this.game.drawAll()
    this.draw()
  }

  /**
     * @param {string} newDirection
     */
  set setDirection(newDirection){
    this.remove()
    this.direction = newDirection
    this.game.removeAll()
    this.game.drawAll()
    this.draw()
  }

  draw() {
    this.#drawText();
    this.#drawSprite();
    if(this.game.devMode)this.showBox()
  }

  remove() {
    this.#clearText();
    this.#clearSprite()
  }

  update(){
    this.remove()
    this.draw()
  }

  changePos(info){
    this.x = info.x;
    this.y = info.y
    this.direction = info.direction
  }

  getPlayerInfo(){
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
    }
  }

  #drawSprite() {
    this.ctx.drawImage(
      this.spriteImg,
      50 + 113 * (this.directionMapping[this.direction] - 1),
      30,
      100,
      160,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  #drawText() {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.447)";
    this.ctx.font = "bolder 12px Arial";
    this.ctx.fillRect(
      this.x + this.width / 2 - this.ctx.measureText(this.name).width / 2,
      this.y - 14,
      this.ctx.measureText(this.name).width,
      12
    );
    this.ctx.fillStyle = this.color;
    this.ctx.fillText(
      this.name,
      this.x + this.width / 2 - this.ctx.measureText(this.name).width / 2,
      this.y - 4
    );
  }

  #clearSprite() {
    this.ctx.clearRect(this.x, this.y, this.width, this.height);
  }

  #clearText() {
    this.ctx.font = "bolder 12px Arial";
    this.ctx.clearRect(
      this.x + this.width / 2 - this.ctx.measureText(this.name).width / 2 - 1,
      this.y - 14,
      this.ctx.measureText(this.name).width + 2,
      12
    );
  }

  
}
