/**
 * Repräsentiert die Tastatursteuerung des Spiels.
 * Verwaltet den Zustand der Tasten und ermöglicht die Abfrage von Tastendrücken.
 */
class Keyboard {
  /**
   * Gibt an, ob die linke Pfeiltaste gedrückt ist.
   * @type {boolean}
   */
  LEFT = false;

  /**
   * Gibt an, ob die obere Pfeiltaste gedrückt ist.
   * @type {boolean}
   */
  UP = false;

  /**
   * Gibt an, ob die rechte Pfeiltaste gedrückt ist.
   * @type {boolean}
   */
  RIGHT = false;

  /**
   * Gibt an, ob die untere Pfeiltaste gedrückt ist.
   * @type {boolean}
   */
  DOWN = false;

  /**
   * Gibt an, ob die Leertaste gedrückt ist.
   * @type {boolean}
   */
  SPACE = false;

  /**
   * Gibt an, ob die D-Taste gedrückt ist.
   * @type {boolean}
   */
  D = false;

  /**
   * Erstellt eine neue Keyboard-Instanz.
   * Initialisiert die Liste der gedrückten Tasten.
   */
  constructor() {
    this.keys = [];
  }

  /**
   * Fügt eine Taste zur Liste der gedrückten Tasten hinzu.
   * @param {string} key - Die hinzuzufügende Taste
   */
  addKey(key) {
    this.keys.push(key);
  }

  /**
   * Entfernt eine Taste aus der Liste der gedrückten Tasten.
   * @param {string} key - Die zu entfernende Taste
   */
  removeKey(key) {
    this.keys = this.keys.filter((k) => k !== key);
  }

  /**
   * Gibt die Liste aller gedrückten Tasten zurück.
   * @returns {string[]} Array der gedrückten Tasten
   */
  getKeys() {
    return this.keys;
  }
}
