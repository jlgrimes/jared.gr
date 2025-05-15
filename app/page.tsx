import { Hero } from './components/Hero';
import { Projects } from './components/projects/Projects';
import { I18nProvider } from './components/I18nProvider';

export default function Home() {
  return (
    <I18nProvider>
      <div className='bg-white dark:bg-gray-900 min-h-screen'>
        {/* <LanguageSelector /> */}
        <div className='container mx-auto md:px-4 md:py-12'>
          <div className='max-w-2xl mx-auto w-full'>
            <Hero />
          </div>
          <div className='w-2xl px-4 mx-auto lg:w-full'>
            <Projects />
          </div>
        </div>
      </div>
    </I18nProvider>
  );
}
