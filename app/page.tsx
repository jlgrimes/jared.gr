'use client';

import { useDesktop } from './context/DesktopContext';
import { Taskbar } from './components/os/Taskbar';
import { Window } from './components/os/Window';
import { DesktopIcon } from './components/os/DesktopIcon';
import { Home, FolderOpen, PanelTop, Chrome } from 'lucide-react';
import { Hero } from './components/Hero';
import { Projects } from './components/projects/Projects';
import { Testimonials } from './components/Testimonials';

export default function Desktop() {
  const { windows } = useDesktop();

  return (
    <div className='relative w-screen h-screen overflow-hidden bg-cover bg-center select-none'
      style={{
        // A generic Windows 11 style blue bloom gradient
        backgroundImage: 'linear-gradient(to bottom right, #f8f9fa, #e6f2ff)',
      }}
    >
      {/* Desktop Background / Area */}
      <div className='absolute inset-0 z-0 bg-[url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop")] bg-cover bg-center opacity-40 dark:opacity-20 mix-blend-overlay pointer-events-none' />

      {/* Desktop Icons Container */}
      <div className='absolute top-0 left-0 bottom-12 p-2 flex flex-col flex-wrap content-start gap-1 z-10'>
        <DesktopIcon
          id='about'
          name='About Me.txt'
          icon={<PanelTop className='w-8 h-8 text-blue-500' />}
          content={
            <div className='p-8 bg-white dark:bg-[#202020] min-h-full font-mono'>
               <Hero />
            </div>
          }
        />
        <DesktopIcon
          id='projects'
          name='Projects'
          icon={<Chrome className='w-8 h-8 text-indigo-500' />}
          content={
            <div className='p-4 bg-[#f3f3f3] dark:bg-[#202020] min-h-full'>
               <Projects />
            </div>
          }
        />
        <DesktopIcon
          id='testimonials'
          name='Testimonials'
          icon={<Home className='w-8 h-8 text-green-500' />}
          content={
            <div className='p-4 bg-white dark:bg-[#111] min-h-full'>
               <Testimonials />
            </div>
          }
        />
      </div>

      {/* Render Open Windows */}
      {windows.map((w) => (
        <Window key={w.id} id={w.id} />
      ))}

      {/* Taskbar */}
      <Taskbar />
    </div>
  );
}
