'use client';

import { useState, useMemo } from 'react';
import { siteData } from '../../../lib/data';
import { FileRow, PreviewPane } from './Project';
import { ChevronDown, ChevronRight, ArrowLeft, ArrowRight, ArrowUp, Search } from 'lucide-react';

type ProjectType = (typeof siteData.projects)[0];

const companyMap: Record<string, string> = {
  'Microsoft Office AI': 'Microsoft',
  'Microsoft Office Media Group': 'Microsoft',
  Freelance: 'Freelance',
  'University of Michigan + Michigan Government': 'UMich',
  Amazon: 'Amazon',
};

function groupProjects(projects: ProjectType[]) {
  const groups: Record<string, ProjectType[]> = {};
  for (const p of projects) {
    const folder = companyMap[p.company] ?? p.company;
    (groups[folder] ??= []).push(p);
  }
  return groups;
}

type SortKey = 'title' | 'team' | 'stack' | 'year';
type SortDir = 'asc' | 'desc';

export const Projects = () => {
  const groups = useMemo(() => groupProjects(siteData.projects), []);
  const folderNames = useMemo(() => Object.keys(groups), [groups]);

  const [activeFolder, setActiveFolder] = useState<string>(folderNames[0]);
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('year');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  const selectFolder = (folder: string) => {
    setActiveFolder(folder);
    setSelectedProject(null);
  };

  const selectProject = (project: ProjectType) => {
    setSelectedProject(project);
    setActiveFolder(companyMap[project.company] ?? project.company);
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

  const breadcrumb = selectedProject
    ? `Projects > ${companyMap[selectedProject.company] ?? selectedProject.company} > ${selectedProject.title}`
    : `Projects > ${activeFolder}`;

  const visibleProjects = useMemo(() => {
    const items = [...(groups[activeFolder] ?? [])];
    items.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'title':
          cmp = a.title.localeCompare(b.title);
          break;
        case 'team':
          cmp = a.company.localeCompare(b.company);
          break;
        case 'stack':
          cmp = a.stack.localeCompare(b.stack);
          break;
        case 'year':
          cmp = a.year - b.year;
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return items;
  }, [groups, activeFolder, sortKey, sortDir]);

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
          {folderNames.map(folder => (
            <button
              key={folder}
              onClick={() => selectFolder(folder)}
              className={`w-full flex items-center gap-1.5 px-2 py-[5px] text-left text-xs hover:bg-gray-200/70 dark:hover:bg-white/5 ${
                activeFolder === folder
                  ? 'bg-[#cce4f7] dark:bg-[#0078d4]/20'
                  : ''
              }`}
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
            </button>
          ))}
        </div>

        {/* File List (Details View) */}
        <div className='flex-1 flex flex-col min-w-0'>
          {/* Column Headers */}
          <div className='flex items-center border-b border-gray-200 dark:border-gray-700 bg-[#f9f9f9] dark:bg-[#2d2d2d] text-[11px] text-gray-500 dark:text-gray-400 font-medium'>
            <button
              onClick={() => handleSort('title')}
              className='flex items-center flex-[3] min-w-0 px-3 py-1.5 text-left hover:bg-gray-200/50 dark:hover:bg-white/5'
            >
              Name<SortIndicator column='title' />
            </button>
            <button
              onClick={() => handleSort('team')}
              className='hidden sm:flex items-center flex-[2] min-w-0 px-3 py-1.5 text-left hover:bg-gray-200/50 dark:hover:bg-white/5 border-l border-gray-200 dark:border-gray-700'
            >
              Team<SortIndicator column='team' />
            </button>
            <button
              onClick={() => handleSort('stack')}
              className='hidden lg:flex items-center flex-[2] min-w-0 px-3 py-1.5 text-left hover:bg-gray-200/50 dark:hover:bg-white/5 border-l border-gray-200 dark:border-gray-700'
            >
              Stack<SortIndicator column='stack' />
            </button>
            <button
              onClick={() => handleSort('year')}
              className='flex items-center w-16 shrink-0 px-3 py-1.5 text-left hover:bg-gray-200/50 dark:hover:bg-white/5 border-l border-gray-200 dark:border-gray-700'
            >
              Year<SortIndicator column='year' />
            </button>
          </div>

          {/* Rows */}
          <div className='flex-1 overflow-y-auto'>
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

        {/* Preview Pane */}
        {selectedProject && (
          <div className='hidden lg:block w-[280px] border-l border-gray-200 dark:border-gray-700 overflow-y-auto'>
            <PreviewPane project={selectedProject} />
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className='flex items-center justify-between px-3 py-1 border-t border-gray-200 dark:border-gray-700 bg-[#f9f9f9] dark:bg-[#2d2d2d] text-[11px] text-gray-500 dark:text-gray-400'>
        <span>{visibleProjects.length} items</span>
        {selectedProject && <span>{selectedProject.title}</span>}
      </div>
    </div>
  );
};
