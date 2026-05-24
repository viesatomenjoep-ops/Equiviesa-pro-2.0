import { useState } from 'react'
import { useRouter } from 'next/router'
import { useI18n, LANGUAGES } from '../contexts/I18nContext'
import { supabase } from '../lib/supabase'
import { Eye, EyeOff, Globe } from 'lucide-react'
import Head from 'next/head'

export default function LoginPage() {
  const { t, locale, changeLocale } = useI18n()
  const router  = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) {
      setError(err.message)
      setLoading(false)
    } else {
      router.push('/')
    }
  }

  return (
    <>
      <Head><title>EquiManager — {t('auth.login')}</title></Head>
      <div className="min-h-screen bg-stable-900 flex items-center justify-center p-4">

        {/* Language selector */}
        <div className="absolute top-4 right-4 flex gap-2">
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              onClick={() => changeLocale(l.code)}
              className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg transition-all
                ${locale === l.code ? 'bg-gold-500' : 'bg-stable-700 hover:bg-stable-600'}`}
              title={l.label}
            >
              {l.flag}
            </button>
          ))}
        </div>

        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gold-500 flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 shadow-lg">E</div>
            <h1 className="text-3xl font-bold text-white">EquiManager</h1>
            <p className="text-stable-300 mt-1">{t('app.tagline')}</p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-stone-800 mb-1">{t('auth.welcomeBack')}</h2>
            <p className="text-stone-500 text-sm mb-6">{t('auth.loginSubtitle')}</p>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="label">{t('auth.email')}</label>
                <input
                  type="email"
                  className="input"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="jan@destalling.be"
                  autoComplete="email"
                  required
                />
              </div>
              <div>
                <label className="label">{t('auth.password')}</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    className="input pr-12"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-stone-400 hover:text-stone-600"
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <a href="/forgot-password" className="text-sm text-stable-600 hover:underline">
                  {t('auth.forgotPassword')}
                </a>
              </div>

              <button type="submit" className="btn-primary w-full text-lg py-4 mt-2" disabled={loading}>
                {loading ? t('common.loading') : t('auth.login')}
              </button>
            </form>

            <p className="text-center text-sm text-stone-500 mt-6">
              {t('auth.noAccount')}{' '}
              <a href="/register" className="text-stable-700 font-medium hover:underline">{t('auth.signUp')}</a>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
