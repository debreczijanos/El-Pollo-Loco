/**
 * Handles animation sequences for the Endboss.
 * Methods expect the Endboss instance as the first parameter.
 * @class
 */
class EndbossAnimations {
  /**
   * Plays the hurt animation sequence.
   * @param {Endboss} endboss - The Endboss instance
   */
  playHurtAnimation(endboss) {
    let i = 0;
    const interval = setInterval(() => {
      if (i < endboss.IMAGES_HURT.length) {
        endboss.img = endboss.imageCache[endboss.IMAGES_HURT[i]];
        i++;
      } else {
        clearInterval(interval);
      }
    }, 140);
  }

  /**
   * Plays the attack animation frames.
   * @param {Endboss} endboss - The Endboss instance
   */
  playAttackAnimation(endboss) {
    this.playAttackFrames(endboss);
  }

  /**
   * Plays the attack animation frames (helper).
   * @param {Endboss} endboss - The Endboss instance
   */
  playAttackFrames(endboss) {
    let i = 0;
    const interval = setInterval(() => {
      if (i < endboss.IMAGES_ATTACK.length) {
        endboss.img = endboss.imageCache[endboss.IMAGES_ATTACK[i]];
        i++;
      } else {
        clearInterval(interval);
      }
    }, 120);
  }

  /**
   * Plays the alert animation sequence.
   * @param {Endboss} endboss - The Endboss instance
   */
  playAlertAnimation(endboss) {
    let i = 0;
    const interval = setInterval(() => {
      if (i < endboss.IMAGES_ALERT.length) {
        endboss.img = endboss.imageCache[endboss.IMAGES_ALERT[i]];
        i++;
      } else {
        clearInterval(interval);
      }
    }, 120);
  }

  /**
   * Plays the death animation sequence and calls a callback when finished.
   * @param {Endboss} endboss - The Endboss instance
   * @param {Function} callback - Function to call after animation
   */
  animateDeath(endboss, callback) {
    let i = 0;
    const interval = setInterval(() => {
      if (i < endboss.IMAGES_DEAD.length) {
        endboss.img = endboss.imageCache[endboss.IMAGES_DEAD[i]];
        i++;
      } else {
        clearInterval(interval);
        if (callback) callback();
      }
    }, 200);
  }
}
