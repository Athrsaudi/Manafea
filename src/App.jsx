import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { LangProvider } from './lib/LangContext'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'

/* ─── Code Splitting: تحميل الصفحات الثقيلة عند الحاجة فقط ─── */
const VideosPage  = lazy(() => import('./pages/VideosPage'))
const QuranPage   = lazy(() => import('./pages/QuranPage'))
const LibraryPage = lazy(() => import('./pages/LibraryPage'))
const HajjPage    = lazy(() => import('./pages/HajjPage'))
const UmrahPage   = lazy(() => import('./pages/UmrahPage'))
const ContestPage = lazy(() => import('./pages/ContestPage'))
const AdminPage   = lazy(() => import('./pages/AdminPage'))

/* ─── شاشة التحميل ─── */
const Loading = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    height: '100vh', fontFamily: 'Tajawal', color: '#1B3A4B',
    fontSize: '1.1rem', direction: 'rtl'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2rem', marginBottom: 12, animation: 'pulse 1.5s infinite' }}>🕋</div>
      <div>جارٍ التحميل...</div>
    </div>
  </div>
)

export default function App() {
  return (
    <LangProvider>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/videos" element={<VideosPage />} />
          <Route path="/quran" element={<QuranPage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/hajj" element={<HajjPage />} />
          <Route path="/umrah" element={<UmrahPage />} />
          <Route path="/contest" element={<ContestPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </LangProvider>
  )
}
