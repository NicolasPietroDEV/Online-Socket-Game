export class MediaLoader {
    static playSound(filename){
        return (new Audio(filename)).play()
    }

    static getImage(filename, width, height){
        let image = new Image(width, height);
        image.src = filename;
        return image
    }
}