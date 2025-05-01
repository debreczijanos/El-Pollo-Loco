/**
 * Repräsentiert die Hauptstatusleiste im Spiel.
 * Zeigt den Gesundheitszustand des Charakters an.
 * @extends DrawableObject
 */
class StatusBar extends DrawableObject {
  /**
   * Array von Bildpfaden für die verschiedenen Gesundheitszustände.
   * @type {string[]}
   */
  IMAGES = [
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/0.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/20.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/80.png",
    "img/7_statusbars/1_statusbar/2_statusbar_health/blue/100.png",
  ];

  /**
   * Der aktuelle Prozentsatz der Gesundheitsleiste.
   * @type {number}
   */
  percentage = 100;

  /**
   * Erstellt eine neue Hauptstatusleiste.
   * Initialisiert die Position, Größe und den Startwert.
   */
  constructor() {
    super();
    this.loadImages(this.IMAGES);
    this.x = 20;
    this.y = 0;
    this.width = 120;
    this.height = 40;
    this.setPrecentage(100);
  }

  /**
   * Setzt den Prozentsatz der Gesundheitsleiste und aktualisiert das angezeigte Bild.
   * @param {number} percentage - Der neue Prozentsatz (0-100)
   */
  setPrecentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES[this.resolveImageIndex()];
    this.img = this.imageCache[path];
  }

  /**
   * Bestimmt den Index des anzuzeigenden Bildes basierend auf dem aktuellen Prozentsatz.
   * @returns {number} - Der Index des anzuzeigenden Bildes im IMAGES-Array
   */
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
