'use client';

import { useState, useMemo } from 'react';
import { siteData } from '../../../lib/data';
import { FileRow, FolderRow, PreviewPane } from './Project';
import {
  ArrowLeft20Regular,
  ArrowRight20Regular,
  ArrowUp20Regular,
  Search20Regular,
  ChevronUp12Regular,
  ChevronDown12Regular,
  ChevronRight12Regular,
} from '@fluentui/react-icons';

type ProjectType = (typeof siteData.projects)[0];

// Companies that get their own subfolder
const folderCompanies: Record<string, string> = {
  'Microsoft Office AI': 'Microsoft',
  'Microsoft Office Media Group': 'Microsoft',
  Amazon: 'Amazon',
};

// Companies whose projects are loose (no folder)
const looseCompanies = new Set([
  'Freelance',
  'University of Michigan + Michigan Government',
]);

// Folders where the latest date should show as "Present" (still active)
const folderPresent = new Set(['Microsoft']);

function buildTree(projects: ProjectType[]) {
  const folders: Record<string, ProjectType[]> = {};
  const loose: ProjectType[] = [];

  for (const p of projects) {
    if (looseCompanies.has(p.company)) {
      loose.push(p);
    } else {
      const folder = folderCompanies[p.company] ?? p.company;
      (folders[folder] ??= []).push(p);
    }
  }
  return { folders, loose };
}

type SortKey = 'title' | 'team' | 'stack' | 'year';
type SortDir = 'asc' | 'desc';

const sidebarItem = (isActive: boolean) =>
  `w-full flex items-center gap-1.5 pr-2 py-[5px] text-left text-xs ${
    isActive
      ? 'bg-[#cce4f7] dark:bg-[#0078d4]/20'
      : 'hover:bg-[#e5f3ff] dark:hover:bg-[#0078d4]/10'
  }`;

