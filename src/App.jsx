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
  const [playing, setPlaying] = React.useState(false);
  const doneRef = React.useRef(false);

  const playTakbeer = React.useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    // Multiple audio sources as fallback
    const sources = [
      'https://download.quranicaudio.com/quran/abdurrahmaan_as-sudays/takbeer.mp3',
      'https://audio.islamway.net/lessons/57082/Takbeer-Eid.mp3',
      'https://ia800203.us.archive.org/14/items/TakbirateEidMakkah/takbir.mp3'
    ];
    let idx = 0;
    const tryNext = () => {
      if (idx >= sources.length) return;
      const audio = new Audio(sources[idx++]);
      audio.volume = 0.8;
      audio.play()
        .then(() => {
          setPlaying(true);
          setTimeout(() => { audio.pause(); setGone(true); }, 30000);
        })
        .catch(tryNext);
    };
    tryNext();
  }, []);

  React.useEffect(() => {
    if (gone) return;
    // Try auto-play after 1 second
    const t = setTimeout(playTakbeer, 1000);
    // Also listen for first interaction as fallback
    const onInteract = () => { clearTimeout(t); playTakbeer(); };
    window.addEventListener('click', onInteract, {once: true, capture: true});
    window.addEventListener('touchstart', onInteract, {once: true, capture: true});
    return () => {
      clearTimeout(t);
      window.removeEventListener('click', onInteract, true);
      window.removeEventListener('touchstart', onInteract, true);
    };
  }, [gone, playTakbeer]);

  if (gone) return null;

  return (
    <div onClick={playTakbeer} style={{
      position:'fixed', bottom:'24px', left:'50%', transform:'translateX(-50%)',
      zIndex:99999, cursor: playing ? 'default' : 'pointer',
      display:'flex', alignItems:'center', gap:'12px',
      background:'linear-gradient(135deg,#0F2530,#1B3A4B)',
      border:'2px solid #C8A951', borderRadius:'50px',
      padding:'12px 20px', boxShadow:'0 8px 40px rgba(200,169,81,.3)',
      direction:'rtl', fontFamily:"'Tajawal',sans-serif", whiteSpace:'nowrap'
    }}>
      <span style={{fontSize:'26px', animation: playing ? 'tk-pulse 0.8s infinite' : ''}}>
        {playing ? '👏' : '🕋'}
      </span>
      <div>
        <div style={{color:'#C8A951', fontSize:'14px', fontWeight:800, lineHeight:1.3}}>
          تكبيرات ذي الحجة 🎉
        </div>
        <div style={{color:'rgba(255,255,255,.7)', fontSize:'12px'}}>
          {playing
            ? 'الله أكبر الله أكبر لا إله إلا الله'
            : 'اضغط هنا لتشغيل التكبيرات'
          }
        </div>
      </div>
      <button
        onClick={e => { e.stopPropagation(); setGone(true); }}
        style={{background:'rgba(255,255,255,.1)', border:'none', color:'white',
          fontSize:'16px', cursor:'pointer', borderRadius:'50%',
          width:'28px', height:'28px', display:'flex', alignItems:'center', justifyContent:'center'}}
      >×</button>
      <style>{`
        @keyframes tk-pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.3)} }
      `}</style>
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
