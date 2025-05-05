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
    this.initDimensions();
    this.initPosition();
    this.initHitbox();
  }

  /**
   * Initializes the dimensions of the bottle.
   */
  initDimensions() {
    this.width = 50;
    this.height = 50;
  }

  /**
   * Initializes the position and appearance of the bottle.
   * Randomly determines if the bottle is in the air or on the ground.
   */
  initPosition() {
    this.x = Math.random() * 1800;
    const isAirBottle = Math.random() < 0.5;

    if (isAirBottle) {
      this.initAirBottle();
    } else {
      this.initGroundBottle();
    }
  }

  /**
   * Initializes a bottle that is in the air.
   */
  initAirBottle() {
    this.y = Math.random() * (300 - 150) + 150;
    this.loadImage(this.IMAGES_BOTTLE_ON_AIR[0]);
  }

  /**
   * Initializes a bottle that is on the ground.
   */
  initGroundBottle() {
    this.y = 370;
    const randomIndex = Math.floor(Math.random() * 2);
    this.loadImage(this.IMAGES_BOTTLE_ON_GROUND[randomIndex]);
  }

  /**
   * Initializes the hitbox for collision detection.
   */
  initHitbox() {
    this.hitbox = { top: 0, bottom: 0, left: 20, right: 20 };
  }
}
