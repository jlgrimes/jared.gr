'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from '../i18n/useTranslation';

export const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    setCurrentLanguage(i18n.language || 'en');
  }, [i18n.language]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setCurrentLanguage(lng);
  };

  return (
    <div className='fixed top-4 right-4 flex gap-2 z-10'>
      <button
        className={`px-2 py-1 rounded ${
          currentLanguage === 'en'
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
        }`}
        onClick={() => changeLanguage('en')}
      >
        EN
      </button>
      {/* Add more language buttons here when we have more translations */}
    </div>
  );
};
