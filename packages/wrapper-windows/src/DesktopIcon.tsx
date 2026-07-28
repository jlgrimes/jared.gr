'use client';

import React from 'react';
import { useDesktop } from './DesktopContext';

interface DesktopIconProps {
  id: string;
  name: string;
  icon: React.ReactNode;
  content?: React.ReactNode;
  url?: string;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ id, name, icon, content, url, isSelected, onSelect }) => {
  const { openWindow } = useDesktop();

  const activate = () => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      openWindow({ id, title: name, icon, content });
    }
  };

  return (
    <div
      className='flex flex-col items-center justify-start w-20 h-24 m-2 overflow-visible group'
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(id);
      }}
      onDoubleClick={activate}
      onTouchEnd={(e) => {
          e.preventDefault();
          activate();
      }}
    >
      <div className={`flex flex-col items-center gap-1 w-full py-1 rounded
        ${isSelected
          ? 'bg-white/20 hover:bg-white/15'
          : 'group-hover:bg-white/15 dark:group-hover:bg-white/15'}
      `}>
        <div className='w-12 h-12 flex items-center justify-center drop-shadow-md group-hover:drop-shadow-lg transition-transform'>
          {icon}
        </div>
        <span
          className={`text-xs text-white text-center font-medium select-none leading-tight w-full ${isSelected ? 'line-clamp-2' : 'truncate'}`}
          style={{ textShadow: '0 0.625px 1.75px black, 0 0.625px 1.75px black, 0 0.625px 1.75px black, 0 0.625px 1.75px black', letterSpacing: '-0.025em' }}
        >
          {name}
        </span>
      </div>
    </div>
  );
};
