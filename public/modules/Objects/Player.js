import { CollisionEntity } from "./CollisionEntity.js";
import { Sword } from "../Weapons/Sword.js";
import { Shield } from "../Weapons/Shield.js";
import { MediaLoader } from "../Helpers/MediaLoader.js";
import { Bow } from "../Weapons/Bow.js";
import { Bomb } from "../Weapons/Bomb.js";
import { LifePotion } from "../Weapons/LifePotion.js";
import { ClassTranslator } from "../Helpers/ClassTranslator.js";

export class Player extends CollisionEntity {
  constructor(game, playerInfo, notAdd) {
    super(game, false, playerInfo, "../assets/sprites/player/sprite.png");
    this.type = "player"
    this.kills = 0
    this.weapons = [...this.createBlankSpaces(3)];
    
    this.itemInventory = [...this.createBlankSpaces(21)]
    playerInfo.hotbar && playerInfo.hotbar.forEach((item)=>{
      new (ClassTranslator.stringToObject(item))(game, this)
    })
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
    this.maxLife = 10
    this.kills = playerInfo.kills || 0
    this.life = playerInfo.life;
    this.immuneFrom = false;
    this.canChangeDirection = true
    this.inventory = { arrow: {current: 10, limit: 50}, bomb: {current: 10, limit: 30} }
    this.lifeBar = MediaLoader.getImage("../assets/sprites/misc/lifebar.png", 30,10)
    if (!notAdd) this.game.addToGame(this);
    if (this.game.devMode) console.log("Player created");
    this.draw();
    this.animate();
    if(!playerInfo.hotbar){new Sword(game, this);
    new Shield(game, this);
    new Bow(game, this)
    new Bomb(game, this)
    new LifePotion(game, this)}
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
      inventory: this.inventory,
      kills: this.kills
    };
  }

  getHotbarInfo(){
    return this.weapons.map((item)=>item.type)
  }

  addItem(item, amount){
    if(this.inventory[item].current+amount < this.inventory[item].limit){this.inventory[item].current += amount} else {this.inventory[item].current = this.inventory[item].limit}
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
      if (this.canTakeDamage) {
        clearInterval(blinkAnimation);
        this.blinkState = true;
        this.isYourPlayer() && this.game.connection.emitMovement();
      }
    });
  }

  respawn() {
    this.life = this.maxLife;
    this.changePos({
      x: this.game.spawn.x,
      y: this.game.spawn.y,
      direction: "down",
    });
  }

  die(killerId){
    killerId && killerId!=this.id && this.game.connection.emitKill(killerId)
    this.respawn()
  }

  startImmunity(time) {
    this.canTakeDamage = false;
    // this.canMove = false;
    setTimeout(() => {
      this.canTakeDamage = true;
      // this.canMove = true;
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

  takeDamage(amount, knockback, direction, ignoreImmunity, killerId) {
    if (this.canTakeDamage && (this.immuneFrom != direction || ignoreImmunity)) {
      this.startImmunity(1000);
      this.startBlinking();
      if (this.life - amount > 0) {
        this.life -= amount;
        if (knockback) this.takeKnockbackTo(knockback, direction, 10);
      } else {
        this.life = 0;
        this.die(killerId)
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
      this.y - 8 + this.game.cameraPositionY,
      45/this.maxLife * this.life,
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
    this.ctx.fillStyle = "black"
    this.ctx.font = "8px PixelArt"
    this.ctx.fillText(this.life+"/"+this.maxLife, 
    this.x + this.game.cameraPositionX +10,
    this.y + this.game.cameraPositionY-2,
    )
  }

  #drawText() {
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.447)";
    this.ctx.font = "bolder 12px PixelArt";
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
    if(this.countUsedSlots(this.weapons)<3){
      this.weapons[this.findEmptySlot(this.weapons)] = weapon;} 
    else {this.itemInventory[this.findEmptySlot(this.itemInventory)] = weapon}
  }

  removeWeapon(weapon){
    let hotbarIndx = this.weapons.findIndex((item)=>item == weapon)
    let inventoryIndx = this.itemInventory.findIndex((item)=>item == weapon)
    if(hotbarIndx != -1){
      this.weapons[hotbarIndx] = {}
    } else if (inventoryIndx != -1){
      this.itemInventory[inventoryIndx] = {}
    }
  }
  createBlankSpaces(amount){
    let blankSpaces = [];
    for (let i=0; i<amount; i++) blankSpaces.push({})
    return blankSpaces
  }
  countUsedSlots(inventory){
    return inventory.filter((item)=>Object.keys(item)!=0).length
  }
  findEmptySlot(inventory){
    return inventory.findIndex((item)=>Object.keys(item)==0)
  }
}
