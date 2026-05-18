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
  const [gone, setGone] = React.useState(false);
  const [played, setPlayed] = React.useState(false);
  const played_ref = React.useRef(false);

  React.useEffect(() => {
    if (gone) return;
    const playOnce = () => {
      if (played_ref.current) return;
      played_ref.current = true;
      setPlayed(true);
      const audio = new Audio('https://ia800203.us.archive.org/14/items/TakbirateEidMakkah/takbir.mp3');
      audio.volume = 0.7;
      audio.play().catch(() => {});
      // Stop after 30 seconds (one round of takbeer)
      setTimeout(() => { audio.pause(); audio.currentTime = 0; }, 30000);
      // Remove listeners after first play
      document.removeEventListener('click', playOnce, true);
      document.removeEventListener('touchstart', playOnce, true);
      document.removeEventListener('keydown', playOnce, true);
    };
    document.addEventListener('click', playOnce, true);
    document.addEventListener('touchstart', playOnce, true);
    document.addEventListener('keydown', playOnce, true);
    return () => {
      document.removeEventListener('click', playOnce, true);
      document.removeEventListener('touchstart', playOnce, true);
      document.removeEventListener('keydown', playOnce, true);
    };
  }, [gone]);

  if (gone) return null;

  return (
    <div style={{position:'fixed',bottom:'20px',left:'50%',transform:'translateX(-50%)',zIndex:9999,display:'flex',alignItems:'center',gap:'10px',background:'linear-gradient(135deg,rgba(15,37,48,.97),rgba(27,58,75,.97))',border:'1px solid rgba(200,169,81,.5)',borderRadius:'50px',padding:'10px 16px',boxShadow:'0 8px 32px rgba(0,0,0,.5)',backdropFilter:'blur(12px)',direction:'rtl',fontFamily:"'Tajawal',sans-serif",whiteSpace:'nowrap'}}>
      <span style={{fontSize:'22px'}}>👏</span>
      <div>
        <div style={{color:'#C8A951',fontSize:'13px',fontWeight:700,lineHeight:1.3}}>تكبيرات ذي الحجة</div>
        <div style={{color:'rgba(255,255,255,.55)',fontSize:'11px'}}>
          {played ? 'الله أكبر الله أكبر لا إله إلا الله' : 'اضغط أي مكان لتشغيل التكبيرات'}
        </div>
      </div>
      <button onClick={() => setGone(true)} style={{background:'none',border:'none',color:'rgba(255,255,255,.4)',fontSize:'20px',cursor:'pointer',padding:'0 2px',lineHeight:1}}>×</button>
    </div>
  );
}

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
    <TakbeerPlayer />
    </LangProvider>
  )
}
