// Wispr Flow's public design language, recreated from its brand material.
// Editorial and warm — a cream broadsheet, not a dashboard.

export const ink = '#1a1a1a'; // Vast Ink — text and every border
export const cream = '#ffffeb'; // Lumen Cream — the canvas
export const lavender = '#f0d7ff'; // Lavender Whisper — primary actions
export const forest = '#034f46'; // Forest Ink — secondary accents
export const ember = '#ffa946'; // active/recording states

// Ink at low alpha rather than a grey ramp — keeps everything in the same family.
export const inkMuted = 'rgba(26, 26, 26, 0.56)';
export const inkFaint = 'rgba(26, 26, 26, 0.28)';
export const inkHairline = 'rgba(26, 26, 26, 0.12)';

/** 2px solid ink is the signature element — most surfaces carry it. */
export const border = `2px solid ${ink}`;

export const radius = {
  pill: 999,
  card: 32,
  panel: 40,
} as const;

/** The one shadow in the system: soft, warm, never a grey drop shadow. */
export const lift = '0 18px 50px -12px rgba(26, 26, 26, 0.28)';

/** Spring used for every notch size change — the pill and the panel are one element. */
export const notchSpring = {
  type: 'spring',
  stiffness: 420,
  damping: 38,
  mass: 0.9,
} as const;
