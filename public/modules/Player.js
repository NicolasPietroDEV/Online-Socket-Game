import { CollisionEntity } from "./CollisionEntity.js";

export class Player extends CollisionEntity {
  constructor(game, playerInfo, notAdd) {
    super(game, false)
    this.game = game;
    this.ctx = this.game.ctx;
    this.directionMapping = {
        "w": 0,
        "a": 1,
        "s": 2,
        "d": 3
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
    this.isMoving = false;
    this.frame = 1
    this.spriteImg = new Image(200,200);
    this.spriteImg.src = "../assets/sprite.png";
    if(!notAdd)this.game.entities.push(this)

    if(this.game.devMode)console.log("Player created");
    this.draw();
    this.animate()
  }

  /**
     * @param {number} newX
     */
  set setX(newX){
    // this.remove()  
    this.x = newX
    // this.game.removeAll()
    this.game.drawAll()
  }

  /**
     * @param {number} newY
     */
  set setY(newY){
    // this.remove()
    this.y = newY
    // this.game.removeAll()
    this.game.drawAll()
  }

  /**
     * @param {string} newDirection
     */
  set setDirection(newDirection){
    // this.remove()
    this.direction = newDirection
    // this.game.removeAll()
    this.game.drawAll()
  }

  get collisionY(){
    return this.y + (this.height/2)
  }

  get collisionHeight(){
    return this.height/2
  }

  get collisionX(){
    return this.x + (this.width/4)
  }

  get collisionWidth(){
    return this.width/2
  }

  draw() {
    this.#drawText();
    this.#drawSprite();
    if(this.game.devMode)this.showBox()
  }

  // remove() {
  //   this.#clearText();
  //   this.#clearSprite()
  // }

  update(){
    this.draw()
  }

  changePos(info){
    this.x = info.x;
    this.y = info.y
    this.direction = info.direction
    this.isMoving = info.isMoving
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
        isMoving: this.isMoving
    }
  }

  animate(){
    let animation = setInterval(()=>{
        if((this.frame+1>3) || !this.isMoving) {this.frame=0} else this.frame++
      
    }, 300)
    
  }

  #drawSprite() {
    // this.ctx.drawImage(
    //   this.spriteImg,
    //   50 + 113 * (this.directionMapping[this.direction] - 1),
    //   30,
    //   100,
    //   160,
    //   this.x,
    //   this.y,
    //   this.width,
    //   this.height
    // );
    this.ctx.drawImage(
      this.spriteImg,
      this.frame*48,
      (this.directionMapping[this.direction]*(68)),
      48,
      67,
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
