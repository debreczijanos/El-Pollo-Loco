/**
 * Base class for all drawable objects in the game.
 * Provides basic functionality for loading and drawing images.
 */
class DrawableObject {
  /** @type {number} X-position of the object */
  x = 120;
  /** @type {number} Y-position of the object */
  y = 280;
  /** @type {number} Height of the object in pixels */
  height = 150;
  /** @type {number} Width of the object in pixels */
  width = 100;
  /** @type {Image} Current image of the object */
  img;
  /** @type {Object} Cache for loaded images */
  imageCache = {};
  /** @type {number} Current image index for animations */
  currentImage = 0;

  /**
   * Loads a single image from the specified path.
   * @param {string} path - The path to the image file
   */
  loadImage(path) {
    this.img = new Image();
    this.img.src = path;
  }

  /**
   * Draws the object on the canvas.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   */
  draw(ctx) {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
  }

  /**
   * Draws a debug frame around the object (currently disabled).
   * Only draws frames for Character and Chicken objects.
   * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
   */
  drawFrame(ctx) {
    if (this instanceof Character || this instanceof Chicken) {
      ctx.beginPath();
      ctx.stroke();
    }
  }

  /**
   * Loads multiple images into the image cache.
   * @param {string[]} arr - Array of image paths to load
   */
  loadImages(arr) {
    arr.forEach((path) => {
      let img = new Image();
      img.src = path;
      this.imageCache[path] = img;
    });
  }
}
