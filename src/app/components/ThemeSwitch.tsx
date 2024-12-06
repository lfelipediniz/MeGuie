"use client";

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { IoIosContrast } from "react-icons/io";
import { IoContrast } from "react-icons/io5";

export default function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDarkMode = resolvedTheme === 'dark';

  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  return (
    <button
      type='button'
      className='p-2 focus:outline-none'
      aria-label={isDarkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
      onClick={toggleTheme}
      style={{ backgroundColor: 'transparent' }}
    >
      {isDarkMode ? <IoIosContrast size={24} color='var(--primary)' /> : <IoContrast size={24} color='var(--primary)' />}
    </button>
  );
}
