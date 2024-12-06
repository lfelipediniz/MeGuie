'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { useState } from 'react'

import { ReactNode } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState('light') //  tema padrão como 'light'

  return (
    <NextThemesProvider
      defaultTheme={theme}    
      themes={["light", "dark"]}
      enableSystem={false}     // não permite que o sistema escolha o tema
    >
      {children}
    </NextThemesProvider>
  )
}
