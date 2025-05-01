/**
 * Represents a cloud object in the game background.
 * Handles cloud movement and positioning in the game world.
 * @extends MovableObject
 */
class Cloud extends MovableObject {
  /** @type {number} Initial y-position of the cloud */
  y = 20;
  /** @type {number} Height of the cloud in pixels */
  height = 250;
  /** @type {number} Width of the cloud in pixels */
  width = 500;

  /**
   * Creates a new cloud instance.
   * Sets up initial position and loads the cloud image.
   */
  constructor() {
    super();
    this.loadImage("img/5_background/layers/4_clouds/1.png");

    this.x = Math.random() * 2000;
    this.y = 10 + Math.random() * 40;
    this.animate();
  }

  /**
   * Sets up the movement interval for the cloud.
   * Makes the cloud move continuously to the left.
   */
  animate() {
    setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);
  }
}