export const Projects = () => {
  const { folders, loose } = useMemo(() => buildTree(siteData.projects), []);
  const folderNames = useMemo(() => Object.keys(folders), [folders]);

  const [activeView, setActiveView] = useState<string>('Projects');
  const [history, setHistory] = useState<string[]>(['Projects']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    () => new Set(['Projects']),
  );
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(
    null,
  );
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('year');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folder)) next.delete(folder); else next.add(folder);
      return next;
    });
  };

  const navigateTo = (view: string) => {
    setActiveView(view);
    setSelectedProject(null);
    setSelectedFolder(null);
    setHistory(prev => [...prev.slice(0, historyIndex + 1), view]);
    setHistoryIndex(prev => prev + 1);
  };

  const selectView = (view: string) => {
    if (view === activeView) return;
    navigateTo(view);
  };

  const selectProject = (project: ProjectType) => {
    setSelectedProject(project);
    setSelectedFolder(null);
  };

  const selectFolder = (folder: string) => {
    setSelectedFolder(folder);
    setSelectedProject(null);
  };

  const navigateToFolder = (folder: string) => {
    navigateTo(folder);
    setExpandedFolders(prev => new Set(prev).add('Projects').add(folder));
  };

  const goBack = () => {
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    setHistoryIndex(newIndex);
    setActiveView(history[newIndex]);
    setSelectedProject(null);
    setSelectedFolder(null);
  };

  const goForward = () => {
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    setHistoryIndex(newIndex);
    setActiveView(history[newIndex]);
    setSelectedProject(null);
    setSelectedFolder(null);
  };

  const goUp = () => {
    if (activeView !== 'Projects') {
      navigateTo('Projects');
    }
  };

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < history.length - 1;
  const canGoUp = activeView !== 'Projects';

  const handleDoubleClick = (project: ProjectType) => {
    const url = project.url || project.infoUrl;
    if (url) {
      window.open(url.startsWith('http') ? url : `https://${url}`, '_blank');
    }
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'year' ? 'desc' : 'asc');
    }
  };

  const breadcrumbParts =
    activeView === 'Projects'
      ? [{ label: 'Projects', view: 'Projects' }]
      : [
          { label: 'Projects', view: 'Projects' },
          { label: activeView, view: activeView },
        ];

  const visibleProjects = useMemo(() => {
    let items: ProjectType[];
    if (activeView === 'Projects') {
      items = [...loose];
    } else {
      items = [...(folders[activeView] ?? [])];
    }
    items.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'title':
          cmp = a.title.localeCompare(b.title);
          break;
        case 'team':
          cmp = (a.team || '').localeCompare(b.team || '');
          break;
        case 'stack':
          cmp = a.stack.localeCompare(b.stack);
          break;
        case 'year':
          cmp = (a.endYear ?? a.year) - (b.endYear ?? b.year);
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return items;
  }, [folders, loose, activeView, sortKey, sortDir]);

  // Show subfolder rows in file list when at root
  const showFolderRows = activeView === 'Projects';

  const totalItems =
    visibleProjects.length + (showFolderRows ? folderNames.length : 0);

  const SortIndicator = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return null;
    return sortDir === 'asc' ? <ChevronUp12Regular /> : <ChevronDown12Regular />;
  };

  return (
    <div className='flex flex-col h-full bg-[#f3f3f3] dark:bg-[#202020] text-sm select-none'>
      {/* Address Bar */}
      <div className='flex items-center gap-1 px-2 py-1.5 border-b border-gray-200 dark:border-gray-700 bg-[#f9f9f9] dark:bg-[#2d2d2d]'>
        <div className='flex items-center gap-2'>
          <button
            onClick={goBack}
            disabled={!canGoBack}
            className='w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 disabled:text-gray-300 dark:disabled:text-gray-600 disabled:pointer-events-none'
          >
            <ArrowLeft20Regular className='w-3.5 h-3.5' />
          </button>
          <button
            onClick={goForward}
            disabled={!canGoForward}
            className='w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 disabled:text-gray-300 dark:disabled:text-gray-600 disabled:pointer-events-none'
          >
            <ArrowRight20Regular className='w-3.5 h-3.5' />
          </button>
          <button
            onClick={goUp}
            disabled={!canGoUp}
            className='w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 disabled:text-gray-300 dark:disabled:text-gray-600 disabled:pointer-events-none'
          >
            <ArrowUp20Regular className='w-3.5 h-3.5' />
          </button>
        </div>
        <div className='flex-1 flex items-center px-2.5 py-1 bg-white dark:bg-[#383838] rounded-sm border border-gray-300 dark:border-gray-600 text-xs text-gray-700 dark:text-gray-300 truncate'>
          {breadcrumbParts.map((part, i) => (
            <span key={part.view} className='flex items-center'>
              {i > 0 && <ChevronRight12Regular className='mx-1 text-gray-400' />}
              <button
                onClick={() => selectView(part.view)}
                className='hover:bg-gray-200/60 dark:hover:bg-white/10 px-2 py-0.5 rounded-sm'
              >
                {part.label}
              </button>
            </span>
          ))}
        </div>
        <div className='hidden sm:flex items-center px-2 py-1 bg-white dark:bg-[#383838] rounded-sm border border-gray-300 dark:border-gray-600 w-44'>
          <Search20Regular className='w-3 h-3 text-gray-400 mr-1.5' />
          <span className='text-xs text-gray-400'>Search Projects</span>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex flex-1 min-h-0'>
        {/* Sidebar — folders only */}
        <div className='hidden md:flex flex-col w-40 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e1e1e] overflow-y-auto py-1'>
          {/* Root: Projects */}
          <div
            onClick={() => selectView('Projects')}
            className={`${sidebarItem(activeView === 'Projects')} px-2 cursor-pointer`}
          >
            <span
              onClick={e => {
                e.stopPropagation();
                toggleFolder('Projects');
              }}
              className='shrink-0 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10'
            >
              {expandedFolders.has('Projects') ? (
                <ChevronDown12Regular className='text-gray-500' />
              ) : (
                <ChevronRight12Regular className='text-gray-500' />
              )}
            </span>
            <img
              src='/assets/icons/folder.ico'
              alt=''
              className='w-4 h-4 shrink-0'
              draggable={false}
            />
            <span className='truncate font-medium text-gray-800 dark:text-gray-200'>
              Projects
            </span>
          </div>

          {/* Subfolders */}
          {expandedFolders.has('Projects') &&
            folderNames.map(folder => (
              <div
                key={folder}
                onClick={() => selectView(folder)}
                className={`${sidebarItem(activeView === folder)} pl-9 cursor-pointer`}
              >
                <img
                  src='/assets/icons/folder.ico'
                  alt=''
                  className='w-4 h-4 shrink-0'
                  draggable={false}
                />
                <span className='truncate text-gray-800 dark:text-gray-200'>
                  {folder}
                </span>
              </div>
            ))}
        </div>

        {/* File List (Details View) */}
        <div className='flex-1 overflow-x-auto min-w-0'>
          <div className='min-w-140 flex flex-col h-full'>
            {/* Column Headers */}
            <div className='flex items-center border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e1e1e] text-[11px] text-gray-500 dark:text-gray-400 font-medium'>
              <button
                onClick={() => handleSort('title')}
                className='flex items-center justify-between w-50 shrink-0 px-3 py-1.5 text-left hover:bg-gray-200/50 dark:hover:bg-white/5'
              >
                Name
                <SortIndicator column='title' />
              </button>
              <button
                onClick={() => handleSort('year')}
                className='flex items-center justify-between w-25 shrink-0 px-3 py-1.5 text-left hover:bg-gray-200/50 dark:hover:bg-white/5 border-l border-gray-200 dark:border-gray-700'
              >
                Date
                <SortIndicator column='year' />
              </button>
              <button
                onClick={() => handleSort('stack')}
                className='flex items-center justify-between flex-1 min-w-40 px-3 py-1.5 text-left hover:bg-gray-200/50 dark:hover:bg-white/5 border-l border-gray-200 dark:border-gray-700'
              >
                Stack
                <SortIndicator column='stack' />
              </button>
              <button
                onClick={() => handleSort('team')}
                className='flex items-center justify-between w-35 shrink-0 px-3 py-1.5 text-left hover:bg-gray-200/50 dark:hover:bg-white/5 border-l border-gray-200 dark:border-gray-700'
              >
                Team
                <SortIndicator column='team' />
              </button>
            </div>

            {/* Rows */}
            <div className='flex-1 overflow-y-auto overflow-x-hidden bg-white dark:bg-[#1e1e1e]'>
              {/* Folder rows when at root */}
              {showFolderRows &&
                folderNames.map(folder => {
                  const items = folders[folder];
                  const minY = Math.min(...items.map(p => p.year));
                  const maxY = Math.max(...items.map(p => p.year));
                  const isPresent = folderPresent.has(folder);
                  const dateRange = isPresent
                    ? `${minY}–Present`
                    : minY === maxY
                      ? `${minY}`
                      : `${minY}–${maxY}`;
                  return (
                    <FolderRow
                      key={folder}
                      name={folder}
                      dateRange={dateRange}
                      isSelected={selectedFolder === folder}
                      onClick={() => selectFolder(folder)}
                      onDoubleClick={() => navigateToFolder(folder)}
                    />
                  );
                })}
              {visibleProjects.map(project => (
                <FileRow
                  key={project.title}
                  project={project}
                  isSelected={selectedProject?.title === project.title}
                  onClick={() => selectProject(project)}
                  onDoubleClick={() => handleDoubleClick(project)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Preview Pane */}
        {selectedProject && (
          <div className='w-70 shrink-0 border-l border-gray-200 dark:border-gray-700 overflow-y-auto bg-white dark:bg-[#1e1e1e]'>
            <PreviewPane project={selectedProject} />
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className='flex items-center justify-between px-3 py-1 border-t border-gray-200 dark:border-gray-700 bg-[#f9f9f9] dark:bg-[#2d2d2d] text-[11px] text-gray-500 dark:text-gray-400'>
        <span>{totalItems} items</span>
        {selectedProject && <span>{selectedProject.title}</span>}
      </div>
    </div>
  );
};
