let nickname = document.getElementById('name');
let room = document.getElementById('room');

nickname.value = localStorage.getItem('name');
room.value = localStorage.getItem('room');

document.body.addEventListener('keypress', enterKey)

function enterKey(event){
    if (event.keyCode == 13) enter()
}

function enter(){
    if(nickname.value){
        localStorage.setItem('name', nickname.value);
        localStorage.setItem('room', room.value || 'main')
        window.location.replace("..")
    }
    
}