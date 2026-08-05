'use client';

import React from 'react';

/** How close to the bottom still counts as "at the bottom". */
const THRESHOLD = 24;

/**
 * Keeps a scroll container pinned to its newest content while streaming, and gets out of the
 * way the moment the visitor scrolls up to re-read something.
 *
 * Observer-driven rather than dependency-driven: tokens arrive as `characterData` mutations
 * inside an existing text node, which a `useEffect` on a message array would never see.
 */
export const useAutoScroll = <T extends HTMLElement>() => {
  const ref = React.useRef<T>(null);
  const [isAtBottom, setIsAtBottom] = React.useState(true);
  // Ref, not state: the observers below read this on every mutation and must not be torn
  // down and rebuilt each time it flips.
  const pinned = React.useRef(true);

  const scrollToBottom = React.useCallback((behavior: ScrollBehavior = 'smooth') => {
    const el = ref.current;
    if (!el) return;
    pinned.current = true;
    setIsAtBottom(true);
    el.scrollTo({ top: el.scrollHeight, behavior });
  }, []);

  const handleScroll = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= THRESHOLD;
    pinned.current = atBottom;
    setIsAtBottom(atBottom);
  }, []);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Assigning scrollTop directly, never scrollTo({behavior:'smooth'}) — this fires on
    // every token, and each smooth scroll would cancel the previous one's animation, so the
    // view would chase the bottom without ever arriving.
    const stick = () => {
      if (!pinned.current) return;
      el.scrollTop = el.scrollHeight;
    };

    const mutations = new MutationObserver(stick);
    mutations.observe(el, { childList: true, subtree: true, characterData: true });

    // Catches the container itself resizing — the notch animating open, or the viewport
    // changing under it.
    const resizes = new ResizeObserver(stick);
    resizes.observe(el);

    return () => {
      mutations.disconnect();
      resizes.disconnect();
    };
  }, []);

  return { ref, isAtBottom, scrollToBottom, handleScroll };
};
