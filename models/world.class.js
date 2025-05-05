/**
 * Represents the game world and manages all game objects.
 * Coordinates the interactions between character, enemies, and objects.
 */
class World {
  /**
   * The main character of the game.
   * @type {Character}
   */
  character;

  /**
   * The current level with all objects.
   * @type {Level}
   */
  level;

  /**
   * The canvas element for game graphics.
   * @type {HTMLCanvasElement}
   */
  canvas;

  /**
   * The 2D context of the canvas for drawing.
   * @type {CanvasRenderingContext2D}
   */
  ctx;

  /**
   * The player's keyboard input.
   * @type {Keyboard}
   */
  keyboard;

  /**
   * The X position of the camera.
   * @type {number}
   */
  camera_x = 0;

  /**
   * The status bar for health.
   * @type {StatusBar}
   */
  statusBar;

  /**
   * The status bar for coins.
   * @type {StatusBarCoins}
   */
  statusBarCoins;

  /**
   * The status bar for bottles.
   * @type {StatusBarBottle}
   */
  statusBarBottle;

  /**
   * The status bar for the endboss.
   * @type {StatusBarEndboss}
   */
  statusBarEndboss;

  /**
   * Array of throwable objects (bottles).
   * @type {ThrowableObject[]}
   */
  throwableObjects = [];

  /**
   * Reference to the Game class.
   * @type {Game}
   */
  game;

  /**
   * The collision utility object.
   * @type {CollisionUtils}
   */
  collisionUtils;

  /**
   * Creates a new game world.
   * @param {HTMLCanvasElement} canvas - The canvas element for graphics
   * @param {Keyboard} keyboard - The keyboard input
   * @param {Game} game - The main game class
   */
  constructor(canvas, keyboard, game) {
    this.initCanvasAndInput(canvas, keyboard, game);
    this.initLevel();
    this.initStatusBars();
    this.collisionUtils = new CollisionUtils();
    this.startGame();
  }

