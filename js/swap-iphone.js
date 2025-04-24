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
    let descriptionMobile = document.querySelector(".description-mobile");
    if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
      descriptionMobile.style.display = "flex";
    } else {
      descriptionMobile.style.display = "none";
    }
    let description = document.querySelectorAll(".description");
    description.forEach((el) => {
      if (/Mobi|Android|iPhone/i.test(navigator.userAgent)) {
        el.style.display = "none";
      } else {
        el.style.removeProperty("display");
      }
    });
  }
}

window.addEventListener("load", checkOrientation);
window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);
