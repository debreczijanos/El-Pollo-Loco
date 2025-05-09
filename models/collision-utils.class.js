/**
 * Provides collision detection and collision reaction utilities for the game world.
 * Handles all collision checks and responses between the character and enemies, including stomp and side collisions.
 */
class CollisionUtils {
  /**
   * Checks all collisions between the character and enemies.
   * Handles stomp and side collisions, including invulnerability after stomping.
   * @param {World} world - The game world instance
   */
  checkCharacterEnemyCollisions(world) {
    for (let enemy of world.level.enemies) {
      if (enemy.isDead || enemy.ignoreCollisions) continue;
      if (world.character.isColliding(enemy)) {
        if (world.character.isFalling()) {
          this.handleStompCollision(world, enemy);
        } else {
          this.handleSideCollision(world);
        }
      }
    }
  }

  /**
   * Handles the collision between character and enemy (stomp).
   * Applies stomp effects, bounces the character, marks the enemy as dead, and schedules removal.
   * @param {World} world - The game world instance
   * @param {MovableObject} enemy - The hit enemy
   */
  handleStompCollision(world, enemy) {
    this.applyStompEffects(world, enemy);
    this.setCharacterBounce(world);
    this.setEnemyDead(enemy);
    this.setCharacterInvulnerable(world);
    this.scheduleEnemyRemoval(world, enemy);
    this.scheduleStompReset(world);
  }

  /**
   * Applies stomp effects: damages the enemy, moves the character up, and sets justStomped flag.
   * @param {World} world - The game world instance
   * @param {MovableObject} enemy - The hit enemy
   */
  applyStompEffects(world, enemy) {
    enemy.hit();
    world.character.y -= 10;
    world.character.justStomped = true;
  }

  /**
   * Bounces the character upwards after a stomp if falling.
   * @param {World} world - The game world instance
   */
  setCharacterBounce(world) {
    if (world.character.speedY > 0) {
      world.character.speedY = -5;
    }
  }

  /**
   * Marks the enemy as dead and ignores further collisions.
   * @param {MovableObject} enemy - The hit enemy
   */
  setEnemyDead(enemy) {
    enemy.isDead = true;
    enemy.ignoreCollisions = true;
  }

  /**
   * Sets the character to be invulnerable for a short time after stomping.
   * @param {World} world - The game world instance
   */
  setCharacterInvulnerable(world) {
    world.character.stompInvulnerable = true;
    setTimeout(() => {
      world.character.stompInvulnerable = false;
    }, 300);
  }

  /**
   * Schedules the removal of the enemy from the world after a short delay (for death animation).
   * @param {World} world - The game world instance
   * @param {MovableObject} enemy - The hit enemy
   */
  scheduleEnemyRemoval(world, enemy) {
    setTimeout(() => {
      world.level.enemies = world.level.enemies.filter((e) => e !== enemy);
    }, 500);
  }

  /**
   * Resets the justStomped flag after a short delay.
   * @param {World} world - The game world instance
   */
  scheduleStompReset(world) {
    setTimeout(() => {
      world.character.justStomped = false;
    }, 300);
  }

  /**
   * Handles the character's hit (side collision).
   * Applies damage and updates the status bar if the character is not invulnerable.
   * @param {World} world - The game world instance
   */
  handleSideCollision(world) {
    if (!world.character.isHurt() && !world.character.stompInvulnerable) {
      world.character.hit();
      world.statusBar.setPrecentage(world.character.energy);
    }
  }

  /**
   * Gets the hitbox for a given object.
   * @param {MovableObject} obj - The object to get hitbox for
   * @returns {Object} The hitbox object with top, bottom, left, right properties
   */
  getHitbox(obj) {
    return obj.hitbox || { top: 0, bottom: 0, left: 0, right: 0 };
  }
}
