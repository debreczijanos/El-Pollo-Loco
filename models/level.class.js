/**
 * Repräsentiert ein Level im Spiel.
 * Enthält alle Objekte und Gegner, die in einem Level vorkommen.
 */
class Level {
  /**
   * Array von Gegnern im Level.
   * @type {Array<MovableObject>}
   */
  enemies;

  /**
   * Array von Wolken im Level.
   * @type {Array<Cloud>}
   */
  clouds;

  /**
   * Array von Hintergrundobjekten im Level.
   * @type {Array<BackgroundObject>}
   */
  backgroundObjects;

  /**
   * Die X-Position, an der das Level endet.
   * @type {number}
   */
  level_end_x = 2600;

  /**
   * Erstellt ein neues Level mit den angegebenen Objekten.
   * @param {Array<MovableObject>} enemies - Array von Gegnern
   * @param {Array<Cloud>} clouds - Array von Wolken
   * @param {Array<BackgroundObject>} backgroundObjects - Array von Hintergrundobjekten
   * @param {Array<Coin>} coins - Array von Münzen
   * @param {Array<Bottle>} bottles - Array von Flaschen
   */
  constructor(enemies, clouds, backgroundObjects, coins, bottles) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins;
    this.bottles = bottles;
  }
}
