/**
 * Represents a chicken enemy in the game.
 * Handles the basic chicken behavior including movement, animation, and death.
 * @extends MovableObject
 */
class Chicken extends MovableObject {
  /** @type {number} Y-position of the chicken */
  y = 360;
  /** @type {number} Height of the chicken in pixels */
  height = 60;
  /** @type {number} Width of the chicken in pixels */
  width = 60;
  /** @type {boolean} Flag indicating if the chicken is dead */
  isDead = false;
  /** @type {string[]} Array of image paths for walking animation */
  IMAGES_WALKING = [
    "img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
    "img/3_enemies_chicken/chicken_normal/1_walk/3_w.png",
  ];
  /** @type {string[]} Array of image paths for death animation */
  IMAGES_DEAD = ["img/3_enemies_chicken/chicken_small/2_dead/dead.png"];
  hitbox = { top: 0, bottom: 0, left: 0, right: 0 };

  /**
   * Creates a new chicken instance.
   * Sets up initial position, speed, and loads necessary images.
   */
  constructor() {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_DEAD);

    this.x = 200 + Math.random() * 2300;
    this.speed = 0.15 + Math.random() * 0.25;

    this.animate();
  }

  /**
   * Sets up the animation and movement intervals for the chicken.
   * Handles continuous left movement and walking animation.
   */
  animate() {
    this.moveInterval = setInterval(() => {
      if (!this.isDead) this.moveLeft();
    }, 1000 / 60);

    this.animationInterval = setInterval(() => {
      if (!this.isDead) this.playAnimation(this.IMAGES_WALKING);
    }, 200);
  }

  /**
   * Handles the chicken being hit.
   * Plays death animation, stops movement, and removes the chicken from the game.
   */
  hit() {
    if (this.isDead) return;
    this.isDead = true;

    if (world && world.soundManager) {
      world.soundManager.playSound("hit");
    }

    this.loadImage(this.IMAGES_DEAD[0]);
    this.speed = 0;
    this.y += 10;

    clearInterval(this.moveInterval);
    clearInterval(this.animationInterval);

    setTimeout(() => {
      let index = world.level.enemies.indexOf(this);
      if (index > -1) {
        world.level.enemies.splice(index, 1);
      }
    }, 500);
  }

  /**
   * Stops all running animations by clearing all intervals.
   */
  stopAnimation() {
    let highestIntervalId = setInterval(() => {}, 0);
    for (let i = 0; i < highestIntervalId; i++) {
      clearInterval(i);
    }
  }

  /**
   * Completely stops the chicken's movement.
   * Sets speed to 0 and overrides the moveLeft method.
   */
  stopMovement() {
    this.speed = 0;
    this.moveLeft = function () {};
  }
}
