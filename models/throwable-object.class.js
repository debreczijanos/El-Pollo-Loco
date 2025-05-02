/**
 * Repräsentiert ein werfbares Objekt (Flasche) im Spiel.
 * Erweitert die Funktionalität von MovableObject um Wurf- und Kollisionsverhalten.
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
  /**
   * Array von Bildpfaden für die Rotationsanimation der Flasche.
   * @type {string[]}
   */
  IMAGES_BOTTLE_ROTATION = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  /**
   * Array von Bildpfaden für die Splash-Animation beim Aufprall.
   * @type {string[]}
   */
  IMAGES_BOTTLE_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  /**
   * Erstellt ein neues werfbares Objekt.
   * @param {number} x - Die X-Position des Objekts
   * @param {number} y - Die Y-Position des Objekts
   * @param {number} direction - Die Wurfrichtung (-1 für links, 1 für rechts)
   */
  constructor(x, y, direction) {
    super().loadImage(this.IMAGES_BOTTLE_ROTATION[0]);
    this.loadImages(this.IMAGES_BOTTLE_ROTATION);
    this.loadImages(this.IMAGES_BOTTLE_SPLASH);

    this.x = x;
    this.y = y;
    this.direction = direction;
    this.height = 60;
    this.width = 50;
    this.trow();
  }

  /**
   * Initialisiert den Wurf der Flasche.
   * Setzt die vertikale Geschwindigkeit und aktiviert die Schwerkraft.
   */
  trow() {
    this.initializeThrow();
    this.setupMovementInterval();
    this.animate();
  }

  /**
   * Initialisiert die Wurfparameter.
   * Setzt die vertikale Geschwindigkeit und aktiviert die Schwerkraft.
   */
  initializeThrow() {
    this.speedY = 18;
    this.applyGravity();
  }

  /**
   * Richtet das Bewegungsintervall für die Flasche ein.
   * Überprüft regelmäßig, ob die Bewegung gestoppt werden soll.
   */
  setupMovementInterval() {
    this.moveInterval = setInterval(() => {
      if (this.shouldStopMovement()) {
        this.handleMovementStop();
      } else {
        this.moveBottle();
      }
    }, 25);
  }

  /**
   * Prüft, ob die Bewegung der Flasche gestoppt werden soll.
   * @returns {boolean} - True, wenn die Flasche auf einen Gegner trifft oder den Boden erreicht
   */
  shouldStopMovement() {
    return this.checkCollisionWithEnemies() || this.y >= 360;
  }

  /**
   * Behandelt das Stoppen der Bewegung.
   * Zeigt die Splash-Animation an der aktuellen Position.
   */
  handleMovementStop() {
    clearInterval(this.moveInterval);
    if (this.y >= 360) {
      this.showSplash(this.x, this.y);
    }
  }

  /**
   * Bewegt die Flasche in die angegebene Richtung.
   */
  moveBottle() {
    this.x += 13 * this.direction;
  }

  /**
   * Startet die Animation der Flasche.
   * Aktualisiert regelmäßig die Animation basierend auf dem Zustand.
   */
  animate() {
    this.animationInterval = setInterval(() => {
      if (this.hasSplashed) {
        this.stopAnimation();
        return;
      }
      this.updateAnimation();
    }, 50);
  }

  /**
   * Stoppt die Animation der Flasche.
   */
  stopAnimation() {
    clearInterval(this.animationInterval);
  }

  /**
   * Aktualisiert die Animation der Flasche basierend auf ihrer Position.
   * Spielt entweder die Rotations- oder Splash-Animation ab.
   */
  updateAnimation() {
    if (this.y < 360) {
      this.playAnimation(this.IMAGES_BOTTLE_ROTATION);
    } else {
      this.handleSplashAnimation();
    }
  }

  /**
   * Behandelt die Splash-Animation beim Aufprall.
   * Spielt den Splash-Sound ab und entfernt die Flasche nach einer Verzögerung.
   */
  handleSplashAnimation() {
    this.playAnimation(this.IMAGES_BOTTLE_SPLASH);
    this.hasSplashed = true;

    if (world && world.soundManager) {
      world.soundManager.playSound("splash");
    }

    this.removeBottleAfterDelay();
  }

  /**
   * Entfernt die Flasche nach einer Verzögerung aus dem Spiel.
   */
  removeBottleAfterDelay() {
    setTimeout(() => {
      this.removeBottle();
    }, 500);
  }

  /**
   * Entfernt die Flasche aus dem Array der werfbaren Objekte.
   */
  removeBottle() {
    let index = world.throwableObjects.indexOf(this);
    if (index > -1) {
      world.throwableObjects.splice(index, 1);
    }
  }

  /**
   * Prüft auf Kollisionen mit Gegnern.
   * @returns {boolean} - True, wenn eine Kollision mit einem Gegner stattgefunden hat
   */
  checkCollisionWithEnemies() {
    if (this.hasSplashed) return false;

    for (let enemy of world.level.enemies) {
      if (this.isColliding(enemy)) {
        this.handleEnemyCollision(enemy);
        return true;
      }
    }
    return false;
  }

  /**
   * Behandelt die Kollision mit einem Gegner.
   * @param {MovableObject} enemy - Der getroffene Gegner
   */
  handleEnemyCollision(enemy) {
    this.stopMovement();
    this.positionBottleOnEnemy(enemy);
    this.initiateSplash();
    this.damageEnemy(enemy);
    this.removeBottleAfterDelay();
  }

  /**
   * Stoppt die Bewegung der Flasche.
   */
  stopMovement() {
    clearInterval(this.moveInterval);
    this.stopGravity();
  }

  /**
   * Positioniert die Flasche auf dem getroffenen Gegner.
   * @param {MovableObject} enemy - Der getroffene Gegner
   */
  positionBottleOnEnemy(enemy) {
    this.y = enemy.y + enemy.height / 2 - this.height / 2;
    this.x = enemy.x + enemy.width / 2 - this.width / 2;
  }

  /**
   * Initiiert die Splash-Animation.
   */
  initiateSplash() {
    this.hasSplashed = true;
    this.loadImage(this.IMAGES_BOTTLE_SPLASH[0]);
    this.playAnimation(this.IMAGES_BOTTLE_SPLASH);
  }

  /**
   * Fügt dem Gegner Schaden zu.
   * @param {MovableObject} enemy - Der getroffene Gegner
   */
  damageEnemy(enemy) {
    if (enemy instanceof Endboss) {
      enemy.takeHitFromBottle();
    } else {
      enemy.hit();
    }

    if (world && world.soundManager) {
      world.soundManager.playSound("hit");
    }
  }

  /**
   * Zeigt die Splash-Animation an einer bestimmten Position.
   * @param {number} x - Die X-Position für die Splash-Animation
   * @param {number} y - Die Y-Position für die Splash-Animation
   */
  showSplash(x, y) {
    this.x = x;
    this.y = y;
    this.playAnimation(this.IMAGES_BOTTLE_SPLASH);
    this.removeBottleAfterDelay();
  }

  /**
   * Stoppt die Schwerkraftwirkung auf die Flasche.
   */
  stopGravity() {
    this.speedY = 0;
    this.acceleration = 0;
  }
}
