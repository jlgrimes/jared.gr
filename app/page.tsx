import { Hero } from './components/Hero';
import { Projects } from './components/projects/Projects';
import { I18nProvider } from './components/I18nProvider';
import { Testimonials } from './components/Testimonials';

export default function Home() {
  return (
    <I18nProvider>
      <div className='bg-white dark:bg-gray-900 min-h-screen'>
        {/* <LanguageSelector /> */}
        <div className='container mx-auto px-8 lg:py-12'>
          <div className='max-w-4xl mx-auto w-full'>
            <Hero />
          </div>
          <Testimonials />
          <div className='max-w-4xl mx-auto w-full'>
            <Projects />
          </div>
        </div>
      </div>
    </I18nProvider>
  );
}
