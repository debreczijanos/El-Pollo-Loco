/**
 * Represents a bottle object in the game that can be either on the ground or in the air.
 * @extends DrawableObject
 */
class Bottle extends DrawableObject {
  /**
   * Array of image paths for bottles on the ground
   * @type {string[]}
   */
  IMAGES_BOTTLE_ON_GROUND = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

  /**
   * Array of image paths for bottles in the air
   * @type {string[]}
   */
  IMAGES_BOTTLE_ON_AIR = ["img/6_salsa_bottle/salsa_bottle.png"];

  /**
   * Creates a new Bottle instance.
   * The bottle can be either on the ground or in the air, with random positioning.
   */
  constructor() {
    super();
    this.width = 50;
    this.height = 50;

    this.x = Math.random() * 1800;
    let isAirBottle = Math.random() < 0.5;

    if (isAirBottle) {
      this.y = Math.random() * (300 - 150) + 150;
      this.loadImage(this.IMAGES_BOTTLE_ON_AIR[0]);
    } else {
      this.y = 370;
      this.loadImage(
        this.IMAGES_BOTTLE_ON_GROUND[Math.floor(Math.random() * 2)]
      );
    }

    this.hitbox = { top: 10, bottom: 10, left: 10, right: 10 };
  }
}
