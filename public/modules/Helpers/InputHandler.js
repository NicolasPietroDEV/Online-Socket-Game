export class InputHandler {
  constructor(game, canvas) {
    this.game = game;
    this.movementHandler = {
      up: false,
      left: false,
      right: false,
      down: false,
    };
    this.otherKeys = {
      a: 0,
      s: 1,
      d: 2,
      menu: (state) => state && this.game.interface.openInventory(),
    };
    this.inventoryKeys = {
      up: ()=>this.handleInventoryMove("up"),
      down: ()=>this.handleInventoryMove("down"),
      left: ()=>this.handleInventoryMove("left"),
      right: ()=>this.handleInventoryMove("right"),
      a: ()=>this.selectItem("a"),
      s: ()=>this.selectItem("s"),
      d: ()=>this.selectItem("d"),
      menu: ()=>this.game.interface.openInventory()

    }
    this.translateKeys = {
      40: "down",
      37: "left",
      39: "right",
      38: "up",
      90: "z",
      88: "x",
      67: "c",
      86: "v",
      87: "w",
      65: "a",
      83: "s",
      81: "q",
      68: "d",
      77: "menu",
      13: "enter"
    };
    this.mainPlayer = this.game.mainPlayer;
    this.canvas = this.game.canvas;

    if (this.game.devMode) console.log("InputHandler started");

    canvas.addEventListener("keyup", (event) => {
      this.handleKeyPressing(this.translateKeys[event.keyCode], false);
    });

    canvas.addEventListener("keydown", (event) => {
      if(this.game.interface.inventoryOpen){this.inventoryKeys[this.translateKeys[event.keyCode]] && this.inventoryKeys[this.translateKeys[event.keyCode]]()}
      else if(!this.game.interface.inventoryOpen || ["menu", "enter"].includes(this.translateKeys[event.keyCode])){this.handleKeyPressing(this.translateKeys[event.keyCode], true)}
    });

    canvas.addEventListener("blur", () => {
      this.stopAllInputs();
    });

    window.addEventListener("keydown", (event) => {
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(event.code)
      )
        event.preventDefault();
    });

    canvas.addEventListener(
      "mousemove",
      (evt) => this.game.devMode && this.game.drawCoords(evt)
    );
  }

  startMovementChecker() {
    setInterval(() => {
      let moved = false;
      if (this.mainPlayer.canMove) {
        for (let key of Object.keys(this.movementHandler)) {
          if (this.movementHandler[key] && this.mainPlayer.canChangeDirection) {
            this.mainPlayer.direction = key;
            moved = true;
          }
        }
        let collisionInfo = this.mainPlayer.getCollisionInfo();
        let collides = this.game.checkAllCollisions(collisionInfo, true, false, ["bomb_entity", "player"])
        if (
          this.movementHandler["up"] &&
          (!this.game.checkAllCollisions({
            ...collisionInfo,
            y: collisionInfo.y - this.mainPlayer.speed,
          })|| collides) 
        ) {
          this.mainPlayer.y -= this.mainPlayer.speed;
          if (
            this.game.cameraPositionY < 0 &&
            this.game.mainPlayer.y + this.game.cameraPositionY <
              this.game.canvas.height / 2 - this.mainPlayer.height / 2
          )
            this.game.cameraPositionY += this.mainPlayer.speed;
          moved = true;
        }
        if (
          this.movementHandler["left"] &&
          (!this.game.checkAllCollisions({
            ...collisionInfo,
            x: collisionInfo.x - this.mainPlayer.speed,
          })||collides)
        ) {
          this.mainPlayer.x -= this.mainPlayer.speed;
          if (
            this.game.cameraPositionX < 0 &&
            this.game.mainPlayer.x + this.game.cameraPositionX <
              this.game.canvas.width / 2 - this.mainPlayer.width / 2
          )
            this.game.cameraPositionX += this.mainPlayer.speed;
          moved = true;
        }
        if (
          this.movementHandler["down"] &&
          (!this.game.checkAllCollisions({
            ...collisionInfo,
            y: collisionInfo.y + this.mainPlayer.speed,
          })||collides)
        ) {
          this.mainPlayer.y += this.mainPlayer.speed;
          if (
            -this.game.cameraPositionY < this.game.canvas.height &&
            this.game.mainPlayer.y >
              this.game.canvas.height / 2 - this.mainPlayer.height / 2
          )
            this.game.cameraPositionY -= this.mainPlayer.speed;
          moved = true;
        }
        if (
          this.movementHandler["right"] &&
          (!this.game.checkAllCollisions({
            ...collisionInfo,
            x: collisionInfo.x + this.mainPlayer.speed,
          })||collides)
        ) {
          this.mainPlayer.x += this.mainPlayer.speed;
          if (
            -this.game.cameraPositionX < this.game.canvas.width &&
            this.game.mainPlayer.x >
              this.game.canvas.width / 2 - this.mainPlayer.width / 2
          )
            this.game.cameraPositionX -= this.mainPlayer.speed;
          moved = true;
        }
      }
      let wasPreviouslyMoving = this.mainPlayer.isMoving;
      if (moved) {
        this.mainPlayer.isMoving = true;
      } else {
        this.mainPlayer.isMoving = false;
      }
      
      if (wasPreviouslyMoving || this.mainPlayer.isMoving) {
        this.game.connection.emitMovement();
      }
      this.game.refreshEntities();
    }, 20);
  }

  stopAllInputs() {
    for (let input of Object.keys(this.movementHandler)) {
      this.movementHandler[input] = false;
    }
  }

  // OTIMIZAR //
  useKey(index, state) {
    if (state && this.game.mainPlayer.weapons[index].use) {
      this.game.mainPlayer.weapons[index].use();
      this.game.connection.emitWeaponUsed(index, true);
    } else if (this.game.mainPlayer.weapons[index].stop) {
      this.game.mainPlayer.weapons[index].stop();
      this.game.connection.emitWeaponUsed(index, false);
    }
  }

  handleKeyPressing(input, state) {
    if (Object.keys(this.movementHandler).includes(input)) {
      this.movementHandler[input] = state;
    } else if (
      Object.keys(this.otherKeys).includes(input) &&
      typeof this.otherKeys[input] == "number"
    ) {
      this.useKey(this.otherKeys[input], state);
    } else if (
      this.otherKeys[input] &&
      typeof this.otherKeys[input] != "number"
    ) {
      this.otherKeys[input](state);
    }
  }

  handleInventoryMove(input){
    switch (input){
      case "up":
        if(this.game.interface.pointerPos.slotY - 1>=0)this.game.interface.pointerPos.slotY -= 1
        break
      case "down":
        if(this.game.interface.pointerPos.slotY + 1<=2)this.game.interface.pointerPos.slotY += 1
        break
      case "left":
        if(this.game.interface.pointerPos.slotX - 1>=0)this.game.interface.pointerPos.slotX -= 1
        break
      case "right":
        if(this.game.interface.pointerPos.slotX + 1<=6)this.game.interface.pointerPos.slotX += 1
        break
    }
  }

  selectItem(key){
    this.game.interface.selectItem(key)
  }
}
