(function () {
  class TetrisAudio {
    constructor() {
      this.audioContext = null;
      this.isUnlocked = false;
      this.lockSoundVariants = [
        (now, clearedLines) => this.playArcadeBlip(now, clearedLines),
        (now, clearedLines) => this.playCoinChirp(now, clearedLines),
        (now, clearedLines) => this.playLaserPop(now, clearedLines),
        (now, clearedLines) => this.playRubberGlitch(now, clearedLines),
      ];
    }

    ensureContext() {
      if (!this.audioContext) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) {
          return null;
        }

        this.audioContext = new AudioContextClass();
      }

      return this.audioContext;
    }

    unlock() {
      const audioContext = this.ensureContext();
      if (!audioContext) {
        return;
      }

      if (audioContext.state === "suspended") {
        audioContext.resume();
      }

      this.isUnlocked = true;
    }

    createTone({
      startTime,
      duration,
      type,
      startFrequency,
      endFrequency,
      gainValue,
      panValue,
    }) {
      const audioContext = this.ensureContext();
      if (!audioContext || !this.isUnlocked) {
        return;
      }

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      const panNode = audioContext.createStereoPanner();

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(startFrequency, startTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        Math.max(40, endFrequency),
        startTime + duration
      );

      gainNode.gain.setValueAtTime(0.0001, startTime);
      gainNode.gain.exponentialRampToValueAtTime(gainValue, startTime + 0.015);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      panNode.pan.setValueAtTime(panValue, startTime);

      oscillator.connect(gainNode);
      gainNode.connect(panNode);
      panNode.connect(audioContext.destination);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);
    }

    playLockSound({ clearedLines }) {
      const audioContext = this.ensureContext();
      if (!audioContext || !this.isUnlocked) {
        return;
      }

      const now = audioContext.currentTime;
      const variant =
        this.lockSoundVariants[
          Math.floor(Math.random() * this.lockSoundVariants.length)
        ];
      variant(now, clearedLines);
    }

    playArcadeBlip(now, clearedLines) {
      const sparkleBoost = clearedLines > 0 ? 1.08 : 1;

      this.createTone({
        startTime: now,
        duration: 0.14,
        type: "square",
        startFrequency: 220 * sparkleBoost,
        endFrequency: 120,
        gainValue: 0.07,
        panValue: -0.2,
      });

      this.createTone({
        startTime: now + 0.03,
        duration: 0.11,
        type: "triangle",
        startFrequency: 660 * sparkleBoost,
        endFrequency: 240,
        gainValue: 0.05,
        panValue: 0.25,
      });

      this.createTone({
        startTime: now + 0.08,
        duration: 0.12,
        type: "sawtooth",
        startFrequency: 310 * sparkleBoost,
        endFrequency: 510 * sparkleBoost,
        gainValue: 0.03,
        panValue: 0,
      });

      if (clearedLines > 0) {
        this.createTone({
          startTime: now + 0.16,
          duration: 0.16,
          type: "square",
          startFrequency: 540,
          endFrequency: 860,
          gainValue: 0.045,
          panValue: 0.1,
        });
      }
    }

    playCoinChirp(now, clearedLines) {
      const boost = clearedLines > 0 ? 1.18 : 1;

      this.createTone({
        startTime: now,
        duration: 0.08,
        type: "triangle",
        startFrequency: 420,
        endFrequency: 780 * boost,
        gainValue: 0.055,
        panValue: -0.08,
      });

      this.createTone({
        startTime: now + 0.055,
        duration: 0.13,
        type: "square",
        startFrequency: 690,
        endFrequency: 1120 * boost,
        gainValue: 0.045,
        panValue: 0.12,
      });

      if (clearedLines > 0) {
        this.createTone({
          startTime: now + 0.12,
          duration: 0.1,
          type: "triangle",
          startFrequency: 900,
          endFrequency: 1320,
          gainValue: 0.03,
          panValue: 0.2,
        });
      }
    }

    playLaserPop(now, clearedLines) {
      const boost = clearedLines > 0 ? 1.12 : 1;

      this.createTone({
        startTime: now,
        duration: 0.09,
        type: "sawtooth",
        startFrequency: 880 * boost,
        endFrequency: 240,
        gainValue: 0.04,
        panValue: -0.28,
      });

      this.createTone({
        startTime: now + 0.025,
        duration: 0.14,
        type: "square",
        startFrequency: 180,
        endFrequency: 420 * boost,
        gainValue: 0.055,
        panValue: 0.18,
      });

      if (clearedLines > 0) {
        this.createTone({
          startTime: now + 0.11,
          duration: 0.12,
          type: "sawtooth",
          startFrequency: 520,
          endFrequency: 980,
          gainValue: 0.028,
          panValue: 0,
        });
      }
    }

    playRubberGlitch(now, clearedLines) {
      const boost = clearedLines > 0 ? 1.15 : 1;

      this.createTone({
        startTime: now,
        duration: 0.12,
        type: "square",
        startFrequency: 150,
        endFrequency: 92,
        gainValue: 0.06,
        panValue: -0.16,
      });

      this.createTone({
        startTime: now + 0.018,
        duration: 0.07,
        type: "triangle",
        startFrequency: 250,
        endFrequency: 470 * boost,
        gainValue: 0.04,
        panValue: 0.26,
      });

      this.createTone({
        startTime: now + 0.07,
        duration: 0.09,
        type: "triangle",
        startFrequency: 330,
        endFrequency: 210,
        gainValue: 0.032,
        panValue: 0,
      });

      if (clearedLines > 0) {
        this.createTone({
          startTime: now + 0.13,
          duration: 0.14,
          type: "square",
          startFrequency: 610,
          endFrequency: 940,
          gainValue: 0.03,
          panValue: -0.04,
        });
      }
    }
  }

  window.Tetris = window.Tetris || {};
  window.Tetris.audio = {
    TetrisAudio,
  };
})();
