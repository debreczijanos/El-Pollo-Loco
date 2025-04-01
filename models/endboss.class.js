class Endboss extends MovableObject {
  height = 400;
  width = 250;
  y = 55;
  directionLeft = true;
  otherDirection = true;

  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.x = 2500;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.playAnimation(this.IMAGES_WALKING);

      if (!this.directionLeft) {
        this.x += 3;
        this.otherDirection = true;
        if (this.x >= 2700) this.directionLeft = true;
      } else {
        this.x -= 3;
        this.otherDirection = false;
        if (this.x <= 2200) this.directionLeft = false;
      }
    }, 150);
  }
}
