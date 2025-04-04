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
    this.speedY = 30;
    this.applyGravity();

    let moveInterval = setInterval(() => {
      if (this.checkCollisionWithEnemies()) {
        clearInterval(moveInterval); // Stoppe Bewegung nach einem Treffer
      } else if (this.y < 360) {
        this.x += 13 * this.direction; // Bewege die Flasche weiter
      } else {
        clearInterval(moveInterval); // Stoppe die Bewegung am Boden
        this.showSplash(this.x, this.y);
      }
    }, 25);

    this.animate();
  }

  stopGravity() {
    this.speedY = 0;
    this.acceleration = 0;
  }

  animate() {
    let animationInterval = setInterval(() => {
      if (this.hasSplashed) {
        // Wenn bereits Splash ausgelöst wurde, stoppe Animation
        clearInterval(animationInterval);
        return;
      }

      if (this.y < 360) {
        this.playAnimation(this.IMAGES_BOTTLE_ROTATION);
      } else {
        this.playAnimation(this.IMAGES_BOTTLE_SPLASH);
        this.hasSplashed = true; // Markiere, dass die Flasche gesplasht ist

        setTimeout(() => {
          clearInterval(animationInterval);
          let index = world.throwableObjects.indexOf(this);
          if (index > -1) {
            world.throwableObjects.splice(index, 1); // Entferne die Flasche nach Splash
          }
        }, 500);
      }
    }, 50);
  }

  checkCollisionWithEnemies() {
    if (this.hasSplashed) return false; // Verhindert mehrfaches Treffen

    for (let enemy of world.level.enemies) {
      if (this.isColliding(enemy)) {
        clearInterval(this.moveInterval); // Stoppe die Bewegung sofort
        this.stopGravity(); // Deaktiviere die Gravitation
        this.y = enemy.y + enemy.height / 2 - this.height / 2; // Setze die Flasche auf den Gegner
        this.x = enemy.x + enemy.width / 2 - this.width / 2;

        this.hasSplashed = true; // Markiere, dass die Flasche gesplasht ist
        this.loadImage(this.IMAGES_BOTTLE_SPLASH[0]); // Sofort Splash-Animation anzeigen
        this.playAnimation(this.IMAGES_BOTTLE_SPLASH);

        if (enemy instanceof Endboss) {
          enemy.takeHitFromBottle();
        } else {
          enemy.hit();
        }

        setTimeout(() => {
          let index = world.throwableObjects.indexOf(this);
          if (index > -1) {
            world.throwableObjects.splice(index, 1); // Entferne die Flasche nach Splash
          }
        }, 500);

        return true;
      }
    }
    return false;
  }

  showSplash(x, y) {
    this.x = x;
    this.y = y;
    this.playAnimation(this.IMAGES_BOTTLE_SPLASH);

    setTimeout(() => {
      let index = world.throwableObjects.indexOf(this);
      if (index > -1) {
        world.throwableObjects.splice(index, 1); // Entfernt die Flasche nach Splash
      }
    }, 500); // Splash-Animation für 0,5 Sekunden abspielen
  }
}
