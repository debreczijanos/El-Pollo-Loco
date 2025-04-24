class Cloud extends MovableObject {
  y = 20;
  height = 250;
  width = 500;

  constructor() {
    super();
    this.loadImage("img/5_background/layers/4_clouds/1.png");

    this.x = Math.random() * 2000;
    this.y = 10 + Math.random() * 40;
    this.animate();
  }

  animate() {
    setInterval(() => {
      this.moveLeft();
    }, 1000 / 60);
  }
}
