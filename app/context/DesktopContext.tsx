'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type WindowState = 'normal' | 'maximized' | 'minimized';

export interface WindowData {
  id: string;
  title: string;
  icon: ReactNode;
  content: ReactNode;
  state: WindowState;
  zIndex: number;
}

interface DesktopContextType {
  windows: WindowData[];
  openWindow: (window: Omit<WindowData, 'state' | 'zIndex'>) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  focusedWindowId: string | null;
}

const DesktopContext = createContext<DesktopContextType | undefined>(undefined);

export const DesktopProvider = ({ children }: { children: ReactNode }) => {
  const [windows, setWindows] = useState<WindowData[]>([]);
  const [highestZIndex, setHighestZIndex] = useState(10);
  const [focusedWindowId, setFocusedWindowId] = useState<string | null>(null);

  const openWindow = (windowInfo: Omit<WindowData, 'state' | 'zIndex'>) => {
    setWindows((prev) => {
      const existing = prev.find((w) => w.id === windowInfo.id);
      if (existing) {
        setFocusedWindowId(windowInfo.id);
        return prev.map((w) =>
          w.id === existing.id
            ? { ...w, state: w.state === 'minimized' ? 'normal' : w.state, zIndex: highestZIndex + 1 }
            : w
        );
      }
      setFocusedWindowId(windowInfo.id);
      return [
        ...prev,
        { ...windowInfo, state: 'normal', zIndex: highestZIndex + 1 },
      ];
    });
    setHighestZIndex((prev) => prev + 1);
  };

  const closeWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    if (focusedWindowId === id) setFocusedWindowId(null);
  };

  const minimizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, state: 'minimized' } : w))
    );
    if (focusedWindowId === id) setFocusedWindowId(null);
  };

  const maximizeWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, state: 'maximized', zIndex: highestZIndex + 1 } : w))
    );
    setHighestZIndex((prev) => prev + 1);
    setFocusedWindowId(id);
  };

  const restoreWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, state: 'normal', zIndex: highestZIndex + 1 } : w))
    );
    setHighestZIndex((prev) => prev + 1);
    setFocusedWindowId(id);
  };

  const focusWindow = (id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: highestZIndex + 1 } : w))
    );
    setHighestZIndex((prev) => prev + 1);
    setFocusedWindowId(id);
  };

  return (
    <DesktopContext.Provider
      value={{
        windows,
        openWindow,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        restoreWindow,
        focusWindow,
        focusedWindowId
      }}
    >
      {children}
    </DesktopContext.Provider>
  );
};

export const useDesktop = () => {
  const context = useContext(DesktopContext);
  if (!context) {
    throw new Error('useDesktop must be used within a DesktopProvider');
  }
  return context;
};
