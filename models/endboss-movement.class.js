/**
 * Handles movement and attack logic for the Endboss.
 * Methods expect the Endboss instance as the first parameter.
 * @class
 */
class EndbossMovement {
  /**
   * Makes the endboss jump towards the character.
   * @param {Endboss} endboss
   */
  jumpTowardsCharacter(endboss) {
    const char = endboss.world.character;
    if (this.shouldCancelJump(endboss, char)) return;
    const jumpParams = this.calculateJumpParameters(endboss, char);
    this.executeJump(endboss, jumpParams);
  }

  /**
   * Checks if the jump should be cancelled.
   * @param {Endboss} endboss
   * @param {Character} char
   */
  shouldCancelJump(endboss, char) {
    if (char.isDead()) {
      endboss.isAttacking = false;
      endboss.animations.playAlertAnimation(endboss);
      return true;
    }
    return false;
  }

  /**
   * Calculates jump parameters.
   * @param {Endboss} endboss
   * @param {Character} char
   */
  calculateJumpParameters(endboss, char) {
    return {
      startX: endboss.x,
      startY: endboss.y,
      targetX: char.x + char.width / 2 - endboss.width / 2,
      targetY: char.y + char.height - endboss.height,
      steps: 40,
    };
  }

  /**
   * Executes the jump animation.
   * @param {Endboss} endboss
   * @param {Object} params
   */
  executeJump(endboss, params) {
    let step = 0;
    const interval = setInterval(() => {
      if (this.shouldCancelJump(endboss, endboss.world.character)) {
        clearInterval(interval);
        return;
      }
      this.updateJumpPosition(endboss, params, step);
      step++;
      if (step > params.steps) {
        this.finishJump(endboss, interval);
      }
    }, 20);
  }

  /**
   * Updates the position during jump.
   * @param {Endboss} endboss
   * @param {Object} params
   * @param {number} step
   */
  updateJumpPosition(endboss, params, step) {
    const t = step / params.steps;
    endboss.x = params.startX + (params.targetX - params.startX) * t;
    endboss.y =
      params.startY +
      (params.targetY - params.startY) * t -
      120 * Math.sin(Math.PI * t);
  }

  /**
   * Finishes the jump sequence.
   * @param {Endboss} endboss
   * @param {number} interval
   */
  finishJump(endboss, interval) {
    clearInterval(interval);
    this.handleCharacterCollision(endboss);
    endboss.isAttacking = false;
    this.fallToGround(endboss);
  }

  /**
   * Handles collision with character.
   * @param {Endboss} endboss
   */
  handleCharacterCollision(endboss) {
    const char = endboss.world.character;
    if (!char.isDead() && this.isValidCollision(endboss, char)) {
      char.energy = 0;
      char.lastHit = new Date().getTime();
      endboss.world.statusBar.setPrecentage(char.energy);
      endboss.animations.playAlertAnimation(endboss);
    }
  }

  /**
   * Checks if there is a valid collision between endboss and character.
   * @param {Endboss} endboss
   * @param {Character} char
   * @returns {boolean}
   */
  isValidCollision(endboss, char) {
    const tolerance = 20;
    const overlapX =
      endboss.x + tolerance < char.x + char.width - tolerance &&
      endboss.x + endboss.width - tolerance > char.x + tolerance;
    const overlapY =
      endboss.y + endboss.height > char.y + tolerance &&
      endboss.y < char.y + char.height - tolerance;
    const minOverlap = char.width * 0.5;
    const actualOverlap =
      Math.min(endboss.x + endboss.width, char.x + char.width) -
      Math.max(endboss.x, char.x);
    return overlapX && overlapY && actualOverlap > minOverlap;
  }

  /**
   * Makes the endboss fall to the ground.
   * @param {Endboss} endboss
   */
  fallToGround(endboss) {
    const groundY = 55;
    const fallInterval = setInterval(() => {
      if (endboss.y < groundY) {
        endboss.y += 3;
      } else {
        endboss.y = groundY;
        clearInterval(fallInterval);
      }
    }, 20);
  }

  /**
   * Checks if the attack should be stopped.
   * @param {Endboss} endboss
   * @param {number} interval
   */
  shouldStopAttack(endboss, interval) {
    if (endboss.world.character.isDead()) {
      clearInterval(interval);
      endboss.isAttacking = false;
      endboss.animations.playAlertAnimation(endboss);
      return true;
    }
    return false;
  }
}
