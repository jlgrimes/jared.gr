'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import type { Info } from '@jared/info';

const InfoContext = createContext<Info | null>(null);

export const InfoProvider = ({
  info,
  children,
}: {
  info: Info;
  children: ReactNode;
}) => <InfoContext.Provider value={info}>{children}</InfoContext.Provider>;

export const useInfo = (): Info => {
  const info = useContext(InfoContext);
  if (!info) {
    throw new Error('useInfo must be used within a WindowsWrapper');
  }
  return info;
};
