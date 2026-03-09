/**
 * AudioManager — Web Audio API singleton
 *
 * Usage:
 *   import { audioManager } from "@/lib/audioManager";
 *   await audioManager.playBgm("/audio/bgm/main_theme.ogg");
 *   await audioManager.playSfx("/audio/sfx/click.ogg");
 *
 * Volume is controlled by SettingsProvider which calls the setXxxVolume methods
 * whenever the settings store changes.
 *
 * NOTE: AudioContext is created lazily on first user interaction.
 * The manager silently no-ops if audio files are missing (404).
 */

class AudioManager {
  private ctx: AudioContext | null = null;

  // Gain nodes
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private voiceGain: GainNode | null = null;

  // Current BGM source
  private bgmSource: AudioBufferSourceNode | null = null;
  private currentBgmUrl = "";

  // Cache decoded buffers
  private bufferCache = new Map<string, AudioBuffer>();

  // ── Internal bootstrap ────────────────────────────────────────────────────

  private ensureContext() {
    if (typeof window === "undefined" || this.ctx) return;
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.bgmGain    = this.ctx.createGain();
    this.sfxGain    = this.ctx.createGain();
    this.voiceGain  = this.ctx.createGain();

    this.bgmGain.connect(this.masterGain);
    this.sfxGain.connect(this.masterGain);
    this.voiceGain.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);
  }

  /** Call this on first user interaction if needed (e.g. button click) */
  resume() {
    this.ctx?.resume();
  }

  // ── Volume setters (called by SettingsProvider reactively) ───────────────

  setMasterVolume(v: number) {
    this.ensureContext();
    if (this.masterGain) this.masterGain.gain.value = v / 100;
  }

  setBgmVolume(v: number) {
    this.ensureContext();
    if (this.bgmGain) this.bgmGain.gain.value = v / 100;
  }

  setSfxVolume(v: number) {
    this.ensureContext();
    if (this.sfxGain) this.sfxGain.gain.value = v / 100;
  }

  setVoiceVolume(v: number) {
    this.ensureContext();
    if (this.voiceGain) this.voiceGain.gain.value = v / 100;
  }

  // ── Buffer loading ────────────────────────────────────────────────────────

  // Public so assetLoader can preload audio into cache
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
      const arr = await res.arrayBuffer();
      const buf = await this.ctx.decodeAudioData(arr);
      this.bufferCache.set(url, buf);
      return buf;
    } catch (e) {
      console.warn(`[AudioManager] Could not load "${url}":`, e);
      return null;
    }
  }

  // ── Playback ──────────────────────────────────────────────────────────────

  /** Play looping background music. Skips if the same URL is already playing. */
  async playBgm(url: string, loop = true) {
    if (this.currentBgmUrl === url) return;
    this.stopBgm();
    this.ensureContext();
    const buf = await this.fetchBuffer(url);
    if (!buf || !this.ctx) return;

    this.bgmSource = this.ctx.createBufferSource();
    this.bgmSource.buffer = buf;
    this.bgmSource.loop = loop;
    this.bgmSource.connect(this.bgmGain!);
    this.bgmSource.start();
    this.currentBgmUrl = url;
  }

  /** Stop current BGM immediately */
  stopBgm() {
    try { this.bgmSource?.stop(); } catch {}
    this.bgmSource = null;
    this.currentBgmUrl = "";
  }

  /** Fade BGM out over `durationMs` ms then stop */
  fadeBgm(durationMs = 1000) {
    if (!this.bgmGain || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.bgmGain.gain.linearRampToValueAtTime(0, now + durationMs / 1000);
    setTimeout(() => this.stopBgm(), durationMs + 50);
  }

  /** One-shot sound effect */
  async playSfx(url: string) {
    this.ensureContext();
    const buf = await this.fetchBuffer(url);
    if (!buf || !this.ctx) return;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.connect(this.sfxGain!);
    src.start();
  }

  /** One-shot voice line */
  async playVoice(url: string) {
    this.ensureContext();
    const buf = await this.fetchBuffer(url);
    if (!buf || !this.ctx) return;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.connect(this.voiceGain!);
    src.start();
  }
}

// Export a singleton — safe on server (no AudioContext until browser APIs accessed)
export const audioManager = new AudioManager();