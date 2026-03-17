import {
  Scene,
  SceneBg,
  SceneCharacter,
  SceneAudio,  
  SceneType,
  DialogueScene,
  MonologueScene,
  TransitionScene,
  ChoiceScene,
  CgScene,
  EndingScene,
  ChoiceOption,
  ExamineScene
} from "@/types/game";

export class StoryBuilder {
  private actNumber: number;
  private prefix: string;
  private scenes: Scene[] = [];
  
  // Persistent State
  private currentBg?: SceneBg;
  private currentAudio?: SceneAudio;
  private currentCharacters?: SceneCharacter[];

  constructor(actNumber: number, prefix: string = `act${actNumber}`) {
    this.actNumber = actNumber;
    this.prefix = prefix;
  }

  /**
   * Generates the auto-incremented scene ID
   */
  private generateId(index: number): string {
    return `${this.prefix}_s${index + 1}`;
  }

  /**
   * Internal helper to create and push a standard scene while inheriting state.
   */
  private addScene(
    type: SceneType,
    overrides: any
  ): this {
    const sceneNumber = this.scenes.length + 1;
    const id = this.generateId(this.scenes.length);

    const base: any = {
      id,
      type,
      act: this.actNumber,
      sceneNumber,
    };

    // Inherit Backgrounds unless intentionally cleared by passing null
    if (overrides.bg !== undefined) {
      if (overrides.bg === null) {
         this.currentBg = undefined;
      } else {
         this.currentBg = { ...this.currentBg, ...overrides.bg };
      }
    }
    if (this.currentBg) base.bg = { ...this.currentBg };

    // Inherit Audio
    if (overrides.audio !== undefined) {
      if (overrides.audio === null) {
        this.currentAudio = undefined;
      } else {
        this.currentAudio = { ...this.currentAudio, ...overrides.audio };
      }
    }
    if (this.currentAudio) {
      base.audio = { ...this.currentAudio };

      // Cleanup one-track triggers so they don't persist to subsequent scenes
      delete this.currentAudio.sfx;
      delete this.currentAudio.voice;
    }

    // Inherit Characters
    if (overrides.characters !== undefined) {
      if (overrides.characters === null) {
        this.currentCharacters = undefined;
      } else {
        this.currentCharacters = [...overrides.characters];
      }
    }
    if (this.currentCharacters) base.characters = [...this.currentCharacters];

    // Merge in the specific overrides (text, speaker, effect, next, etc)
    Object.assign(base, overrides);

    // Link previous scene "next" pointer to this scene
    if (this.scenes.length > 0) {
      const prev = this.scenes[this.scenes.length - 1];
      if (!prev.next && prev.type !== "choice" && prev.type !== "ending") {
        prev.next = id;
      }
    }

    // Debug: log ending scenes to verify next property
    if (type === "ending") {
      console.log(`[StoryBuilder] Ending scene created:`, { id, type, next: overrides.next, baseNext: base.next });
    }

    this.scenes.push(base as Scene);
    return this;
  }

  // ══════════════════════════════════════════════════════════════
  // HELPER BUILDER METHODS
  // ══════════════════════════════════════════════════════════════

  /**
   * Set the persistent background. 
   * Subsequent scenes will use this until changed.
   * Pass null to clear.
   */
  public bg(config: SceneBg | null): this {
     if (config === null) {
        this.currentBg = undefined;
     } else {
        this.currentBg = { ...this.currentBg, ...config };
     }
     return this;
  }

  /**
   * Set the persistent characters on screen.
   * Subsequent scenes will use this exact array until changed.
   * Pass null to clear the screen.
   */
  public chars(config: SceneCharacter[] | null): this {
    if (config === null) {
       this.currentCharacters = undefined;
    } else {
       this.currentCharacters = [...config];
    }
    return this;
  }

  /**
   * Play or set audio. Will persist.
   */
  public audio(config: SceneAudio | null): this {
    if (config === null) {
       this.currentAudio = undefined;
    } else {
       this.currentAudio = { ...this.currentAudio, ...config };
    }
    return this;
  }

  // ══════════════════════════════════════════════════════════════
  // CORE SCENE ADDERS
  // ══════════════════════════════════════════════════════════════

  /**
   * Add a generic Transition (black screen/fade)
   */
  public transition(duration: number, text: string = "", overrides: Partial<Omit<TransitionScene, "type">> = {}): this {
    return this.addScene("transition", { text, duration, ...overrides });
  }

  /**
   * Add a CG Scene (Full screen image)
   */
  public cg(image: string, caption: string = "", overrides: Partial<Omit<CgScene, "type">> = {}): this {
    return this.addScene("cg", { image, caption, ...overrides });
  }

  /**
   * Add an Examine Scene (Pop-up item inspection)
   */
  public examine(image: string, caption: string = "", overrides: Partial<Omit<ExamineScene, "type">> = {}): this {
    return this.addScene("examine", { image, caption, ...overrides });
  }

  /**
   * Add an Inner Monologue (No speaker name)
   */
  public M(text: string, overrides: Partial<Omit<MonologueScene, "type">> = {}): this {
    return this.addScene("monologue", { text, ...overrides });
  }

  /**
   * Add a Speaker Dialogue
   */
  public D(speakerName: string, speakerId: string | undefined, text: string, overrides: Partial<Omit<DialogueScene, "type">> = {}): this {
    return this.addScene("dialogue", { speaker: speakerName, speakerId, text, ...overrides });
  }

  /**
   * Add a Choice Option branch. 
   * 'options' must define absolute next pointers unless processed specially by the executor.
   */
  public choice(question: string, options: ChoiceOption[], overrides: Partial<Omit<ChoiceScene, "type">> = {}): this {
    return this.addScene("choice", { question, options, ...overrides });
  }

  /**
   * Add an Ending
   */
  public end(title: string, endingType: "act" | "good" | "bad" | "true" = "act", overrides: Partial<Omit<EndingScene, "type">> = {}): this {
    return this.addScene("ending", { title, endingType, ...overrides });
  }

  // ══════════════════════════════════════════════════════════════
  // RENDERER / EXPORTER
  // ══════════════════════════════════════════════════════════════

  /**
   * Return the constructed scene array.
   */
  public build(): Scene[] {
    return this.scenes;
  }
}
