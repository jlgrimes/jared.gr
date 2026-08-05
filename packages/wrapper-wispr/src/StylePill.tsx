'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { WRITING_STYLES, type WritingStyle } from './types';
import { cream, ink, inkHairline, lavender, lift, radius } from './tokens';

const MENU_WIDTH = 176;
const GAP = 10;

/**
 * Wispr's writing-style pill, repurposed: it sets the register for both the hero copy and
 * the model's answers. Active style carries a checkmark, same as the real one.
 *
 * The menu is portalled to <body> because the notch clips its own overflow (the panel height
 * animation needs it). `position: fixed` wouldn't be enough — the notch animates transforms,
 * which makes it a containing block for fixed descendants.
 */
export const StylePill = ({
  value,
  onChange,
}: {
  value: WritingStyle;
  onChange: (style: WritingStyle) => void;
}) => {
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [rect, setRect] = React.useState<DOMRect | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLUListElement>(null);

  React.useEffect(() => setMounted(true), []);

  const place = React.useCallback(() => {
    const el = triggerRef.current;
    if (el) setRect(el.getBoundingClientRect());
  }, []);

  React.useEffect(() => {
    if (!open) return;
    place();

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Swallow it so Esc closes the menu without also collapsing the whole notch.
        e.stopPropagation();
        setOpen(false);
      }
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKey, true);
    // The notch resizes underneath the menu as the panel animates — track it.
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, true);
    const interval = window.setInterval(place, 100);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKey, true);
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
      window.clearInterval(interval);
    };
  }, [open, place]);

  return (
    <>
      <button
        ref={triggerRef}
        type='button'
        onClick={() => setOpen(o => !o)}
        aria-haspopup='listbox'
        aria-expanded={open}
        aria-label={`Writing style: ${value}`}
        className='flex shrink-0 cursor-pointer items-center gap-1.5 px-3 py-1.5 text-[13px] whitespace-nowrap transition-colors'
        style={{
          fontFamily: 'var(--font-figtree)',
          color: ink,
          background: open ? lavender : 'transparent',
          border: `1.5px solid ${open ? ink : inkHairline}`,
          borderRadius: radius.pill,
        }}
      >
        {value}
        <svg width='9' height='6' viewBox='0 0 9 6' fill='none' aria-hidden='true'>
          <path
            d='M1 1.5 4.5 5 8 1.5'
            stroke={ink}
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && rect && (
              <motion.ul
                ref={menuRef}
                role='listbox'
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.97 }}
                transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className='fixed z-[100] overflow-hidden p-1'
                style={{
                  // Right-aligned to the trigger, opening upward above the notch.
                  left: Math.max(8, rect.right - MENU_WIDTH),
                  top: rect.top - GAP,
                  width: MENU_WIDTH,
                  transformOrigin: 'bottom right',
                  translate: '0 -100%',
                  background: cream,
                  border: `2px solid ${ink}`,
                  borderRadius: 18,
                  boxShadow: lift,
                }}
              >
                {WRITING_STYLES.map(style => (
                  <li key={style}>
                    <button
                      type='button'
                      role='option'
                      aria-selected={style === value}
                      onClick={() => {
                        onChange(style);
                        setOpen(false);
                      }}
                      className='flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-left text-[13px] transition-colors hover:bg-[rgba(26,26,26,0.06)]'
                      style={{ fontFamily: 'var(--font-figtree)', color: ink }}
                    >
                      {style}
                      {style === value && (
                        <svg
                          width='13'
                          height='10'
                          viewBox='0 0 13 10'
                          fill='none'
                          aria-hidden='true'
                        >
                          <path
                            d='M1 5.2 4.6 8.8 12 1.4'
                            stroke={ink}
                            strokeWidth='2'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                      )}
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
};
