import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { LangProvider } from './lib/LangContext'
import HomePage from './pages/HomePage'
import VideosPage from './pages/VideosPage'
import QuranPage from './pages/QuranPage'
import LibraryPage from './pages/LibraryPage'
import HajjPage from './pages/HajjPage'
import UmrahPage from './pages/UmrahPage'
import ContestPage from './pages/ContestPage'

const AdminPage = lazy(() => import('./pages/AdminPage'))

export default function App() {
  return (
    <LangProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/videos" element={<VideosPage />} />
        <Route path="/quran" element={<QuranPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/hajj" element={<HajjPage />} />
        <Route path="/umrah" element={<UmrahPage />} />
        <Route path="/contest" element={<ContestPage />} />
        <Route path="/admin" element={
          <Suspense fallback={<div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',fontFamily:'Tajawal',color:'#1B3A4B'}}>جارٍ التحميل...</div>}>
            <AdminPage />
          </Suspense>
        } />
      </Routes>
    </LangProvider>
  )
}
