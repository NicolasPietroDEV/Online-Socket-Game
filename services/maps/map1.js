const uuidv4 = require("../uuidv4")

function map1(){
    let map = {
    scenery: {width:1000, height: 1000},
    entities: [
    //top
    {x: 60, y: 10, width: 1000-120, height: 40, type: "wall"},
    //bottom
    {x: 60, y: 1000-120, width: 1000-120, height: 40, type: "wall"}, 
    //right
    {x: 10, y: 60, width: 40, height: 1000-180, type: "wall"},
    //left
    {x: 1000-50, y: 60, width: 40, height: 1000-180, type: "wall"},

    {x: 422, y: 30, width:150, height:228, type: "house"},
    
    {x: 200, y: 100, width:120, height: 144, type: "tree"},
    {x: 670, y: 100, width:120, height: 144, type: "tree"},

    {x: 380, y: 120, width:34, height: 41, type: "jar"},
    {x: 380, y: 170, width:34, height: 41, type: "jar"},
    {x: 580, y: 120, width:34, height: 41, type: "jar"},
    {x: 580, y: 170, width:34, height: 41, type: "jar"},

    {x: 60, y: 60, width:34, height: 41, type: "jar"},
    {x: 60, y: 820, width:34, height: 41, type: "jar"},
    {x: 900, y: 820, width:34, height: 41, type: "jar"},
    {x: 900, y: 60, width:34, height: 41, type: "jar"},
    {x: 500, y: 500, height: 50, width: 50, life: 10, canMove: true , type: "mob"},
]}

    map.entities.map((item)=>item.code = uuidv4())
    return map
}

module.exports = map1