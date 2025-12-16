import { Hero } from './components/Hero';
import { Projects } from './components/projects/Projects';
import { Testimonials } from './components/Testimonials';

export default function Home() {
  return (
    <div className='bg-white dark:bg-gray-900 min-h-screen'>
      <div className='container mx-auto px-8 lg:py-12'>
        <div className='max-w-4xl mx-auto w-full'>
          <Hero />
        </div>
        <Testimonials />
        <Projects />
      </div>
    </div>
  );
}
