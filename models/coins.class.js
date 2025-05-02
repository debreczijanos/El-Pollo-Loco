/**
 * Represents a collectible coin in the game.
 * Handles coin animation and collection behavior.
 * @extends DrawableObject
 */
class Coin extends DrawableObject {
  /**
   * Creates a new coin instance.
   * @param {number} x - The x-coordinate where the coin should be placed
   * @param {number} y - The y-coordinate where the coin should be placed
   */
  constructor(x, y) {
    super();
    this.loadImage("img/8_coin/coin_1.png");
    /** @type {number} X-position of the coin */
    this.x = x;
    /** @type {number} Y-position of the coin */
    this.y = y;
    /** @type {number} Base size of the coin in pixels */
    this.baseSize = 100;
    /** @type {number} Current width of the coin */
    this.width = this.baseSize;
    /** @type {number} Current height of the coin */
    this.height = this.baseSize;
    /** @type {boolean} Flag indicating if the coin is currently growing */
    this.growing = true;

    this.animate();

    this.hitbox = { top: 20, bottom: 20, left: 20, right: 20 };
  }

  /**
   * Sets up the animation interval for the coin.
   * Creates a pulsing effect by alternating between growing and shrinking.
   */
  animate() {
    setInterval(() => {
      if (this.growing) {
        this.width += 1;
        this.height += 1;
        if (this.width >= 105) this.growing = false;
      } else {
        this.width -= 1;
        this.height -= 1;
        if (this.width <= this.baseSize) this.growing = true;
      }
    }, 120);
  }
}
