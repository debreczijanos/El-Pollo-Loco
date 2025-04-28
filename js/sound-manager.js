class SoundManager {
  constructor() {
    this.sounds = {};
    this.isMuted = false;
    this.backgroundMusic = null;
    this.loadSounds();
  }

  /**
   * Initializes and loads all sound files with their configurations.
   */
  loadSounds() {
    this.loadBackgroundMusic();
    this.loadGameSounds();
  }

  /**
   * Loads and configures the background music.
   */
  loadBackgroundMusic() {
    this.backgroundMusic = new Audio("audio/background-music.mp3");
    this.backgroundMusic.loop = true;
    this.backgroundMusic.volume = 0.3;
  }

  /**
   * Loads and configures all game sound effects.
   */
  loadGameSounds() {
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

    this.configureSoundVolumes();
    this.configureSoundLoops();
  }

  /**
   * Sets the volume for all sound effects.
   */
  configureSoundVolumes() {
    Object.values(this.sounds).forEach((sound) => {
      sound.volume = 0.5;
    });
  }

  /**
   * Configures loop settings for sounds that need to loop.
   */
  configureSoundLoops() {
    this.sounds.walking.loop = true;
  }

  /**
   * Plays a specific sound effect if not muted.
   * @param {string} soundName - The name of the sound to play.
   */
  playSound(soundName) {
    if (this.isMuted) return;

    const sound = this.sounds[soundName];
    if (sound) {
      sound.currentTime = 0;

      if (soundName === "walking") {
        sound.play().catch((error) => {
          console.warn(`Fehler beim Abspielen von ${soundName}:`, error);
        });
      } else {
        sound.play().catch((error) => {
          console.warn(`Fehler beim Abspielen von ${soundName}:`, error);
        });
      }
    }
  }

  /**
   * Starts playing the background music if not muted.
   */
  startBackgroundMusic() {
    if (this.isMuted) return;

    if (this.backgroundMusic) {
      this.backgroundMusic.play().catch((error) => {
        console.warn("Fehler beim Abspielen der Hintergrundmusik:", error);
      });
    }
  }

  /**
   * Stops the background music and resets its playback position.
   */
  stopBackgroundMusic() {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
    }
  }

  /**
   * Toggles the mute state of all sounds.
   * @returns {boolean} - The new mute state.
   */
  toggleMute() {
    this.isMuted = !this.isMuted;

    if (this.isMuted) {
      this.stopBackgroundMusic();
      Object.values(this.sounds).forEach((sound) => {
        sound.pause();
        sound.currentTime = 0;
      });
    } else {
      this.startBackgroundMusic();
    }

    return this.isMuted;
  }

  /**
   * Sets the volume for all sounds.
   * @param {number} volume - The volume level between 0 and 1.
   */
  setVolume(volume) {
    const normalizedVolume = Math.max(0, Math.min(1, volume));

    if (this.backgroundMusic) {
      this.backgroundMusic.volume = normalizedVolume * 0.3;
    }

    Object.values(this.sounds).forEach((sound) => {
      sound.volume = normalizedVolume * 0.5;
    });
  }
}
