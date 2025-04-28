/**
 * Main game class that manages the game state, game loop, and game screens.
 * @class
 */
class Game {
  /**
   * Creates a new Game instance.
   * @constructor
   */
  constructor() {
    this.world = null;
    this.gameOver = false;
    this.victory = false;
    this.soundManager = new SoundManager();
    this.victoryScreenShown = false;
    this.gameOverScreenShown = false;
  }

  /**
   * Sets the world instance and links the sound manager.
   * @param {World} world - The world instance to be set.
   */
  setWorld(world) {
    this.world = world;
    this.world.soundManager = this.soundManager;
  }

  /**
   * Main game loop that checks the game state and requests the next animation frame.
   */
  gameLoop() {
    this.checkGameState();
    requestAnimationFrame(() => this.gameLoop());
  }

  /**
   * Checks the current game state and triggers appropriate handlers.
   */
  checkGameState() {
    if (this.isGameOver()) {
      this.handleGameOver();
    } else if (this.isVictory()) {
      this.handleVictory();
    }
  }

  /**
   * Checks if the game over conditions are met.
   * @returns {boolean} - True if game over conditions are met, false otherwise.
   */
  isGameOver() {
    return (
      this.gameOver && this.world.character && this.world.character.isDead()
    );
  }

  /**
   * Checks if the victory conditions are met.
   * @returns {boolean} - True if victory conditions are met, false otherwise.
   */
  isVictory() {
    return this.victory && this.world.endboss && this.world.endboss.isDead;
  }

  /**
   * Handles the game over state and shows the game over screen after animation.
   */
  handleGameOver() {
    if (!this.gameOverScreenShown) {
      this.gameOverScreenShown = true;
      const animationDuration = this.world.character.IMAGES_DEAD.length * 200;
      setTimeout(() => this.showGameOverScreen(), animationDuration);
    }
  }

  /**
   * Handles the victory state and shows the victory screen after animation.
   */
  handleVictory() {
    if (!this.victoryScreenShown) {
      this.victoryScreenShown = true;
      const animationDuration = this.world.endboss.IMAGES_DEAD.length * 200;
      setTimeout(() => this.showVictoryScreen(), animationDuration);
    }
  }

  /**
   * Shows the game over screen and stops the game.
   */
  showGameOverScreen() {
    this.stopGame();
    this.playGameOverSound();
    document.getElementById("game-over-screen").style.display = "flex";
  }

  /**
   * Shows the victory screen and stops the game.
   */
  showVictoryScreen() {
    this.stopGame();
    document.getElementById("victory-screen").style.display = "flex";
  }

  /**
   * Stops all game intervals and animations.
   */
  stopGame() {
    clearInterval(this.world.gameInterval);
    cancelAnimationFrame(this.world.animationFrame);
    this.stopAllAnimations();
  }

  /**
   * Stops all character and enemy animations.
   */
  stopAllAnimations() {
    this.world.character.stopAnimation();
    this.world.level.enemies.forEach((enemy) => {
      if (enemy.stopAnimation) enemy.stopAnimation();
      if (enemy.stopMovement) enemy.stopMovement();
    });
  }

  /**
   * Plays the game over sound and stops background music.
   */
  playGameOverSound() {
    this.soundManager.playSound("gameOver");
    this.soundManager.stopBackgroundMusic();
  }

  /**
   * Checks if the victory conditions are met and updates the victory state.
   */
  checkVictory() {
    if (this.world && this.world.endboss && this.world.endboss.isDead) {
      this.victory = true;
    }
  }
}

/**
 * Global canvas element.
 * @type {HTMLCanvasElement}
 */
let canvas;

/**
 * Global world instance.
 * @type {World}
 */
let world;

/**
 * Global keyboard input handler.
 * @type {Keyboard}
 */
let keyboard = new Keyboard();

/**
 * Global game instance.
 * @type {Game}
 */
let game;

/**
 * Initializes the game by creating necessary instances and starting the game loop.
 */
function init() {
  canvas = document.getElementById("canvas");
  game = new Game();
  world = new World(canvas, keyboard, game);
  game.setWorld(world);
  game.gameLoop();
}

/**
 * Event listener for keydown events to update keyboard state.
 * @param {KeyboardEvent} e - The keyboard event.
 */
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

/**
 * Event listener for keyup events to update keyboard state.
 * @param {KeyboardEvent} e - The keyboard event.
 */
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

/**
 * Restarts the game by resetting all game states and initializing a new game.
 */
function restartGame() {
  if (world) {
    if (world.gameInterval) {
      clearInterval(world.gameInterval);
    }
    if (world.animationFrame) {
      cancelAnimationFrame(world.animationFrame);
    }
  }

  document.getElementById("game-over-screen").style.display = "none";
  document.getElementById("victory-screen").style.display = "none";

  world = null;
  canvas = null;

  init();

  const soundBtn = document.getElementById("soundToggleBtn");
  const isMuted = soundBtn.textContent === "🔇";

  if (game && game.soundManager) {
    game.soundManager.isMuted = isMuted;
    if (!isMuted) {
      game.soundManager.startBackgroundMusic();
    }
  }
}

/**
 * Starts the game by hiding the start screen and initializing the game.
 */
function startGame() {
  if (window.gameStarted) return;
  window.gameStarted = true;

  document.getElementById("start-screen").style.display = "none";
  init();

  const soundBtn = document.getElementById("soundToggleBtn");
  const isMuted = soundBtn.textContent === "🔇";

  if (game && game.soundManager) {
    game.soundManager.isMuted = isMuted;
    if (!isMuted) {
      game.soundManager.startBackgroundMusic();
    }
  }
}

/**
 * Sets up mobile controls by adding touch event listeners to control buttons.
 */
function setupMobileControls() {
  const btnLeft = document.querySelector("#btn-left");
  const btnRight = document.querySelector("#btn-right");
  const btnJump = document.querySelector("#btn-jump");
  const btnThrow = document.querySelector("#btn-throw");

  if (btnLeft) {
    btnLeft.addEventListener("touchstart", () => (keyboard.LEFT = true));
    btnLeft.addEventListener("touchend", () => (keyboard.LEFT = false));
  }

  if (btnRight) {
    btnRight.addEventListener("touchstart", () => (keyboard.RIGHT = true));
    btnRight.addEventListener("touchend", () => (keyboard.RIGHT = false));
  }

  if (btnJump) {
    btnJump.addEventListener("touchstart", () => (keyboard.SPACE = true));
    btnJump.addEventListener("touchend", () => (keyboard.SPACE = false));
  }

  if (btnThrow) {
    btnThrow.addEventListener("touchstart", () => (keyboard.D = true));
    btnThrow.addEventListener("touchend", () => (keyboard.D = false));
  }
}

/**
 * Event listener for window load event to set up mobile controls.
 */
window.addEventListener("load", setupMobileControls);
