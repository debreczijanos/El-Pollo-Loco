class Chicken extends MovableObject {
  y = 360;
  height = 60;
  width = 60;
  isDead = false;
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];
  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_small/2_dead/dead.png"];

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);

    this.x = 200 + Math.random() * 2300;
    this.speed = 0.15 + Math.random() * 0.25;

    this.animate();
  }

  animate() {
    this.moveInterval = setInterval(() => {
      if (!this.isDead) this.moveLeft();
    }, 1000 / 60);

    this.animationInterval = setInterval(() => {
      if (!this.isDead) this.playAnimation(this.IMAGES_WALKING);
    }, 200);
  }

  hit() {
    if (this.isDead) return;
    this.isDead = true;

    console.log("Chicken wurde getroffen!", this);

    this.loadImage(this.IMAGES_DEAD[0]); // Setze Todesbild sofort
    this.speed = 0;
    this.y += 10;

    clearInterval(this.moveInterval); // Stoppt Bewegung
    clearInterval(this.animationInterval); // Stoppt Animation

    setTimeout(() => {
      let index = world.level.enemies.indexOf(this);
      if (index > -1) {
        world.level.enemies.splice(index, 1); // Entferne das Chicken nach Tod
      }
    }, 500);
  }

  // Diese Methode stoppt alle laufenden Animationen
  stopAnimation() {
    let highestIntervalId = setInterval(() => {}, 0);
    for (let i = 0; i < highestIntervalId; i++) {
      clearInterval(i);
    }
  }

  // Diese Methode stoppt die Bewegung vollständig
  stopMovement() {
    this.speed = 0;
    this.moveLeft = function () {}; // Verhindert weiteres Laufen
  }
}
