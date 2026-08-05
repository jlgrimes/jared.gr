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
 * Panels the model can mount inside the notch, keyed by the tool that produced them.
 * The tool's *input* is the payload — there is no separate card protocol.
 */
export type Card =
  | { kind: 'projects'; stack?: string }
  | { kind: 'project'; title: string }
  | { kind: 'testimonials' }
  | { kind: 'skills' }
  | { kind: 'contact' };

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
}
