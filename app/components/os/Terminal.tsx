'use client';

import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { siteData } from '../../../lib/data';

const COMMANDS: Record<string, (args: string[]) => string[]> = {
  help: () => [
    'Available commands:',
    '  help          Show this message',
    '  whoami        Who am I?',
    '  about         About me',
    '  projects      List projects',
    '  skills        Tech stack',
    '  socials       Social links',
    '  neofetch      System info',
    '  clear         Clear terminal',
    '',
  ],
  whoami: () => ['jared'],
  about: () => [siteData.hero.bio, ''],
  projects: () => [
    ...siteData.projects.slice(0, 8).map(
      (p) => `  ${p.title.padEnd(28)} ${p.company.padEnd(24)} ${p.year}`
    ),
    '',
    `  ... and ${siteData.projects.length - 8} more`,
    '',
  ],
  skills: () => [
    '  Languages     TypeScript, JavaScript, Rust, Python',
    '  Frameworks    React, Next.js, Node.js',
    '  UI            Fluent UI, Tailwind CSS',
    '  Tools         Git, Azure DevOps, Figma',
    '',
  ],
  socials: () => [
    '  GitHub        https://github.com/jlgrimes',
    '  LinkedIn      https://linkedin.com/in/jaredlgrimes',
    '  X             https://x.com/jgrimesey',
    '',
  ],
  neofetch: () => [
    '',
    '       ████████████           jared@jared.gr',
    '     ██            ██         ──────────────────',
    '   ██    ██    ██    ██       OS: JaredOS 11 Pro',
    '   ██                ██       Host: jared.gr',
    '   ██   ██      ██   ██       Kernel: Next.js 15',
    '     ██   ██████   ██         Shell: zsh',
    '       ██        ██           Terminal: Windows Terminal',
    '         ████████             Theme: Win11 (Dark)',
    '       ██        ██           Resolution: whatever yours is',
    '     ██            ██         WM: CSS Grid + Framer Motion',
    '   ██████████████████         CPU: Your browser @ who knows',
    '                              Memory: enough',
    '',
  ],
};

interface Line {
  text: string;
  isCommand?: boolean;
}

export const Terminal: React.FC = () => {
  const [lines, setLines] = useState<Line[]>([
    { text: 'JaredOS [Version 11.0.2026]' },
    { text: '(c) Jared Grimes. All rights reserved.' },
    { text: '' },
    { text: 'Type "help" for available commands.' },
    { text: '' },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const focusInput = () => inputRef.current?.focus();

  const handleSubmit = () => {
    const trimmed = input.trim();
    const newLines: Line[] = [
      ...lines,
      { text: `C:\\Users\\jared> ${trimmed}`, isCommand: true },
    ];

    if (trimmed === '') {
      // noop
    } else if (trimmed === 'clear') {
      setLines([]);
      setInput('');
      setHistory((prev) => [...prev, trimmed]);
      setHistoryIndex(-1);
      return;
    } else {
      const [cmd, ...args] = trimmed.toLowerCase().split(/\s+/);
      const handler = COMMANDS[cmd];
      if (handler) {
        newLines.push(...handler(args).map((text) => ({ text })));
      } else {
        newLines.push({
          text: `'${cmd}' is not recognized as an internal or external command.`,
        });
        newLines.push({ text: '' });
      }
    }

    setLines(newLines);
    setInput('');
    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
        }
      }
    }
  };

  return (
    <div
      className='h-full bg-[#0c0c0c] text-[#cccccc] font-cascadia text-sm flex flex-col cursor-text'
      onClick={focusInput}
    >
      <div ref={scrollRef} className='flex-1 overflow-y-auto p-4 pb-0'>
        {lines.map((line, i) => (
          <div key={i} className='whitespace-pre-wrap leading-6'>
            {line.isCommand ? (
              <>
                <span className='text-[#6cb6ff]'>C:\Users\jared&gt;</span>{' '}
                {line.text.replace('C:\\Users\\jared> ', '')}
              </>
            ) : (
              line.text || '\u00A0'
            )}
          </div>
        ))}
        <div className='flex leading-6 pb-4'>
          <span className='text-[#6cb6ff] shrink-0'>C:\Users\jared&gt;</span>
          <span>&nbsp;</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className='flex-1 bg-transparent outline-none text-[#cccccc] font-cascadia text-sm caret-[#cccccc]'
            autoFocus
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
};
