/**
 * Repräsentiert die Statusleiste für die Münzenanzahl im Spiel.
 * Zeigt den Füllstand der gesammelten Münzen des Charakters an.
 * @extends DrawableObject
 */
class StatusBarCoins extends DrawableObject {
  /**
   * Array von Bildpfaden für die verschiedenen Füllstände der Münzenleiste.
   * @type {string[]}
   */
  IMAGES_COINS = [
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/0.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/20.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/80.png",
    "img/7_statusbars/1_statusbar/1_statusbar_coin/blue/100.png",
  ];

  /**
   * Der aktuelle Prozentsatz der Münzenleiste.
   * @type {number}
   */
  percentage = 0;

  /**
   * Erstellt eine neue Münzenstatusleiste.
   * Initialisiert die Position, Größe und den Startwert.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES_COINS);
    this.x = 20;
    this.y = 35;
    this.width = 120;
    this.height = 40;
    this.setPrecentage(0);
  }

  /**
   * Setzt den Prozentsatz der Münzenleiste und aktualisiert das angezeigte Bild.
   * @param {number} percentage - Der neue Prozentsatz (0-100)
   */
  setPrecentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES_COINS[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Bestimmt den Index des anzuzeigenden Bildes basierend auf dem aktuellen Prozentsatz.
   * @returns {number} - Der Index des anzuzeigenden Bildes im IMAGES_COINS-Array
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
