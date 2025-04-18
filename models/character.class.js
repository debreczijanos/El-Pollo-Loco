class Character extends MovableObject {
  height = 250;
  y = 80;
  speed = 10;
  collectedBottles = 0;
  justStomped = false;
  IMAGES_WALKING = [
    "img/2_character_pepe/2_walk/W-21.png",
    "img/2_character_pepe/2_walk/W-22.png",
    "img/2_character_pepe/2_walk/W-23.png",
    "img/2_character_pepe/2_walk/W-24.png",
    "img/2_character_pepe/2_walk/W-25.png",
    "img/2_character_pepe/2_walk/W-26.png",
  ];
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
  IMAGES_DEAD = [
    "img/2_character_pepe/5_dead/D-51.png",
    "img/2_character_pepe/5_dead/D-52.png",
    "img/2_character_pepe/5_dead/D-53.png",
    "img/2_character_pepe/5_dead/D-54.png",
    "img/2_character_pepe/5_dead/D-55.png",
    "img/2_character_pepe/5_dead/D-56.png",
    "img/2_character_pepe/5_dead/D-57.png",
  ];
  IMAGES_HURT = [
    "img/2_character_pepe/4_hurt/H-41.png",
    "img/2_character_pepe/4_hurt/H-42.png",
    "img/2_character_pepe/4_hurt/H-43.png",
  ];
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

  world;
  hasPlayedDeathAnimation = false;
  deathAnimationFrame = 0;
  isWalkingSoundPlaying = false;
  hasPlayedHurtSound = false;

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

  animate() {
    this.setupMovementInterval();
    this.setupAnimationInterval();
  }

  setupMovementInterval() {
    setInterval(() => {
      if (this.isDead()) return;
      this.handleMovement();
    }, 1000 / 60);
  }

  handleMovement() {
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

    // Sound-Steuerung basierend auf Bewegung
    if (isMoving && !this.isWalkingSoundPlaying) {
      this.playWalkingSound();
    } else if (!isMoving && this.isWalkingSoundPlaying) {
      this.stopWalkingSound();
    }

    if (this.world.keyboard.SPACE && !this.isAboveGround()) {
      this.jump();
    }
    this.world.camera_x = -this.x + 100;
  }

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

  handleDeathAnimation() {
    if (!this.hasPlayedDeathAnimation) {
      this.hasPlayedDeathAnimation = true;
      this.playDeathAnimation();
    }
  }

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

  updateAnimationState(idleTime) {
    if (this.isHurt()) {
      this.playAnimation(this.IMAGES_HURT);
      this.playHurtSound();
      return 0;
    } else if (this.isAboveGround()) {
      this.playAnimation(this.IMAGES_JUMPING);
      return 0;
    } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
      this.playAnimation(this.IMAGES_WALKING);
      return 0;
    } else {
      idleTime += 50;
      this.updateIdleAnimation(idleTime);
      return idleTime;
    }
  }

  updateIdleAnimation(idleTime) {
    if (idleTime > 4000) {
      this.playAnimation(this.IMAGES_LONG_IDLE);
    } else {
      this.playAnimation(this.IMAGES_IDLE);
    }
  }

  jump() {
    this.speedY = 30;
    if (this.world && this.world.soundManager) {
      this.world.soundManager.playSound("jump");
    }
  }

  stopAnimation() {
    if (this.deathAnimationInterval) {
      clearInterval(this.deathAnimationInterval);
    }
    // Stoppe alle anderen Animationen
    let highestIntervalId = setInterval(() => {}, 0);
    for (let i = 0; i < highestIntervalId; i++) {
      clearInterval(i);
    }

    // Stoppe den Walking-Sound
    this.stopWalkingSound();
  }

  playWalkingSound() {
    if (this.world && this.world.soundManager) {
      this.world.soundManager.playSound("walking");
      this.isWalkingSoundPlaying = true;
    }
  }

  stopWalkingSound() {
    if (this.world && this.world.soundManager && this.isWalkingSoundPlaying) {
      this.world.soundManager.sounds.walking.pause();
      this.world.soundManager.sounds.walking.currentTime = 0;
      this.isWalkingSoundPlaying = false;
    }
  }

  playHurtSound() {
    if (this.world && this.world.soundManager && !this.hasPlayedHurtSound) {
      this.world.soundManager.playSound("hurt");
      this.hasPlayedHurtSound = true;

      // Setze den Flag zurück, damit der Sound beim nächsten Verletztwerden wieder abgespielt wird
      setTimeout(() => {
        this.hasPlayedHurtSound = false;
      }, 1000);
    }
  }
}

let collisionInterval = setInterval(() => {
  console.log({
    characterEnergy: world.character.energy,
    isHurt: world.character.isHurt(),
    justStomped: world.character.justStomped,
    statusBarPercentage: world.statusBar.percentage,
    chickens: world.level.enemies
      .filter((e) => e instanceof Chicken)
      .map((c) => ({ isDead: c.isDead, ignoreCollisions: c.ignoreCollisions })),
  });
}, 500);
