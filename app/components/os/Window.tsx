'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { useDesktop } from '../../context/DesktopContext';
import { Subtract16Regular, Maximize16Regular, SquareMultiple16Regular, Dismiss16Regular } from '@fluentui/react-icons';

interface WindowProps {
  id: string;
}

export const Window: React.FC<WindowProps> = ({ id }) => {
  const { windows, closeWindow, minimizeWindow, maximizeWindow, restoreWindow, focusWindow, getIconRect } = useDesktop();
  const windowData = windows.find((w) => w.id === id);
  const dragControls = useDragControls();
  const constraintsRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  // Responsive default width handling based on screen size
  const [defaultWidth, setDefaultWidth] = useState(800);
  
  useEffect(() => {
      const handleResize = () => {
          if (window.innerWidth < 1024) {
              setDefaultWidth(Math.min(window.innerWidth - 32, 800)); // Mobile padding
          } else {
              setDefaultWidth(800);
          }
      };
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!windowData) return null;

  const { title, icon, content, state, zIndex } = windowData;
  const isMaximized = state === 'maximized';
  const isMinimized = state === 'minimized';

  const handlePointerDown = (e: React.PointerEvent) => {
    focusWindow(id);
    dragControls.start(e);
  };

  // Calculate zoom coordinates based on the Taskbar icon
  const targetRect = getIconRect(id);
  const targetX = targetRect && typeof window !== 'undefined' ? targetRect.x + (targetRect.width / 2) - (defaultWidth / 2) : typeof window !== 'undefined' ? (window.innerWidth / 2) - (defaultWidth / 2) : 0;
  const targetY = targetRect ? targetRect.y + (targetRect.height / 2) : typeof window !== 'undefined' ? window.innerHeight : 500;

  // Track the exact dragged position to safely animate back to it after maximizing
  const [dragPos, setDragPos] = useState({
      x: typeof window !== 'undefined' ? (window.innerWidth / 2) - (defaultWidth / 2) : 0,
      y: typeof window !== 'undefined' ? (window.innerHeight / 2) - 300 : 100
  });

  return (
    <motion.div
      ref={windowRef}
      drag={!isMaximized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      dragConstraints={{ top: 0, left: -defaultWidth + 50, right: typeof window !== 'undefined' ? window.innerWidth - 50 : 1000, bottom: typeof window !== 'undefined' ? window.innerHeight - 100 : 800 }}
      onDragEnd={(e, info) => {
          setDragPos(prev => ({
              x: prev.x + info.offset.x,
              y: prev.y + info.offset.y
          }));
      }}
      initial={{ opacity: 0, scale: 0, x: targetX, y: targetY }}
      animate={
        isMinimized
          ? { opacity: 0, scale: 0, x: targetX, y: targetY, pointerEvents: 'none' as const }
          : { 
              opacity: 1, 
              scale: 1, 
              pointerEvents: 'auto' as const,
              ...(isMaximized ? {
                  width: '100vw',
                  height: 'calc(100vh - 3rem)',
                  x: 0,
                  y: 0,
                  borderRadius: 0
              } : {
                  x: dragPos.x,
                  y: dragPos.y,
                  width: defaultWidth,
                  height: 600,
                  borderRadius: 8
              })
            }
      }
      exit={{ opacity: 0, scale: 0, x: targetX, y: targetY }}
      transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
      style={{ 
        zIndex,
        position: 'absolute',
      }}
      className={`flex flex-col bg-white dark:bg-gray-900 shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800`}
      onPointerDown={() => focusWindow(id)}
    >
      {/* Title Bar */}
      <div
        className={`h-10 flex items-center justify-between px-3 select-none touch-none ${
            // Active window styling vs inactive
            zIndex >= Math.max(...windows.map(w => w.zIndex)) 
                ? 'bg-gray-100/80 dark:bg-gray-800/80' 
                : 'bg-white/50 dark:bg-gray-900/50'
        }`}
        onPointerDown={handlePointerDown}
        onDoubleClick={() => isMaximized ? restoreWindow(id) : maximizeWindow(id)}
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
        <div className='flex h-full -mr-3 items-center shrink-0'>
          <button
            title="Minimize"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => minimizeWindow(id)}
            className='w-[46px] h-[32px] flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors'
          >
            <Subtract16Regular />
          </button>
          <button
            title={isMaximized ? "Restore" : "Maximize"}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => isMaximized ? restoreWindow(id) : maximizeWindow(id)}
            className='w-[46px] h-[32px] flex items-center justify-center hover:bg-gray-200 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-colors'
          >
            {isMaximized ? <SquareMultiple16Regular /> : <Maximize16Regular />}
          </button>
          <button
            title="Close"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => closeWindow(id)}
            className='w-[46px] h-[32px] flex items-center justify-center hover:bg-red-500 hover:text-white dark:hover:bg-red-500 text-gray-600 dark:text-gray-300 transition-colors'
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
