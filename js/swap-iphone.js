/**
 * Checks if the device is in portrait mode.
 * @returns {boolean} - True if the device is in portrait mode, false otherwise.
 */
function isPortraitMode() {
  return window.innerHeight > window.innerWidth;
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
  const isMobileOrTablet = isMobileDevice() || isTablet();

  if (isMobileOrTablet) {
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

  if (isMobileDevice() && isPortraitMode()) {
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

/**
 * Checks if the current device is a mobile device (phone or small screen).
 * @returns {boolean} True if the device is a mobile device, false otherwise.
 */
function isMobileDevice() {
  return (
    /Mobi|Android|iPhone/i.test(navigator.userAgent) || window.innerWidth < 700
  );
}

/**
 * Checks if the current device is a tablet (based on user agent, touch capability, and screen width).
 * @returns {boolean} True if the device is detected as a tablet, false otherwise.
 */
function isTablet() {
  const ua = navigator.userAgent;
  const isIPad = /iPad/.test(ua);
  const isAndroidTablet = /Android/.test(ua) && !/Mobile/.test(ua);
  const isGenericTablet = /Tablet/.test(ua);
  const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 1;
  const width = window.innerWidth;
  return (
    isIPad ||
    isAndroidTablet ||
    isGenericTablet ||
    (hasTouch && width >= 700 && width <= 1366)
  );
}
