import '../styles/globals.css'
import { I18nProvider } from '../contexts/I18nContext'
import Layout from '../components/Layout'

const NO_LAYOUT = ['/login', '/register', '/forgot-password']

export default function App({ Component, pageProps }) {
  const { router } = pageProps
  const noLayout = typeof window !== 'undefined' &&
    NO_LAYOUT.some(p => window.location.pathname.startsWith(p))

  if (noLayout) {
    return (
      <I18nProvider>
        <Component {...pageProps} />
      </I18nProvider>
    )
  }

  return (
    <I18nProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </I18nProvider>
  )
}
