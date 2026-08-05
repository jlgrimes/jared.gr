// The notch is a state machine. Everything else in this package renders one of these.

export type FlowState =
  | 'idle' // narrow pill, waiting
  | 'listening' // mic open, transcript filling in
  | 'processing' // request in flight, nothing to show yet
  | 'answering' // response streaming into the panel
  | 'open'; // panel holds a settled answer

/** Wispr's writing-style pill. Steers both the hero copy and the model's register. */
export const WRITING_STYLES = [
  'Default',
  'Casual',
  'Formal',
  'Very casual',
  'Excited',
] as const;

export type WritingStyle = (typeof WRITING_STYLES)[number];

/**
 * Maps the pill's label onto the key the hero copy is stored under. 'Default' has no
 * variant — it is `hero.bio` itself.
 */
export const BIO_STYLE_KEY: Record<
  WritingStyle,
  'casual' | 'formal' | 'veryCasual' | 'excited' | null
> = {
  Default: null,
  Casual: 'casual',
  Formal: 'formal',
  'Very casual': 'veryCasual',
  Excited: 'excited',
};

/**
 * One turn in the transcript, flattened to the only thing the notch renders. Answers are
 * plain prose — there is no card protocol and no markdown to parse.
 */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

/**
 * What the Flow Bar needs from a speech source. Two adapters implement it — the browser's
 * Web Speech API and the Gateway's streaming transcription — and the bar can't tell which
 * it's talking to.
 */
export interface Dictation {
  /** False when the browser can't dictate at all; the mic button hides rather than erroring. */
  supported: boolean;
  listening: boolean;
  /** Live, revisable text. Replaced wholesale as the recognizer changes its mind. */
  partial: string;
  /** Per-frame amplitudes, newest last, roughly 0–1. Drives the waveform. */
  amplitudes: number[];
  start: () => void;
  /** Resolves with the final transcript, or '' if nothing was heard. */
  stop: () => Promise<string>;
  cancel: () => void;
  /**
   * Optional: warm anything expensive before the user commits to speaking — minting a
   * token, opening a socket. Called on mic hover. A no-op for adapters with nothing to warm.
   */
  prefetch?: () => void;
}
