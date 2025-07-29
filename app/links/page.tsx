import Link from 'next/link';
import { redirectGroups } from '../../lib/redirects';

export default function LinksPage() {
  return (
    <div className='min-h-screen bg-gray-50 py-12'>
      <div className='max-w-2xl mx-auto px-4'>
        <div className='space-y-4'>
          {redirectGroups.map(group => (
            <div
              key={group.name}
              className='bg-white p-4 rounded-lg shadow-sm border'
            >
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='font-semibold text-gray-900 mb-1'>
                    {group.name}
                  </h3>
                  <p className='text-sm text-gray-600'>{group.destination}</p>
                </div>
                <div className='flex gap-2'>
                  {group.paths.map(path => (
                    <Link
                      key={path}
                      href={path}
                      className='px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-sm font-medium hover:bg-blue-100 transition-colors'
                    >
                      jared.gr{path}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
