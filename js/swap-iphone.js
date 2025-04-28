/**
 * Checks if the device is in portrait mode.
 * @returns {boolean} - True if the device is in portrait mode, false otherwise.
 */
function isPortraitMode() {
  return window.innerWidth < 667;
}

/**
 * Handles the portrait mode display.
 * @param {HTMLElement} warning - The warning element.
 * @param {HTMLElement} gameScreenSwap - The game screen element.
 */
function handlePortraitMode(warning, gameScreenSwap) {
  warning.style.display = "flex";
  gameScreenSwap.style.display = "none";
}

/**
 * Handles the landscape mode display.
 * @param {HTMLElement} warning - The warning element.
 * @param {HTMLElement} gameScreenSwap - The game screen element.
 */
function handleLandscapeMode(warning, gameScreenSwap) {
  warning.style.display = "none";
  gameScreenSwap.style.removeProperty("display");
  setupMobileControls();
}

/**
 * Sets up mobile controls based on device type.
 */
function setupMobileControls() {
  const descriptionMobile = document.querySelector(".description-mobile");
  const description = document.querySelectorAll(".description");
  const isMobileDevice = /Mobi|Android|iPhone/i.test(navigator.userAgent);

  if (isMobileDevice) {
    descriptionMobile.style.display = "flex";
    description.forEach((el) => {
      el.style.display = "none";
    });
  } else {
    descriptionMobile.style.display = "none";
    description.forEach((el) => {
      el.style.removeProperty("display");
    });
  }
}

/**
 * Main function to check and handle device orientation.
 */
function checkOrientation() {
  const warning = document.getElementById("swapYourPhone");
  const gameScreenSwap = document.getElementById("gameScreen");

  if (isPortraitMode()) {
    handlePortraitMode(warning, gameScreenSwap);
  } else {
    handleLandscapeMode(warning, gameScreenSwap);
  }
}

/**
 * Add event listeners for orientation changes
 */
window.addEventListener("load", checkOrientation);
window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);
