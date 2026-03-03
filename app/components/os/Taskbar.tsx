'use client';

import React, { useState, useEffect } from 'react';

import { useDesktop } from '../../context/DesktopContext';
import { StartMenu } from './StartMenu';
import {
  Wifi,
  Volume2,
  BatteryMedium,
  ChevronUp,
} from 'lucide-react';

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
    <div className='fixed bottom-0 left-0 right-0 h-12 bg-[#e3e3e3]/80 dark:bg-[#1a1a1a]/80 backdrop-blur-xl border-t border-white/20 flex items-center justify-between px-2 z-[9999]'>
      
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
           <div className='w-40 h-8 bg-white/50 dark:bg-white/10 rounded-full border border-black/10 dark:border-white/10 flex items-center px-3 hover:bg-white/80 dark:hover:bg-white/20 transition-colors cursor-text'>
              <svg className="w-4 h-4 text-gray-600 dark:text-gray-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
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
        <button className='w-6 h-full flex items-center justify-center hover:bg-white/30 dark:hover:bg-white/10 rounded my-1 text-gray-800 dark:text-gray-200'>
          <ChevronUp className='w-4 h-4' />
        </button>
        
        <div className='flex items-center h-full hover:bg-white/30 dark:hover:bg-white/10 rounded my-1 px-2 gap-2 cursor-pointer text-gray-800 dark:text-gray-200'>
          <Wifi className='w-4 h-4' />
          <Volume2 className='w-4 h-4' />
          <BatteryMedium className='w-4 h-4 rotate-90' />
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
