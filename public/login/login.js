let nickname = document.getElementById('name');
let room = document.getElementById('room');
let roomsDatalist = document.getElementById('rooms');


window.onload = setup

async function createList(){
    let roomsList = await (await fetch("/rooms")).json()
    list = ""
    for (roomOption of roomsList){
        list += `<option value="${roomOption.name}">`
    }
    roomsDatalist.innerHTML += list
}

function setup(){
    createList().then(()=>{
        nickname.value = localStorage.getItem('name');
        room.value = localStorage.getItem('room');
    })
}




document.body.addEventListener('keypress', enterKey)

function enterKey(event){
    if (event.keyCode == 13) enter()
}

function enter(){
    if(nickname.value){
        localStorage.setItem('name', nickname.value);
        console.log(room)
        localStorage.setItem('room', room.value || 'main')
        window.location.replace("..")
    }
    
}

