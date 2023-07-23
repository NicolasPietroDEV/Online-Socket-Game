import { CollisionEntity } from "./CollisionEntity.js";

export class Wall extends CollisionEntity {
    constructor(game,info){
        super(game, false, info)
        this.game.entities.push(this);  
    }

    draw(){        
        if(this.game.devMode){this.showBox()}
    }

}