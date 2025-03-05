import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='min-h-screen bg-white dark:bg-gray-900'>
      {/* Hero Section */}
      <section className='container mx-auto px-4 py-8'>
        <div className='flex flex-col items-center text-center'>
          <div className='relative w-16 h-16 mb-4'>
            <Image
              src='/profile.jpg'
              alt='Profile picture'
              fill
              className='rounded-full object-cover'
              priority
            />
          </div>
          <h1 className='text-2xl font-mono mb-1'>Jared Grimes</h1>
          <p className='text-sm text-gray-600 dark:text-gray-400 mb-4 font-mono'>
            Software Engineer
          </p>
          <div className='flex gap-2'>
            <Link
              href='#contact'
              className='px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-mono'
            >
              Contact
            </Link>
            <Link
              href='#projects'
              className='px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-mono'
            >
              Projects
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className='container mx-auto px-4 py-8'>
        <div className='max-w-xl mx-auto'>
          <p className='text-sm text-gray-600 dark:text-gray-400 leading-relaxed font-mono'>
            I&apos;m a software engineer focused on building elegant solutions
            to complex problems. Currently working with modern web technologies
            and always exploring new tools and frameworks.
          </p>
        </div>
      </section>

      {/* Projects Section */}
      <section id='projects' className='container mx-auto px-4 py-8'>
        <h2 className='text-sm font-mono mb-4 text-center text-gray-600 dark:text-gray-400'>
          Selected Projects
        </h2>
        <div className='grid md:grid-cols-2 gap-4 max-w-2xl mx-auto'>
          {[
            {
              title: 'Project 1',
              description: 'A brief description of your first project',
              tech: 'React, Node.js, MongoDB',
            },
            {
              title: 'Project 2',
              description: 'A brief description of your second project',
              tech: 'Next.js, TypeScript, Tailwind',
            },
          ].map(project => (
            <div
              key={project.title}
              className='p-3 border border-gray-200 dark:border-gray-800 rounded'
            >
              <h3 className='text-sm font-mono mb-1'>{project.title}</h3>
              <p className='text-sm text-gray-600 dark:text-gray-400 mb-1 font-mono'>
                {project.description}
              </p>
              <p className='text-xs text-gray-500 dark:text-gray-500 font-mono'>
                {project.tech}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id='contact' className='container mx-auto px-4 py-8'>
        <h2 className='text-sm font-mono mb-4 text-center text-gray-600 dark:text-gray-400'>
          Get in Touch
        </h2>
        <div className='max-w-sm mx-auto'>
          <div className='flex flex-col gap-1'>
            <a
              href='mailto:your.email@example.com'
              className='text-sm text-center p-2 border border-gray-200 dark:border-gray-800 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-mono'
            >
              Email
            </a>
            <a
              href='https://github.com/yourusername'
              target='_blank'
              rel='noopener noreferrer'
              className='text-sm text-center p-2 border border-gray-200 dark:border-gray-800 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-mono'
            >
              GitHub
            </a>
            <a
              href='https://linkedin.com/in/yourusername'
              target='_blank'
              rel='noopener noreferrer'
              className='text-sm text-center p-2 border border-gray-200 dark:border-gray-800 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-mono'
            >
              LinkedIn
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
