'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useIsPresent } from 'framer-motion';
import { useDesktop } from '../../context/DesktopContext';
import {
  Subtract16Regular,
  Maximize16Regular,
  SquareMultiple16Regular,
  Dismiss16Regular,
} from '@fluentui/react-icons';

interface WindowProps {
  id: string;
}

export const Window: React.FC<WindowProps> = ({ id }) => {
  const {
    windows,
    closeWindow,
    removeWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    focusWindow,
    getIconRect,
  } = useDesktop();
  const windowData = windows.find(w => w.id === id);
  const windowRef = useRef<HTMLDivElement>(null);

  // Responsive default width handling based on screen size
  const [defaultWidth, setDefaultWidth] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 1024
      ? Math.min(window.innerWidth - 32, 800)
      : 800
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setDefaultWidth(Math.min(window.innerWidth - 32, 800));
      } else {
        setDefaultWidth(800);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track the exact dragged position
  const [dragPos, setDragPos] = useState(() => {
    if (typeof window === 'undefined') return { x: 0, y: 100 };
    const w = window.innerWidth < 1024 ? Math.min(window.innerWidth - 32, 800) : 800;
    return {
      x: Math.max(0, window.innerWidth / 2 - w / 2),
      y: Math.max(0, window.innerHeight / 2 - 300),
    };
  });

  const [isDragging, setIsDragging] = useState(false);
  const grabOffset = useRef({ x: 0, y: 0 });
  const dragPosRef = useRef(dragPos);
  dragPosRef.current = dragPos;

  const isPresent = useIsPresent();

  const {
    title = '',
    icon = null,
    content = null,
    state = 'normal',
    zIndex = 0,
    isClosing = false,
  } = windowData || {};
  const isMaximized = state === 'maximized';
  const isMinimized = state === 'minimized';
  const isMaximizedRef = useRef(isMaximized);
  isMaximizedRef.current = isMaximized;

  // Manual drag via pointer events
  const handlePointerMove = useCallback((e: PointerEvent) => {
    const x = Math.max(
      -700,
      Math.min(
        e.clientX - grabOffset.current.x,
        window.innerWidth - 50
      )
    );
    const y = Math.max(
      0,
      Math.min(
        e.clientY - grabOffset.current.y,
        window.innerHeight - 100
      )
    );
    setDragPos({ x, y });
  }, []);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
  }, [handlePointerMove]);

  // Cleanup listeners on unmount
  useEffect(() => {
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  if (!windowData && !isPresent) return null;

  const handleTitleBarPointerDown = (e: React.PointerEvent) => {
    focusWindow(id);

    if (isMaximized) {
      const pointerX = e.clientX;
      const fraction = pointerX / window.innerWidth;
      const newX = pointerX - defaultWidth * fraction;
      grabOffset.current = { x: pointerX - newX, y: e.clientY };
      setDragPos({ x: newX, y: 0 });
      restoreWindow(id);
    } else {
      grabOffset.current = { x: e.clientX - dragPosRef.current.x, y: e.clientY - dragPosRef.current.y };
    }

    setIsDragging(true);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // Calculate zoom coordinates based on the Taskbar icon
  const targetRect = getIconRect(id);
  const targetX =
    targetRect && typeof window !== 'undefined'
      ? targetRect.x + targetRect.width / 2 - defaultWidth / 2
      : typeof window !== 'undefined'
        ? window.innerWidth / 2 - defaultWidth / 2
        : 0;
  const targetY = targetRect
    ? targetRect.y + targetRect.height / 2
    : typeof window !== 'undefined'
      ? window.innerHeight
      : 500;

  return (
    <motion.div
      ref={windowRef}
      initial={{ opacity: 0, scale: 0, x: targetX, y: targetY }}
      animate={
        isClosing
          ? 'closed'
          : isMinimized
            ? {
                opacity: 0,
                scale: 0,
                x: targetX,
                y: targetY,
                pointerEvents: 'none' as const,
              }
            : {
                opacity: 1,
                scale: 1,
                pointerEvents: 'auto' as const,
                ...(isMaximized
                  ? {
                      width: '100vw',
                      height: 'calc(100vh - 3rem)',
                      x: 0,
                      y: 0,
                      borderRadius: 0,
                    }
                  : {
                      x: dragPos.x,
                      y: dragPos.y,
                      width: defaultWidth,
                      height: 600,
                      borderRadius: 8,
                    }),
              }
      }
      variants={{
        closed: {
          opacity: 0,
          scale: 0.95,
          x: isMaximized ? 0 : dragPos.x,
          y: isMaximized ? 0 : dragPos.y,
          height: isMaximized ? 'calc(100vh - 3rem)' : 600,
          width: isMaximized ? '100vw' : defaultWidth,
          pointerEvents: 'none' as const,
        },
      }}
      exit='closed'
      onAnimationComplete={definition => {
        if (definition === 'closed' && isClosing) {
          removeWindow(id);
        }
      }}
      transition={isDragging ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
      style={{
        zIndex,
        position: 'absolute',
      }}
      className={`flex flex-col bg-white dark:bg-gray-900 shadow-2xl overflow-hidden`}
      onPointerDown={() => focusWindow(id)}
    >
      {/* Title Bar */}
      <div
        className={`h-7 flex items-center justify-between px-3 select-none touch-none ${
          zIndex >= Math.max(...windows.map(w => w.zIndex))
            ? 'bg-gray-100/80 dark:bg-gray-800/80'
            : 'bg-white/50 dark:bg-gray-900/50'
        }`}
        onPointerDown={handleTitleBarPointerDown}
        onDoubleClick={() =>
          isMaximized ? restoreWindow(id) : maximizeWindow(id)
        }
      >
        <div className='flex items-center gap-2 overflow-hidden flex-1'>
          <div className='w-4 h-4 flex items-center justify-center shrink-0'>
            {icon}
          </div>
          <span className='text-xs font-medium text-gray-800 dark:text-gray-200 truncate'>
            {title}
          </span>
        </div>

        {/* Window Controls */}
        <div className='flex h-full -mr-3 items-stretch shrink-0'>
          <button
            onPointerDown={e => e.stopPropagation()}
            onClick={() => minimizeWindow(id)}
            className='w-[46px] flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors'
          >
            <Subtract16Regular />
          </button>
          <button
            onPointerDown={e => e.stopPropagation()}
            onClick={() =>
              isMaximized ? restoreWindow(id) : maximizeWindow(id)
            }
            className='w-[46px] flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors'
          >
            {isMaximized ? <SquareMultiple16Regular /> : <Maximize16Regular />}
          </button>
          <button
            onPointerDown={e => e.stopPropagation()}
            onClick={() => closeWindow(id)}
            className='w-[46px] flex items-center justify-center hover:bg-red-600 hover:text-white dark:hover:bg-red-600 text-gray-600 dark:text-gray-300 transition-colors rounded-tr-[8px]'
          >
            <Dismiss16Regular />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className='flex-1 overflow-auto bg-white dark:bg-[#202020] relative max-h-full'>
        {content}
      </div>
    </motion.div>
  );
};
