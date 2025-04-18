class Endboss extends MovableObject {
  isDead = false;
  isAttacking = false;
  height = 400;
  width = 250;
  y = 55;
  directionLeft = true;
  otherDirection = true;
  energy = 100; // Assuming initial energy is 100

  IMAGES_WALKING = [
    "img/4_enemie_boss_chicken/1_walk/G1.png",
    "img/4_enemie_boss_chicken/1_walk/G2.png",
    "img/4_enemie_boss_chicken/1_walk/G3.png",
    "img/4_enemie_boss_chicken/1_walk/G4.png",
  ];
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
  IMAGES_DEAD = [
    "img/4_enemie_boss_chicken/5_dead/G24.png",
    "img/4_enemie_boss_chicken/5_dead/G25.png",
    "img/4_enemie_boss_chicken/5_dead/G26.png",
  ];
  IMAGES_HURT = [
    "img/4_enemie_boss_chicken/4_hurt/G21.png",
    "img/4_enemie_boss_chicken/4_hurt/G22.png",
    "img/4_enemie_boss_chicken/4_hurt/G23.png",
  ];

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

  takeHitFromBottle() {
    if (this.isDead) return;

    this.energy -= 20;
    this.lastHit = new Date().getTime();

    if (this.energy <= 0) {
      this.energy = 0;
      this.isDead = true;

      // Spiele Victory-Sound ab
      if (this.world && this.world.soundManager) {
        this.world.soundManager.playSound("victory");
        this.world.soundManager.stopBackgroundMusic();
      }

      this.animateDeath(() => {
        // Nach der Todesanimation
        setTimeout(() => {
          let index = this.world.level.enemies.indexOf(this);
          if (index > -1) {
            this.world.level.enemies.splice(index, 1);
          }
        }, 1000);
      });
    } else {
      this.playHurtAnimation();
    }

    this.world.statusBarEndboss.setPrecentage(this.energy);
  }

  hit() {
    this.reduceEnergy();
    this.handleHurtState();
    this.checkDeathState();
  }

  reduceEnergy() {
    this.energy -= 20;
    if (this.energy < 0) this.energy = 0;
  }

  handleHurtState() {
    if (!this.isDead) {
      this.playHurtAnimation();
    }
  }

  checkDeathState() {
    if (this.energy === 0 && !this.isDead) {
      this.die();
    }
  }

  die() {
    this.isDead = true;
    this.playAnimation(this.IMAGES_DEAD);
    this.animateDeath(() => {
      this.fallDown();
      this.shrinkAfterDeath();
    });
  }

  shrinkAfterDeath() {
    setTimeout(() => {
      this.height = 0;
      this.width = 0;
    }, 3000);
  }

  playHurtAnimation() {
    let i = 0;
    const interval = setInterval(() => {
      if (i < this.IMAGES_HURT.length) {
        this.img = this.imageCache[this.IMAGES_HURT[i]];
        i++;
      } else {
        clearInterval(interval);
      }
    }, 140); // Geschwindigkeit: 140ms pro Frame
  }

  playAttackAnimation() {
    if (this.canStartAttack()) {
      this.startAttack();
    }
  }

  canStartAttack() {
    return (
      !this.isAttacking &&
      !this.world.character.isDead() &&
      !this.otherDirection
    );
  }

  startAttack() {
    this.isAttacking = true;
    this.playAttackFrames();
  }

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

  shouldStopAttack(interval) {
    if (this.world.character.isDead()) {
      clearInterval(interval);
      this.isAttacking = false;
      this.playAlertAnimation(() => {
        this.isAttacking = false;
      });
      return true;
    }
    return false;
  }

  jumpTowardsCharacter() {
    const char = this.world.character;
    if (this.shouldCancelJump(char)) return;

    const jumpParams = this.calculateJumpParameters(char);
    this.executeJump(jumpParams);
  }

  shouldCancelJump(char) {
    if (char.isDead()) {
      this.isAttacking = false;
      this.playAlertAnimation(() => {
        this.isAttacking = false;
      });
      return true;
    }
    return false;
  }

  calculateJumpParameters(char) {
    return {
      startX: this.x,
      startY: this.y,
      targetX: char.x + char.width / 2 - this.width / 2,
      targetY: char.y + char.height - this.height,
      steps: 20,
    };
  }

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

  updateJumpPosition(params, step) {
    const t = step / params.steps;
    this.x = params.startX + (params.targetX - params.startX) * t;
    this.y =
      params.startY +
      (params.targetY - params.startY) * t -
      120 * Math.sin(Math.PI * t);
  }

  finishJump(interval) {
    clearInterval(interval);
    this.handleCharacterCollision();
    this.isAttacking = false;
    this.fallToGround();
  }

  handleCharacterCollision() {
    const char = this.world.character;
    if (!char.isDead() && this.isColliding(char)) {
      char.energy = 0;
      char.lastHit = new Date().getTime();
      this.world.statusBar.setPrecentage(char.energy);
      this.playAlertAnimation();
    }
  }

  fallToGround() {
    const groundY = 55; // Standardposition auf dem Boden
    const fallInterval = setInterval(() => {
      if (this.y < groundY) {
        this.y += 5;
      } else {
        this.y = groundY;
        clearInterval(fallInterval);
      }
    }, 40);
  }

  animateDeath(callback) {
    let i = 0;
    const interval = setInterval(() => {
      if (i < this.IMAGES_DEAD.length) {
        this.img = this.imageCache[this.IMAGES_DEAD[i]];
        i++;
      } else {
        clearInterval(interval);
        if (callback) callback();
      }
    }, 200);
  }

  fallDown() {
    let fallInterval = setInterval(() => {
      if (this.y < 400) {
        this.y += 5;
      } else {
        clearInterval(fallInterval);
      }
    }, 40);
  }

  playAlertAnimation() {
    let i = 0;
    clearInterval(this.alertInterval); // vorherige Schleife beenden
    this.alertInterval = setInterval(() => {
      this.img = this.imageCache[this.IMAGES_ALERT[i]];
      i = (i + 1) % this.IMAGES_ALERT.length; // Loop zurück zum ersten Bild
    }, 120);
  }

  animate() {
    setInterval(() => {
      if (this.isDead) return;
      this.updateBehavior();
    }, 150);
  }

  updateBehavior() {
    const distance = Math.abs(this.x - this.world.character.x);
    const char = this.world.character;

    if (this.shouldAttack(char)) {
      this.prepareAttack();
    } else if (this.shouldMove()) {
      this.move();
    }
  }

  shouldAttack(char) {
    return (
      (this.isColliding(char) && !this.isAttacking) ||
      (Math.abs(this.x - char.x) < 150 && !this.isAttacking)
    );
  }

  prepareAttack() {
    this.otherDirection = false;
    this.directionLeft = true;
    this.playAttackAnimation();
  }

  shouldMove() {
    return !this.isAttacking;
  }

  move() {
    this.playAnimation(this.IMAGES_WALKING);
    this.updatePosition();
  }

  updatePosition() {
    if (!this.directionLeft) {
      this.moveRight();
    } else {
      this.moveLeft();
    }
  }

  moveRight() {
    this.x += this.speedBoost ? 6 : 3;
    this.otherDirection = true;
    if (this.x >= 2700) this.directionLeft = true;
  }

  moveLeft() {
    this.x -= this.speedBoost ? 6 : 3;
    this.otherDirection = false;
    if (this.x <= 2200) this.directionLeft = false;
  }
}
