class StatusBarEndboss extends DrawableObject {
  IMAGES_ENDBOSS = [
    "img/7_statusbars/2_statusbar_endboss/orange0.png",
    "img/7_statusbars/2_statusbar_endboss/orange20.png",
    "img/7_statusbars/2_statusbar_endboss/blue40.png",
    "img/7_statusbars/2_statusbar_endboss/blue60.png",
    "img/7_statusbars/2_statusbar_endboss/green80.png",
    "img/7_statusbars/2_statusbar_endboss/green100.png",
  ];
  percentage = 100;

  constructor(statusBar) {
    super();
    this.loadImages(this.IMAGES_ENDBOSS);
    this.x = 570;
    this.y = 0;
    this.width = 120;
    this.height = 40;
    this.setPrecentage(100);
    this.statusBar = statusBar;
  }

  setPrecentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES_ENDBOSS[this.resolveImageIndex()];
    this.loadImage(path);
  }

  resolveImageIndex() {
    if (this.percentage == 100) {
      return 5;
    } else if (this.percentage > 80) {
      return 4;
    } else if (this.percentage > 60) {
      return 3;
    } else if (this.percentage > 40) {
      return 2;
    } else if (this.percentage > 20) {
      return 1;
    } else {
      return 0;
    }
  }
}
