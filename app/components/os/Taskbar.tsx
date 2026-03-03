'use client';

import React, { useState, useEffect, useRef } from 'react';

import { useDesktop } from '../../context/DesktopContext';
import { AnimatePresence, motion } from 'framer-motion';
import { StartMenu } from './StartMenu';
import {
  Wifi4Regular,
  Speaker2Regular,
  Battery4Regular,
  ChevronUpRegular,
  Search24Regular,
} from '@fluentui/react-icons';

export const Taskbar = () => {
  const { windows, focusWindow, minimizeWindow, restoreWindow, focusedWindowId } = useDesktop();
  const [time, setTime] = useState<Date | null>(null);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

  useEffect(() => {
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAppClick = (id: string, state: string) => {
    if (state === 'minimized') {
      restoreWindow(id);
    } else if (focusedWindowId === id) {
      minimizeWindow(id);
    } else {
      focusWindow(id);
    }
  };

  return (
    <>
    <StartMenu isOpen={isStartMenuOpen} onClose={() => setIsStartMenuOpen(false)} />
    <div className='fixed bottom-0 left-0 right-0 h-12 bg-[#f3f3f3]/80 dark:bg-[#202020]/90 backdrop-blur-2xl border-t border-white/20 dark:border-white/5 flex items-center justify-between px-2 z-[9999] shadow-[0_-2px_10px_rgba(0,0,0,0.1)]'>
      
      {/* Invisible spacer for flex balance */}
      <div className='flex-1 flex items-center justify-start hidden md:flex'>
         <div className='w-10 h-10'></div>
      </div>

      {/* Center Apps */}
      <div className='flex-1 flex items-center justify-center'>
        {/* Windows Start Button */}
        <button
          id="start-button"
          onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
          className={`w-10 h-10 mx-[3px] flex items-center justify-center rounded transition-colors group relative
            ${isStartMenuOpen ? 'bg-white/60 dark:bg-white/20' : 'hover:bg-white/40 dark:hover:bg-white/10'}
          `}
        >
          <svg viewBox="0 0 100 100" className="w-6 h-6 text-[#0078d4]">
            <path fill="currentColor" d="M4 4h44v44H4zM52 4h44v44H52zM4 52h44v44H4zM52 52h44v44H52z" />
          </svg>
        </button>

        {/* Search */}
        <div className='hidden sm:flex relative items-center ml-2 mr-4'>
           <div className='w-40 h-8 bg-white/70 dark:bg-white/10 rounded-full border border-black/10 dark:border-white/10 flex items-center px-3 hover:bg-white dark:hover:bg-white/20 transition-colors shadow-sm cursor-text'>
              <Search24Regular className="w-4 h-4 text-gray-600 dark:text-gray-300 mr-2" />
              <span className='text-xs text-gray-500'>Search</span>
           </div>
        </div>

        {/* Open Windows List */}
        <AnimatePresence>
          {windows.filter((w) => !w.isClosing).map((w) => (
            <motion.div
              key={w.id}
              initial={{ width: 0, marginLeft: 0, marginRight: 0 }}
              animate={{ width: 40, marginLeft: 3, marginRight: 3 }}
              exit={{ width: 0, marginLeft: 0, marginRight: 0, transition: { delay: 0.15, type: 'spring', stiffness: 400, damping: 30 } }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              style={{ overflow: 'hidden', flexShrink: 0 }}
            >
              <TaskbarIcon window={w} handleAppClick={handleAppClick} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Right System Tray */}
      <div className='flex-1 flex items-center justify-end h-full gap-1 pr-2'>
        <button className='w-6 h-full flex items-center justify-center hover:bg-white/50 dark:hover:bg-white/10 rounded my-1 text-gray-800 dark:text-gray-200'>
          <ChevronUpRegular className='w-4 h-4' />
        </button>
        
        <div className='flex items-center h-full hover:bg-white/50 dark:hover:bg-white/10 rounded my-1 px-2 gap-2 cursor-pointer text-gray-800 dark:text-gray-200'>
          <Wifi4Regular className='w-4 h-4' />
          <Speaker2Regular className='w-4 h-4' />
          <Battery4Regular className='w-4 h-4' />
        </div>

        <div 
          className='flex flex-col items-end justify-center h-full hover:bg-white/30 dark:hover:bg-white/10 rounded my-1 px-2 cursor-pointer text-xs text-gray-800 dark:text-gray-200 leading-tight'
          // Windows 11 clock uses OpenType style set 1 for straight-base numbers
          style={{ 
            fontFamily: '"Inter", sans-serif',
            fontFeatureSettings: '"cv01"' 
          }}
        >
          <span>
            {time ? time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).replace(':', '\u2236') : '...'}
          </span>
          <span>
            {time ? time.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' }) : '...'}
          </span>
        </div>
      </div>
    </div>
    </>
  );
};

// Extracted component to safely measure DOM rect after mount
const TaskbarIcon = ({ window: w, handleAppClick }: { window: any, handleAppClick: any }) => {
  const { registerIconRect } = useDesktop();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Re-register icon rect whenever layout settles (handles shifting positions)
  const updateRect = () => {
    if (buttonRef.current) {
      registerIconRect(w.id, buttonRef.current.getBoundingClientRect());
    }
  };

  useEffect(() => {
    updateRect();
  }, [w.id]);

  return (
    <motion.button
      ref={buttonRef}
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.8 }}
      transition={{ type: 'spring', stiffness: 500, damping: 28, mass: 0.8 }}
      onClick={() => handleAppClick(w.id, w.state)}
      className={`w-10 h-10 flex flex-shrink-0 items-center justify-center rounded transition-[background-color] relative group
        ${w.state === 'minimized' ? 'hover:bg-white/30 dark:hover:bg-white/10' : 'bg-white/50 dark:bg-white/20 hover:bg-white/60 dark:hover:bg-white/30'}
      `}
    >
      <div className='w-6 h-6 flex items-center justify-center'>
         {w.icon}
      </div>
      {/* Active Indicator */}
      <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-1 rounded-t-full transition-all
        ${w.state === 'minimized' ? 'w-1 bg-gray-400' : 'w-4 bg-[#0078d4]'}
      `} />
      
      {/* Tooltip */}
      <div className='absolute bottom-12 left-1/2 -translate-x-1/2 px-2 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap text-xs text-gray-800 dark:text-gray-200 z-[10000]'>
          {w.title}
      </div>
    </motion.button>
  );
};
