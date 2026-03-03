'use client';

import React, { useRef, useEffect } from 'react';
import {
  Search16Regular,
  Power20Regular,
  Person24Regular,
} from '@fluentui/react-icons';
import { motion, AnimatePresence } from 'framer-motion';
import { useDesktop } from '../../context/DesktopContext';
import { desktopApps } from './apps';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ isOpen, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { openWindow } = useDesktop();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't close if clicking the start button itself (it will be handled by the button toggle)
      const startButton = document.getElementById('start-button');
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        startButton &&
        !startButton.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const handleAppClick = (app: any) => {
    openWindow({
      id: app.id,
      title: app.name,
      icon: app.icon,
      content: app.content,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 30,
            mass: 0.8,
          }}
          className='fixed bottom-16 left-1/2 -translate-x-1/2 w-[600px] h-[640px] bg-[#f2f2f2]/90 dark:bg-[#202020]/90 backdrop-blur-2xl rounded-lg shadow-2xl border border-white/20 dark:border-white/10 flex flex-col overflow-hidden z-[9998] transform-gpu'
        >
          {/* Search Bar */}
          <div className='p-6 pb-2'>
            <div className='relative flex items-center bg-white dark:bg-black/20 rounded-full border-b-2 border-b-blue-500 shadow-inner overflow-hidden h-10'>
              <div className='pl-4 pr-3 flex items-center pt-1'>
                <Search16Regular className='text-gray-500 dark:text-gray-400' />
              </div>
              <input
                type='text'
                placeholder='Type here to search'
                className='w-full h-full bg-transparent outline-none text-sm text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 font-sans'
              />
            </div>
          </div>

          {/* Pinned Section */}
          <div className='flex-1 px-8 py-4 overflow-y-auto'>
            <div className='flex justify-between items-center mb-4'>
              <h3 className='text-sm font-semibold text-gray-800 dark:text-white'>
                Pinned
              </h3>
              <button className='text-xs text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white bg-white/50 dark:bg-white/10 px-2 py-1 rounded shadow-sm hover:shadow transition-all'>
                All apps &gt;
              </button>
            </div>

            <div className='grid grid-cols-6 gap-x-2 gap-y-6'>
              {desktopApps.map(app => (
                <div
                  key={app.id}
                  className='flex flex-col items-center justify-start gap-2 p-2 rounded hover:bg-white/50 dark:hover:bg-white/10 cursor-pointer transition-colors group'
                  onClick={() => handleAppClick(app)}
                >
                  <div className='w-8 h-8 flex items-center justify-center transition-transform group-hover:scale-105'>
                    {app.icon}
                  </div>
                  <span className='text-xs text-center text-gray-800 dark:text-gray-200 line-clamp-2 leading-tight px-1'>
                    {app.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Recommended Section */}
            <div className='mt-8'>
              <div className='flex justify-between items-center mb-4'>
                <h3 className='text-sm font-semibold text-gray-800 dark:text-white'>
                  Recommended
                </h3>
                <button className='text-xs text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white bg-white/50 dark:bg-white/10 px-2 py-1 rounded shadow-sm hover:shadow transition-all'>
                  More &gt;
                </button>
              </div>

              <div className='grid grid-cols-2 gap-4'>
                {desktopApps.slice(0, 2).map(app => (
                  <div
                    key={`rec-${app.id}`}
                    className='flex items-center gap-4 p-2 rounded hover:bg-white/50 dark:hover:bg-white/10 cursor-pointer transition-colors'
                    onClick={() => handleAppClick(app)}
                  >
                    <div className='w-8 h-8 flex items-center justify-center'>
                      {app.icon}
                    </div>
                    <div className='flex flex-col'>
                      <span className='text-xs font-medium text-gray-800 dark:text-gray-200'>
                        {app.name}
                      </span>
                      <span className='text-[10px] text-gray-500 dark:text-gray-400'>
                        Recently added
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Profile/Power Bar */}
          <div className='h-16 bg-black/5 dark:bg-black/20 border-t border-black/5 dark:border-white/5 flex items-center justify-between px-6 mt-auto shrink-0'>
            <div className='flex items-center gap-3 hover:bg-white/40 dark:hover:bg-white/10 p-2 rounded cursor-pointer transition-colors'>
              <div className='w-8 h-8 rounded-full overflow-hidden shadow-sm shrink-0'>
                <img
                  src='/assets/propic.jpg'
                  alt=''
                  className='w-full h-full object-cover'
                  draggable={false}
                />
              </div>
              <span className='text-xs text-gray-800 dark:text-gray-200 font-medium font-sans'>
                Jared Grimes
              </span>
            </div>
            <div className='flex items-center gap-1'>
              <button className='w-10 h-10 flex items-center justify-center rounded hover:bg-white/40 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 transition-colors'>
                <Power20Regular />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
