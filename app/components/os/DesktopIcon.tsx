'use client';

import React from 'react';
import { useDesktop } from '../../context/DesktopContext';

interface DesktopIconProps {
  id: string;
  name: string;
  icon: React.ReactNode;
  content: React.ReactNode;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ id, name, icon, content, isSelected, onSelect }) => {
  const { openWindow } = useDesktop();

  return (
    <div
      className={`flex flex-col items-center justify-start w-20 h-24 px-1 py-2 pt-3 m-2 gap-1 rounded overflow-visible group
        ${isSelected
          ? 'bg-blue-500/20 ring-1 ring-blue-400/40'
          : 'hover:bg-black/10 dark:hover:bg-white/10'}
      `}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.(id);
      }}
      onDoubleClick={() => openWindow({ id, title: name, icon, content })}
      onTouchEnd={(e) => {
          e.preventDefault();
          openWindow({ id, title: name, icon, content });
      }}
    >
      <div className='w-12 h-12 flex items-center justify-center drop-shadow-md group-hover:drop-shadow-lg transition-transform'>
        {icon}
      </div>
      <span
        className={`text-xs text-white text-center font-medium select-none leading-tight w-full pb-1 ${isSelected ? 'line-clamp-2' : 'truncate'}`}
        style={{ textShadow: '0 0.625px 1.75px black, 0 0.625px 1.75px black, 0 0.625px 1.75px black, 0 0.625px 1.75px black', letterSpacing: '-0.025em' }}
      >
        {name}
      </span>
    </div>
  );
};
