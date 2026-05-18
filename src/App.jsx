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
  const [gone, setGone] = React.useState(false);
  const audio = React.useRef(null);
  if (gone) return null;
  const toggle = () => {
    if (!audio.current) {
      audio.current = new Audio('https://ia800203.us.archive.org/14/items/TakbirateEidMakkah/takbir.mp3');
      audio.current.loop = true;
      audio.current.volume = 0.7;
    }
    if (playing) { audio.current.pause(); setPlaying(false); }
    else { audio.current.play().then(()=>setPlaying(true)).catch(()=>{}); }
  };
  const close = () => { if (audio.current) audio.current.pause(); setGone(true); };
  return (
    <div style={{position:'fixed',bottom:'24px',left:'50%',transform:'translateX(-50%)',zIndex:9999,display:'flex',alignItems:'center',gap:'10px',background:'linear-gradient(135deg,rgba(15,37,48,.97),rgba(27,58,75,.97))',border:'1px solid rgba(200,169,81,.5)',borderRadius:'50px',padding:'10px 16px',boxShadow:'0 8px 32px rgba(0,0,0,.5)',backdropFilter:'blur(12px)',direction:'rtl',fontFamily:"'Tajawal',sans-serif",whiteSpace:'nowrap'}}>
      <button onClick={toggle} style={{background:'linear-gradient(135deg,#C8A951,#B8942E)',border:'none',borderRadius:'50%',width:'40px',height:'40px',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px',color:'#0F2530',flexShrink:0,boxShadow:'0 2px 8px rgba(200,169,81,.4)'}}>
        {playing ? '⏸️' : '▶️'}
      </button>
      <div>
        <div style={{color:'#C8A951',fontSize:'13px',fontWeight:700,lineHeight:1.3}}>👏 تكبيرات ذي الحجة</div>
        <div style={{color:'rgba(255,255,255,.55)',fontSize:'11px'}}>{playing ? 'الله أكبر الله أكبر لا إله إلا الله' : 'اضغط لتشغيل التكبيرات'}</div>
      </div>
      <button onClick={close} style={{background:'none',border:'none',color:'rgba(255,255,255,.35)',fontSize:'20px',cursor:'pointer',padding:'0 2px',lineHeight:1,marginRight:'2px'}}>×</button>
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
