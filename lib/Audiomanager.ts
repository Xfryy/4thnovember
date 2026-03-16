/**
 * AudioManager - Handles all audio playback with proper lifecycle
 * Features:
 * - BGM crossfade (fade out old → fade in new)
 * - Character voice (doesn't cut BGM)
 * - SFX layering
 * - Proper cleanup on act/scene change
 * - Volume control
 */

export interface AudioTrack {
  id: string;
  element: HTMLAudioElement;
  type: "bgm" | "voice" | "sfx";
  volume: number;
  fadeDuration: number;
  isPlaying: boolean;
}

class AudioManagerClass {
  private tracks: Map<string, AudioTrack> = new Map();
  private globalVolume = {
    bgm: 0.7,
    voice: 0.8,
    sfx: 0.6,
  };
  private currentBgmId: string | null = null;
  private fadeIntervals: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Initialize or get audio element for a track
   */
  private getOrCreateAudioElement(trackId: string, type: "bgm" | "voice" | "sfx"): HTMLAudioElement {
    const existing = this.tracks.get(trackId)?.element;
    if (existing) return existing;

    const audio = new Audio();
    audio.id = trackId;
    audio.className = `audio-track audio-${type}`;

    // Add to document so it can play (only if document.body is available)
    try {
      if (document.body && !document.body.querySelector(`#${trackId}`)) {
        document.body.appendChild(audio);
      }
    } catch (e) {
      // Page might be unloading or document not ready
    }

    return audio;
  }

  /**
   * Play BGM with crossfade
   * Stops previous BGM and fades in new one
   */
  async playBGM(path: string, fadeInDuration: number = 1000): Promise<void> {
    const trackId = `bgm-${Date.now()}`;

    // Stop previous BGM with fade out
    if (this.currentBgmId) {
      try {
        await this.fadeOutTrack(this.currentBgmId, 500);
        this.stopTrack(this.currentBgmId);
      } catch (e) {
        // Fade might fail if page is unloading
        this.stopTrack(this.currentBgmId);
      }
    }

    const audio = this.getOrCreateAudioElement(trackId, "bgm");
    audio.src = path;
    audio.loop = true;
    audio.volume = 0; // Start silent for fade in

    const track: AudioTrack = {
      id: trackId,
      element: audio,
      type: "bgm",
      volume: this.globalVolume.bgm,
      fadeDuration: fadeInDuration,
      isPlaying: true,
    };

    this.tracks.set(trackId, track);
    this.currentBgmId = trackId;

    try {
      await audio.play();
    } catch (err: any) {
      // Browser autoplay policy: user must interact before audio plays
      if (err.name === 'NotAllowedError') {
        console.warn("⏸️ BGM autoplay blocked by browser policy. Will resume on first user interaction.");
      } else {
        console.error("❌ BGM play failed:", err);
      }
    }

    // Fade in
    await this.fadeInTrack(trackId, fadeInDuration);
  }

  /**
   * Play character voice (doesn't interrupt BGM)
   */
  async playVoice(path: string, fadeDuration: number = 200): Promise<void> {
    const trackId = `voice-${Date.now()}`;
    const audio = this.getOrCreateAudioElement(trackId, "voice");

    audio.src = path;
    audio.loop = false;
    audio.volume = 0;

    const track: AudioTrack = {
      id: trackId,
      element: audio,
      type: "voice",
      volume: this.globalVolume.voice,
      fadeDuration,
      isPlaying: true,
    };

    this.tracks.set(trackId, track);

    try {
      await audio.play();
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        console.warn("⏸️ Voice autoplay blocked.");
      } else {
        console.error("❌ Voice play failed:", err);
      }
    }
    await this.fadeInTrack(trackId, fadeDuration);

