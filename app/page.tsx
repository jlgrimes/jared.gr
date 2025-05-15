import { Hero } from './components/Hero';
import { Projects } from './components/projects/Projects';
import { LanguageSelector } from './components/LanguageSelector';
import { I18nProvider } from './components/I18nProvider';

export default function Home() {
  return (
    <I18nProvider>
      <div className='bg-white dark:bg-gray-900 min-h-screen'>
        <LanguageSelector />
        <div className='container mx-auto px-4 py-8'>
          <div className='max-w-2xl mx-auto w-full'>
            <Hero />
          </div>
          <Projects />
        </div>
      </div>
    </I18nProvider>
  );
}
