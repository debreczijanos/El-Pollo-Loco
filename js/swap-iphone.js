function checkOrientation() {
  let isPortrait = window.innerWidth < 667;
  let warning = document.getElementById("swapYourPhone");
  let gameScreenSwap = document.getElementById("gameScreen");

  if (isPortrait) {
    warning.style.display = "flex";
    gameScreenSwap.style.display = "none";
  } else {
    warning.style.display = "none";
    gameScreenSwap.style.removeProperty("display");
  }
}

window.addEventListener("load", checkOrientation);
window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);
