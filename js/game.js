let canvas;
let world;
let keyboard = new Keyboard();
let game;

function init() {
  canvas = document.getElementById("canvas");
  game = new Game();
  world = new World(canvas, keyboard, game);
  game.setWorld(world);
  game.gameLoop();
}

window.addEventListener("keydown", (e) => {
  if (e.keyCode == 37) {
    keyboard.LEFT = true;
  }
  if (e.keyCode == 38) {
    keyboard.UP = true;
  }
  if (e.keyCode == 39) {
    keyboard.RIGHT = true;
  }
  if (e.keyCode == 40) {
    keyboard.DOWN = true;
  }
  if (e.keyCode == 32) {
    keyboard.SPACE = true;
  }
  if (e.keyCode == 68) {
    keyboard.D = true;
  }
});

window.addEventListener("keyup", (e) => {
  if (e.keyCode == 37) {
    keyboard.LEFT = false;
  }
  if (e.keyCode == 38) {
    keyboard.UP = false;
  }
  if (e.keyCode == 39) {
    keyboard.RIGHT = false;
  }
  if (e.keyCode == 40) {
    keyboard.DOWN = false;
  }
  if (e.keyCode == 32) {
    keyboard.SPACE = false;
  }
  if (e.keyCode == 68) {
    keyboard.D = false;
  }
});

function restartGame() {
  // Alle Intervalle und Animationen stoppen
  if (world) {
    if (world.gameInterval) {
      clearInterval(world.gameInterval);
    }
    if (world.animationFrame) {
      cancelAnimationFrame(world.animationFrame);
    }
  }

  // Game Over Screen ausblenden
  document.getElementById("game-over-screen").style.display = "none";

  // Level zurücksetzen
  world = null;
  canvas = null;

  // Neues Level initialisieren
  init();
}

function startGame() {
  if (window.gameStarted) return;
  window.gameStarted = true;

  document.getElementById("start-screen").style.display = "none";
  init(); // Spiel starten
}

class Game {
  constructor() {
    this.world = null;
    this.gameOver = false;
  }

  setWorld(world) {
    this.world = world;
  }

  gameLoop() {
    // Prüfe, ob das Spiel vorbei ist
    if (this.gameOver) {
      this.showGameOverScreen();
      return;
    }

    // Führe die Spielschleife aus
    requestAnimationFrame(() => this.gameLoop());
  }

  showGameOverScreen() {
    // Stoppe alle Spiel-Intervalle
    clearInterval(this.world.gameInterval);
    cancelAnimationFrame(this.world.animationFrame);

    // Stoppe alle Bewegungen und Animationen
    this.world.character.stopAnimation();
    this.world.level.enemies.forEach((enemy) => {
      if (enemy.stopAnimation) enemy.stopAnimation();
      if (enemy.stopMovement) enemy.stopMovement();
    });

    // Zeige Game Over Screen
    document.getElementById("game-over-screen").style.display = "flex";
  }
}
