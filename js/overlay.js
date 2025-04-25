document.addEventListener("DOMContentLoaded", () => {
  setupOverlaySystem();
});

/**
 * Initializes the overlay system by setting up overlays and global click handling.
 */
function setupOverlaySystem() {
  setupOverlay("impressum", "impressumOverlay", "closeImpressumOverlay");
  setupOverlay(
    "gameDescriptiom",
    "gameDescriptionOverlay",
    "closeGameDescriptionOverlay"
  );
  document.addEventListener("click", handleGlobalClick);
}

/**
 * Sets up the event listeners for a specific overlay and its corresponding buttons.
 *
 * @param {string} buttonId - The ID of the button that opens the overlay.
 * @param {string} overlayId - The ID of the overlay to show/hide.
 * @param {string} closeButtonId - The ID of the button that closes the overlay.
 */
function setupOverlay(buttonId, overlayId, closeButtonId) {
  const button = document.getElementById(buttonId);
  const overlay = document.getElementById(overlayId);
  const closeButton = document.getElementById(closeButtonId);

  if (button && overlay && closeButton) {
    button.addEventListener("click", (e) => openOverlay(e, button, overlay));
    closeButton.addEventListener("click", (e) =>
      closeOverlay(e, button, overlay)
    );
  }
}

/**
 * Opens an overlay, closes all others, and highlights the associated button.
 *
 * @param {MouseEvent} event - The click event.
 * @param {HTMLElement} button - The button element associated with the overlay.
 * @param {HTMLElement} overlay - The overlay element to show.
 */
function openOverlay(event, button, overlay) {
  event.stopPropagation();
  closeAllOverlays();
  overlay.classList.add("show");
  button.classList.add("button-active");
}

/**
 * Closes a specific overlay and deactivates the associated button.
 *
 * @param {MouseEvent} event - The click event.
 * @param {HTMLElement} button - The button element associated with the overlay.
 * @param {HTMLElement} overlay - The overlay element to hide.
 */
function closeOverlay(event, button, overlay) {
  event.stopPropagation();
  overlay.classList.remove("show");
  button.classList.remove("button-active");
}

/**
 * Closes all open overlays and deactivates all buttons.
 */
function closeAllOverlays() {
  document
    .querySelectorAll(".overlay")
    .forEach((overlay) => overlay.classList.remove("show"));
  document
    .querySelectorAll(".impressum-description button")
    .forEach((button) => button.classList.remove("button-active"));
}

/**
 * Handles clicks on the document to close overlays if a click occurs outside.
 *
 * @param {MouseEvent} event - The click event.
 */
function handleGlobalClick(event) {
  if (
    ![
      ...document.querySelectorAll(".overlay"),
      ...document.querySelectorAll(".impressum-description button"),
    ].some((el) => el.contains(event.target))
  ) {
    closeAllOverlays();
  }
}
