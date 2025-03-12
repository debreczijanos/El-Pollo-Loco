class Bottle extends DrawableObject {
  IMAGES_BOTTLE_ON_GROUND = [
    "img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
    "img/6_salsa_bottle/2_salsa_bottle_on_ground.png",
  ];

  IMAGES_BOTTLE_ON_AIR = ["img/6_salsa_bottle/salsa_bottle.png"];

  constructor() {
    super();
    this.width = 50;
    this.height = 50;

    // Zufällige x-Position auf der Achse
    this.x = Math.random() * 1800; // Zufällige Platzierung auf der x-Achse (bis zu 1800 Pixel)

    // Zufällig bestimmen, ob die Flasche in der Luft oder am Boden ist
    let isAirBottle = Math.random() < 0.5; // 50% Chance

    if (isAirBottle) {
      // Flasche in der Luft
      this.y = Math.random() * (300 - 150) + 150; // Zufällige Höhe zwischen 150 und 300
      this.loadImage(this.IMAGES_BOTTLE_ON_AIR[0]);
    } else {
      // Flasche auf dem Boden
      this.y = 370;
      this.loadImage(
        this.IMAGES_BOTTLE_ON_GROUND[Math.floor(Math.random() * 2)]
      );
    }
  }
}
