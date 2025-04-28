/**
 * Represents a background object in the game.
 * @class
 * @extends DrawableObject
 */
class BackgroundObject extends MovableObject {
  width = 720;
  height = 480;

  /**
   * Creates a new BackgroundObject instance.
   * @constructor
   * @param {string} imagePath - The path to the image file.
   * @param {number} x - The x-coordinate of the background object.
   */
  constructor(imagePath, x) {
    super().loadImage(imagePath);
    this.x = x;
    this.y = 480 - this.height;
  }
}
