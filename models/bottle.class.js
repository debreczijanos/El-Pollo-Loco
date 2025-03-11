class Bottle extends DrawableObject {
  IMAGES_BOTTLE_ON_GROUND = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

  IMAGES_BOTTLE_ON_AIR = ["img/6_salsa_bottle/salsa_bottle.png"];
  constructor(x, y) {
    super();
    this.loadImage("img/6_salsa_bottle/salsa_bottle.png");
    // this.loadImage(this.IMAGES_BOTTLE_ON_GROUND);
    // this.loadImage(this.IMAGES_BOTTLE_ON_AIR);
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
  }
}
