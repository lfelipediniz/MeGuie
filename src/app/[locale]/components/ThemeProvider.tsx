'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { useState } from 'react'

import { ReactNode } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState('light') // Define o tema padrão como 'light'

  return (
    <NextThemesProvider
      defaultTheme={theme}    // Usa 'light' como tema inicial
      themes={["light", "dark"]}
      enableSystem={false}     // Não permitir que o sistema escolha o tema
    >
      {children}
    </NextThemesProvider>
  )
}
