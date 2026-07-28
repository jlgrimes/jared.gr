'use client';

import React from 'react';
import type { Info } from '@jared/info';
import { InfoProvider } from './InfoContext';
import { DesktopProvider } from './DesktopContext';
import { Desktop } from './Desktop';

// The wrapper contract: give it an Info, it renders the whole site.
export const WindowsWrapper = ({ info }: { info: Info }) => (
  <InfoProvider info={info}>
    <DesktopProvider>
      <Desktop />
    </DesktopProvider>
  </InfoProvider>
);
