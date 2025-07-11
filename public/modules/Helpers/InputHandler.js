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
        let speed = this.mainPlayer.speed;
        
        // Ajusta a velocidade para movimento diagonal
        if(Object.values(this.movementHandler).filter((a)=>a).length == 2) {
            speed = Math.sqrt((speed**2)/2);
        }

        if (this.mainPlayer.canMove) {
            // Atualiza direção do jogador
            for (let key of Object.keys(this.movementHandler)) {
                if (this.movementHandler[key] && this.mainPlayer.canChangeDirection) {
                    this.mainPlayer.direction = key;
                    moved = true;
                }
            }

            let collisionInfo = this.mainPlayer.getCollisionInfo();
            let collides = this.game.checkAllCollisions(collisionInfo, true, false, ["bomb_entity", "player"]);

            // Movimento para cima
            if (this.movementHandler["up"] && 
                (!this.game.checkAllCollisions({...collisionInfo, y: collisionInfo.y - speed}) || collides)) {
                this.mainPlayer.y -= speed;
                this.game.changeCameraPosition("up", speed);
                moved = true;
            }

            // Movimento para esquerda
            if (this.movementHandler["left"] && 
                (!this.game.checkAllCollisions({...collisionInfo, x: collisionInfo.x - speed}) || collides)) {
                this.mainPlayer.x -= speed;
                this.game.changeCameraPosition("left", speed);
                moved = true;
            }

            // Movimento para baixo
            if (this.movementHandler["down"] && 
                (!this.game.checkAllCollisions({...collisionInfo, y: collisionInfo.y + speed}) || collides)) {
                this.mainPlayer.y += speed;
                this.game.changeCameraPosition("down", speed);
                moved = true;
            }

            // Movimento para direita
            if (this.movementHandler["right"] && 
                (!this.game.checkAllCollisions({...collisionInfo, x: collisionInfo.x + speed}) || collides)) {
                this.mainPlayer.x += speed;
                this.game.changeCameraPosition("right", speed);
                moved = true;
            }
        }

        // Atualiza estado de movimento do jogador
        let wasPreviouslyMoving = this.mainPlayer.isMoving;
        this.mainPlayer.isMoving = moved;
        
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