    // Remove track when done
    audio.addEventListener(
      "ended",
      () => {
        this.stopTrack(trackId);
      },
      { once: true }
    );
  }

  /**
   * Play SFX (multiple can overlap)
   */
  async playSFX(path: string, fadeDuration: number = 100): Promise<void> {
    const trackId = `sfx-${Date.now()}`;
    const audio = this.getOrCreateAudioElement(trackId, "sfx");

    audio.src = path;
    audio.loop = false;
    audio.volume = 0;

    const track: AudioTrack = {
      id: trackId,
      element: audio,
      type: "sfx",
      volume: this.globalVolume.sfx,
      fadeDuration,
      isPlaying: true,
    };

    this.tracks.set(trackId, track);

    try {
      await audio.play();
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        console.warn("⏸️ SFX autoplay blocked.");
      } else {
        console.error("❌ SFX play failed:", err);
      }
    }
    await this.fadeInTrack(trackId, fadeDuration);

    // Remove track when done
    audio.addEventListener(
      "ended",
      () => {
        this.stopTrack(trackId);
      },
      { once: true }
    );
  }

  /**
   * Fade in track gradually
   */

  private fadeInTrack(trackId: string, duration: number): Promise<void> {
    return new Promise((resolve) => {
      const track = this.tracks.get(trackId);
      if (!track) {
        resolve();
        return;
      }

      const startVolume = track.element.volume;
      const targetVolume = track.volume;
      const startTime = Date.now();

      // Clear any existing fade for this track
      if (this.fadeIntervals.has(trackId)) {
        clearInterval(this.fadeIntervals.get(trackId));
      }

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        track.element.volume = startVolume + (targetVolume - startVolume) * progress;

        if (progress >= 1) {
          clearInterval(interval);
          this.fadeIntervals.delete(trackId);
          resolve();
        }
      }, 16); // ~60fps

      this.fadeIntervals.set(trackId, interval);
    });
  }

  /**
   * Fade out track gradually
   */
  private fadeOutTrack(trackId: string, duration: number): Promise<void> {
    return new Promise((resolve) => {
      const track = this.tracks.get(trackId);
      if (!track) {
        resolve();
        return;
      }

      const startVolume = track.element.volume;
      const startTime = Date.now();

      // Clear any existing fade
      if (this.fadeIntervals.has(trackId)) {
        clearInterval(this.fadeIntervals.get(trackId));
      }

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        track.element.volume = startVolume * (1 - progress);

        if (progress >= 1) {
          track.element.volume = 0;
          clearInterval(interval);
          this.fadeIntervals.delete(trackId);
          resolve();
        }
      }, 16); // ~60fps

      this.fadeIntervals.set(trackId, interval);
    });
  }

  /**
   * Immediately fade out and stop specifically the BGM track (if any)
   */
  async stopBGM(fadeOutDuration: number = 800): Promise<void> {
    const bgmId = this.currentBgmId;
    if (!bgmId) return;
    
    // Unset the ID so anything else trying to grab it fails cleanly
    this.currentBgmId = null; 

    try {
      await this.fadeOutTrack(bgmId, fadeOutDuration);
    } catch (e) {
      console.warn("Failed to fade out BGM gracefully", e);
    } finally {
      this.stopTrack(bgmId);
    }
  }

  /**
   * Stop and remove track from memory
   */
  stopTrack(trackId: string): void {
    const track = this.tracks.get(trackId);
    if (!track) return;

    // Clear fade interval
    if (this.fadeIntervals.has(trackId)) {
      clearInterval(this.fadeIntervals.get(trackId));
      this.fadeIntervals.delete(trackId);
    }

    // Stop audio
    try {
      track.element.pause();
      track.element.currentTime = 0;
    } catch (e) {
      // Element might be invalid
    }

    // Remove from DOM if it exists and has parent
    try {
      if (track.element && track.element.parentNode) {
        track.element.parentNode.removeChild(track.element);
      }
    } catch (e) {
      // Element might have been removed already
    }

    this.tracks.delete(trackId);

    if (this.currentBgmId === trackId) {
      this.currentBgmId = null;
    }
  }

  /**
   * Pause all audio
   */
  pauseAll(): void {
    this.tracks.forEach((track) => {
      track.element.pause();
    });
  }

  /**
   * Resume all audio
   */
  resumeAll(): void {
    this.tracks.forEach((track) => {
      if (track.isPlaying) {
        track.element.play().catch((err) => console.error("❌ Resume failed:", err));
      }
    });
  }

  /**
   * Resume all audio (alias for resumeAll)
   */
  resume(): void {
    this.resumeAll();
  }

  /**
   * Stop all audio and cleanup - call this when exiting game/act
   */
  stopAll(): void {
    // Stop all fade intervals
    this.fadeIntervals.forEach((interval) => clearInterval(interval));
    this.fadeIntervals.clear();

    // Stop all tracks
    this.tracks.forEach((track) => {
      if (track.element) {
        track.element.pause();
        track.element.currentTime = 0;
      }
    });

    this.tracks.clear();
    this.currentBgmId = null;
  }

  /**
   * Set global volume for a type
   */
  setVolume(type: "bgm" | "voice" | "sfx", volume: number): void {
    this.globalVolume[type] = Math.max(0, Math.min(1, volume));

    // Update all playing tracks of this type
    this.tracks.forEach((track) => {
      if (track.type === type) {
        track.volume = this.globalVolume[type];
        track.element.volume = track.volume;
      }
    });
  }

  /**
   * Get current global volume
   */
  getVolume(type: "bgm" | "voice" | "sfx"): number {
    return this.globalVolume[type];
  }

  /**
   * Set master volume (affects all tracks proportionally)
   */
  setMasterVolume(volume: number): void {
    // Master volume is 0-100, convert to 0-1
    const normalized = Math.max(0, Math.min(1, volume / 100));
    this.tracks.forEach((track) => {
      track.element.volume = (track.volume || this.globalVolume[track.type]) * normalized;
    });
  }

  /**
   * Set BGM volume
   */
  setBgmVolume(volume: number): void {
    this.setVolume("bgm", volume / 100);
  }

  /**
   * Set SFX volume
   */
  setSfxVolume(volume: number): void {
    this.setVolume("sfx", volume / 100);
  }

  /**
   * Set voice volume
   */
  setVoiceVolume(volume: number): void {
    this.setVolume("voice", volume / 100);
  }

  /**
   * Check if currently playing BGM
   */
  isPlayingBGM(): boolean {
    return this.currentBgmId !== null && this.tracks.has(this.currentBgmId);
  }

  /**
   * Get current BGM track
   */
  getCurrentBGM(): AudioTrack | null {
    if (!this.currentBgmId) return null;
    return this.tracks.get(this.currentBgmId) || null;
  }

  /**
   * Get all active tracks
   */
  getActiveTracks(): AudioTrack[] {
    return Array.from(this.tracks.values());
  }

  /**
   * Debug: Log all active tracks
   */
  debug(): void {
    console.log("=== Audio Manager Debug ===");
    console.log("Global Volumes:", this.globalVolume);
    console.log("Active Tracks:", this.getActiveTracks().length);
    this.tracks.forEach((track) => {
      console.log(`  [${track.type}] ${track.id} - Volume: ${track.element.volume.toFixed(2)}`);
    });
  }
}

// Singleton instance
export const audioManager = new AudioManagerClass();
