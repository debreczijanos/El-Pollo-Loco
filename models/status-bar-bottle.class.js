/**
 * Represents the status bar for the bottle count in the game.
 * Shows the fill level of the character's bottle count.
 * @extends DrawableObject
 */
class StatusBarBottle extends DrawableObject {
  /**
   * Array of image paths for the various fill levels of the bottle bar.
   * @type {string[]}
   */
  IMAGES_BOTTLE = [
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png",
  ];

  /**
   * The current percentage of the bottle bar.
   * @type {number}
   */
  percentage = 0;

  /**
   * Creates a new bottle status bar.
   * Initializes the position, size, and start value.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_BOTTLE);
    this.x = 20;
    this.y = 70;
    this.width = 120;
    this.height = 40;
    this.setPrecentage(0);
  }

  /**
   * Sets the percentage of the bottle bar and updates the displayed image.
   * @param {number} percentage - The new percentage (0-100)
   */
  setPrecentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES_BOTTLE[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Determines the index of the image to display based on the current percentage.
   * @returns {number} - The index of the image to display in the IMAGES_BOTTLE array
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
