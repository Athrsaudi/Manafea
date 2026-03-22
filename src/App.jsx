import { Routes, Route } from 'react-router-dom'
import { LangProvider } from './lib/LangContext'
import HomePage from './pages/HomePage'
import VideosPage from './pages/VideosPage'
import QuranPage from './pages/QuranPage'
import LibraryPage from './pages/LibraryPage'
import HajjPage from './pages/HajjPage'
import UmrahPage from './pages/UmrahPage'
import ContestPage from './pages/ContestPage'
import AdminPage from './pages/AdminPage'

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
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </LangProvider>
  )
}
