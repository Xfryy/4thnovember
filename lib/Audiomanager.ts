/**
 * AudioManager — Web Audio API singleton (FIXED)
 *
 * Fixes from previous version:
 *  1. fadeBgm race condition — currentBgmUrl is cleared IMMEDIATELY so playBgm
 *     with the same URL can restart after a fade-out.
 *  2. Gain stuck at 0 after fade — bgmGain is restored to _bgmVol before every
 *     new playBgm call and after every stopBgm/fadeBgm completes.
 *  3. Pending fade timers are cancelled on stopBgm / new playBgm so timers
 *     never clobber a freshly started track.
 *  4. ctx.resume() is awaited inside playBgm/playSfx/playVoice so the
 *     AudioContext is always running before audio nodes are started.
 *  5. Volume values are stored internally (_bgmVol etc.) so the gain node can
 *     always be restored to the correct level after a fade.
 */

class AudioManager {
  private ctx: AudioContext | null = null;

  // Gain nodes
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private voiceGain: GainNode | null = null;

  // Current BGM source node and its URL
  private bgmSource: AudioBufferSourceNode | null = null;
  private currentBgmUrl = "";

  // Pending fade timer — always cancel before starting new BGM or hard-stop
  private fadeTimer: ReturnType<typeof setTimeout> | null = null;

  // Last known volumes (0.0 – 1.0) so we can restore gain after fades
  private _masterVol = 0.8;
  private _bgmVol    = 0.7;
  private _sfxVol    = 0.75;
  private _voiceVol  = 0.8;

  // Decoded-buffer cache — survives across scenes
  private bufferCache = new Map<string, AudioBuffer>();

  // ── Bootstrap ──────────────────────────────────────────────────────────────

