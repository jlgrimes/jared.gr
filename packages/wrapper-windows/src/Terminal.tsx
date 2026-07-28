'use client';

import React, { useState, useRef, useEffect, useLayoutEffect, useMemo } from 'react';
import type { Info } from '@jared/info';
import { useInfo } from './InfoContext';

const buildCommands = (info: Info): Record<string, (args: string[]) => string[]> => ({
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
  whoami: () => [info.profile.name.split(' ')[0].toLowerCase()],
  about: () => [info.hero.bio, ''],
  projects: () => [
    ...info.projects
      .slice(0, 8)
      .map(p => `  ${p.title.padEnd(28)} ${p.company.padEnd(24)} ${p.year}`),
    '',
    `  ... and ${info.projects.length - 8} more`,
    '',
  ],
  skills: () => [
    ...info.skills.map(s => `  ${s.category.padEnd(14)}${s.items}`),
    '',
  ],
  socials: () => [
    ...info.socials.map(s => `  ${s.name.padEnd(14)}${s.url}`),
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
});

interface Line {
  text: string;
  isCommand?: boolean;
}

export const Terminal: React.FC = () => {
  const info = useInfo();
  const COMMANDS = useMemo(() => buildCommands(info), [info]);
  const [lines, setLines] = useState<Line[]>([
    { text: 'JaredOS [Version 11.0.2026]' },
    { text: `(c) ${info.profile.name}. All rights reserved.` },
    { text: '' },
    { text: 'Type "help" for available commands.' },
    { text: '' },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLSpanElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useLayoutEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const focusInput = () => inputRef.current?.focus({ preventScroll: true });

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
      if (inputRef.current) inputRef.current.textContent = '';
      setHistory(prev => [...prev, trimmed]);
      setHistoryIndex(-1);
      return;
    } else {
      const [cmd, ...args] = trimmed.toLowerCase().split(/\s+/);
      const handler = COMMANDS[cmd];
      if (handler) {
        newLines.push(...handler(args).map(text => ({ text })));
      } else {
        newLines.push({
          text: `'${cmd}' is not recognized as an internal or external command.`,
        });
        newLines.push({ text: '' });
      }
    }

    setLines(newLines);
    setInput('');
    if (inputRef.current) inputRef.current.textContent = '';
    setHistory(prev => [...prev, trimmed]);
    setHistoryIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex =
          historyIndex === -1
            ? history.length - 1
            : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
        if (inputRef.current) inputRef.current.textContent = history[newIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= history.length) {
          setHistoryIndex(-1);
          setInput('');
          if (inputRef.current) inputRef.current.textContent = '';
        } else {
          setHistoryIndex(newIndex);
          setInput(history[newIndex]);
          if (inputRef.current) inputRef.current.textContent = history[newIndex];
        }
      }
    }
  };

  return (
    <div
      className='h-full bg-[#0c0c0c] text-[#cccccc] font-cascadia text-sm flex flex-col cursor-text'
      onClick={focusInput}
    >
      <div ref={scrollRef} className='flex-1 overflow-y-auto p-2 pb-0'>
        {lines.map((line, i) => (
          <div key={i} className='whitespace-pre-wrap leading-4'>
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
        <div className='whitespace-pre-wrap leading-4'>
          <span className='text-[#6cb6ff]'>C:\Users\jared&gt;</span>{' '}
          <span
            ref={inputRef}
            contentEditable
            suppressContentEditableWarning
            onInput={e => setInput(e.currentTarget.textContent || '')}
            onKeyDown={handleKeyDown}
            className='outline-none caret-[#cccccc]'
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
};
