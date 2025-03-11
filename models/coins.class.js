class Coin extends DrawableObject {
  constructor(x, y) {
    super();
    this.loadImage("img/8_coin/coin_1.png");
    this.x = x;
    this.y = y;
    this.baseSize = 100; // Standardgröße
    this.width = this.baseSize;
    this.height = this.baseSize;
    this.growing = true; // Status für Animation

    this.animate();
  }

  animate() {
    setInterval(() => {
      if (this.growing) {
        this.width += 1;
        this.height += 1;
        if (this.width >= 105) this.growing = false; // Maximalgröße erreicht
      } else {
        this.width -= 1;
        this.height -= 1;
        if (this.width <= this.baseSize) this.growing = true; // Zurück zur Standardgröße
      }
    }, 120); // Geschwindigkeit der Animation (50ms pro Frame)
  }
}
