import { CollisionEntity } from "./CollisionEntity.js";

export class Wall extends CollisionEntity {
    constructor(game,info){
        super(game, false)
        this.x = info.x;
        this.y = info.y;
        this.width = info.width;
        this.height = info.height;
    }
}