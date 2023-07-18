let nickname = document.getElementById('name');
let room = document.getElementById('room');

nickname.value = localStorage.getItem('name');
room.value = localStorage.getItem('room');

function enter(){
    if(nickname.value){
        localStorage.setItem('name', nickname.value);
        localStorage.setItem('room', room.value || 'main')
        window.location.replace("..")
    }
    
}