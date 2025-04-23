class MovableObject extends DrawableObject {
  speed = 0.15;
  otherDirection = false;
  speedY = 0;
  acceleration = 2.5;
  energy = 100;
  lastHit = 0;

  applyGravity() {
    setInterval(() => {
      if (this.isAboveGround() || this.speedY > 0) {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;
      }
      if (this.y >= 360) {
        // Bodenhöhe auf 360 setzen
        this.y = 390;
        this.speedY = 0;
        this.playAnimation(this.IMAGES_BOTTLE_SPLASH); // Flaschen-Splash-Animation starten
      }
    }, 1000 / 60);
  }

  isAboveGround() {
    if (this instanceof ThrowableObject) {
      return this.y < 360; // Jetzt stimmt der Boden für Flaschen
    } else {
      return this.y < 180;
    }
  }

  isColliding(obj) {
    const collides =
      this.x + this.width > obj.x &&
      this.x < obj.x + obj.width &&
      this.y + this.height > obj.y &&
      this.y < obj.y + obj.height;

    return collides;
  }

  hit() {
    this.energy -= 5;
    if (this.energy < 0) {
      this.energy = 0;
    } else {
      this.lastHit = new Date().getTime();
    }
  }

  isDead() {
    return this.energy == 0;
  }

  isHurt() {
    let timepassed = new Date().getTime() - this.lastHit;
    timepassed = timepassed / 1000;
    return timepassed < 1;
  }

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

  moveRight() {
    this.x += this.speed;
  }

  moveLeft() {
    this.x -= this.speed;
  }

  jump() {
    this.speedY = 30;
  }
}
