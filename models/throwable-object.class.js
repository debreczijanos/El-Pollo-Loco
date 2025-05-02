/**
 * Represents a throwable object (bottle) in the game.
 * Extends the functionality of MovableObject with throwing and collision behavior.
 * @extends MovableObject
 */
class ThrowableObject extends MovableObject {
  /**
   * Array of image paths for the bottle's rotation animation.
   * @type {string[]}
   */
  IMAGES_BOTTLE_ROTATION = [
    "img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
    "img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png",
  ];

  /**
   * Array of image paths for the splash animation on impact.
   * @type {string[]}
   */
  IMAGES_BOTTLE_SPLASH = [
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
    "img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png",
  ];

  /**
   * Creates a new throwable object.
   * @param {number} x - The X position of the object
   * @param {number} y - The Y position of the object
   * @param {number} direction - The throw direction (-1 for left, 1 for right)
   */
  constructor(x, y, direction) {
    super().loadImage(this.IMAGES_BOTTLE_ROTATION[0]);
    this.loadImages(this.IMAGES_BOTTLE_ROTATION);
    this.loadImages(this.IMAGES_BOTTLE_SPLASH);

    this.x = x;
    this.y = y;
    this.direction = direction;
    this.height = 60;
    this.width = 50;
    this.trow();
  }

  /**
   * Initializes the throw of the bottle.
   * Sets the vertical speed and activates gravity.
   */
  trow() {
    this.initializeThrow();
    this.setupMovementInterval();
    this.animate();
  }

  /**
   * Initializes the throw parameters.
   * Sets the vertical speed and activates gravity.
   */
  initializeThrow() {
    this.speedY = 18;
    this.applyGravity();
  }

  /**
   * Sets up the movement interval for the bottle.
   * Regularly checks whether the movement should be stopped.
   */
  setupMovementInterval() {
    this.moveInterval = setInterval(() => {
      if (this.shouldStopMovement()) {
        this.handleMovementStop();
      } else {
        this.moveBottle();
      }
    }, 25);
  }

  /**
   * Checks whether the movement of the bottle should be stopped.
   * @returns {boolean} - True if the bottle hits an enemy or reaches the ground
   */
  shouldStopMovement() {
    return this.checkCollisionWithEnemies() || this.y >= 360;
  }

  /**
   * Handles stopping the movement.
   * Shows the splash animation at the current position.
   */
  handleMovementStop() {
    clearInterval(this.moveInterval);
    if (this.y >= 360) {
      this.showSplash(this.x, this.y);
    }
  }

  /**
   * Moves the bottle in the specified direction.
   */
  moveBottle() {
    this.x += 13 * this.direction;
  }

  /**
   * Starts the animation of the bottle.
   * Regularly updates the animation based on the state.
   */
  animate() {
    this.animationInterval = setInterval(() => {
      if (this.hasSplashed) {
        this.stopAnimation();
        return;
      }
      this.updateAnimation();
    }, 50);
  }

  /**
   * Stops the animation of the bottle.
   */
  stopAnimation() {
    clearInterval(this.animationInterval);
  }

  /**
   * Updates the animation of the bottle based on its position.
   * Plays either the rotation or splash animation.
   */
  updateAnimation() {
    if (this.y < 360) {
      this.playAnimation(this.IMAGES_BOTTLE_ROTATION);
    } else {
      this.handleSplashAnimation();
    }
  }

  /**
   * Handles the splash animation on impact.
   * Plays the splash sound and removes the bottle after a delay.
   */
  handleSplashAnimation() {
    this.playAnimation(this.IMAGES_BOTTLE_SPLASH);
    this.hasSplashed = true;

    if (world && world.soundManager) {
      world.soundManager.playSound("splash");
    }

    this.removeBottleAfterDelay();
  }

  /**
   * Removes the bottle from the game after a delay.
   */
  removeBottleAfterDelay() {
    setTimeout(() => {
      this.removeBottle();
    }, 500);
  }

  /**
   * Removes the bottle from the array of throwable objects.
   */
  removeBottle() {
    let index = world.throwableObjects.indexOf(this);
    if (index > -1) {
      world.throwableObjects.splice(index, 1);
    }
  }

  /**
   * Checks for collisions with enemies.
   * @returns {boolean} - True if a collision with an enemy occurred
   */
  checkCollisionWithEnemies() {
    if (this.hasSplashed) return false;

    for (let enemy of world.level.enemies) {
      if (this.isColliding(enemy)) {
        this.handleEnemyCollision(enemy);
        return true;
      }
    }
    return false;
  }

  /**
   * Handles the collision with an enemy.
   * @param {MovableObject} enemy - The enemy that was hit
   */
  handleEnemyCollision(enemy) {
    this.stopMovement();
    this.positionBottleOnEnemy(enemy);
    this.initiateSplash();
    this.damageEnemy(enemy);
    this.removeBottleAfterDelay();
  }

  /**
   * Stops the movement of the bottle.
   */
  stopMovement() {
    clearInterval(this.moveInterval);
    this.stopGravity();
  }

  /**
   * Positions the bottle on the hit enemy.
   * @param {MovableObject} enemy - The hit enemy
   */
  positionBottleOnEnemy(enemy) {
    this.y = enemy.y + enemy.height / 2 - this.height / 2;
    this.x = enemy.x + enemy.width / 2 - this.width / 2;
  }

  /**
   * Initiates the splash animation.
   */
  initiateSplash() {
    this.hasSplashed = true;
    this.loadImage(this.IMAGES_BOTTLE_SPLASH[0]);
    this.playAnimation(this.IMAGES_BOTTLE_SPLASH);
  }

  /**
   * Damages the enemy.
   * @param {MovableObject} enemy - The hit enemy
   */
  damageEnemy(enemy) {
    if (enemy instanceof Endboss) {
      enemy.takeHitFromBottle();
    } else {
      enemy.hit();
    }

    if (world && world.soundManager) {
      world.soundManager.playSound("hit");
    }
  }

  /**
   * Shows the splash animation at a specific position.
   * @param {number} x - The X position for the splash animation
   * @param {number} y - The Y position for the splash animation
   */
  showSplash(x, y) {
    this.x = x;
    this.y = y;
    this.playAnimation(this.IMAGES_BOTTLE_SPLASH);
    this.removeBottleAfterDelay();
  }

  /**
   * Stops the gravity effect on the bottle.
   */
  stopGravity() {
    this.speedY = 0;
    this.acceleration = 0;
  }
}
