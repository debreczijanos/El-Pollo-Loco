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

  constructor(x, y) {
    super().loadImage(this.IMAGES_BOTTLE_ROTATION[0]);
    this.loadImages(this.IMAGES_BOTTLE_ROTATION);
    this.loadImages(this.IMAGES_BOTTLE_SPLASH);

    this.x = x;
    this.y = y;
    this.height = 60;
    this.width = 50;
    this.trow();
  }

  trow() {
    this.speedY = 30;
    this.applyGravity();

    let moveInterval = setInterval(() => {
      if (this.y < 360) {
        this.x += 13; // Bewege die Flasche nur, wenn sie in der Luft ist
      } else {
        clearInterval(moveInterval); // Stoppe die Bewegung, wenn die Flasche den Boden erreicht
      }
    }, 25);

    this.animate();
  }

  animate() {
    let animationInterval = setInterval(() => {
      if (this.y < 360) {
        // Flasche ist noch in der Luft -> Dreh-Animation
        this.playAnimation(this.IMAGES_BOTTLE_ROTATION);
      } else {
        // Flasche hat den Boden erreicht -> Splash-Animation
        this.playAnimation(this.IMAGES_BOTTLE_SPLASH);

        setTimeout(() => {
          clearInterval(animationInterval); // Stoppt die Animation nach dem Splash
          let index = world.throwableObjects.indexOf(this);
          if (index > -1) {
            world.throwableObjects.splice(index, 1); // Entfernt die Flasche nach Splash
          }
        }, 500); // Splash-Animation für 0,5 Sekunden abspielen
      }
    }, 50);
  }
}
