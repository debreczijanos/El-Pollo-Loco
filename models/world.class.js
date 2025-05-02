/**
 * Repräsentiert die Spielwelt und verwaltet alle Spielobjekte.
 * Koordiniert die Interaktionen zwischen Charakter, Gegnern und Objekten.
 */
class World {
  /**
   * Der Hauptcharakter des Spiels.
   * @type {Character}
   */
  character;

  /**
   * Das aktuelle Level mit allen Objekten.
   * @type {Level}
   */
  level;

  /**
   * Das Canvas-Element für die Spielgrafik.
   * @type {HTMLCanvasElement}
   */
  canvas;

  /**
   * Der 2D-Kontext des Canvas für das Zeichnen.
   * @type {CanvasRenderingContext2D}
   */
  ctx;

  /**
   * Die Tastatureingaben des Spielers.
   * @type {Keyboard}
   */
  keyboard;

  /**
   * Die X-Position der Kamera.
   * @type {number}
   */
  camera_x = 0;

  /**
   * Die Statusleiste für die Gesundheit.
   * @type {StatusBar}
   */
  statusBar;

  /**
   * Die Statusleiste für die Münzen.
   * @type {StatusBarCoins}
   */
  statusBarCoins;

  /**
   * Die Statusleiste für die Flaschen.
   * @type {StatusBarBottle}
   */
  statusBarBottle;

  /**
   * Die Statusleiste für den Endboss.
   * @type {StatusBarEndboss}
   */
  statusBarEndboss;

  /**
   * Array von werfbaren Objekten (Flaschen).
   * @type {ThrowableObject[]}
   */
  throwableObjects = [];

  /**
   * Referenz auf die Game-Klasse.
   * @type {Game}
   */
  game;

  /**
   * Erstellt eine neue Spielwelt.
   * @param {HTMLCanvasElement} canvas - Das Canvas-Element für die Grafik
   * @param {Keyboard} keyboard - Die Tastatureingaben
   * @param {Game} game - Die Hauptspielklasse
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
   * Setzt die Welt-Referenz für alle beweglichen Objekte.
   */
  setWorld() {
    this.character.world = this;
    this.endboss = new Endboss(this.statusBarEndboss, this);
    this.level.enemies.push(this.endboss);
  }

  /**
   * Startet die Hauptspielschleife.
   * Überprüft regelmäßig Kollisionen und Spielzustände.
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
   * Zeichnet alle Objekte der Spielwelt.
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
   * Fügt ein einzelnes Objekt zur Zeichenfläche hinzu.
   * @param {DrawableObject} mo - Das zu zeichnende Objekt
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
   * Fügt mehrere Objekte zur Zeichenfläche hinzu.
   * @param {DrawableObject[]} objects - Array von zu zeichnenden Objekten
   */
  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

  /**
   * Spiegelt ein Bild horizontal.
   * @param {DrawableObject} mo - Das zu spiegelnde Objekt
   */
  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  /**
   * Stellt die ursprüngliche Bildausrichtung wieder her.
   * @param {DrawableObject} mo - Das Objekt
   */
  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

  /**
   * Überprüft die Kollisionen zwischen Objekten.
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
   * Überprüft Kollisionen zwischen Charakter und Gegnern.
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
   * Behandelt die Kollision zwischen Charakter und Gegner.
   * @param {MovableObject} enemy - Der getroffene Gegner
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
   * Behandelt den Treffer des Charakters.
   */
  handleSideCollision() {
    if (!this.character.isHurt()) {
      this.character.hit();
      this.statusBar.setPrecentage(this.character.energy);
    }
  }

  /**
   * Überprüft und aktualisiert den Zustand der werfbaren Objekte.
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
   * Überprüft das Einsammeln von Münzen.
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
   * Überprüft das Einsammeln von Flaschen.
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
