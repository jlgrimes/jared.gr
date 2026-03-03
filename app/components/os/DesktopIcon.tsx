'use client';

import React from 'react';
import { useDesktop } from '../../context/DesktopContext';

interface DesktopIconProps {
  id: string;
  name: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({ id, name, icon, content }) => {
  const { openWindow } = useDesktop();

  return (
    <div
      className='flex flex-col items-center justify-center w-20 h-24 p-2 m-2 gap-1 rounded hover:bg-white/20 dark:hover:bg-white/10 transition-colors group'
      onDoubleClick={() => openWindow({ id, title: name, icon, content })}
      onTouchEnd={(e) => {
          e.preventDefault();
          openWindow({ id, title: name, icon, content });
      }}
    >
      <div className='w-12 h-12 flex items-center justify-center drop-shadow-md group-hover:drop-shadow-lg transition-transform'>
        {icon}
      </div>
      <span className='text-xs text-white text-center font-medium drop-shadow-md select-none line-clamp-2 leading-tight w-full'>
        {name}
      </span>
    </div>
  );
};
