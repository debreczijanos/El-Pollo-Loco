let bottles = [];
for (let i = 0; i < 20; i++) {
  bottles.push(new Bottle());
}

let enemies = [];

for (let i = 0; i < 8; i++) {
  enemies.push(new Chicken());
}

for (let i = 0; i < 7; i++) {
  enemies.push(new ChickenSmall());
}

// enemies.push(new Endboss());

const level1 = new Level(
  enemies,

  [new Cloud()],

  [
    new BackgroundObject("img/5_background/layers/air.png", -719),
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png", -719),
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png", -719),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", -719),

    new BackgroundObject("img/5_background/layers/air.png", 0),
    new BackgroundObject("img/5_background/layers/3_third_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/2_second_layer/1.png", 0),
    new BackgroundObject("img/5_background/layers/1_first_layer/1.png", 0),

    new BackgroundObject("img/5_background/layers/air.png", 719),
    new BackgroundObject("img/5_background/layers/3_third_layer/2.png", 719),
    new BackgroundObject("img/5_background/layers/2_second_layer/2.png", 719),
    new BackgroundObject("img/5_background/layers/1_first_layer/2.png", 719),

    new BackgroundObject("img/5_background/layers/air.png", 719 * 2),
    new BackgroundObject(
      "img/5_background/layers/3_third_layer/1.png",
      719 * 2
    ),
    new BackgroundObject(
      "img/5_background/layers/2_second_layer/1.png",
      719 * 2
    ),
    new BackgroundObject(
      "img/5_background/layers/1_first_layer/1.png",
      719 * 2
    ),

    new BackgroundObject("img/5_background/layers/air.png", 719 * 3),
    new BackgroundObject(
      "img/5_background/layers/3_third_layer/2.png",
      719 * 3
    ),
    new BackgroundObject(
      "img/5_background/layers/2_second_layer/2.png",
      719 * 3
    ),
    new BackgroundObject(
      "img/5_background/layers/1_first_layer/2.png",
      719 * 3
    ),

    new BackgroundObject("img/5_background/layers/air.png", 719 * 4),
    new BackgroundObject(
      "img/5_background/layers/3_third_layer/1.png",
      719 * 4
    ),
    new BackgroundObject(
      "img/5_background/layers/2_second_layer/1.png",
      719 * 4
    ),
    new BackgroundObject(
      "img/5_background/layers/1_first_layer/1.png",
      719 * 4
    ),
  ],
  [
    new Coin(350, 100),
    new Coin(400, 150),
    new Coin(450, 200),
    new Coin(500, 250),
    new Coin(800, 250),
    new Coin(850, 200),
    new Coin(900, 150),
    new Coin(950, 100),
    new Coin(1000, 150),
    new Coin(1050, 200),
    new Coin(1100, 250),
    new Coin(1500, 250),
    new Coin(1600, 210),
    new Coin(1700, 250),
    new Coin(1750, 200),
    new Coin(1800, 150),
  ],
  bottles
);
