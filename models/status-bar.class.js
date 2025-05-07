/**
 * Represents a flexible status bar for the game.
 * Can be used for health, coins, bottles, or endboss status.
 * Configuration is done via constructor or static factory methods.
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
   * Creates a new status bar instance.
   * @param {Object} options - Configuration object
   * @param {string[]} images - Array of image paths for the status bar states
   * @param {number} x - X position on the canvas
   * @param {number} y - Y position on the canvas
   * @param {number} width - Width of the status bar
   * @param {number} height - Height of the status bar
   * @param {number} [percentage=100] - Initial percentage (0-100)
   */
  constructor({ images, x, y, width, height, percentage = 100 }) {
    super();
    this.IMAGES = images;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.percentage = percentage;
    this.loadImages(this.IMAGES);
    this.setPrecentage(this.percentage);
  }

  /**
   * Sets the percentage value and updates the displayed image.
   * @param {number} percentage - The new percentage (0-100)
   */
  setPrecentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Determines the image index based on the current percentage.
   * @returns {number} - The index of the image to display
   */
  resolveImageIndex() {
    if (this.percentage >= 100) return 5;
    if (this.percentage >= 80) return 4;
    if (this.percentage >= 60) return 3;
    if (this.percentage >= 40) return 2;
    if (this.percentage >= 20) return 1;
    return 0;
  }

  /**
   * Creates a status bar for the character's health.
   * @returns {StatusBar}
   */
  static createHealthBar() {
    return new StatusBar({
      images: [
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
        "img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
      ],
      x: 20,
      y: 0,
      width: 120,
      height: 40,
      percentage: 100,
    });
  }

  /**
   * Creates a status bar for collected coins.
   * @returns {StatusBar}
   */
  static createCoinBar() {
    return new StatusBar({
      images: [
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
        "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
      ],
      x: 20,
      y: 35,
      width: 120,
      height: 40,
      percentage: 0,
    });
  }

  /**
   * Creates a status bar for collected bottles.
   * @returns {StatusBar}
   */
  static createBottleBar() {
    return new StatusBar({
      images: [
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png",
        "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png",
      ],
      x: 20,
      y: 70,
      width: 120,
      height: 40,
      percentage: 0,
    });
  }

  /**
   * Creates a status bar for the endboss health.
   * @returns {StatusBar}
   */
  static createEndbossBar() {
    return new StatusBar({
      images: [
        "img/7_statusbars/2_statusbar_endboss/orange0.png",
        "img/7_statusbars/2_statusbar_endboss/orange20.png",
        "img/7_statusbars/2_statusbar_endboss/blue40.png",
        "img/7_statusbars/2_statusbar_endboss/blue60.png",
        "img/7_statusbars/2_statusbar_endboss/green80.png",
        "img/7_statusbars/2_statusbar_endboss/green100.png",
      ],
      x: 570,
      y: 0,
      width: 120,
      height: 40,
      percentage: 100,
    });
  }
}
