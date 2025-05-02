/**
 * Represents the status bar for the coin count in the game.
 * Shows the fill level of the character's collected coins.
 * @extends DrawableObject
 */
class StatusBarCoins extends DrawableObject {
  /**
   * Array of image paths for the various fill levels of the coin bar.
   * @type {string[]}
   */
  IMAGES_COINS = [
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
  ];

  /**
   * The current percentage of the coin bar.
   * @type {number}
   */
  percentage = 0;

  /**
   * Creates a new coin status bar.
   * Initializes the position, size, and start value.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_COINS);
    this.x = 20;
    this.y = 35;
    this.width = 120;
    this.height = 40;
    this.setPrecentage(0);
  }

  /**
   * Sets the percentage of the coin bar and updates the displayed image.
   * @param {number} percentage - The new percentage (0-100)
   */
  setPrecentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES_COINS[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Determines the index of the image to display based on the current percentage.
   * @returns {number} - The index of the image to display in the IMAGES_COINS array
   */
  resolveImageIndex() {
    if (this.percentage === 100 || this.percentage >= 100) {
      return 5;
    } else if (this.percentage >= 80) {
      return 4;
    } else if (this.percentage >= 60) {
      return 3;
    } else if (this.percentage >= 40) {
      return 2;
    } else if (this.percentage >= 20) {
      return 1;
    } else {
      return 0;
    }
  }
}
