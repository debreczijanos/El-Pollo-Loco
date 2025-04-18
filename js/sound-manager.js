class SoundManager {
  constructor() {
    this.sounds = {};
    this.isMuted = false;
    this.backgroundMusic = null;
    this.loadSounds();
  }

  loadSounds() {
    // Hintergrundmusik
    this.backgroundMusic = new Audio("audio/background-music.mp3");
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.3;

    // Soundeffekte
    this.sounds = {
      jump: new Audio("audio/jump.mp3"),
      throw: new Audio("audio/throw.mp3"),
      collect: new Audio("audio/collect.mp3"),
      hit: new Audio("audio/hit.mp3"),
      splash: new Audio("audio/splash.mp3"),
      gameOver: new Audio("audio/game-over.mp3"),
      victory: new Audio("audio/victory.mp3"),
      walking: new Audio("audio/walking.mp3"),
      hurt: new Audio("audio/hurt.mp3"),
    };

    // Setze Lautstärke für alle Soundeffekte
    Object.values(this.sounds).forEach((sound) => {
      sound.volume = 0.5;
    });

    // Walking-Sound auf Loop setzen
    this.sounds.walking.loop = true;
  }

  playSound(soundName) {
    if (this.isMuted) return;

    const sound = this.sounds[soundName];
    if (sound) {
      // Setze den Sound zurück und spiele ihn ab
      sound.currentTime = 0;

      // Für den Walking-Sound: Stelle sicher, dass er sofort abgespielt wird
      if (soundName === "walking") {
        sound.play().catch((error) => {
          console.warn(`Fehler beim Abspielen von ${soundName}:`, error);
        });
      } else {
        // Für andere Sounds: Normales Abspielen
        sound.play().catch((error) => {
          console.warn(`Fehler beim Abspielen von ${soundName}:`, error);
        });
      }
    }
  }

  startBackgroundMusic() {
    if (this.isMuted) return;

    if (this.backgroundMusic) {
      this.backgroundMusic.play().catch((error) => {
        console.warn("Fehler beim Abspielen der Hintergrundmusik:", error);
      });
    }
  }

  stopBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;

    if (this.isMuted) {
      this.stopBackgroundMusic();
    } else {
      this.startBackgroundMusic();
    }

    return this.isMuted;
  }

  setVolume(volume) {
    // Volume sollte zwischen 0 und 1 liegen
    const normalizedVolume = Math.max(0, Math.min(1, volume));

    if (this.backgroundMusic) {
      this.backgroundMusic.volume = normalizedVolume * 0.3; // Hintergrundmusik etwas leiser
    }

    Object.values(this.sounds).forEach((sound) => {
      sound.volume = normalizedVolume * 0.5;
    });
  }
}
