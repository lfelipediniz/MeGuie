'use client'
import Link from 'next/link'
import { useRouter as useNextRouter, usePathname as useNextPathname } from 'next/navigation'

// Tipo para as rotas (opcional)
type Pathnames = Record<string, string>;

export const pathnames: Pathnames = {
  '/': '/',
  '/pages/fronts': '/pages/fronts',
  '/pages/competitions': '/pages/competitions',
  '/pages/learn': '/pages/learn',
  '/pages/projects': '/pages/projects',
  '/pages/events/dataDay': '/pages/events/dataDay',
  '/pages/events/understandingDL': '/pages/events/understandingDL',
  '/pages/events/understandingDL/speakers': '/pages/events/understandingDL/speakers',
  '/pages/roadmap': '/pages/roadmap',
  '/pages/contact': '/pages/contact',
  '/pages/about': '/pages/about',
  '/pages/signup': '/pages/signup',
  '/pages/login': '/pages/login',
  '/pages/home': '/pages/home',
  '/pages/calendar': '/pages/calendar',
  '/pages/savedroads': '/pages/savedroads',
  '/pages/howtouse': '/pages/howtouse',
}

// Exportar componentes e hooks nativos do Next.js
export { Link, useNextRouter as useRouter, useNextPathname as usePathname }
