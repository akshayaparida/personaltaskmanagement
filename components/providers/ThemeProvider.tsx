'use client'

import * as React from 'react'
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from 'next-themes'
import { useThemeStore } from '@/store/useThemeStore'

type Theme = 'light' | 'dark' | 'system'

export function ThemeProvider({ children, ...props }: Readonly<ThemeProviderProps>) {
  const { theme } = useThemeStore() // Removed unused setTheme

  return (
    <NextThemesProvider 
      {...props} 
      defaultTheme={theme}
      forcedTheme={props.forcedTheme}
      themes={props.themes}
      enableSystem={props.enableSystem}
      attribute={props.attribute}
      value={props.value}
    >
      {children}
    </NextThemesProvider>
  )
}