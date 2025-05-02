/**
 * Repräsentiert ein bewegliches Objekt im Spiel.
 * Erweitert die Funktionalität von DrawableObject um Bewegungs- und Physik-Eigenschaften.
 * @extends DrawableObject
 */
class MovableObject extends DrawableObject {
  /**
   * Die Bewegungsgeschwindigkeit des Objekts.
   * @type {number}
   */
  speed = 0.15;

  /**
   * Gibt an, ob das Objekt in die andere Richtung schaut.
   * @type {boolean}
   */
  otherDirection = false;

  /**
   * Die vertikale Geschwindigkeit des Objekts (für Sprünge und Fallen).
   * @type {number}
   */
  speedY = 0;

  /**
   * Die Beschleunigung des Objekts (für Schwerkraft).
   * @type {number}
   */
  acceleration = 1.2;

  /**
   * Die Energie/HP des Objekts.
   * @type {number}
   */
  energy = 100;

  /**
   * Zeitstempel des letzten Treffers.
   * @type {number}
   */
  lastHit = 0;

  /**
   * Wendet die Schwerkraft auf das Objekt an.
   * Aktualisiert die vertikale Position basierend auf der Geschwindigkeit.
   */
  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
      if (this.y >= 360) {
        this.y = 390;
        this.speedY = 0;
        this.playAnimation(this.IMAGES_BOTTLE_SPLASH);
      }
    }, 1000 / 60);
  }

  /**
   * Prüft, ob sich das Objekt über dem Boden befindet.
   * @returns {boolean} - True, wenn das Objekt über dem Boden ist
   */
  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return this.y < 360;
    } else {
      return this.y < 180;
    }
  }

  /**
   * Prüft, ob dieses Objekt mit einem anderen Objekt kollidiert, unter Berücksichtigung der individuellen Hitboxen.
   * @param {DrawableObject} obj - Das zu prüfende Objekt
   * @returns {boolean} - True, wenn eine Kollision vorliegt
   */
  isColliding(obj) {
    const a = this.hitbox || { top: 0, bottom: 0, left: 0, right: 0 };
    const b = obj.hitbox || { top: 0, bottom: 0, left: 0, right: 0 };

    return (
      this.x + a.left < obj.x + obj.width - b.right &&
      this.x + this.width - a.right > obj.x + b.left &&
      this.y + a.top < obj.y + obj.height - b.bottom &&
      this.y + this.height - a.bottom > obj.y + b.top
    );
  }

  /**
   * Verarbeitet einen Treffer auf das Objekt.
   * Reduziert die Energie und aktualisiert den letzten Treffer-Zeitstempel.
   */
  hit() {
    this.energy -= 20;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  /**
   * Prüft, ob das Objekt tot ist.
   * @returns {boolean} - True, wenn die Energie 0 ist
   */
  isDead() {
    return this.energy == 0;
  }

  /**
   * Prüft, ob das Objekt verletzt ist.
   * @returns {boolean} - True, wenn das Objekt in den letzten Sekunde getroffen wurde
   */
  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

  /**
   * Spielt eine Animation ab.
   * @param {string[]} images - Array von Bildpfaden für die Animation
   */
  playAnimation(images) {
    if (!images || images.length === 0) {
      console.error("Fehler: Bild-Array ist undefined oder leer!", images);
      return;
    }

    let i = this.currentImage % images.length;
    let path = images[i];

    if (this.imageCache[path]) {
      this.img = this.imageCache[path];
    } else {
      console.warn("Bild nicht gefunden:", path);
    }

    this.currentImage++;
  }

  /**
   * Bewegt das Objekt nach rechts.
   */
  moveRight() {
    this.x += this.speed;
  }

  /**
   * Bewegt das Objekt nach links.
   */
  moveLeft() {
    this.x -= this.speed;
  }

  /**
   * Lässt das Objekt springen.
   */
  jump() {
    this.speedY = 30;
  }
}
