import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const langs = [
  { code: "ar", name: "العربية", dir: "rtl" },
  { code: "en", name: "English", dir: "ltr" },
  { code: "tr", name: "Türkçe", dir: "ltr" },
  { code: "ur", name: "اردو", dir: "rtl" },
  { code: "ms", name: "Melayu", dir: "ltr" },
  { code: "fr", name: "Français", dir: "ltr" },
  { code: "fa", name: "فارسی", dir: "rtl" },
  { code: "bn", name: "বাংলা", dir: "ltr" },
  { code: "hi", name: "हिन्दी", dir: "ltr" },
];

const NAV_LINKS = [
  { k: "n_home",    h: "/" },
  { k: "n_vid",     h: "/videos" },
  { k: "n_quran",   h: "/quran" },
  { k: "n_lib",     h: "/library" },
  { k: "n_hajj",    h: "/hajj" },
  { k: "n_umrah",   h: "/umrah" },
  { k: "n_contest", h: "/contest" },
];

const LOGIN_TEXT = {
  ar:"تسجيل الدخول", en:"Login", tr:"Giriş", ur:"لاگ ان",
  ms:"Log Masuk", fr:"Connexion", fa:"ورود", bn:"লগইন", hi:"लॉगिन"
};

const NAV_TEXT = {
  ar:["الرئيسية","الفيديوهات","القرآن الكريم","المكتبة","الحج","العمرة","المسابقة"],
  en:["Home","Videos","Holy Quran","Library","Hajj","Umrah","Contest"],
  tr:["Ana Sayfa","Videolar","Kur'an","Kütüphane","Hac","Umre","Yarışma"],
  ur:["ہوم","ویڈیوز","قرآن","لائبریری","حج","عمرہ","مقابلہ"],
  ms:["Utama","Video","Al-Quran","Perpustakaan","Haji","Umrah","Pertandingan"],
  fr:["Accueil","Vidéos","Coran","Bibliothèque","Hajj","Omra","Concours"],
  fa:["خانه","ویدیوها","قرآن","کتابخانه","حج","عمره","مسابقه"],
  bn:["হোম","ভিডিও","কুরআন","লাইব্রেরি","হজ্জ","উমরাহ","প্রতিযোগিতা"],
  hi:["होम","वीडियो","कुरान","पुस्तकालय","हज","उमरा","प्रतियोगिता"],
};

export default function Navbar({ lang, setLang }) {
  const [scrolled, setScrolled] = useState(false);
  const [mob, setMob] = useState(false);
  const [showLM, setShowLM] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const lo = langs.find(l => l.code === lang) || langs[0];
  const dir = lo.dir;
  const navText = NAV_TEXT[lang] || NAV_TEXT.ar;

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-500 ${scrolled ? 'shadow-2xl' : ''}`}
         style={{background:'rgba(27,58,75,.97)', backdropFilter:'blur(20px)', direction: dir}}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Logo */}
          <Link to="/" style={{textDecoration:'none',flexShrink:0}}>
            <img
              src="/logo.jpg"
              alt="مشروع منافع"
              style={{height:'48px', width:'48px', borderRadius:'50%', objectFit:'cover', border:'2px solid #C8A951'}}
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((n, i) => (
              <Link key={i} to={n.h}
                className="text-sm px-3 py-2 rounded-lg transition-all"
                style={{
                  color: isActive(n.h) ? 'white' : 'rgba(255,255,255,.75)',
                  background: isActive(n.h) ? 'rgba(200,169,81,.2)' : 'none',
                  fontWeight: isActive(n.h) ? 'bold' : 'normal',
                  textDecoration: 'none',
                  borderBottom: isActive(n.h) ? '2px solid #C8A951' : '2px solid transparent',
                }}>
                {navText[i]}
              </Link>
            ))}
          </div>

          {/* Right: Language + Login + Mobile Toggle */}
          <div className="flex items-center gap-2">
            {/* Language Picker */}
            <div className="relative">
              <button onClick={() => setShowLM(!showLM)}
                style={{background:'none',border:'1px solid rgba(200,169,81,.4)',borderRadius:'8px',color:'rgba(255,255,255,.85)',cursor:'pointer',fontSize:'13px',padding:'5px 10px',display:'flex',alignItems:'center',gap:'4px'}}>
                🌐 {lo.name}
              </button>
              {showLM && (
                <div className={`absolute ${dir==='rtl'?'left-0':'right-0'} top-full mt-2 w-44 bg-white rounded-xl shadow-2xl overflow-hidden z-50`}
                     style={{border:'1px solid #eee'}}>
                  {langs.map(l => (
                    <button key={l.code} onClick={() => { setLang(l.code); setShowLM(false); }}
                      className="w-full px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center justify-between transition-colors"
                      style={{textAlign:l.dir==='rtl'?'right':'left',border:'none',cursor:'pointer',
                              background:lang===l.code?'#EFF6FF':'white',
                              color:lang===l.code?'#1B3A4B':'#333',
                              fontWeight:lang===l.code?'bold':'normal'}}>
                      <span>{l.name}</span>
                      {lang===l.code && <span style={{color:'#C8A951'}}>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Login Button */}
            <button onClick={() => alert('قريباً / Coming Soon')}
              style={{background:'linear-gradient(135deg,#C8A951,#B8942E)',border:'none',borderRadius:'10px',
                      color:'#0F2530',fontWeight:'bold',fontSize:'13px',padding:'7px 14px',cursor:'pointer',
                      display:'flex',alignItems:'center',gap:'5px',whiteSpace:'nowrap'}}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              {LOGIN_TEXT[lang] || LOGIN_TEXT.ar}
            </button>

            {/* Mobile Toggle */}
            <button onClick={() => setMob(!mob)}
              className="lg:hidden text-white p-2 rounded-lg"
              style={{background:'none',border:'none',cursor:'pointer'}}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {mob
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mob && (
          <div className="lg:hidden pb-3" style={{borderTop:'1px solid rgba(255,255,255,.08)'}}>
            <div className="pt-2 space-y-1">
              {NAV_LINKS.map((n, i) => (
                <Link key={i} to={n.h} onClick={() => setMob(false)}
                  className="flex items-center px-4 py-3 rounded-lg text-sm transition-all"
                  style={{
                    color: isActive(n.h) ? 'white' : 'rgba(255,255,255,.75)',
                    background: isActive(n.h) ? 'rgba(200,169,81,.15)' : 'transparent',
                    textDecoration: 'none',
                    fontWeight: isActive(n.h) ? 'bold' : 'normal',
                  }}>
                  {navText[i]}
                </Link>
              ))}
              {/* Mobile Login */}
              <button onClick={() => alert('قريباً / Coming Soon')}
                className="w-full text-right px-4 py-3 rounded-lg text-sm font-bold mt-1"
                style={{background:'linear-gradient(135deg,#C8A951,#B8942E)',color:'#0F2530',border:'none',cursor:'pointer'}}>
                {LOGIN_TEXT[lang] || LOGIN_TEXT.ar}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Overlay */}
      {(showLM || mob) && (
        <div className="fixed inset-0 z-40" onClick={() => { setShowLM(false); setMob(false); }}/>
      )}
    </nav>
  );
}
