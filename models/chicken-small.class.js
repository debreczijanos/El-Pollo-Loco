class ChickenSmall extends Chicken {
  constructor() {
    super();
    this.IMAGES_WALKING = [
      "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
      "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
      "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
    ];
    this.IMAGES_DEAD = ["img/3_enemies_chicken/chicken_small/2_dead/dead.png"];
    this.height = 40;
    this.width = 40;
    this.y = 380;

    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImage(this.IMAGES_WALKING[0]);

    this.animate();
  }
}
