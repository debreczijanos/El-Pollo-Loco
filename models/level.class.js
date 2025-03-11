class Level {
  enemies;
  clouds;
  backgroundObjects;
  level_end_x = 2200;

  constructor(enemies, clouds, backgroundObjects, coins, bottle) {
    this.enemies = enemies;
    this.clouds = clouds;
    this.backgroundObjects = backgroundObjects;
    this.coins = coins;
    // this.bottle = bottle;
  }
}
