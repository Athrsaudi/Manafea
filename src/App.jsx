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
  const [status, setStatus] = React.useState('waiting'); // waiting | playing | done
  const audioRef = React.useRef(null);
  const startedRef = React.useRef(false);

  React.useEffect(() => {
    if (gone) return;

    const tryPlay = () => {
      if (startedRef.current) return;
      startedRef.current = true;

      if (!audioRef.current) return;
      audioRef.current.muted = false;
      audioRef.current.volume = 0.8;
      audioRef.current.play()
        .then(() => {
          setStatus('playing');
          // Stop after 35 seconds
          setTimeout(() => {
            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
            }
            setStatus('done');
            setTimeout(() => setGone(true), 4000);
          }, 35000);
        })
        .catch(() => { startedRef.current = false; });

      ['click','touchstart','scroll','keydown'].forEach(e =>
        document.removeEventListener(e, tryPlay, true)
      );
    };

    // Try immediately (works if page has prior interaction like refresh)
    setTimeout(tryPlay, 800);

    // Fallback: on first user interaction
    ['click','touchstart','scroll','keydown'].forEach(e =>
      document.addEventListener(e, tryPlay, true)
    );

    return () => {
      ['click','touchstart','scroll','keydown'].forEach(e =>
        document.removeEventListener(e, tryPlay, true)
      );
    };
  }, [gone]);

  if (gone) return null;

  return (
    <div style={{position:'fixed',bottom:'20px',left:'50%',transform:'translateX(-50%)',zIndex:9999,
      display:'flex',alignItems:'center',gap:'10px',
      background:'linear-gradient(135deg,rgba(15,37,48,.97),rgba(27,58,75,.97))',
      border:'1px solid rgba(200,169,81,.5)',borderRadius:'50px',
      padding:'10px 18px',boxShadow:'0 8px 32px rgba(0,0,0,.5)',
      backdropFilter:'blur(12px)',direction:'rtl',fontFamily:"'Tajawal',sans-serif",
      whiteSpace:'nowrap'}}>
      <audio ref={audioRef} src="https://ia800203.us.archive.org/14/items/TakbirateEidMakkah/takbir.mp3" muted />
      <span style={{fontSize:'24px',animation:status==='playing'?'pulse 1s infinite':''}}>
        {status==='playing'?'👏':status==='done'?'✅':'🏕️'}
      </span>
      <div>
        <div style={{color:'#C8A951',fontSize:'13px',fontWeight:700,lineHeight:1.3}}>
          تكبيرات ذي الحجة 🎉
        </div>
        <div style={{color:'rgba(255,255,255,.6)',fontSize:'11px'}}>
          {status==='playing'?
            'الله أكبر الله أكبر لا إله إلا الله':
           status==='done'?
            'جزاك الله خيراً ❤️':
            'اضغط أي مكان لسماع التكبيرات'
          }
        </div>
      </div>
      <button onClick={() => { if(audioRef.current) audioRef.current.pause(); setGone(true); }}
        style={{background:'none',border:'none',color:'rgba(255,255,255,.35)',fontSize:'20px',cursor:'pointer',padding:'0 2px',lineHeight:1}}>
        ×
      </button>
      <style>{`@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.2)}}`}</style>
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
