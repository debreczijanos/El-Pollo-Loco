/**
 * Represents the main character (Pepe) in the game.
 * Handles all character-specific animations, movements, and interactions.
 * @extends MovableObject
 */
class Character extends MovableObject {
  /** @type {number} Height of the character in pixels */
  height = 250;
  /** @type {number} Initial y-position of the character */
  y = 80;
  /** @type {number} Movement speed of the character */
  speed = 5;
  /** @type {number} Number of bottles collected by the character */
  collectedBottles = 0;
  /** @type {boolean} Flag indicating if the character just stomped an enemy */
  justStomped = false;
  /** @type {boolean} Indicates if the jump animation is currently active */
  isJumpingAnimationActive = false;

  /** @type {string[]} Array of image paths for walking animation */
  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];

  /** @type {string[]} Array of image paths for jumping animation */
  IMAGES_JUMPING = [
    "img/2_character_pepe/3_jump/J-31.png",
    "img/2_character_pepe/3_jump/J-32.png",
    "img/2_character_pepe/3_jump/J-33.png",
    "img/2_character_pepe/3_jump/J-34.png",
    "img/2_character_pepe/3_jump/J-35.png",
    "img/2_character_pepe/3_jump/J-36.png",
    "img/2_character_pepe/3_jump/J-37.png",
    "img/2_character_pepe/3_jump/J-38.png",
    "img/2_character_pepe/3_jump/J-39.png",
  ];

  /** @type {string[]} Array of image paths for death animation */
  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];

  /** @type {string[]} Array of image paths for hurt animation */
  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];

  /** @type {string[]} Array of image paths for idle animation */
  IMAGES_IDLE = [
    "img/2_character_pepe/1_idle/idle/I-1.png",
    "img/2_character_pepe/1_idle/idle/I-2.png",
    "img/2_character_pepe/1_idle/idle/I-3.png",
    "img/2_character_pepe/1_idle/idle/I-4.png",
    "img/2_character_pepe/1_idle/idle/I-5.png",
    "img/2_character_pepe/1_idle/idle/I-6.png",
    "img/2_character_pepe/1_idle/idle/I-7.png",
    "img/2_character_pepe/1_idle/idle/I-8.png",
    "img/2_character_pepe/1_idle/idle/I-9.png",
    "img/2_character_pepe/1_idle/idle/I-10.png",
  ];

  /** @type {string[]} Array of image paths for long idle animation */
  IMAGES_LONG_IDLE = [
    "img/2_character_pepe/1_idle/long_idle/I-11.png",
    "img/2_character_pepe/1_idle/long_idle/I-12.png",
    "img/2_character_pepe/1_idle/long_idle/I-13.png",
    "img/2_character_pepe/1_idle/long_idle/I-14.png",
    "img/2_character_pepe/1_idle/long_idle/I-15.png",
    "img/2_character_pepe/1_idle/long_idle/I-16.png",
    "img/2_character_pepe/1_idle/long_idle/I-17.png",
    "img/2_character_pepe/1_idle/long_idle/I-18.png",
    "img/2_character_pepe/1_idle/long_idle/I-19.png",
    "img/2_character_pepe/1_idle/long_idle/I-20.png",
  ];

  /** @type {World} Reference to the game world */
  world;
  /** @type {boolean} Flag indicating if death animation has been played */
  hasPlayedDeathAnimation = false;
  /** @type {number} Current frame of death animation */
  deathAnimationFrame = 0;
  /** @type {boolean} Flag indicating if walking sound is currently playing */
  isWalkingSoundPlaying = false;
  /** @type {boolean} Flag indicating if hurt sound has been played */
  hasPlayedHurtSound = false;

  /** @type {object} Hitbox for the character */
  hitbox = { top: 130, bottom: 0, left: 35, right: 35 };

  /**
   * Creates a new Character instance.
   * Loads all necessary images and sets up initial state.
   */
  constructor() {
    super().loadImage("img/2_character_pepe/2_walk/W-21.png");
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_JUMPING);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_IDLE);
    this.loadImages(this.IMAGES_LONG_IDLE);
    this.applyGravity();
    this.animate();
  }

  /**
   * Starts the character's animation and movement intervals.
   */
  animate() {
    this.setupMovementInterval();
    this.setupAnimationInterval();
  }

  /**
   * Sets up the interval for character movement.
   * Checks if character is dead before handling movement.
   */
  setupMovementInterval() {
    setInterval(() => {
      if (this.isDead()) return;
      this.handleMovement();
    }, 1000 / 60);
  }

  /**
   * Handles all character movement including horizontal movement, jumping, and camera updates.
   */
  handleMovement() {
    this.handleHorizontalMovement();
    this.handleJump();
    this.updateCameraPosition();
  }

  /**
   * Handles horizontal movement based on keyboard input.
   * Updates character position and direction.
   */
  handleHorizontalMovement() {
    let isMoving = false;

    if (this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
      this.moveRight();
      this.otherDirection = false;
      isMoving = true;
    } else if (this.world.keyboard.LEFT && this.x > 0) {
      this.moveLeft();
      this.otherDirection = true;
      isMoving = true;
    }

    this.handleWalkingSound(isMoving);
  }

  /**
   * Controls the walking sound based on character movement.
   * @param {boolean} isMoving - Whether the character is currently moving
   */
  handleWalkingSound(isMoving) {
    if (isMoving && !this.isWalkingSoundPlaying) {
      this.playWalkingSound();
    } else if (!isMoving && this.isWalkingSoundPlaying) {
      this.stopWalkingSound();
    }
  }

  /**
   * Handles character jumping when space key is pressed and character is on ground.
   */
  handleJump() {
    if (this.world.keyboard.SPACE && !this.isAboveGround()) {
      this.jump();
    }
  }

  /**
   * Updates the camera position based on character's x-position.
   */
  updateCameraPosition() {
    this.world.camera_x = -this.x + 100;
  }

  /**
   * Sets up the interval for character animations.
   * Handles different animation states based on character condition.
   */
  setupAnimationInterval() {
    let idleTime = 0;
    setInterval(() => {
      if (this.isDead()) {
        this.handleDeathAnimation();
        return;
      }
      idleTime = this.updateAnimationState(idleTime);
    }, 50);
  }

  /**
   * Handles the death animation sequence.
   * Ensures death animation is played only once.
   */
  handleDeathAnimation() {
    if (!this.hasPlayedDeathAnimation) {
      this.hasPlayedDeathAnimation = true;
      this.playDeathAnimation();
    }
  }

  /**
   * Plays the death animation sequence.
   * Updates the character's image based on death animation frames.
   */
  playDeathAnimation() {
    this.deathAnimationInterval = setInterval(() => {
      if (this.deathAnimationFrame < this.IMAGES_DEAD.length) {
        const path = this.IMAGES_DEAD[this.deathAnimationFrame];
        this.img = this.imageCache[path];
        this.deathAnimationFrame++;
      } else {
        clearInterval(this.deathAnimationInterval);
      }
    }, 100);
  }

  /**
   * Updates the character's animation state based on current conditions.
   * @param {number} idleTime - Current idle time in milliseconds
   * @returns {number} Updated idle time
   */
  updateAnimationState(idleTime) {
    if (this.isHurt()) {
      this.handleHurtAnimation();
      return 0;
    } else if (this.isAboveGround()) {
      this.handleJumpAnimation();
      return 0;
    } else if (this.isWalking()) {
      this.handleWalkingAnimation();
      return 0;
    } else {
      return this.handleIdleAnimation(idleTime);
    }
  }

  /**
   * Handles the hurt animation and sound.
   */
  handleHurtAnimation() {
    this.playAnimation(this.IMAGES_HURT);
    this.playHurtSound();
    this.isJumpingAnimationActive = false;
  }

  /**
   * Handles the jump animation.
   */
  handleJumpAnimation() {
    if (!this.isJumpingAnimationActive) {
      this.currentImage = 0;
      this.isJumpingAnimationActive = true;
    }
    this.playAnimation(this.IMAGES_JUMPING);
  }

  /**
   * Handles the walking animation.
   */
  handleWalkingAnimation() {
    this.playAnimation(this.IMAGES_WALKING);
    this.isJumpingAnimationActive = false;
  }

  /**
   * Handles the idle animation and returns updated idle time.
   * @param {number} idleTime - Current idle time in milliseconds
   * @returns {number} Updated idle time
   */
  handleIdleAnimation(idleTime) {
    idleTime += 50;
    this.updateIdleAnimation(idleTime);
    this.isJumpingAnimationActive = false;
    return idleTime;
  }

  /**
   * Checks if the character is currently walking.
   * @returns {boolean} True if walking, false otherwise
   */
  isWalking() {
    return this.world.keyboard.RIGHT || this.world.keyboard.LEFT;
  }

  /**
   * Updates the idle animation based on idle time.
   * @param {number} idleTime - Current idle time in milliseconds
   */
  updateIdleAnimation(idleTime) {
    if (idleTime > 4000) {
      this.playAnimation(this.IMAGES_LONG_IDLE);
    } else {
      this.playAnimation(this.IMAGES_IDLE);
    }
  }

  /**
   * Makes the character jump and plays jump sound.
   */
  jump() {
    this.speedY = 18;
    if (this.world && this.world.soundManager) {
      this.world.soundManager.playSound("jump");
    }
  }

  /**
   * Stops all character animations and sounds.
   */
  stopAnimation() {
    if (this.deathAnimationInterval) {
      clearInterval(this.deathAnimationInterval);
    }
    let highestIntervalId = setInterval(() => {}, 0);
    for (let i = 0; i < highestIntervalId; i++) {
      clearInterval(i);
    }
    this.stopWalkingSound();
  }

  /**
   * Plays the walking sound effect.
   */
  playWalkingSound() {
    if (this.world && this.world.soundManager) {
      this.world.soundManager.playSound("walking");
      this.isWalkingSoundPlaying = true;
    }
  }

  /**
   * Stops the walking sound effect.
   */
  stopWalkingSound() {
    if (this.world && this.world.soundManager && this.isWalkingSoundPlaying) {
      this.world.soundManager.sounds.walking.pause();
      this.world.soundManager.sounds.walking.currentTime = 0;
      this.isWalkingSoundPlaying = false;
    }
  }

  /**
   * Plays the hurt sound effect.
   * Ensures hurt sound is played only once per hit.
   */
  playHurtSound() {
    if (this.world && this.world.soundManager && !this.hasPlayedHurtSound) {
      this.world.soundManager.playSound("hurt");
      this.hasPlayedHurtSound = true;

      setTimeout(() => {
        this.hasPlayedHurtSound = false;
      }, 1000);
    }
  }
}
