'use client';

import React, { useState, useEffect } from 'react';

import { useDesktop } from '../../context/DesktopContext';
import { StartMenu } from './StartMenu';
import {
  Wifi4Regular,
  Speaker2Regular,
  Battery4Regular,
  ChevronUpRegular,
  Search24Regular,
} from '@fluentui/react-icons';

export const Taskbar = () => {
  const { windows, focusWindow, minimizeWindow, restoreWindow } = useDesktop();
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
    } else {
      // If it's the focused window, minimize it. Otherwise, focus it.
      // We can approximate focus by z-index or simply toggle for now.
      // A full implementation would track actual active window ID.
      // For simplicity, let's just restore/focus it.
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
      <div className='flex-1 flex items-center justify-center gap-1.5'>
        {/* Windows Start Button */}
        <button 
          id="start-button"
          onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
          className={`w-10 h-10 flex items-center justify-center rounded transition-colors group relative
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
        {windows.map((w) => (
          <button
            key={w.id}
            onClick={() => handleAppClick(w.id, w.state)}
            className={`w-10 h-10 flex items-center justify-center rounded transition-all relative group
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
          </button>
        ))}
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

        <div className='flex flex-col items-end justify-center h-full hover:bg-white/30 dark:hover:bg-white/10 rounded my-1 px-2 cursor-pointer text-xs text-gray-800 dark:text-gray-200 leading-tight'>
          <span>
            {time ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
          </span>
          <span>
            {time ? time.toLocaleDateString([], { month: '2-digit', day: '2-digit', year: 'numeric' }) : '...'}
          </span>
        </div>
      </div>
    </div>
    </>
  );
};
