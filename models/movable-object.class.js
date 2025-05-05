/**
 * Represents a movable object in the game.
 * Extends the functionality of DrawableObject with movement and physics properties.
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
  /**
   * The movement speed of the object.
   * @type {number}
   */
  speed = 0.15;

  /**
   * Indicates whether the object is facing the other direction.
   * @type {boolean}
   */
  otherDirection = false;

  /**
   * The vertical speed of the object (for jumping and falling).
   * @type {number}
   */
  speedY = 0;

  /**
   * The acceleration of the object (for gravity).
   * @type {number}
   */
  acceleration = 1.2;

  /**
   * The energy/HP of the object.
   * @type {number}
   */
  energy = 100;

  /**
   * Timestamp of the last hit.
   * @type {number}
   */
  lastHit = 0;

  /**
   * Applies gravity to the object.
   * Updates the vertical position and handles ground collision.
   */
  applyGravity() {
    setInterval(() => {
      this.updateVerticalPosition();
      this.handleGroundCollision();
    }, 1000 / 60);
  }

  /**
   * Updates the vertical position based on speed and acceleration.
   */
  updateVerticalPosition() {
    if (this.isAboveGround() || this.speedY > 0) {
      this.y -= this.speedY;
      this.speedY -= this.acceleration;
    }
  }

  /**
   * Handles collision with the ground depending on object type.
   */
  handleGroundCollision() {
    if (this.isThrowableObjectOnGround()) {
      this.handleThrowableObjectGround();
    } else if (this.isCharacterOnGround()) {
      this.handleCharacterGround();
    } else if (this.isOtherOnGround()) {
      this.handleOtherGround();
    }
  }

  /**
   * Checks if this object is a ThrowableObject and on the ground.
   * @returns {boolean}
   */
  isThrowableObjectOnGround() {
    return this instanceof ThrowableObject && this.y >= 360;
  }

  /**
   * Handles ground collision for ThrowableObject.
   */
  handleThrowableObjectGround() {
    this.y = 390;
    this.speedY = 0;
    this.playAnimation(this.IMAGES_BOTTLE_SPLASH);
  }

  /**
   * Checks if this object is a Character and on the ground.
   * @returns {boolean}
   */
  isCharacterOnGround() {
    return (
      this instanceof Character &&
      this.y + this.height >= 360 &&
      this.speedY <= 0
    );
  }

  /**
   * Handles ground collision for Character.
   */
  handleCharacterGround() {
    this.y = 360 - this.height + 70;
    this.speedY = 0;
  }

  /**
   * Checks if this object is another MovableObject (e.g. Chicken) and on the ground.
   * @returns {boolean}
   */
  isOtherOnGround() {
    return (
      !(this instanceof ThrowableObject) &&
      !(this instanceof Character) &&
      this.y + this.height >= 360
    );
  }

  /**
   * Handles ground collision for other MovableObjects (e.g. Chicken).
   */
  handleOtherGround() {
    this.y = 360 - this.height;
    this.speedY = 0;
  }

  /**
   * Checks if the object is above the ground.
   * @returns {boolean} - True if the object is above the ground
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return this.y < 360;
    } else {
      return this.y < 180;
    }
  }

  /**
   * Checks if this object collides with another object, taking into account individual hitboxes.
   * @param {DrawableObject} obj - The object to check
   * @returns {boolean} - True if a collision occurs
   */
  isColliding(obj) {
    const a = this.hitbox || { top: 0, bottom: 0, left: 0, right: 0 };
    const b = obj.hitbox || { top: 0, bottom: 0, left: 0, right: 0 };

    return (
      this.x + a.left < obj.x + obj.width - b.right &&
      this.x + this.width - a.right > obj.x + b.left &&
      this.y + a.top < obj.y + obj.height - b.bottom &&
      this.y + this.height - a.bottom > obj.y + b.top
    );
  }

  /**
   * Processes a hit on the object.
   * Reduces energy and updates the last hit timestamp.
   */
  hit() {
    this.energy -= 20;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Checks if the object is dead.
   * @returns {boolean} - True if the energy is 0
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Checks if the object is hurt.
   * @returns {boolean} - True if the object was hit in the last second
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  /**
   * Plays an animation.
   * @param {string[]} images - Array of image paths for the animation
   */
  playAnimation(images) {
    if (!images || images.length === 0) {
      console.error("Error: Image array is undefined or empty!", images);
      return;
    }

    let i = this.currentImage % images.length;
    let path = images[i];

    if (this.imageCache[path]) {
      this.img = this.imageCache[path];
    } else {
      console.warn("Image not found:", path);
    }

    this.currentImage++;
  }

  /**
   * Moves the object to the right.
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Moves the object to the left.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Makes the object jump.
   */
  jump() {
    this.speedY = 30;
  }
}
