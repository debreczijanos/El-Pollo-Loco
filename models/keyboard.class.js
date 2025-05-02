/**
 * Represents the keyboard controls of the game.
 * Manages the state of the keys and allows querying key presses.
 */
class Keyboard {
  /**
   * Indicates whether the left arrow key is pressed.
   * @type {boolean}
   */
  LEFT = false;

  /**
   * Indicates whether the up arrow key is pressed.
   * @type {boolean}
   */
  UP = false;

  /**
   * Indicates whether the right arrow key is pressed.
   * @type {boolean}
   */
  RIGHT = false;

  /**
   * Indicates whether the down arrow key is pressed.
   * @type {boolean}
   */
  DOWN = false;

  /**
   * Indicates whether the space bar is pressed.
   * @type {boolean}
   */
  SPACE = false;

  /**
   * Indicates whether the D key is pressed.
   * @type {boolean}
   */
  D = false;

  /**
   * Creates a new Keyboard instance.
   * Initializes the list of pressed keys.
   */
  constructor() {
    this.keys = [];
  }

  /**
   * Adds a key to the list of pressed keys.
   * @param {string} key - The key to add
   */
  addKey(key) {
    this.keys.push(key);
  }

  /**
   * Removes a key from the list of pressed keys.
   * @param {string} key - The key to remove
   */
  removeKey(key) {
    this.keys = this.keys.filter((k) => k !== key);
  }

  /**
   * Returns the list of all pressed keys.
   * @returns {string[]} Array of pressed keys
   */
  getKeys() {
    return this.keys;
  }
}
