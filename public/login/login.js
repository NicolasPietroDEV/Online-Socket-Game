let nickname = document.getElementById('name');

function enter(){
    if(nickname.value){
        localStorage.setItem('name', nickname.value);
        window.location.replace("..")
    }
    
}