'use client';

import React from 'react';
import type { Info } from '@jared/info';
import type { Card } from '../types';

interface PanelContextValue {
  info: Info;
  /** Send a new question through the model. */
  ask: (question: string) => void;
  /** Swap the panel locally, with no model round-trip — instant and free. */
  show: (card: Card) => void;
}

const PanelContext = React.createContext<PanelContextValue | null>(null);

export const PanelProvider = ({
  value,
  children,
}: {
  value: PanelContextValue;
  children: React.ReactNode;
}) => <PanelContext.Provider value={value}>{children}</PanelContext.Provider>;

export const usePanel = () => {
  const ctx = React.useContext(PanelContext);
  if (!ctx) throw new Error('usePanel must be used within a PanelProvider');
  return ctx;
};
