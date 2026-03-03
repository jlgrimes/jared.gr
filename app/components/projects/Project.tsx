import Image from 'next/image';
import { siteData } from '../../../lib/data';

type ProjectType = (typeof siteData.projects)[0];

interface FileItemProps {
  project: ProjectType;
  isSelected: boolean;
  onClick: () => void;
  onDoubleClick: () => void;
}

export const FileItem = ({
  project,
  isSelected,
  onClick,
  onDoubleClick,
}: FileItemProps) => {
  return (
    <div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      className={`flex flex-col items-center p-2 rounded cursor-pointer transition-colors ${
        isSelected
          ? 'bg-[#cce4f7] dark:bg-[#0078d4]/20 outline outline-1 outline-[#99d1ff] dark:outline-[#0078d4]/40'
          : 'hover:bg-gray-200/60 dark:hover:bg-white/5'
      }`}
    >
      <div className='w-full aspect-square rounded overflow-hidden bg-gray-200 dark:bg-gray-700'>
        <Image
          src={`/assets/${project.image}`}
          alt={project.title}
          width={200}
          height={200}
          className='w-full h-full object-cover'
        />
      </div>
      <span className='mt-1.5 text-[11px] text-center leading-tight text-gray-700 dark:text-gray-300 line-clamp-2 w-full'>
        {project.title}
      </span>
    </div>
  );
};

interface PreviewPaneProps {
  project: ProjectType;
}

export const PreviewPane = ({ project }: PreviewPaneProps) => {
  const companyMap: Record<string, string> = {
    'Microsoft Office AI': 'Microsoft',
    'Microsoft Office Media Group': 'Microsoft',
  };
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
