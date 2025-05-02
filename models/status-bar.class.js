/**
 * Represents the main status bar in the game.
 * Shows the health status of the character.
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject {
  /**
   * Array of image paths for the various health states.
   * @type {string[]}
   */
  IMAGES = [
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
  ];

  /**
   * The current percentage of the health bar.
   * @type {number}
   */
  percentage = 100;

  /**
   * Creates a new main status bar.
   * Initializes the position, size, and start value.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 20;
    this.y = 0;
    this.width = 120;
    this.height = 40;
    this.setPrecentage(100);
  }

  /**
   * Sets the percentage of the health bar and updates the displayed image.
   * @param {number} percentage - The new percentage (0-100)
   */
  setPrecentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Determines the index of the image to display based on the current percentage.
   * @returns {number} - The index of the image to display in the IMAGES array
   */
  resolveImageIndex() {
    if (this.percentage == 100) {
      return 5;
    } else if (this.percentage > 80) {
      return 4;
    } else if (this.percentage > 60) {
      return 3;
    } else if (this.percentage > 40) {
      return 2;
    } else if (this.percentage > 20) {
      return 1;
    } else {
      return 0;
    }
  }
}
