'use client';

import { useTranslation as useTranslationOriginal } from 'react-i18next';
import './client';

export function useTranslation() {
  try {
    return useTranslationOriginal();
  } catch (error) {
    console.error('Error using i18n translation hook:', error);
    // Return a fallback object to prevent crashes
    return {
      t: (key: string) => key,
      i18n: {
        language: 'en',
        changeLanguage: () => Promise.resolve(),
      },
    };
  }
}
