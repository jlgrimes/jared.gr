import Image from 'next/image';
import { siteData } from '../../../lib/data';

type ProjectType = (typeof siteData.projects)[0];

const companyMap: Record<string, string> = {
  'Microsoft Office AI': 'Microsoft',
  'Microsoft Office Media Group': 'Microsoft',
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
  const displayCompany = companyMap[project.company] ?? project.company;

  return (
    <div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      className={`flex items-center cursor-pointer text-xs border-b border-gray-100 dark:border-gray-800 ${
        isSelected
          ? 'bg-[#cce4f7] dark:bg-[#0078d4]/20'
          : 'hover:bg-gray-100 dark:hover:bg-white/[0.03]'
      }`}
    >
      <div className='flex items-center gap-2 flex-[3] min-w-0 px-3 py-1.5'>
        <Image
          src={`/assets/${project.image}`}
          alt=''
          width={20}
          height={20}
          className='w-5 h-5 rounded-sm object-cover shrink-0'
        />
        <span className='truncate text-gray-800 dark:text-gray-200'>
          {project.title}
        </span>
      </div>
      <div className='hidden sm:block flex-[2] min-w-0 px-3 py-1.5 truncate text-gray-500 dark:text-gray-400 border-l border-gray-100 dark:border-gray-800'>
        {displayCompany}
      </div>
      <div className='hidden lg:block flex-[2] min-w-0 px-3 py-1.5 truncate text-gray-500 dark:text-gray-400 border-l border-gray-100 dark:border-gray-800'>
        {project.stack}
      </div>
      <div className='w-16 shrink-0 px-3 py-1.5 text-gray-500 dark:text-gray-400 border-l border-gray-100 dark:border-gray-800'>
        {project.year}
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
      <div className='w-full aspect-video rounded overflow-hidden bg-gray-200 dark:bg-gray-700 mb-3'>
        <Image
          src={`/assets/${project.image}`}
          alt={project.title}
          width={400}
          height={300}
          className='w-full h-full object-cover'
        />
      </div>

      <h3 className='font-semibold text-sm text-gray-900 dark:text-gray-100'>
        {project.title}
      </h3>
      <p className='text-gray-500 dark:text-gray-400 mt-0.5'>
        {displayCompany} &middot; {project.year}
      </p>
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
