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

  // Victory Screen ausblenden
  document.getElementById("victory-screen").style.display = "none";

  // Level zurücksetzen
  world = null;
  canvas = null;

  // Neues Level initialisieren
  init();

  // Hintergrundmusik neu starten
  if (game && game.soundManager) {
    game.soundManager.stopBackgroundMusic();
    game.soundManager.startBackgroundMusic();
  }
}

function startGame() {
  if (window.gameStarted) return;
  window.gameStarted = true;

  document.getElementById("start-screen").style.display = "none";
  init(); // Spiel starten

  // Starte die Hintergrundmusik
  game.soundManager.startBackgroundMusic();
}

class Game {
  constructor() {
    this.world = null;
    this.gameOver = false;
    this.victory = false;
    this.soundManager = new SoundManager();
  }

  setWorld(world) {
    this.world = world;
    this.world.soundManager = this.soundManager;
  }

  gameLoop() {
    // Prüfe, ob das Spiel vorbei ist
    if (this.gameOver) {
      this.showGameOverScreen();
      return;
    }

    // Prüfe, ob der Spieler gewonnen hat
    if (this.victory) {
      this.showVictoryScreen();
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

    // Spiele Game Over Sound ab
    this.soundManager.playSound("gameOver");
    this.soundManager.stopBackgroundMusic();

    // Zeige Game Over Screen
    document.getElementById("game-over-screen").style.display = "flex";
  }

  showVictoryScreen() {
    // Stoppe alle Spiel-Intervalle
    clearInterval(this.world.gameInterval);
    cancelAnimationFrame(this.world.animationFrame);

    // Stoppe alle Bewegungen und Animationen
    this.world.character.stopAnimation();
    this.world.level.enemies.forEach((enemy) => {
      if (enemy.stopAnimation) enemy.stopAnimation();
      if (enemy.stopMovement) enemy.stopMovement();
    });

    // Zeige Victory Screen
    document.getElementById("victory-screen").style.display = "flex";
  }

  checkVictory() {
    // Prüfe, ob der Endboss besiegt wurde
    if (this.world && this.world.endboss && this.world.endboss.isDead) {
      this.victory = true;
    }
  }
}