  /**
   * Initializes canvas, context, keyboard, and game reference.
   */
  initCanvasAndInput(canvas, keyboard, game) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.game = game;
  }

  /**
   * Initializes the level and main character.
   */
  initLevel() {
    this.character = new Character();
    this.level = new Level(
      createEnemies(),
      Array.from({ length: 4 }, () => new Cloud()),
      [...level1.backgroundObjects],
      [...level1.coins],
      [...level1.bottles]
    );
  }

  /**
   * Initializes all status bars.
   */
  initStatusBars() {
    this.statusBar = new StatusBar();
    this.statusBarCoins = new StatusBarCoins();
    this.statusBarBottle = new StatusBarBottle();
    this.statusBarEndboss = new StatusBarEndboss();
  }

  /**
   * Starts the world (draw, setWorld, run).
   */
  startGame() {
    this.draw();
    this.setWorld();
    this.run();
  }

  /**
   * Draws all objects in the game world.
   */
  draw() {
    this.clearCanvas();
    this.drawBackground();
    this.drawStatusBars();
    this.drawGameObjects();
    this.checkGameStateAndRedraw();
  }

  /**
   * Clears the canvas.
   * */
  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Draws background objects and clouds.
   * */
  drawBackground() {
    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);
    this.ctx.translate(-this.camera_x, 0);
  }

  /**
   * Draws all status bars.
   */
  drawStatusBars() {
    this.addToMap(this.statusBar);
    this.addToMap(this.statusBarCoins);
    this.addToMap(this.statusBarBottle);
    this.addToMap(this.statusBarEndboss);
    this.ctx.translate(this.camera_x, 0);
  }

  /**
   * Draws character, coins, bottles, enemies, and throwable objects.
   */
  drawGameObjects() {
    this.addToMap(this.character);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);
    this.ctx.translate(-this.camera_x, 0);
  }

  /**
   * Checks collisions, victory, and schedules next frame.
   */
  checkGameStateAndRedraw() {
    this.checkCollisions();
    if (this.game && this.game.checkVictory) {
      this.game.checkVictory();
    }
    let self = this;
    this.animationFrame = requestAnimationFrame(function () {
      self.draw();
    });
  }

  /**
   * Sets the world reference for all movable objects.
   */
  setWorld() {
    this.character.world = this;
    this.endboss = new Endboss(this.statusBarEndboss, this);
    this.level.enemies.push(this.endboss);
  }

  /**
   * Starts the main game loop.
   * Regularly checks for collisions and game states.
   */
  run() {
    this.gameInterval = setInterval(() => {
      if (this.character.isDead()) {
        this.game.gameOver = true;
        return;
      }
      this.checkCollisions();
      this.checkThrowableObjects();
      if (this.level.coins?.length > 0) {
        this.checkCoinCollection();
      }
      this.checkBottleCollection();
    }, 200);
  }

  /**
   * Adds a single object to the canvas.
   * @param {DrawableObject} mo - The object to draw
   */
  addToMap(mo) {
    if (mo.otherDirection) {
      this.flipImage(mo);
    }

    mo.draw(this.ctx);
    mo.drawFrame(this.ctx);

    if (mo.otherDirection) {
      this.flipImageBack(mo);
    }
  }

  /**
   * Adds multiple objects to the canvas.
   * @param {DrawableObject[]} objects - Array of objects to draw
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  /**
   * Flips an image horizontally.
   * @param {DrawableObject} mo - The object to flip
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Resets the original image orientation.
   * @param {DrawableObject} mo - The object
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  /**
   * Checks for collisions between objects.
   */
  checkCollisions() {
    if (this.collisionUtils.checkStompOnEnemies(this)) return;
    if (this.character.justStomped) return;
    this.collisionUtils.checkSideCollisionOnEnemies(this);
  }

  /**
   * Checks and updates the state of throwable objects.
   */
  checkThrowableObjects() {
    if (this.keyboard.D && this.character.collectedBottles > 0) {
      let throwDirection = this.character.otherDirection ? -1 : 1;
      let bottle = new ThrowableObject(
        this.character.x + (throwDirection === 1 ? 100 : -10),
        this.character.y + 130,
        throwDirection
      );
      bottle.speedX = 13 * throwDirection;
      this.throwableObjects.push(bottle);
      this.character.collectedBottles--;
      this.statusBarBottle.setPrecentage(
        (this.character.collectedBottles / 5) * 100
      );
    }
  }

  /**
   * Checks for coin collection.
   */
  checkCoinCollection() {
    if (!this.level.coins?.length) return;
    this.character.collectedCoins =
      (this.character.collectedCoins || 0) +
      this.level.coins.reduce(
        (count, coin) => (this.character.isColliding(coin) ? count + 1 : count),
        0
      );
    this.level.coins = this.level.coins.filter(
      (coin) => !this.character.isColliding(coin)
    );
    this.statusBarCoins.setPrecentage(
      Math.min((this.character.collectedCoins / 5) * 100, 100)
    );
  }

  /**
   * Checks for bottle collection.
   */
  checkBottleCollection() {
    if (!this.level.bottles?.length) return;

    if (this.character.collectedBottles < 5) {
      this.level.bottles = this.level.bottles.filter((bottle) => {
        if (this.character.isColliding(bottle)) {
          this.character.collectedBottles++;
          this.statusBarBottle.setPrecentage(
            (this.character.collectedBottles / 5) * 100
          );
          return false;
        }
        return true;
      });
    }
  }

  /**
   * Handles the collision between character and enemy.
   * @param {MovableObject} enemy - The hit enemy
   */
  handleStompCollision(enemy) {
    enemy.hit();
    if (this.character.speedY >= 0) {
      this.character.speedY = -5;
    }
    enemy.isDead = true;
    enemy.ignoreCollisions = true;

    this.character.justStomped = true;
    setTimeout(() => {
      this.character.justStomped = false;
    }, 300);
  }

  /**
   * Handles the character's hit.
   */
  handleSideCollision() {
    if (!this.character.isHurt()) {
      this.character.hit();
      this.statusBar.setPrecentage(this.character.energy);
    }
  }
}
