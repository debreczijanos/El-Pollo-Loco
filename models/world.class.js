class World {
  character = new Character();
  level = level1;
  canvas;
  ctx;
  keyboard;
  camera_x = 0;
  statusBar = new StatusBar();
  statusBarCoins = new StatusBarCoins();
  statusBarBottle = new StatusBarBottle();
  statusBarEndboss = new StatusBarEndboss();
  throwableObjects = [];

  constructor(canvas, keyboard) {
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;
    this.keyboard = keyboard;
    this.draw();
    this.setWorld();
    this.run();
  }

  setWorld() {
    this.character.world = this;
    this.endboss = new Endboss(this.statusBarEndboss, this);
    this.level.enemies.push(this.endboss);
  }

  run() {
    this.gameInterval = setInterval(() => {
      if (this.character.isDead()) {
        this.showGameOverScreen();
        return;
      }
      this.checkCollisions();
      this.checkThrowableObjects();
      // Nur ausführen, wenn es noch Münzen gibt
      if (this.level.coins?.length > 0) {
        this.checkCoinCollection();
      }
      this.checkBottleCollection(); // Hier wird geprüft, ob Bottles gesammelt werden
    }, 200);
  }

  checkCollisions() {
    const charBottom = this.character.y + this.character.height;
    this.level.enemies.forEach((enemy) => {
      if (enemy.isDead || !(enemy instanceof Chicken)) return;

      const enemyTop = enemy.y;
      const stompFromAbove =
        this.character.isColliding(enemy) &&
        this.character.speedY >= 0 &&
        charBottom <= enemyTop + enemy.height * 0.6;

      if (stompFromAbove) {
        enemy.hit();
        this.character.speedY = -15;
      } else if (this.character.isColliding(enemy)) {
        if (!this.character.isHurt()) {
          this.character.hit();
          this.statusBar.setPrecentage(this.character.energy);
        }
      }
    });
  }

  checkThrowableObjects() {
    if (this.keyboard.D && this.character.collectedBottles > 0) {
      let throwDirection = this.character.otherDirection ? -1 : 1;
      let bottle = new ThrowableObject(
        this.character.x + (throwDirection === 1 ? 100 : -10),
        this.character.y + 130,
        throwDirection
      );
      bottle.speedX = 13 * throwDirection; // Damit sich die Flasche in die richtige Richtung bewegt
      this.throwableObjects.push(bottle);
      this.character.collectedBottles--; // Nach dem Werfen eine Bottle abziehen

      // Statusbar aktualisieren
      this.statusBarBottle.setPrecentage(
        (this.character.collectedBottles / 5) * 100
      );
    }
  }

  showGameOverScreen() {
    clearInterval(this.gameInterval); // stoppe das Spiel
    cancelAnimationFrame(this.animationFrame); // stoppe das Zeichnen
    document.getElementById("game-over-screen").style.display = "flex";
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.translate(this.camera_x, 0);
    this.addObjectsToMap(this.level.backgroundObjects);

    this.ctx.translate(-this.camera_x, 0);
    this.addToMap(this.statusBar);
    this.addToMap(this.statusBarCoins);
    this.addToMap(this.statusBarBottle);
    this.addToMap(this.statusBarEndboss);
    this.ctx.translate(this.camera_x, 0);

    this.addToMap(this.character);
    this.addObjectsToMap(this.level.clouds);
    this.addObjectsToMap(this.level.coins);
    this.addObjectsToMap(this.level.bottles);

    this.addObjectsToMap(this.level.enemies);
    this.addObjectsToMap(this.throwableObjects);

    this.ctx.translate(-this.camera_x, 0);

    this.checkCollisions();

    let self = this;
    this.animationFrame = requestAnimationFrame(function () {
      self.draw();
    });
  }

  addObjectsToMap(objects) {
    objects.forEach((o) => {
      this.addToMap(o);
    });
  }

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

  flipImage(mo) {
    this.ctx.save();
    this.ctx.translate(mo.width, 0);
    this.ctx.scale(-1, 1);
    mo.x = mo.x * -1;
  }

  flipImageBack(mo) {
    mo.x = mo.x * -1;
    this.ctx.restore();
  }

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

  checkBottleCollection() {
    if (!this.level.bottles?.length) return;

    if (this.character.collectedBottles < 5) {
      this.level.bottles = this.level.bottles.filter((bottle) => {
        if (this.character.isColliding(bottle)) {
          this.character.collectedBottles++; // Eine Bottle aufheben
          this.statusBarBottle.setPrecentage(
            (this.character.collectedBottles / 5) * 100
          );
          return false; // Entferne die eingesammelte Bottle
        }
        return true;
      });
    }
  }
}
