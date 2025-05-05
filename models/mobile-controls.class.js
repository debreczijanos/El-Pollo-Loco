/**
 * Handles mobile touch controls for the game.
 * @class
 */
class MobileControls {
  /**
   * Creates a new MobileControls instance.
   * @param {Keyboard} keyboard - The keyboard instance to update
   */
  constructor(keyboard) {
    this.keyboard = keyboard;
    this.setupControls();
  }

  /**
   * Sets up all mobile control buttons.
   */
  setupControls() {
    this.setupLeftButton();
    this.setupRightButton();
    this.setupJumpButton();
    this.setupThrowButton();
  }

  /**
   * Sets up the left movement button.
   */
  setupLeftButton() {
    const btnLeft = document.querySelector("#btn-left");
    if (btnLeft) {
      this.addTouchEvents(btnLeft, "LEFT");
    }
  }

  /**
   * Sets up the right movement button.
   */
  setupRightButton() {
    const btnRight = document.querySelector("#btn-right");
    if (btnRight) {
      this.addTouchEvents(btnRight, "RIGHT");
    }
  }

  /**
   * Sets up the jump button.
   */
  setupJumpButton() {
    const btnJump = document.querySelector("#btn-jump");
    if (btnJump) {
      this.addTouchEvents(btnJump, "SPACE");
    }
  }

  /**
   * Sets up the throw button.
   */
  setupThrowButton() {
    const btnThrow = document.querySelector("#btn-throw");
    if (btnThrow) {
      this.addTouchEvents(btnThrow, "D");
    }
  }

  /**
   * Adds touch events to a button.
   * @param {HTMLElement} button - The button element
   * @param {string} key - The key to simulate
   */
  addTouchEvents(button, key) {
    button.addEventListener("touchstart", (e) => {
      e.preventDefault();
      this.keyboard[key] = true;
    });
    button.addEventListener("touchend", (e) => {
      e.preventDefault();
      this.keyboard[key] = false;
    });
    button.addEventListener("touchcancel", (e) => {
      e.preventDefault();
      this.keyboard[key] = false;
    });
  }
}
