/**
 * Represents a level in the game.
 * Contains all objects and enemies that appear in a level.
 */
class Level {
  /**
   * Array of enemies in the level.
   * @type {Array<MovableObject>}
   */
  enemies;

  /**
   * Array of clouds in the level.
   * @type {Array<Cloud>}
   */
  clouds;

  /**
   * Array of background objects in the level.
   * @type {Array<BackgroundObject>}
   */
  backgroundObjects;

  /**
   * The X position where the level ends.
   * @type {number}
   */
  level_end_x = 2600;

  /**
   * Creates a new level with the specified objects.
   * @param {Array<MovableObject>} enemies - Array of enemies
   * @param {Array<Cloud>} clouds - Array of clouds
   * @param {Array<BackgroundObject>} backgroundObjects - Array of background objects
   * @param {Array<Coin>} coins - Array of coins
   * @param {Array<Bottle>} bottles - Array of bottles
   */
  constructor(enemies, clouds, backgroundObjects, coins, bottles) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins;
    this.bottles = bottles;
  }
}