  private ensureContext() {
    if (typeof window === "undefined" || this.ctx) return;
    this.ctx = new AudioContext();

    this.masterGain = this.ctx.createGain();
    this.bgmGain    = this.ctx.createGain();
    this.sfxGain    = this.ctx.createGain();
    this.voiceGain  = this.ctx.createGain();

    // Set initial volumes from stored values
    this.masterGain.gain.value = this._masterVol;
    this.bgmGain.gain.value    = this._bgmVol;
    this.sfxGain.gain.value    = this._sfxVol;
    this.voiceGain.gain.value  = this._voiceVol;

    this.bgmGain.connect(this.masterGain);
    this.sfxGain.connect(this.masterGain);
    this.voiceGain.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);
  }

  /**
   * Call on first user interaction (button click, etc.).
   * Required by browser autoplay policy.
   */
  resume() {
    this.ensureContext();
    this.ctx?.resume();
  }

  // ── Volume setters (called by SettingsProvider) ────────────────────────────

  setMasterVolume(v: number) {
    this._masterVol = v / 100;
    this.ensureContext();
    if (this.masterGain) this.masterGain.gain.value = this._masterVol;
  }

  setBgmVolume(v: number) {
    this._bgmVol = v / 100;
    this.ensureContext();
    // Only update gain if we're not currently mid-fade (timer pending)
    if (this.bgmGain && !this.fadeTimer) {
      this.bgmGain.gain.value = this._bgmVol;
    }
  }

  setSfxVolume(v: number) {
    this._sfxVol = v / 100;
    this.ensureContext();
    if (this.sfxGain) this.sfxGain.gain.value = this._sfxVol;
  }

  setVoiceVolume(v: number) {
    this._voiceVol = v / 100;
    this.ensureContext();
    if (this.voiceGain) this.voiceGain.gain.value = this._voiceVol;
  }

  // ── Buffer loading ─────────────────────────────────────────────────────────

  /** Public so assetLoader can preload audio into cache. */
  async fetchBuffer(url: string): Promise<AudioBuffer | null> {
    if (this.bufferCache.has(url)) return this.bufferCache.get(url)!;
    try {
      this.ensureContext();
      if (!this.ctx) return null;
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`[AudioManager] File not found: ${url}`);
        return null;
      }
      const buf = await this.ctx.decodeAudioData(await res.arrayBuffer());
      this.bufferCache.set(url, buf);
      return buf;
    } catch (e) {
      console.warn(`[AudioManager] Could not load "${url}":`, e);
      return null;
    }
  }

  // ── BGM ────────────────────────────────────────────────────────────────────

  /**
   * Play looping background music.
   * - Cancels any pending fade timer first.
   * - Restores bgmGain before playing (fixes gain-stuck-at-0 bug).
   * - Skips only if the exact same track is already playing (not mid-fade).
   */
  async playBgm(url: string, loop = true) {
    // ── Cancel any pending fade timer ────────────────────────────────────────
    if (this.fadeTimer) {
      clearTimeout(this.fadeTimer);
      this.fadeTimer = null;
    }

    // ── Already playing this track? Nothing to do. ────────────────────────
    if (this.currentBgmUrl === url && this.bgmSource) return;

    // ── Stop whatever is currently playing ───────────────────────────────
    this._stopBgmNode();

    this.ensureContext();
    if (!this.ctx) return;

    // Unlock AudioContext (browser autoplay policy)
    await this.ctx.resume();

    // ── Restore bgmGain to the correct volume before playing ─────────────
    // This is the key fix for the "silent after returning from menu" bug.
    this.bgmGain!.gain.cancelScheduledValues(this.ctx.currentTime);
    this.bgmGain!.gain.value = this._bgmVol;

    // ── Load and start the buffer ─────────────────────────────────────────
    const buf = await this.fetchBuffer(url);
    if (!buf || !this.ctx) return;

    this.bgmSource = this.ctx.createBufferSource();
    this.bgmSource.buffer = buf;
    this.bgmSource.loop = loop;
    this.bgmSource.connect(this.bgmGain!);
    this.bgmSource.start();
    this.currentBgmUrl = url;
  }

  /** Hard-stop BGM immediately, restore gain. */
  stopBgm() {
    if (this.fadeTimer) { clearTimeout(this.fadeTimer); this.fadeTimer = null; }
    this._stopBgmNode();
    // Restore gain so the next track plays at the right volume
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.bgmGain.gain.value = this._bgmVol;
    }
  }

  /**
   * Fade BGM out over `durationMs` ms then stop.
   *
   * KEY FIX: currentBgmUrl is set to "" IMMEDIATELY so that a subsequent
   * playBgm("same-url") call will not be skipped by the "already playing"
   * guard — it will correctly restart the track.
   */
  fadeBgm(durationMs = 1000) {
    if (!this.bgmGain || !this.ctx) {
      this._stopBgmNode();
      return;
    }

    // Cancel any previous fade
    if (this.fadeTimer) { clearTimeout(this.fadeTimer); this.fadeTimer = null; }

    // ── Critical: mark as "no current BGM" BEFORE the fade completes ─────
    // This allows playBgm with the same URL to restart after we exit to menu.
    this.currentBgmUrl = "";

    const now = this.ctx.currentTime;
    const currentGain = this.bgmGain.gain.value;

    this.bgmGain.gain.cancelScheduledValues(now);
    this.bgmGain.gain.setValueAtTime(currentGain, now);
    this.bgmGain.gain.linearRampToValueAtTime(0, now + durationMs / 1000);

    this.fadeTimer = setTimeout(() => {
      this._stopBgmNode();
      // Restore gain so the next track is not silent
      if (this.bgmGain) this.bgmGain.gain.value = this._bgmVol;
      this.fadeTimer = null;
    }, durationMs + 60);
  }

  /** Internal: stop the AudioBufferSourceNode without touching gain or timer. */
  private _stopBgmNode() {
    try { this.bgmSource?.stop(); } catch { /* already stopped */ }
    this.bgmSource    = null;
    this.currentBgmUrl = "";
  }

  // ── SFX / Voice ────────────────────────────────────────────────────────────

  private async _playOneShotWithAudioElement(url: string, gainNode: GainNode | null) {
    this.ensureContext();
    if (!this.ctx || !gainNode) return;

    await this.ctx.resume();

    try {
      const audio = new Audio(url);
      const source = this.ctx.createMediaElementSource(audio);
      source.connect(gainNode);

      audio.onended = () => {
        source.disconnect();
      };

      await audio.play();
    } catch (e) {
      console.error(`[AudioManager] Error playing ${url} via <audio> element:`, e);
    }
  }

  /** One-shot sound effect. */
  async playSfx(url: string) {
    await this._playOneShotWithAudioElement(url, this.sfxGain);
  }

  /** One-shot voice line. */
  async playVoice(url: string) {
    await this._playOneShotWithAudioElement(url, this.voiceGain);
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  /** Returns the URL of the currently playing BGM (empty string if none). */
  getCurrentBgm(): string { return this.currentBgmUrl; }

  /** True if a BGM source node is active. */
  isPlayingBgm(): boolean { return !!this.bgmSource; }
}

// Singleton — safe on server (AudioContext is only created when browser APIs are accessed)
export const audioManager = new AudioManager();