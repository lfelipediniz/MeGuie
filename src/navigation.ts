'use client'
import {
  createLocalizedPathnamesNavigation,
  Pathnames
} from 'next-intl/navigation'
import { locales } from './i18n'

export const localePrefix = 'always'

export const pathnames = {
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
  'pages/savedroads': '/pages/savedroads',
} as const satisfies Pathnames<typeof locales>

export const { Link, redirect, usePathname, useRouter } =
  createLocalizedPathnamesNavigation({ locales, localePrefix, pathnames })
