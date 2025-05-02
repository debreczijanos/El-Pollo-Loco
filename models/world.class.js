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
   * Creates a new game world.
   * @param {HTMLCanvasElement} canvas - The canvas element for graphics
   * @param {Keyboard} keyboard - The keyboard input
   * @param {Game} game - The main game class
   */
  constructor(canvas, keyboard, game) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.game = game;

    this.character = new Character();
    this.level = new Level(
      createEnemies(),
      Array.from({ length: 4 }, () => new Cloud()),
      [...level1.backgroundObjects],
      [...level1.coins],
      [...level1.bottles]
    );

    this.statusBar = new StatusBar();
    this.statusBarCoins = new StatusBarCoins();
    this.statusBarBottle = new StatusBarBottle();
    this.statusBarEndboss = new StatusBarEndboss();

    this.draw();
    this.setWorld();
    this.run();
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
   * Draws all objects in the game world.
   */
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);
    this.addObjectsToMap(this.level.clouds);

    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar);
    this.addToMap(this.statusBarCoins);
    this.addToMap(this.statusBarBottle);
    this.addToMap(this.statusBarEndboss);
    this.ctx.translate(this.camera_x, 0);

    this.addToMap(this.character);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);
    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);

    this.ctx.translate(-this.camera_x, 0);

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
    if (this.checkStompOnEnemies()) return;
    if (this.character.justStomped) return;
    this.checkSideCollisionOnEnemies();
  }

  checkStompOnEnemies() {
    for (let enemy of this.level.enemies) {
      if (this.shouldStompEnemy(enemy)) {
        this.handleStompCollision(enemy);
        return true;
      }
    }
    return false;
  }

  shouldStompEnemy(enemy) {
    if (enemy.isDead || !(enemy instanceof Chicken)) return false;
    const { charFeet, enemyMiddle, isHorizontal } =
      this.getCollisionParams(enemy);
    return charFeet < enemyMiddle && isHorizontal && this.character.speedY >= 0;
  }

  checkSideCollisionOnEnemies() {
    for (let enemy of this.level.enemies) {
      if (this.shouldSideCollideWithEnemy(enemy)) {
        this.handleSideCollision();
        break;
      }
    }
  }

  shouldSideCollideWithEnemy(enemy) {
    if (enemy.isDead || !(enemy instanceof Chicken)) return false;
    const { charFeet, enemyMiddle, isHorizontal } =
      this.getCollisionParams(enemy);
    return (
      charFeet >= enemyMiddle &&
      isHorizontal &&
      this.isSideCollidingWithEnemy(
        enemy,
        this.character.y,
        this.character.y + this.character.height,
        this.character.x,
        this.character.x + this.character.width
      )
    );
  }

  getCollisionParams(enemy) {
    const a = this.character.hitbox || { top: 0, bottom: 0, left: 0, right: 0 };
    const b = enemy.hitbox || { top: 0, bottom: 0, left: 0, right: 0 };
    const charFeet = this.character.y + this.character.height - a.bottom;
    const enemyTop = enemy.y + b.top;
    const enemyBottom = enemy.y + enemy.height - b.bottom;
    const enemyMiddle = (enemyTop + enemyBottom) / 2;
    const cam = this.camera_x || 0;
    const charLeft = this.character.x + a.left + cam;
    const charRight = this.character.x + this.character.width - a.right + cam;
    const enemyLeft = enemy.x + b.left + cam;
    const enemyRight = enemy.x + enemy.width - b.right + cam;
    const overlap =
      Math.min(charRight, enemyRight) - Math.max(charLeft, enemyLeft);
    const minOverlap =
      Math.min(charRight - charLeft, enemyRight - enemyLeft) * 0.5;
    const isHorizontal = overlap > minOverlap;
    return { charFeet, enemyMiddle, isHorizontal };
  }

  /**
   * Checks for collisions between character and enemies.
   */
  isSideCollidingWithEnemy(enemy, charTop, charBottom, charLeft, charRight) {
    const enemyTop = enemy.y;
    const enemyBottom = enemy.y + enemy.height;
    const enemyLeft = enemy.x;
    const enemyRight = enemy.x + enemy.width;

    const isSmallChicken = enemy instanceof ChickenSmall;
    const widthFactor = isSmallChicken ? 0.4 : 0.2;

    return (
      this.character.isColliding(enemy) &&
      charRight > enemyLeft + enemy.width * widthFactor &&
      charLeft < enemyRight - enemy.width * widthFactor &&
      charBottom > enemyTop + enemy.height * 0.3 &&
      charTop < enemyBottom - enemy.height * 0.3
    );
  }

  /**
   * Handles the collision between character and enemy.
   * @param {MovableObject} enemy - The hit enemy
   */
  handleStompCollision(enemy) {
    enemy.hit();
    this.character.speedY = -15;
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
}
