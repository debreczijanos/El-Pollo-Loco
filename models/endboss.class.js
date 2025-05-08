/**
 * Represents the endboss of the game.
 * The endboss is a special enemy with unique abilities such as attacks and jumps.
 * @extends MovableObject
 */
class Endboss extends MovableObject {
  /**
   * Indicates whether the endboss is dead.
   * @type {boolean}
   */
  isDead = false;

  /**
   * Indicates whether the endboss is currently attacking.
   * @type {boolean}
   */
  isAttacking = false;

  /**
   * The height of the endboss in pixels.
   * @type {number}
   */
  height = 400;

  /**
   * The width of the endboss in pixels.
   * @type {number}
   */
  width = 250;

  /**
   * The Y position of the endboss.
   * @type {number}
   */
  y = 55;

  /**
   * Indicates whether the endboss is facing left.
   * @type {boolean}
   */
  directionLeft = true;

  /**
   * Indicates whether the endboss is facing the other direction.
   * @type {boolean}
   */
  otherDirection = true;

  /**
   * The energy of the endboss.
   * @type {number}
   */
  energy = 100;

  /**
   * Array of image paths for the walking animation.
   * @type {string[]}
   */
  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];

  /**
   * Array of image paths for the alert animation.
   * @type {string[]}
   */
  IMAGES_ALERT = [
    "img/4_enemie_boss_chicken/2_alert/G5.png",
    "img/4_enemie_boss_chicken/2_alert/G6.png",
    "img/4_enemie_boss_chicken/2_alert/G7.png",
    "img/4_enemie_boss_chicken/2_alert/G8.png",
    "img/4_enemie_boss_chicken/2_alert/G9.png",
    "img/4_enemie_boss_chicken/2_alert/G10.png",
    "img/4_enemie_boss_chicken/2_alert/G11.png",
    "img/4_enemie_boss_chicken/2_alert/G12.png",
  ];

  /**
   * Array of image paths for the attack animation.
   * @type {string[]}
   */
  IMAGES_ATTACK = [
    "img/4_enemie_boss_chicken/3_attack/G13.png",
    "img/4_enemie_boss_chicken/3_attack/G14.png",
    "img/4_enemie_boss_chicken/3_attack/G15.png",
    "img/4_enemie_boss_chicken/3_attack/G16.png",
    "img/4_enemie_boss_chicken/3_attack/G17.png",
    "img/4_enemie_boss_chicken/3_attack/G18.png",
    "img/4_enemie_boss_chicken/3_attack/G19.png",
    "img/4_enemie_boss_chicken/3_attack/G20.png",
  ];

  /**
   * Array of image paths for the death animation.
   * @type {string[]}
   */
  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];

  /**
   * Array of image paths for the hurt animation.
   * @type {string[]}
   */
  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

  /**
   * Creates a new instance of the endboss.
   * @param {StatusBar} statusBar - The status bar for the endboss
   * @param {World} world - The game world
   */
  constructor(statusBar, world) {
    super().loadImage(this.IMAGES_WALKING[0]);
    this.loadImages(this.IMAGES_WALKING);
    this.loadImages(this.IMAGES_HURT);
    this.loadImages(this.IMAGES_ATTACK);
    this.loadImages(this.IMAGES_DEAD);
    this.loadImages(this.IMAGES_ALERT);
    this.statusBar = statusBar;
    this.world = world;
    this.x = 2500;
    this.baseSpeed = 3;
    this.animations = new EndbossAnimations();
    this.movement = new EndbossMovement();
    this.animate();
  }

  /**
   * Handles the endboss being hit by a bottle.
   * Manages damage, death state, and animations.
   */
  takeHitFromBottle() {
    if (this.isDead) return;

    this.applyDamage();
    this.checkDeathState();
    this.updateStatusBar();
  }

  /**
   * Applies damage to the endboss and updates last hit time.
   */
  applyDamage() {
    this.energy -= 20;
    this.lastHit = new Date().getTime();
  }

  /**
   * Checks if the endboss should die and handles death sequence.
   */
  checkDeathState() {
    if (this.energy <= 0) {
      this.handleDeath();
    } else {
      this.animations.playHurtAnimation(this);
    }
  }

  /**
   * Handles the death sequence of the endboss.
   */
  handleDeath() {
    this.energy = 0;
    this.isDead = true;
    this.playVictorySound();
    this.animations.animateDeath(this, () => {
      this.removeFromGame();
    });
  }

  /**
   * Plays victory sound and stops background music.
   */
  playVictorySound() {
    if (this.world && this.world.soundManager) {
      this.world.soundManager.playSound("victory");
      this.world.soundManager.stopBackgroundMusic();
    }
  }

  /**
   * Removes the endboss from the game after a delay.
   */
  removeFromGame() {
    setTimeout(() => {
      let index = this.world.level.enemies.indexOf(this);
      if (index > -1) {
        this.world.level.enemies.splice(index, 1);
      }
    }, 1000);
  }

  /**
   * Updates the endboss status bar with current energy.
   */
  updateStatusBar() {
    this.world.statusBarEndboss.setPrecentage(this.energy);
  }

  /**
   * Handles the attack sequence.
   */
  playAttackAnimation() {
    this.animations.playAttackAnimation(this);
    this.movement.jumpTowardsCharacter(this);
  }

  /**
   * Main animation loop.
   */
  animate() {
    setInterval(() => {
      if (this.isDead) return;
      this.updateBehavior();
    }, 150);
  }

  /**
   * Updates the endboss behavior based on energy level and character position.
   * This is the main behavior control function.
   */
  updateBehavior() {
    const char = this.world.character;
    this.speedBoost = this.energy < 80;
    this.handleBehaviorBasedOnEnergy(char);
  }

  /**
   * Determines which behavior phase to activate based on current energy level.
   * @param {Character} char - The character to interact with
   */
  handleBehaviorBasedOnEnergy(char) {
    if (this.energy < 30) {
      this.handleAggressivePhase(char);
    } else if (this.energy < 50) {
      this.handleChasePhase(char);
    } else {
      this.handleNormalPhase(char);
    }
  }

  /**
   * Handles the aggressive phase behavior when energy is below 30%.
   * Endboss becomes extremely fast and aggressive.
   * @param {Character} char - The character to interact with
   */
  handleAggressivePhase(char) {
    if (this.shouldAttack(char)) {
      this.prepareAttack();
    } else {
      this.aggressiveFollow();
    }
  }

  /**
   * Handles the chase phase behavior when energy is between 30% and 50%.
   * Endboss actively follows the character.
   * @param {Character} char - The character to interact with
   */
  handleChasePhase(char) {
    if (this.shouldAttack(char)) {
      this.prepareAttack();
    } else {
      this.followCharacter();
    }
  }

  /**
   * Handles the normal phase behavior when energy is above 50%.
   * Endboss moves in a standard pattern.
   * @param {Character} char - The character to interact with
   */
  handleNormalPhase(char) {
    if (this.shouldAttack(char)) {
      this.prepareAttack();
    } else if (this.shouldMove()) {
      this.move();
    }
  }

  /**
   * Makes the endboss follow the character at maximum speed.
   * Used during the aggressive phase.
   */
  aggressiveFollow() {
    const char = this.world.character;
    this.playAnimation(this.IMAGES_WALKING);
    const speed = this.baseSpeed * 8;
    if (char.x > this.x) {
      this.x += speed;
      this.otherDirection = true;
      this.directionLeft = false;
    } else {
      this.x -= speed;
      this.otherDirection = false;
      this.directionLeft = true;
    }
  }

  /**
   * Makes the endboss follow the character at normal or boosted speed.
   * Used during the chase phase (30-50% energy).
   * Speed is increased when energy is below 80%.
   */
  followCharacter() {
    const char = this.world.character;
    this.playAnimation(this.IMAGES_WALKING);
    const speed = this.speedBoost ? this.baseSpeed * 4 : this.baseSpeed;
    if (char.x > this.x) {
      this.x += speed;
      this.otherDirection = true;
      this.directionLeft = false;
    } else {
      this.x -= speed;
      this.otherDirection = false;
      this.directionLeft = true;
    }
  }

  /**
   * Checks if the endboss should attack.
   */
  shouldAttack(char) {
    return (
      (this.isColliding(char) && !this.isAttacking) ||
      (Math.abs(this.x - char.x) < 150 && !this.isAttacking)
    );
  }

  /**
   * Prepares for attack.
   */
  prepareAttack() {
    if (this.isAttacking) return;
    this.otherDirection = false;
    this.directionLeft = true;
    this.isAttacking = true;
    this.playAttackAnimation();
  }

  /**
   * Checks if the endboss should move.
   */
  shouldMove() {
    return !this.isAttacking;
  }

  /**
   * Handles movement.
   */
  move() {
    this.playAnimation(this.IMAGES_WALKING);
    this.updatePosition();
  }

  /**
   * Updates the position based on direction.
   */
  updatePosition() {
    if (!this.directionLeft) {
      this.moveRight();
    } else {
      this.moveLeft();
    }
  }

  /**
   * Moves the endboss right.
   */
  moveRight() {
    const speed = this.speedBoost ? this.baseSpeed * 2 : this.baseSpeed;
    this.x += speed;
    this.otherDirection = true;
    if (this.x >= 2700) this.directionLeft = true;
  }

  /**
   * Moves the endboss left.
   */
  moveLeft() {
    const speed = this.speedBoost ? this.baseSpeed * 2 : this.baseSpeed;
    this.x -= speed;
    this.otherDirection = false;
    if (this.x <= 2200) this.directionLeft = false;
  }

  /**
   * Jumps towards the character.
   */
  jumpTowardsCharacter() {
    this.movement.jumpTowardsCharacter(this);
  }

  /**
   * Checks if the endboss can start an attack.
   * @returns {boolean} True if the endboss can start an attack, false otherwise.
   */
  canStartAttack() {
    return (
      !this.isAttacking &&
      !this.world.character.isDead() &&
      !this.otherDirection
    );
  }
}
