'use client';

import React, { useState } from 'react';
import { useDesktop } from './DesktopContext';
import { Taskbar } from './Taskbar';
import { Window } from './Window';
import { DesktopIcon } from './DesktopIcon';
import { useApps } from './apps';
import { AnimatePresence } from 'framer-motion';

export const Desktop = () => {
  const { windows } = useDesktop();
  const { desktopApps } = useApps();
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);

  return (
    <div className='relative w-screen h-screen overflow-hidden bg-cover bg-center select-none'
      style={{
        // A generic Windows 11 style blue bloom gradient
        backgroundImage: 'linear-gradient(to bottom right, #f8f9fa, #e6f2ff)',
      }}
      onClick={() => setSelectedIconId(null)}
    >
      {/* Desktop Background / Area */}
      <div className='absolute inset-0 z-0 bg-[url("/assets/wallpaper.jpg")] bg-cover bg-center pointer-events-none' />

      {/* Desktop Icons Container */}
      <div className='absolute top-0 left-0 bottom-12 p-2 flex flex-col flex-wrap content-start gap-1 z-10'>
        {desktopApps.map((app) => (
          <DesktopIcon
            key={app.id}
            id={app.id}
            name={app.name}
            icon={app.icon}
            content={'content' in app ? app.content : undefined}
            url={'url' in app ? app.url : undefined}
            isSelected={selectedIconId === app.id}
            onSelect={setSelectedIconId}
          />
        ))}
      </div>

      {/* Render Open Windows */}
      <AnimatePresence>
        {windows.map((w) => (
          <Window key={w.id} id={w.id} />
        ))}
      </AnimatePresence>

      {/* Taskbar */}
      <Taskbar />
    </div>
  );
};
