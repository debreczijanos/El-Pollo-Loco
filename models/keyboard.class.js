class Keyboard {
  LEFT = false;
  UP = false;
  RIGHT = false;
  DOWN = false;
  SPACE = false;

  constructor() {
    this.keys = [];
  }

  addKey(key) {
    this.keys.push(key);
  }

  removeKey(key) {
    this.keys = this.keys.filter((k) => k !== key);
  }

  getKeys() {
    return this.keys;
  }
}
