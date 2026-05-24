import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useI18n, LANGUAGES } from '../contexts/I18nContext'
import {
  LayoutDashboard, Trophy, Users, HeartPulse, DollarSign,
  CalendarDays, CheckSquare, FolderOpen, Settings, LogOut,
  X, Globe, ChevronDown, Bell, Menu
} from 'lucide-react'

const NAV = [
  { key: 'dashboard',  href: '/',           icon: LayoutDashboard },
  { key: 'horses',     href: '/horses',      icon: Trophy },
  { key: 'grooms',     href: '/grooms',      icon: Users },
  { key: 'health',     href: '/health',      icon: HeartPulse },
  { key: 'finance',    href: '/finance',     icon: DollarSign },
  { key: 'schedule',   href: '/schedule',    icon: CalendarDays },
  { key: 'tasks',      href: '/tasks',       icon: CheckSquare },
  { key: 'documents',  href: '/documents',   icon: FolderOpen },
  { key: 'settings',   href: '/settings',    icon: Settings },
]

export default function Layout({ children }) {
  const { t, locale, changeLocale, languages } = useI18n()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)

  // Close sidebar on route change
  useEffect(() => { setSidebarOpen(false) }, [router.pathname])

  // Close on ESC
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setSidebarOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const currentLang = LANGUAGES.find(l => l.code === locale)
  const isActive = (href) =>
    href === '/' ? router.pathname === '/' : router.pathname.startsWith(href)

  return (
    <div className="min-h-screen bg-[#f7f5f0] flex">

      {/* ── Desktop Sidebar ─────────────────────────────────────── */}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-stable-800 text-white shadow-xl fixed top-0 left-0 z-30">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-stable-700">
          <div className="w-9 h-9 rounded-xl bg-gold-500 flex items-center justify-center text-white font-bold text-lg">E</div>
          <div>
            <p className="font-semibold text-white text-base leading-tight">EquiManager</p>
            <p className="text-stable-300 text-xs">{t('app.tagline')}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map(({ key, href, icon: Icon }) => (
            <Link
              key={key}
              href={href}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-sm transition-all
                ${isActive(href)
                  ? 'bg-gold-500 text-white shadow-sm'
                  : 'text-stable-200 hover:bg-stable-700 hover:text-white'
                }`}
            >
              <Icon size={20} strokeWidth={1.8} />
              {t(`nav.${key}`)}
            </Link>
          ))}
        </nav>

        {/* Bottom: Language + User */}
        <div className="px-3 pb-4 border-t border-stable-700 pt-3 space-y-2">
          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-stable-200 hover:bg-stable-700 text-sm transition-all"
            >
              <Globe size={18} />
              <span>{currentLang?.flag} {currentLang?.label}</span>
              <ChevronDown size={14} className="ml-auto" />
            </button>
            {langOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-white rounded-xl shadow-lg border border-stone-200 overflow-hidden z-50">
                {languages.map(l => (
                  <button
                    key={l.code}
                    onClick={() => { changeLocale(l.code); setLangOpen(false) }}
                    className={`flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-stone-50 transition-colors
                      ${locale === l.code ? 'bg-stable-50 text-stable-800 font-medium' : 'text-stone-700'}`}
                  >
                    <span className="text-base">{l.flag}</span> {l.label}
                    {locale === l.code && <span className="ml-auto text-stable-600 text-xs">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-stable-700">
            <div className="w-8 h-8 rounded-full bg-gold-400 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">JV</div>
            <div className="min-w-0">
              <p className="text-white text-sm font-medium truncate">Jan V.</p>
              <p className="text-stable-300 text-xs">Staleigenaar</p>
            </div>
            <button className="ml-auto text-stable-400 hover:text-white transition-colors" title={t('auth.logout')}>
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Mobile Overlay ──────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Mobile Sidebar Panel ────────────────────────────────── */}
      <div className={`fixed top-0 left-0 h-full w-72 bg-stable-800 z-50 lg:hidden sidebar-panel flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stable-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gold-500 flex items-center justify-center text-white font-bold text-lg">E</div>
            <p className="font-semibold text-white text-base">EquiManager</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-stable-300 hover:text-white hover:bg-stable-700 transition-colors"
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map(({ key, href, icon: Icon }) => (
            <Link
              key={key}
              href={href}
              className={`flex items-center gap-4 px-4 py-4 rounded-xl font-medium text-base transition-all
                ${isActive(href)
                  ? 'bg-gold-500 text-white shadow-sm'
                  : 'text-stable-200 hover:bg-stable-700 hover:text-white'
                }`}
            >
              <Icon size={22} strokeWidth={1.8} />
              {t(`nav.${key}`)}
            </Link>
          ))}
        </nav>

        {/* Language + User */}
        <div className="px-3 pb-6 border-t border-stable-700 pt-3 space-y-2">
          <div className="grid grid-cols-3 gap-2 px-1">
            {languages.map(l => (
              <button
                key={l.code}
                onClick={() => changeLocale(l.code)}
                className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-xs font-medium transition-all
                  ${locale === l.code ? 'bg-gold-500 text-white' : 'text-stable-300 hover:bg-stable-700 hover:text-white'}`}
              >
                <span className="text-xl">{l.flag}</span>
                <span>{l.code.toUpperCase()}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-stable-700 mt-2">
            <div className="w-9 h-9 rounded-full bg-gold-400 flex items-center justify-center text-sm font-bold text-white">JV</div>
            <div>
              <p className="text-white text-sm font-medium">Jan V.</p>
              <p className="text-stable-300 text-xs">Staleigenaar</p>
            </div>
            <button className="ml-auto text-stable-400 hover:text-white" title={t('auth.logout')}>
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────────── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">

        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-20 bg-stable-800 text-white px-4 py-3 flex items-center gap-3 shadow-md">
          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-stable-700 hover:bg-stable-600 transition-colors flex-shrink-0"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>

          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-gold-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">E</div>
            <span className="font-semibold text-white text-base truncate">EquiManager</span>
          </div>

          {/* Notifications + lang on mobile header */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="w-11 h-11 flex items-center justify-center rounded-xl bg-stable-700 hover:bg-stable-600 text-sm font-medium transition-colors"
              >
                {currentLang?.flag}
              </button>
              {langOpen && (
                <div className="absolute top-full right-0 mt-1 bg-white rounded-xl shadow-lg border border-stone-200 overflow-hidden z-50 w-44">
                  {languages.map(l => (
                    <button
                      key={l.code}
                      onClick={() => { changeLocale(l.code); setLangOpen(false) }}
                      className={`flex items-center gap-2 w-full px-4 py-3.5 text-sm hover:bg-stone-50 transition-colors
                        ${locale === l.code ? 'bg-stable-50 text-stable-800 font-medium' : 'text-stone-700'}`}
                    >
                      <span>{l.flag}</span> {l.label}
                      {locale === l.code && <span className="ml-auto text-stable-600">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="w-11 h-11 flex items-center justify-center rounded-xl bg-stable-700 hover:bg-stable-600 relative transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Desktop top bar */}
        <div className="hidden lg:flex items-center justify-end gap-3 px-8 py-4 border-b border-stone-200 bg-white sticky top-0 z-20 shadow-sm">
          <button className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-stone-100 transition-colors text-stone-600">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-stone-100 text-stone-700 text-sm">
            <div className="w-7 h-7 rounded-full bg-gold-400 flex items-center justify-center text-xs font-bold text-white">JV</div>
            <span className="font-medium">Jan V.</span>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  )
}
