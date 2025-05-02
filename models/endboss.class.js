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
      this.playHurtAnimation();
    }
  }

  /**
   * Handles the death sequence of the endboss.
   */
  handleDeath() {
    this.energy = 0;
    this.isDead = true;
    this.playVictorySound();
    this.animateDeath(() => {
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
   * Plays the hurt animation sequence.
   */
  playHurtAnimation() {
    let i = 0;
    const interval = setInterval(() => {
      if (i < this.IMAGES_HURT.length) {
        this.img = this.imageCache[this.IMAGES_HURT[i]];
        i++;
      } else {
        clearInterval(interval);
      }
    }, 140);
  }

  /**
   * Handles the attack sequence.
   */
  playAttackAnimation() {
    if (this.canStartAttack()) {
      this.startAttack();
    }
  }

  /**
   * Checks if the endboss can start an attack.
   */
  canStartAttack() {
    return (
      !this.isAttacking &&
      !this.world.character.isDead() &&
      !this.otherDirection
    );
  }

  /**
   * Starts the attack sequence.
   */
  startAttack() {
    this.isAttacking = true;
    this.playAttackFrames();
  }

  /**
   * Plays the attack animation frames.
   */
  playAttackFrames() {
    let i = 0;
    const interval = setInterval(() => {
      if (this.shouldStopAttack(interval)) return;

      if (i < this.IMAGES_ATTACK.length) {
        this.img = this.imageCache[this.IMAGES_ATTACK[i]];
        i++;
      } else {
        clearInterval(interval);
        this.jumpTowardsCharacter();
      }
    }, 100);
  }

  /**
   * Checks if the attack should be stopped.
   */
  shouldStopAttack(interval) {
    if (this.world.character.isDead()) {
      clearInterval(interval);
      this.isAttacking = false;
      this.playAlertAnimation();
      return true;
    }
    return false;
  }

  /**
   * Makes the endboss jump towards the character.
   */
  jumpTowardsCharacter() {
    const char = this.world.character;
    if (this.shouldCancelJump(char)) return;

    const jumpParams = this.calculateJumpParameters(char);
    this.executeJump(jumpParams);
  }

  /**
   * Checks if the jump should be cancelled.
   */
  shouldCancelJump(char) {
    if (char.isDead()) {
      this.isAttacking = false;
      this.playAlertAnimation();
      return true;
    }
    return false;
  }

  /**
   * Calculates jump parameters.
   */
  calculateJumpParameters(char) {
    return {
      startX: this.x,
      startY: this.y,
      targetX: char.x + char.width / 2 - this.width / 2,
      targetY: char.y + char.height - this.height,
      steps: 20,
    };
  }

  /**
   * Executes the jump animation.
   */
  executeJump(params) {
    let step = 0;
    const interval = setInterval(() => {
      if (this.shouldCancelJump(this.world.character)) {
        clearInterval(interval);
        return;
      }

      this.updateJumpPosition(params, step);

      step++;
      if (step > params.steps) {
        this.finishJump(interval);
      }
    }, 40);
  }

  /**
   * Updates the position during jump.
   */
  updateJumpPosition(params, step) {
    const t = step / params.steps;
    this.x = params.startX + (params.targetX - params.startX) * t;
    this.y =
      params.startY +
      (params.targetY - params.startY) * t -
      120 * Math.sin(Math.PI * t);
  }

  /**
   * Finishes the jump sequence.
   */
  finishJump(interval) {
    clearInterval(interval);
    this.handleCharacterCollision();
    this.isAttacking = false;
    this.fallToGround();
  }

  /**
   * Handles collision with character.
   */
  handleCharacterCollision() {
    const char = this.world.character;
    if (!char.isDead() && this.isColliding(char)) {
      char.energy = 0;
      char.lastHit = new Date().getTime();
      this.world.statusBar.setPrecentage(char.energy);
      this.playAlertAnimation();
    }
  }

  /**
   * Makes the endboss fall to the ground.
   */
  fallToGround() {
    const groundY = 55;
    const fallInterval = setInterval(() => {
      if (this.y < groundY) {
        this.y += 5;
      } else {
        this.y = groundY;
        clearInterval(fallInterval);
      }
    }, 40);
  }

  /**
   * Animates the death sequence.
   */
  animateDeath(callback) {
    let i = 0;
    const interval = setInterval(() => {
      if (i < this.IMAGES_DEAD.length) {
        this.img = this.imageCache[this.IMAGES_DEAD[i]];
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          if (callback) callback();
        }, 1000);
      }
    }, 500);
  }

  /**
   * Plays the alert animation.
   */
  playAlertAnimation() {
    let i = 0;
    clearInterval(this.alertInterval);
    this.alertInterval = setInterval(() => {
      this.img = this.imageCache[this.IMAGES_ALERT[i]];
      i = (i + 1) % this.IMAGES_ALERT.length;
    }, 120);
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
   * Updates the endboss behavior.
   */
  updateBehavior() {
    const char = this.world.character;
    if (this.shouldAttack(char)) {
      this.prepareAttack();
    } else if (this.shouldMove()) {
      this.move();
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
    this.otherDirection = false;
    this.directionLeft = true;
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
    this.x += this.speedBoost ? 6 : 3;
    this.otherDirection = true;
    if (this.x >= 2700) this.directionLeft = true;
  }

  /**
   * Moves the endboss left.
   */
  moveLeft() {
    this.x -= this.speedBoost ? 6 : 3;
    this.otherDirection = false;
    if (this.x <= 2200) this.directionLeft = false;
  }
}
