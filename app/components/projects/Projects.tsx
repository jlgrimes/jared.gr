'use client';

import { useState, useMemo } from 'react';
import { siteData } from '../../../lib/data';
import { FileItem, PreviewPane } from './Project';
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

export const Projects = () => {
  const groups = useMemo(() => groupProjects(siteData.projects), []);
  const folderNames = useMemo(() => Object.keys(groups), [groups]);

  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    () => new Set(folderNames)
  );
  const [activeFolder, setActiveFolder] = useState<string>(folderNames[0]);
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null);

  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      next.has(folder) ? next.delete(folder) : next.add(folder);
      return next;
    });
  };

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

  const breadcrumb = selectedProject
    ? `Projects > ${companyMap[selectedProject.company] ?? selectedProject.company} > ${selectedProject.title}`
    : `Projects > ${activeFolder}`;

  const visibleProjects = groups[activeFolder] ?? [];

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
        <div className='flex items-center px-2 py-1 bg-white dark:bg-[#383838] rounded-sm border border-gray-300 dark:border-gray-600 w-44'>
          <Search size={12} className='text-gray-400 mr-1.5' />
          <span className='text-xs text-gray-400'>Search Projects</span>
        </div>
      </div>

      {/* Main Content */}
      <div className='flex flex-1 min-h-0'>
        {/* Sidebar */}
        <div className='hidden md:flex flex-col w-[200px] border-r border-gray-200 dark:border-gray-700 bg-[#f9f9f9] dark:bg-[#252525] overflow-y-auto py-1'>
          {folderNames.map(folder => (
            <div key={folder}>
              {/* Folder row */}
              <button
                onClick={() => {
                  toggleFolder(folder);
                  selectFolder(folder);
                }}
                className={`w-full flex items-center gap-1 px-2 py-[3px] text-left text-xs hover:bg-gray-200/70 dark:hover:bg-white/5 ${
                  activeFolder === folder && !selectedProject
                    ? 'bg-[#cce4f7] dark:bg-[#0078d4]/20'
                    : ''
                }`}
              >
                {expandedFolders.has(folder) ? (
                  <ChevronDown size={12} className='shrink-0 text-gray-500' />
                ) : (
                  <ChevronRight size={12} className='shrink-0 text-gray-500' />
                )}
                <span className='truncate font-medium text-gray-800 dark:text-gray-200'>
                  {folder}
                </span>
              </button>

              {/* Children */}
              {expandedFolders.has(folder) &&
                groups[folder].map(project => (
                  <button
                    key={project.title}
                    onClick={() => selectProject(project)}
                    className={`w-full flex items-center pl-7 pr-2 py-[3px] text-left text-xs hover:bg-gray-200/70 dark:hover:bg-white/5 truncate ${
                      selectedProject?.title === project.title
                        ? 'bg-[#cce4f7] dark:bg-[#0078d4]/20'
                        : ''
                    }`}
                  >
                    <span className='truncate text-gray-600 dark:text-gray-400'>
                      {project.title}
                    </span>
                  </button>
                ))}
            </div>
          ))}
        </div>

        {/* File Grid */}
        <div className='flex-1 overflow-y-auto p-3'>
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1'>
            {visibleProjects.map(project => (
              <FileItem
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
