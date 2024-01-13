const uuidv4 = require("./uuidv4.js");

function loadMap(filename){
    return require(`./maps/${filename}.js`)(uuidv4())
}

module.exports = loadMap