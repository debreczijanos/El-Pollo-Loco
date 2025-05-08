/**
 * Provides collision detection and calculation utilities for the game world.
 * Handles all collision-related calculations and checks between game objects.
 */
class CollisionUtils {
  /**
   * Calculates all relevant collision parameters between character and enemy.
   * @param {World} world - The game world instance
   * @param {MovableObject} enemy - The enemy to check collision with
   * @returns {Object} Object containing collision parameters:
   *                  - charFeet: Y-position of character's feet
   *                  - enemyMiddle: Vertical middle of the enemy
   *                  - isHorizontal: Whether there is horizontal overlap
   */
  getCollisionParams(world, enemy) {
    const a = this.getHitbox(world.character);
    const b = this.getHitbox(enemy);
    return {
      charFeet: this.getCharFeet(world, a),
      enemyMiddle: this.getEnemyMiddle(enemy, b),
      isHorizontal: this.isHorizontalOverlap(
        world,
        world.character,
        enemy,
        a,
        b
      ),
    };
  }

  /**
   * Gets the hitbox for a given object.
   * @param {MovableObject} obj - The object to get hitbox for
   * @returns {Object} The hitbox object with top, bottom, left, right properties
   */
  getHitbox(obj) {
    return obj.hitbox || { top: 0, bottom: 0, left: 0, right: 0 };
  }

  /**
   * Calculates the Y-position of the character's feet.
   * @param {World} world - The game world instance
   * @param {Object} a - The character's hitbox
   * @returns {number} The Y-position of the character's feet
   */
  getCharFeet(world, a) {
    return world.character.y + world.character.height - a.bottom;
  }

  /**
   * Calculates the vertical middle of an enemy.
   * @param {MovableObject} enemy - The enemy object
   * @param {Object} b - The enemy's hitbox
   * @returns {number} The vertical middle position of the enemy
   */
  getEnemyMiddle(enemy, b) {
    const top = enemy.y + b.top;
    const bottom = enemy.y + enemy.height - b.bottom;
    return (top + bottom) / 2;
  }

  /**
   * Checks if there is sufficient horizontal overlap between two objects.
   * @param {World} world - The game world instance
   * @param {MovableObject} char - The character object
   * @param {MovableObject} enemy - The enemy object
   * @param {Object} a - Character's hitbox
   * @param {Object} b - Enemy's hitbox
   * @returns {boolean} True if there is sufficient horizontal overlap
   */
  isHorizontalOverlap(world, char, enemy, a, b) {
    const cam = world.camera_x || 0;
    const charLeft = char.x + a.left + cam;
    const charRight = char.x + char.width - a.right + cam;
    const enemyLeft = enemy.x + b.left + cam;
    const enemyRight = enemy.x + enemy.width - b.right + cam;
    const overlap =
      Math.min(charRight, enemyRight) - Math.max(charLeft, enemyLeft);
    return overlap > 0;
  }

  /**
   * Checks if the character is colliding with an enemy from the side.
   * @param {World} world - The game world instance
   * @param {MovableObject} enemy - The enemy to check collision with
   * @param {number} charTop - Character's top Y-position
   * @param {number} charBottom - Character's bottom Y-position
   * @param {number} charLeft - Character's left X-position
   * @param {number} charRight - Character's right X-position
   * @returns {boolean} True if there is a side collision
   */
  isSideCollidingWithEnemy(
    world,
    enemy,
    charTop,
    charBottom,
    charLeft,
    charRight
  ) {
    const enemyTop = enemy.y;
    const enemyBottom = enemy.y + enemy.height;
    const enemyLeft = enemy.x;
    const enemyRight = enemy.x + enemy.width;
    const isSmallChicken = enemy instanceof ChickenSmall;
    const widthFactor = isSmallChicken ? 0.3 : 0.15;
    return (
      world.character.isColliding(enemy) &&
      charRight > enemyLeft + enemy.width * widthFactor &&
      charLeft < enemyRight - enemy.width * widthFactor &&
      charBottom > enemyTop + enemy.height * 0.2 &&
      charTop < enemyBottom - enemy.height * 0.2
    );
  }

  /**
   * Determines if the character should stomp on the enemy.
   * @param {World} world - The game world instance
   * @param {MovableObject} enemy - The enemy to check
   * @returns {boolean} True if the character should stomp the enemy
   */
  shouldStompEnemy(world, enemy) {
    if (enemy.isDead || !(enemy instanceof Chicken)) return false;
    const { charFeet, enemyMiddle, isHorizontal } = this.getCollisionParams(
      world,
      enemy
    );
    return (
      charFeet < enemyMiddle &&
      isHorizontal &&
      world.character.speedY > 0 &&
      world.character.isColliding(enemy)
    );
  }

  /**
   * Determines if the character should collide with the enemy from the side.
   * @param {World} world - The game world instance
   * @param {MovableObject} enemy - The enemy to check
   * @returns {boolean} True if there should be a side collision
   */
  shouldSideCollideWithEnemy(world, enemy) {
    if (enemy.isDead || !(enemy instanceof Chicken)) return false;
    if (!world.character.isCharacterOnGround()) return false;
    const { charFeet, enemyMiddle, isHorizontal } = this.getCollisionParams(
      world,
      enemy
    );
    return (
      charFeet >= enemyMiddle &&
      isHorizontal &&
      this.isSideCollidingWithEnemy(
        world,
        enemy,
        world.character.y,
        world.character.y + world.character.height,
        world.character.x,
        world.character.x + world.character.width
      )
    );
  }

  /**
   * Checks if the character stomps on any enemy.
   * @param {World} world - The game world instance
   * @returns {boolean} True if a stomp occurred
   */
  checkStompOnEnemies(world) {
    for (let enemy of world.level.enemies) {
      if (this.shouldStompEnemy(world, enemy)) {
        world.handleStompCollision(enemy);
        return true;
      }
    }
    return false;
  }

  /**
   * Checks for side collisions with any enemy.
   * @param {World} world - The game world instance
   */
  checkSideCollisionOnEnemies(world) {
    for (let enemy of world.level.enemies) {
      if (this.shouldSideCollideWithEnemy(world, enemy)) {
        world.handleSideCollision();
        break;
      }
    }
  }
}
