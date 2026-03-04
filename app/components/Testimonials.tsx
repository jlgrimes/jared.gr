'use client';

import { siteData } from '../../lib/data';
import { AnimatedGroup } from '@/components/motion-primitives/animated-group';
import { InView } from '@/components/motion-primitives/in-view';
import { Search, MoreHorizontal, Video, Phone, Plus, Smile, Paperclip, Send } from 'lucide-react';

export function Testimonials() {
  const testimonials = siteData.testimonials;

  // Function to generate initials
  const getInitials = (role: string) => {
    return role.split(' ').map(n => n[0]).join('').substring(0, 2);
  };

  // Fake timestamps
  const timestamps = ['Yesterday 10:23 AM', 'Yesterday 2:45 PM', 'Today 9:12 AM', 'Today 11:30 AM'];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#201f1f] text-gray-900 dark:text-gray-100 font-sans selection:bg-blue-200 dark:selection:bg-blue-900">
      {/* Teams Header */}
      <div className="flex items-center justify-between px-4 h-14 border-b border-gray-200 dark:border-gray-700/60 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#5b5fc7] flex items-center justify-center text-white font-semibold text-sm">
            TE
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-[15px] font-semibold leading-tight">Teams Feedback</h2>
            <p className="text-[12px] text-gray-500 dark:text-gray-400 leading-tight">General</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400">
          <Video className="w-5 h-5 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 transition-colors" />
          <Phone className="w-5 h-5 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 transition-colors" />
          <MoreHorizontal className="w-5 h-5 cursor-pointer hover:text-gray-700 dark:hover:text-gray-200 transition-colors" />
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 flex flex-col custom-scrollbar">
        <InView
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.3 }}
          once
        >
          <div className="flex justify-center my-4">
            <span className="bg-gray-100 dark:bg-[#2d2c2c] text-gray-600 dark:text-gray-300 text-[11px] font-medium px-3 py-1 rounded-sm">
              September 2026
            </span>
          </div>
          
          <AnimatedGroup
            className='flex flex-col gap-6 w-full'
            preset='fade'
            variants={{
              container: {
                visible: {
                  transition: { staggerChildren: 0.1, delayChildren: 0.05 },
                },
              },
            }}
          >
            {testimonials.map((testimonial, index) => (
              <div key={index} className="flex gap-3 group px-2 py-1 -mx-2 hover:bg-gray-50 dark:hover:bg-[#2d2c2c] rounded transition-colors relative">
                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white font-medium text-sm ${
                  ['bg-[#464eb8]', 'bg-[#1e7145]', 'bg-[#881798]', 'bg-[#c239b3]'][index % 4]
                }`}>
                  {getInitials(testimonial.role)}
                </div>
                <div className="flex-1 flex flex-col">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-[14px] text-gray-900 dark:text-gray-100">{testimonial.role}</span>
                    <span className="text-[12px] text-gray-500 dark:text-gray-400">
                      {timestamps[index % timestamps.length]}
                    </span>
                  </div>
                  <div className="text-[14px] mt-0.5 text-gray-800 dark:text-gray-200 leading-[1.4]">
                    {testimonial.content}
                    <div className="mt-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-l-2 border-gray-300 dark:border-gray-600 pl-2">
                     {testimonial.company}
                    </div>
                  </div>
                </div>
                
                {/* Message Hover Actions */}
                <div className="absolute right-4 -top-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white dark:bg-[#292828] border border-gray-200 dark:border-gray-600 rounded shadow-sm flex items-center px-0.5 py-0.5">
                    <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#3b3a39] rounded text-gray-500 dark:text-gray-400"><Smile className="w-[18px] h-[18px]" /></button>
                    <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#3b3a39] rounded text-gray-500 dark:text-gray-400"><MoreHorizontal className="w-[18px] h-[18px]" /></button>
                  </div>
                </div>
              </div>
            ))}
          </AnimatedGroup>
        </InView>
      </div>

      {/* Compose Area */}
      <div className="p-4 pt-2 shrink-0">
        <div className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#201f1f] rounded-md shadow-sm focus-within:ring-2 focus-within:ring-[#5b5fc7] focus-within:border-transparent transition-all flex items-center justify-between px-3 py-2">
          <div className="flex-1 flex items-center">
            <span className="text-[14px] text-gray-400 dark:text-gray-500 select-none">Type a message...</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#2d2c2c] rounded text-gray-500 dark:text-gray-400"><Plus className="w-[18px] h-[18px]" /></button>
            <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#2d2c2c] rounded text-gray-500 dark:text-gray-400"><Paperclip className="w-[18px] h-[18px]" /></button>
            <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-[#2d2c2c] rounded text-gray-500 dark:text-gray-400"><Smile className="w-[18px] h-[18px]" /></button>
            <div className="w-px h-5 bg-gray-200 dark:bg-gray-700 mx-1"></div>
            <button className="p-1.5 bg-gray-100 disabled dark:bg-[#2d2c2c] rounded text-gray-400 dark:text-gray-500 cursor-not-allowed">
              <Send className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
