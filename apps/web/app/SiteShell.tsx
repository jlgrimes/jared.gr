'use client';

import React from 'react';
import type { Info } from '@jared/info';
import { WindowsWrapper } from '@wrapper/windows';
import { WisprWrapper } from '@wrapper/wispr';

export type SiteMode = 'wispr' | 'windows';

const STORAGE_KEY = 'jared.gr:mode';

/**
 * Owns which wrapper is on screen and remembers the choice.
 *
 * Deliberately lives in the app rather than in either wrapper: the README's contract is that
 * a wrapper is a pure function of `Info`, so neither one knows the other exists. The peel
 * that switches between them (Phase 3) mounts here too.
 */
export const SiteShell = ({ info }: { info: Info }) => {
  // Always start on Wispr so SSR and the first client render agree; the stored preference is
  // applied in an effect, which costs one frame and avoids a hydration mismatch.
  const [mode, setMode] = React.useState<SiteMode>('wispr');

  React.useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === 'windows' || stored === 'wispr') setMode(stored);
    } catch {
      // Private mode or blocked storage — the default is fine.
    }
  }, []);

  React.useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // Non-fatal: the mode just won't persist.
    }
  }, [mode]);

  return mode === 'windows' ? (
    <WindowsWrapper info={info} />
  ) : (
    <WisprWrapper info={info} />
  );
};
