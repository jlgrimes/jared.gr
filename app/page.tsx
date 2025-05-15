import { Hero } from './components/Hero';
import { Projects } from './components/projects/Projects';

export default function Home() {
  return (
    <div className='bg-white dark:bg-gray-900 min-h-screen'>
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-2xl mx-auto w-full'>
          <Hero />
        </div>
        <Projects />
      </div>
    </div>
  );
}
