/**
 * Repräsentiert die Statusleiste für die Flaschenanzahl im Spiel.
 * Zeigt den Füllstand der Flaschenanzahl des Charakters an.
 * @extends DrawableObject
 */
class StatusBarBottle extends DrawableObject {
  /**
   * Array von Bildpfaden für die verschiedenen Füllstände der Flaschenleiste.
   * @type {string[]}
   */
  IMAGES_BOTTLE = [
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png",
    "img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png",
  ];

  /**
   * Der aktuelle Prozentsatz der Flaschenleiste.
   * @type {number}
   */
  percentage = 0;

  /**
   * Erstellt eine neue Flaschenstatusleiste.
   * Initialisiert die Position, Größe und den Startwert.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_BOTTLE);
    this.x = 20;
    this.y = 70;
    this.width = 120;
    this.height = 40;
    this.setPrecentage(0);
  }

  /**
   * Setzt den Prozentsatz der Flaschenleiste und aktualisiert das angezeigte Bild.
   * @param {number} percentage - Der neue Prozentsatz (0-100)
   */
  setPrecentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES_BOTTLE[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Bestimmt den Index des anzuzeigenden Bildes basierend auf dem aktuellen Prozentsatz.
   * @returns {number} - Der Index des anzuzeigenden Bildes im IMAGES_BOTTLE-Array
   */
  resolveImageIndex() {
    if (this.percentage === 100 || this.percentage >= 100) {
      return 5;
    } else if (this.percentage >= 80) {
      return 4;
    } else if (this.percentage >= 60) {
      return 3;
    } else if (this.percentage >= 40) {
      return 2;
    } else if (this.percentage >= 20) {
      return 1;
    } else {
      return 0;
    }
  }
}
