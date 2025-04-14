class ThrowableObject extends MovableObject {
  IMAGES_BOTTLE_ROTATION = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];
  IMAGES_BOTTLE_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

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

  trow() {
    this.initializeThrow();
    this.setupMovementInterval();
    this.animate();
  }

  initializeThrow() {
    this.speedY = 30;
    this.applyGravity();
  }

  setupMovementInterval() {
    this.moveInterval = setInterval(() => {
      if (this.shouldStopMovement()) {
        this.handleMovementStop();
      } else {
        this.moveBottle();
      }
    }, 25);
  }

  shouldStopMovement() {
    return this.checkCollisionWithEnemies() || this.y >= 360;
  }

  handleMovementStop() {
    clearInterval(this.moveInterval);
    if (this.y >= 360) {
      this.showSplash(this.x, this.y);
    }
  }

  moveBottle() {
    this.x += 13 * this.direction;
  }

  animate() {
    this.animationInterval = setInterval(() => {
      if (this.hasSplashed) {
        this.stopAnimation();
        return;
      }
      this.updateAnimation();
    }, 50);
  }

  stopAnimation() {
    clearInterval(this.animationInterval);
  }

  updateAnimation() {
    if (this.y < 360) {
      this.playAnimation(this.IMAGES_BOTTLE_ROTATION);
    } else {
      this.handleSplashAnimation();
    }
  }

  handleSplashAnimation() {
    this.playAnimation(this.IMAGES_BOTTLE_SPLASH);
    this.hasSplashed = true;
    this.removeBottleAfterDelay();
  }

  removeBottleAfterDelay() {
    setTimeout(() => {
      this.removeBottle();
    }, 500);
  }

  removeBottle() {
    let index = world.throwableObjects.indexOf(this);
    if (index > -1) {
      world.throwableObjects.splice(index, 1);
    }
  }

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

  handleEnemyCollision(enemy) {
    this.stopMovement();
    this.positionBottleOnEnemy(enemy);
    this.initiateSplash();
    this.damageEnemy(enemy);
    this.removeBottleAfterDelay();
  }

  stopMovement() {
    clearInterval(this.moveInterval);
    this.stopGravity();
  }

  positionBottleOnEnemy(enemy) {
    this.y = enemy.y + enemy.height / 2 - this.height / 2;
    this.x = enemy.x + enemy.width / 2 - this.width / 2;
  }

  initiateSplash() {
    this.hasSplashed = true;
    this.loadImage(this.IMAGES_BOTTLE_SPLASH[0]);
    this.playAnimation(this.IMAGES_BOTTLE_SPLASH);
  }

  damageEnemy(enemy) {
    if (enemy instanceof Endboss) {
      enemy.takeHitFromBottle();
    } else {
      enemy.hit();
    }
  }

  showSplash(x, y) {
    this.x = x;
    this.y = y;
    this.playAnimation(this.IMAGES_BOTTLE_SPLASH);
    this.removeBottleAfterDelay();
  }

  stopGravity() {
    this.speedY = 0;
    this.acceleration = 0;
  }
}
