'use client';

import React from 'react';
import type { Info } from '@jared/info';
import { WindowsWrapper } from '@wrapper/windows';
import { WisprWrapper } from '@wrapper/wispr';
import { PEEL_DURATION_MS, PeelCorner, peelClipPath } from './Peel';

export type SiteMode = 'wispr' | 'windows';

const REST = 34;
const HOVER = 62;

/**
 * The triangle's legs have to sum to at least width + height to clear the whole viewport.
 * Sized to just past that: overshooting makes the sweep finish in the first few frames and
 * the peel reads as a cut rather than a tear.
 */
const tornSize = () =>
  typeof window === 'undefined'
    ? 4000
    : (window.innerWidth + window.innerHeight) * 1.06;

/**
 * Owns which wrapper is on screen, and the peel that switches between them.
 *
 * Deliberately lives in the app rather than in either wrapper: the README's contract is that
 * a wrapper is a pure function of `Info`, so neither one knows the other exists.
 */
export const SiteShell = ({ info }: { info: Info }) => {
  // Always start on Wispr so SSR and the first client render agree; the stored preference is
  // applied in an effect, which costs one frame and avoids a hydration mismatch.
  const [mode, setMode] = React.useState<SiteMode>('wispr');
  const [hydrated, setHydrated] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  // `armed` mounts the destination; `tearing` moves the sheet. Two steps, so the mount cost
  // is paid while the page is still whole.
  const [armed, setArmed] = React.useState(false);
  const [tearing, setTearing] = React.useState(false);
  const [tornPx, setTornPx] = React.useState(4000);

  React.useEffect(() => {
    setHydrated(true);
  }, []);

  const other: SiteMode = mode === 'wispr' ? 'windows' : 'wispr';

  const tear = React.useCallback(() => {
    if (armed) return;
    setTornPx(tornSize());
    setHovered(false);
    setArmed(true);
  }, [armed]);

  // Mounting a whole desktop (or a live chat) in the same frame that starts the transition
  // costs the first few frames of the sweep. Wait for the new layer to paint, then tear.
  React.useEffect(() => {
    if (!armed) return;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setTearing(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [armed]);

  React.useEffect(() => {
    if (!tearing) return;
    const id = window.setTimeout(() => {
      setMode(current => (current === 'wispr' ? 'windows' : 'wispr'));
      setTearing(false);
      setArmed(false);
    }, PEEL_DURATION_MS);
    return () => window.clearTimeout(id);
  }, [tearing]);

  const render = (which: SiteMode) =>
    which === 'windows' ? <WindowsWrapper info={info} /> : <WisprWrapper info={info} />;

  const size = tearing ? tornPx : hovered ? HOVER : REST;

  return (
    <div className='fixed inset-0 w-full h-full overflow-hidden'>
      {/* The other mode's signature surface, always present so the lifted corner shows
          something underneath rather than the bare page. Costs one div and one image. */}
      <div
        aria-hidden='true'
        className='absolute inset-0 z-0 bg-cover bg-center'
        style={
          other === 'windows'
            ? { backgroundImage: 'url("/assets/wallpaper.jpg")' }
            : { background: '#ffffeb' }
        }
      />

      {/* The real destination, mounted only for the tear — a Windows desktop and a live chat
          running behind each other forever would be a lot of nothing for a corner.
          Both layers isolate: the wrappers position things with their own z-indices (the
          Windows taskbar, the Flow Bar), and without a stacking context of their own those
          would compete across layers and paint through the sheet on top. */}
      {armed && (
        <div
          className='absolute inset-0 z-0 isolate'
          // Nothing underneath is clickable until it *is* the page.
          style={{ pointerEvents: 'none' }}
        >
          {render(other)}
        </div>
      )}

      <div
        className='absolute inset-0 z-10 isolate'
        style={{
          clipPath: peelClipPath(size),
          // The tear wants an even sweep, so it eases in and out; the hover lift stays
          // front-loaded because it should feel like it responds instantly.
          transition: tearing
            ? `clip-path ${PEEL_DURATION_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`
            : 'clip-path 260ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {render(mode)}
      </div>

      {/* Rendering the corner only after hydration keeps the server markup honest, since the
          label depends on the stored mode. */}
      {hydrated && (
        <PeelCorner
          label={mode === 'wispr' ? 'Switch to the Windows desktop' : 'Back to Flow'}
          hovered={hovered}
          onHoverChange={h => !armed && setHovered(h)}
          onClick={tear}
          hidden={armed}
        />
      )}
    </div>
  );
};
