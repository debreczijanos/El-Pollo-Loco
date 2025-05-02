/**
 * Represents the status bar for the endboss in the game.
 * Shows the health status of the endboss.
 * @extends DrawableObject
 */
class StatusBarEndboss extends DrawableObject {
  /**
   * Array of image paths for the various health states of the endboss.
   * The colors change depending on the health state (orange -> blue -> green).
   * @type {string[]}
   */
  IMAGES_ENDBOSS = [
    "img/7_statusbars/2_statusbar_endboss/orange0.png",
    "img/7_statusbars/2_statusbar_endboss/orange20.png",
    "img/7_statusbars/2_statusbar_endboss/blue40.png",
    "img/7_statusbars/2_statusbar_endboss/blue60.png",
    "img/7_statusbars/2_statusbar_endboss/green80.png",
    "img/7_statusbars/2_statusbar_endboss/green100.png",
  ];

  /**
   * The current percentage of the health bar.
   * @type {number}
   */
  percentage = 100;

  /**
   * Creates a new endboss status bar.
   * Initializes the position, size, and start value.
   * @param {StatusBar} statusBar - Reference to the main status bar
   */
  constructor(statusBar) {
    super();
    this.loadImages(this.IMAGES_ENDBOSS);
    this.x = 570;
    this.y = 0;
    this.width = 120;
    this.height = 40;
    this.setPrecentage(100);
    this.statusBar = statusBar;
  }

  /**
   * Sets the percentage of the health bar and updates the displayed image.
   * @param {number} percentage - The new percentage (0-100)
   */
  setPrecentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES_ENDBOSS[this.resolveImageIndex()];
    this.loadImage(path);
  }

  /**
   * Determines the index of the image to display based on the current percentage.
   * @returns {number} - The index of the image to display in the IMAGES_ENDBOSS array
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
