import { Game } from "./modules/Game.js";

let nickname = localStorage.getItem("name");
if (!nickname) {
  window.location.replace("/login");
}

let campo = document.getElementById("campomensagem");
let botao = document.getElementById("botaomensagem");
let login = document.getElementById("login");
let chat = document.getElementById("messages");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
var stylew = window.getComputedStyle(canvas);
canvas.width = parseInt(stylew.width.substring(0, stylew.width.search("px")));
canvas.height = parseInt(
  stylew.height.substring(0, stylew.height.search("px"))
);
var GameInstance;

campo.addEventListener("keypress", (event) => {
  enterMessage(event);
});

botao.addEventListener("click", sendMessage);

login.addEventListener("click", goToLogin);

window.addEventListener("resize", adjustCanvas);

function OnStart() {
  GameInstance = new Game(ctx, canvas, chat);
}

function adjustCanvas() {
  stylew = window.getComputedStyle(canvas);
  canvas.width = parseInt(stylew.width.substring(0, stylew.width.search("px")));
  canvas.height = parseInt(
    stylew.height.substring(0, stylew.height.search("px"))
  );
  GameInstance.refreshGame()
}

function sendMessage() {
  if (campo.value == "/devmode") {
    GameInstance.turnDevMode()
    campo.value = "";
    return;
  }
  if (campo.value) {
    GameInstance.connection.emitMessage({
      color: GameInstance.mainPlayer.color,
      message: campo.value,
      name: GameInstance.mainPlayer.name,
    });

    campo.value = "";
  }
}

function enterMessage(event) {
  if (event.key == "Enter") sendMessage();
}

function goToLogin() {
  window.location.replace("/login");
}

window.onload = OnStart;
