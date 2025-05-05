/**
 * Represents a small chicken enemy in the game.
 * A smaller variant of the regular chicken with different dimensions and animations.
 * @extends Chicken
 */
class ChickenSmall extends Chicken {
  /**
   * Creates a new small chicken instance.
   * Sets up the specific properties and animations for the small chicken.
   */
  constructor() {
    super();
    /** @type {string[]} Array of image paths for walking animation */
    this.IMAGES_WALKING = [
      "img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
      "img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
      "img/3_enemies_chicken/chicken_small/1_walk/3_w.png",
    ];
    /** @type {string[]} Array of image paths for death animation */
    this.IMAGES_DEAD = ["img/3_enemies_chicken/chicken_small/2_dead/dead.png"];
    /** @type {number} Height of the small chicken in pixels */
    this.height = 40;
    /** @type {number} Width of the small chicken in pixels */
    this.width = 40;
    /** @type {number} Y-position of the small chicken */
    this.y = 380;

    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImage(this.IMAGES_WALKING[0]);
    this.animate();
  }
}
