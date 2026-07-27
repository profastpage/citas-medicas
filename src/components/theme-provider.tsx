'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type { ThemeProviderProps } from 'next-themes';

/**
 * ThemeProvider — Light mode is the default for CitasPro.
 *
 * Why light as default? Clinics are bright, calm, professional environments.
 * Doctors/receptionists work in well-lit spaces during the day. Light mode
 * matches that context. Dark mode remains available as a user preference
 * (useful for night shifts or low-light rooms).
 *
 * The preference is persisted in localStorage and respects the user's
 * explicit choice (no forced system fallback — we want predictability).
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
