'use client';

import { useState, useMemo } from 'react';
import { siteData } from '../../../lib/data';
import { FileRow, FolderRow, PreviewPane } from './Project';
import { ChevronDown, ChevronRight, ArrowLeft, ArrowRight, ArrowUp, Search } from 'lucide-react';

type ProjectType = (typeof siteData.projects)[0];

// Companies that get their own subfolder
const folderCompanies: Record<string, string> = {
  'Microsoft Office AI': 'Microsoft',
  'Microsoft Office Media Group': 'Microsoft',
  Amazon: 'Amazon',
};

// Companies whose projects are loose (no folder)
const looseCompanies = new Set(['Freelance', 'University of Michigan + Michigan Government']);

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
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    () => new Set(['Projects'])
  );
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('year');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      next.has(folder) ? next.delete(folder) : next.add(folder);
      return next;
    });
  };

  const selectView = (view: string) => {
    setActiveView(view);
    setSelectedProject(null);
  };

  const selectProject = (project: ProjectType) => {
    setSelectedProject(project);
  };

  const navigateToFolder = (folder: string) => {
    setActiveView(folder);
    setSelectedProject(null);
    setExpandedFolders(prev => new Set(prev).add('Projects').add(folder));
  };

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

  const breadcrumb =
    activeView === 'Projects'
      ? 'Projects'
      : `Projects > ${activeView}`;

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

  const totalItems = visibleProjects.length + (showFolderRows ? folderNames.length : 0);

  const SortIndicator = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return null;
    return <span className='ml-1 text-[10px]'>{sortDir === 'asc' ? '▲' : '▼'}</span>;
  };

  return (
    <div className='flex flex-col h-full bg-[#f3f3f3] dark:bg-[#202020] text-sm select-none'>
      {/* Address Bar */}
      <div className='flex items-center gap-1 px-2 py-1.5 border-b border-gray-200 dark:border-gray-700 bg-[#f9f9f9] dark:bg-[#2d2d2d]'>
        <div className='flex items-center gap-0.5 text-gray-400 dark:text-gray-500'>
          <button className='p-1 rounded hover:bg-gray-200 dark:hover:bg-white/10'>
            <ArrowLeft size={14} />
          </button>
          <button className='p-1 rounded hover:bg-gray-200 dark:hover:bg-white/10'>
            <ArrowRight size={14} />
          </button>
          <button className='p-1 rounded hover:bg-gray-200 dark:hover:bg-white/10'>
            <ArrowUp size={14} />
          </button>
        </div>
        <div className='flex-1 flex items-center px-2.5 py-1 bg-white dark:bg-[#383838] rounded-sm border border-gray-300 dark:border-gray-600 text-xs text-gray-700 dark:text-gray-300 truncate'>
          {breadcrumb}
        </div>
        <div className='hidden sm:flex items-center px-2 py-1 bg-white dark:bg-[#383838] rounded-sm border border-gray-300 dark:border-gray-600 w-44'>
          <Search size={12} className='text-gray-400 mr-1.5' />
          <span className='text-xs text-gray-400'>Search Projects</span>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex flex-1 min-h-0'>
        {/* Sidebar — folders only */}
        <div className='hidden md:flex flex-col w-[200px] border-r border-gray-200 dark:border-gray-700 bg-[#f9f9f9] dark:bg-[#252525] overflow-y-auto py-1'>
          {/* Root: Projects */}
          <div
            onClick={() => selectView('Projects')}
            className={`${sidebarItem(activeView === 'Projects')} px-2 cursor-pointer`}
          >
            <span
              onClick={e => { e.stopPropagation(); toggleFolder('Projects'); }}
              className='shrink-0 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10'
            >
              {expandedFolders.has('Projects') ? (
                <ChevronDown size={12} className='text-gray-500' />
              ) : (
                <ChevronRight size={12} className='text-gray-500' />
              )}
            </span>
            <img src='/assets/icons/folder.ico' alt='' className='w-4 h-4 shrink-0' draggable={false} />
            <span className='truncate font-medium text-gray-800 dark:text-gray-200'>Projects</span>
          </div>

          {/* Subfolders */}
          {expandedFolders.has('Projects') &&
            folderNames.map(folder => (
              <div
                key={folder}
                onClick={() => selectView(folder)}
                className={`${sidebarItem(activeView === folder)} pl-7 cursor-pointer`}
              >
                <span
                  onClick={e => { e.stopPropagation(); toggleFolder(folder); }}
                  className='shrink-0 p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10'
                >
                  {expandedFolders.has(folder) ? (
                    <ChevronDown size={10} className='text-gray-500' />
                  ) : (
                    <ChevronRight size={10} className='text-gray-500' />
                  )}
                </span>
                <img src='/assets/icons/folder.ico' alt='' className='w-4 h-4 shrink-0' draggable={false} />
                <span className='truncate text-gray-800 dark:text-gray-200'>{folder}</span>
              </div>
            ))}
        </div>

        {/* File List (Details View) */}
        <div className='flex-1 overflow-x-auto min-w-0'>
          <div className='min-w-[560px] flex flex-col h-full'>
            {/* Column Headers */}
            <div className='flex items-center border-b border-gray-200 dark:border-gray-700 bg-[#f9f9f9] dark:bg-[#2d2d2d] text-[11px] text-gray-500 dark:text-gray-400 font-medium'>
              <button
                onClick={() => handleSort('title')}
                className='flex items-center w-[200px] shrink-0 px-3 py-1.5 text-left hover:bg-gray-200/50 dark:hover:bg-white/5'
              >
                Name<SortIndicator column='title' />
              </button>
              <button
                onClick={() => handleSort('year')}
                className='flex items-center w-[100px] shrink-0 px-3 py-1.5 text-left hover:bg-gray-200/50 dark:hover:bg-white/5 border-l border-gray-200 dark:border-gray-700'
              >
                Date<SortIndicator column='year' />
              </button>
              <button
                onClick={() => handleSort('team')}
                className='flex items-center w-[140px] shrink-0 px-3 py-1.5 text-left hover:bg-gray-200/50 dark:hover:bg-white/5 border-l border-gray-200 dark:border-gray-700'
              >
                Team<SortIndicator column='team' />
              </button>
              <button
                onClick={() => handleSort('stack')}
                className='flex items-center flex-1 min-w-[160px] px-3 py-1.5 text-left hover:bg-gray-200/50 dark:hover:bg-white/5 border-l border-gray-200 dark:border-gray-700'
              >
                Stack<SortIndicator column='stack' />
              </button>
            </div>

            {/* Rows */}
            <div className='flex-1 overflow-y-auto'>
              {/* Folder rows when at root */}
              {showFolderRows &&
                folderNames.map(folder => {
                  const items = folders[folder];
                  const minY = Math.min(...items.map(p => p.year));
                  const maxY = Math.max(...items.map(p => p.year));
                  const isPresent = folderPresent.has(folder);
                  const dateRange = isPresent
                    ? `${minY}–Present`
                    : minY === maxY ? `${minY}` : `${minY}–${maxY}`;
                  return (
                    <FolderRow
                      key={folder}
                      name={folder}
                      dateRange={dateRange}
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
          <div className='hidden lg:block w-[280px] border-l border-gray-200 dark:border-gray-700 overflow-y-auto'>
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
