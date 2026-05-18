import { Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { LangProvider } from './lib/LangContext'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import IslamicSitesPage from './pages/IslamicSitesPage'

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


import React from "react";

// ===== Takbeer Dhul-Hijja Component =====
function TakbeerPlayer() {
  const [playing, setPlaying] = React.useState(false);
  const [visible, setVisible] = React.useState(true);
  const [dismissed, setDismissed] = React.useState(false);
  const audioRef = React.useRef(null);

  React.useEffect(() => {
    // Auto-play on mount after short delay
    const timer = setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.volume = 0.7;
        audioRef.current.play().then(() => setPlaying(true)).catch(() => {});
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) { audioRef.current.pause(); setPlaying(false); }
    else { audioRef.current.play(); setPlaying(true); }
  };

  const dismiss = () => {
    if (audioRef.current) { audioRef.current.pause(); }
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div style={{
      position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
      zIndex: 9999, display: 'flex', alignItems: 'center', gap: '10px',
      background: 'linear-gradient(135deg, rgba(15,37,48,.95), rgba(27,58,75,.95))',
      border: '1px solid rgba(200,169,81,.4)', borderRadius: '50px',
      padding: '10px 18px 10px 14px', boxShadow: '0 8px 32px rgba(0,0,0,.4)',
      backdropFilter: 'blur(12px)', direction: 'rtl', fontFamily: "'Tajawal',sans-serif",
      animation: 'slideUp .5s ease'
    }}>
      <audio ref={audioRef} loop src="https://download.quranicaudio.com/quran/abdurrahmaan_as-sudays/takbeer.mp3" />
      <button onClick={toggle} style={{
        background: 'linear-gradient(135deg,#C8A951,#B8942E)', border: 'none',
        borderRadius: '50%', width: '38px', height: '38px', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '18px', color: '#0F2530', flexShrink: 0
      }}>
        {playing ? '⏸' : '▶'}
      </button>
      <div style={{ flex: 1 }}>
        <div style={{ color: '#C8A951', fontSize: '13px', fontWeight: 700, lineHeight: 1.3 }}>
          👏 تكبيرات العيد - ذو الحجة
        </div>
        <div style={{ color: 'rgba(255,255,255,.5)', fontSize: '11px' }}>
          الله أكبر الله أكبر لا إله إلا الله
        </div>
      </div>
      <button onClick={dismiss} style={{
        background: 'none', border: 'none', color: 'rgba(255,255,255,.4)',
        fontSize: '18px', cursor: 'pointer', padding: '0 4px', lineHeight: 1
      }}>×</button>
      <style>{`
        @keyframes slideUp { from { opacity:0; transform:translateX(-50%) translateY(20px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
      `}</style>
    </div>
  );
}
// ===== End Takbeer Component =====

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
          <Route path="/sites" element={<IslamicSitesPage />} />
        <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </LangProvider>
  )
}
