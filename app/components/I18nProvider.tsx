'use client';

import { ReactNode } from 'react';
import '../i18n/client';

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  return <>{children}</>;
}
