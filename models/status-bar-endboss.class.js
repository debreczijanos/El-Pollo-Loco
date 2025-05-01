/**
 * Repräsentiert die Statusleiste für den Endboss im Spiel.
 * Zeigt den Gesundheitszustand des Endbosses an.
 * @extends DrawableObject
 */
class StatusBarEndboss extends DrawableObject {
  /**
   * Array von Bildpfaden für die verschiedenen Gesundheitszustände des Endbosses.
   * Die Farben ändern sich je nach Gesundheitszustand (orange -> blau -> grün).
   * @type {string[]}
   */
  IMAGES_ENDBOSS = [
    "img/7_statusbars/2_statusbar_endboss/orange0.png",
    "img/7_statusbars/2_statusbar_endboss/orange20.png",
    "img/7_statusbars/2_statusbar_endboss/blue40.png",
    "img/7_statusbars/2_statusbar_endboss/blue60.png",
    "img/7_statusbars/2_statusbar_endboss/green80.png",
    "img/7_statusbars/2_statusbar_endboss/green100.png",
  ];

  /**
   * Der aktuelle Prozentsatz der Gesundheitsleiste.
   * @type {number}
   */
  percentage = 100;

  /**
   * Erstellt eine neue Endboss-Statusleiste.
   * Initialisiert die Position, Größe und den Startwert.
   * @param {StatusBar} statusBar - Referenz zur Hauptstatusleiste
   */
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

  /**
   * Setzt den Prozentsatz der Gesundheitsleiste und aktualisiert das angezeigte Bild.
   * @param {number} percentage - Der neue Prozentsatz (0-100)
   */
  setPrecentage(percentage) {
    this.percentage = percentage;
    let path = this.IMAGES_ENDBOSS[this.resolveImageIndex()];
    this.loadImage(path);
  }

  /**
   * Bestimmt den Index des anzuzeigenden Bildes basierend auf dem aktuellen Prozentsatz.
   * @returns {number} - Der Index des anzuzeigenden Bildes im IMAGES_ENDBOSS-Array
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
