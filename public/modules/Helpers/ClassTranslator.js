import { Bomb } from "../Weapons/Bomb.js";
import { Bow } from "../Weapons/Bow.js";
import { LifePotion } from "../Weapons/LifePotion.js";
import { Shield } from "../Weapons/Shield.js";
import { Sword } from "../Weapons/Sword.js";
import { Jar } from "../Objects/Jar.js"
import { Tree } from "../Objects/Tree.js"
import { Wall } from "../Objects/Wall.js"
import { House } from "../Objects/House.js"
import { Mob } from "../Objects/Mob.js"

export class ClassTranslator {
    static weapons = {
        "sword": Sword,
        "bomb": Bomb,
        "bow": Bow,
        "shield": Shield,
        "life_potion": LifePotion,
    }

    static entity = {
        "wall": Wall,
        "jar": Jar,
        "tree": Tree,
        "house": House,
        "mob": Mob
    }
    
    static stringToObject(name, type){
        if(type == "entity"){
            return ClassTranslator.entity[name]
        } else {
            return ClassTranslator.weapons[name]
        }
        
    }

    
    
}
