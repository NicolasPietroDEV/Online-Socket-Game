import { Bomb } from "../Weapons/Bomb.js";
import { Bow } from "../Weapons/Bow.js";
import { LifePotion } from "../Weapons/LifePotion.js";
import { Shield } from "../Weapons/Shield.js";
import { Sword } from "../Weapons/Sword.js";


export class ClassTranslator {
    static relation = {
        "sword": Sword,
        "bomb": Bomb,
        "bow": Bow,
        "shield": Shield,
        "life_potion": LifePotion
    }
    
    static stringToObject(name){
        return ClassTranslator.relation[name]
    }

    
    
}
