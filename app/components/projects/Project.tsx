import Image from 'next/image';
import { siteData } from '../../../lib/data';

type ProjectType = (typeof siteData.projects)[0];

const companyMap: Record<string, string> = {
  'Microsoft Office AI': 'Microsoft',
  'Microsoft Office Media Group': 'Microsoft',
};

interface FolderRowProps {
  name: string;
  dateRange: string;
  isSelected: boolean;
  onClick: () => void;
  onDoubleClick: () => void;
}

export const FolderRow = ({ name, dateRange, isSelected, onClick, onDoubleClick }: FolderRowProps) => {
  return (
    <div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      className={`flex items-center text-xs ${
        isSelected
          ? 'bg-[#cce4f7] dark:bg-[#0078d4]/20'
          : 'hover:bg-[#e5f3ff] dark:hover:bg-[#0078d4]/10'
      }`}
    >
      <div className='flex items-center gap-1.5 w-50 shrink-0 px-3 py-1'>
        <img
          src='/assets/icons/folder.ico'
          alt=''
          className='w-5 h-5 shrink-0'
          draggable={false}
        />
        <span className='truncate text-gray-800 dark:text-gray-200'>
          {name}
        </span>
      </div>
      <div className='w-25 shrink-0 px-3 py-1 text-gray-500 dark:text-gray-400'>
        {dateRange}
      </div>
      <div className='w-35 shrink-0 px-3 py-1 text-gray-500 dark:text-gray-400' />
      <div className='flex-1 min-w-40 px-3 py-1 text-gray-500 dark:text-gray-400' />
    </div>
  );
};

interface FileRowProps {
  project: ProjectType;
  isSelected: boolean;
  onClick: () => void;
  onDoubleClick: () => void;
}

export const FileRow = ({
  project,
  isSelected,
  onClick,
  onDoubleClick,
}: FileRowProps) => {
  return (
    <div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      className={`flex items-center text-xs ${
        isSelected
          ? 'bg-[#cce4f7] dark:bg-[#0078d4]/20'
          : 'hover:bg-[#e5f3ff] dark:hover:bg-[#0078d4]/10'
      }`}
    >
      <div className='flex items-center gap-1.5 w-50 shrink-0 px-3 py-1'>
        {project.image ? (
          <Image
            src={`/assets/${project.image}`}
            alt=''
            width={20}
            height={20}
            className='w-5 h-5 rounded-sm object-cover shrink-0'
          />
        ) : (
          <img src='/assets/icons/program.ico' alt='' className='w-5 h-5 shrink-0' draggable={false} />
        )}
        <span className='truncate text-gray-800 dark:text-gray-200'>
          {project.title}
        </span>
      </div>
      <div className='w-25 shrink-0 px-3 py-1 text-gray-500 dark:text-gray-400'>
        {project.endYear ? `${project.year}–${project.endYear}` : project.year}
      </div>
      <div className='w-35 shrink-0 px-3 py-1 truncate text-gray-500 dark:text-gray-400'>
        {project.team || '—'}
      </div>
      <div className='flex-1 min-w-40 px-3 py-1 truncate text-gray-500 dark:text-gray-400'>
        {project.stack}
      </div>
    </div>
  );
};

interface PreviewPaneProps {
  project: ProjectType;
}

export const PreviewPane = ({ project }: PreviewPaneProps) => {
  const displayCompany = companyMap[project.company] ?? project.company;

  return (
    <div className='p-4 text-xs'>
      {project.image ? (
        <div className='w-full aspect-video rounded overflow-hidden bg-gray-200 dark:bg-gray-700 mb-3'>
          <Image
            src={`/assets/${project.image}`}
            alt={project.title}
            width={400}
            height={300}
            className='w-full h-full object-cover'
          />
        </div>
      ) : (
        <div className='w-full aspect-video rounded bg-gray-200 dark:bg-gray-700 mb-3 flex items-center justify-center'>
          <img src='/assets/icons/program.ico' alt='' className='w-12 h-12' draggable={false} />
        </div>
      )}

      <h3 className='font-semibold text-sm text-gray-900 dark:text-gray-100'>
        {project.title}
      </h3>
      <p className='text-gray-500 dark:text-gray-400 mt-0.5'>
        {displayCompany} &middot; {project.endYear ? `${project.year}–${project.endYear}` : project.year}
      </p>
      {project.team && (
        <p className='text-gray-400 dark:text-gray-500 mt-0.5'>
          {project.team}
        </p>
      )}
      <p className='text-gray-400 dark:text-gray-500 mt-0.5'>
        {project.stack}
      </p>

      <p className='mt-3 text-gray-600 dark:text-gray-300 leading-relaxed'>
        {project.content}
      </p>

      <div className='flex flex-col gap-1.5 mt-3'>
        {project.url && (
          <a
            href={
              project.url.startsWith('http')
                ? project.url
                : `https://${project.url}`
            }
            target='_blank'
            rel='noopener noreferrer'
            className='text-[#0078d4] hover:underline'
          >
            Visit Project &rarr;
          </a>
        )}
        {project.infoUrl && (
          <a
            href={
              project.infoUrl.startsWith('http')
                ? project.infoUrl
                : `https://${project.infoUrl}`
            }
            target='_blank'
            rel='noopener noreferrer'
            className='text-[#0078d4] hover:underline'
          >
            More Info &rarr;
          </a>
        )}
      </div>
    </div>
  );
};
