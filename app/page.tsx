'use client';

import { useState } from 'react';
import { useDesktop } from './context/DesktopContext';
import { Taskbar } from './components/os/Taskbar';
import { Window } from './components/os/Window';
import { DesktopIcon } from './components/os/DesktopIcon';
import { desktopApps } from './components/os/apps';
import { AnimatePresence } from 'framer-motion';

export default function Desktop() {
  const { windows } = useDesktop();
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
      <div className='absolute inset-0 z-0 bg-[url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop")] bg-cover bg-center opacity-40 dark:opacity-20 mix-blend-overlay pointer-events-none' />

      {/* Desktop Icons Container */}
      <div className='absolute top-0 left-0 bottom-12 p-2 flex flex-col flex-wrap content-start gap-1 z-10'>
        {desktopApps.map((app) => (
          <DesktopIcon
            key={app.id}
            id={app.id}
            name={app.name}
            icon={app.icon}
            content={app.content}
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
}
