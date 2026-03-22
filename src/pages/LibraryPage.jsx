import { useState, useEffect } from "react";
import { useLang } from "../lib/LangContext";
import { useNavigate, Link } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import Navbar from "../components/Navbar";

const supabase = createClient(
  "https://pxacnzpundghlojfldif.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4YWNuenB1bmRnaGxvamZsZGlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NDU4NjgsImV4cCI6MjA4ODMyMTg2OH0.GXnkjYc06QjGMRVOkzpGKh9wcnG0BIxEM-GfmTbM3Tk"
);

const langs = [
  { code: "ar", name: "العربية", dir: "rtl" },{ code: "en", name: "English", dir: "ltr" },{ code: "tr", name: "Türkçe", dir: "ltr" },{ code: "ur", name: "اردو", dir: "rtl" },{ code: "ms", name: "Melayu", dir: "ltr" },{ code: "fr", name: "Français", dir: "ltr" },{ code: "fa", name: "فارسی", dir: "rtl" },{ code: "bn", name: "বাংলা", dir: "ltr" },{ code: "hi", name: "हिन्दी", dir: "ltr" },
];

const T = {
  ar: { bismillah:"بسم الله الرحمن الرحيم",site_name:"مشروع منافع",site_desc:"لدعوة الحجاج والمعتمرين",login:"تسجيل الدخول",n_home:"الرئيسية",n_vid:"الفيديوهات",n_quran:"القرآن الكريم",n_lib:"المكتبة",n_hajj:"الحج",n_umrah:"العمرة",n_contest:"المسابقة",page_tag:"الكتب الإسلامية",page_title:"المكتبة الإسلامية",page_desc:"مجموعة مختارة من الكتب والرسائل في العلوم الشرعية",search:"ابحث عن كتاب...",books_count:"كتاب",pages_count:"صفحة",author_label:"المؤلف",read_now:"اقرأ الآن",download:"تحميل PDF",close:"إغلاق",about_book:"عن الكتاب",no_books:"لا توجد كتب بهذه اللغة حالياً — سيتم إضافتها قريباً",back:"العودة",ft_copy:"مشروع منافع — جميع الحقوق محفوظة",ft_langs:"اللغات المدعومة" },
  en: { bismillah:"In the Name of Allah, the Most Gracious, the Most Merciful",site_name:"Manafea Project",site_desc:"For Hajj & Umrah Dawah",login:"Login",n_home:"Home",n_vid:"Videos",n_quran:"Holy Quran",n_lib:"Library",n_hajj:"Hajj",n_umrah:"Umrah",n_contest:"Contest",page_tag:"Islamic Books",page_title:"Islamic Library",page_desc:"A curated collection of books and treatises in Islamic sciences",search:"Search for a book...",books_count:"books",pages_count:"pages",author_label:"Author",read_now:"Read Now",download:"Download PDF",close:"Close",about_book:"About This Book",no_books:"No books available in this language yet — coming soon",back:"Back",ft_copy:"Manafea Project — All Rights Reserved",ft_langs:"Supported Languages" },
  tr: { bismillah:"Rahman ve Rahim olan Allah'ın adıyla",site_name:"Menafi Projesi",site_desc:"Hacılar İçin",login:"Giriş",n_home:"Ana Sayfa",n_vid:"Videolar",n_quran:"Kur'an",n_lib:"Kütüphane",n_hajj:"Hac",n_umrah:"Umre",n_contest:"Yarışma",page_tag:"İslami Kitaplar",page_title:"İslami Kütüphane",page_desc:"İslami ilimlerde seçme kitap koleksiyonu",search:"Kitap ara...",books_count:"kitap",pages_count:"sayfa",author_label:"Yazar",read_now:"Şimdi Oku",download:"PDF İndir",close:"Kapat",about_book:"Kitap Hakkında",no_books:"Bu dilde henüz kitap yok — yakında eklenecek",back:"Geri",ft_copy:"Menafi — Tüm Hakları Saklıdır",ft_langs:"Diller" },
  ur: { bismillah:"اللہ کے نام سے",site_name:"منافع پروجیکٹ",site_desc:"حاجیوں کی دعوت",login:"لاگ ان",n_home:"ہوم",n_vid:"ویڈیوز",n_quran:"قرآن",n_lib:"لائبریری",n_hajj:"حج",n_umrah:"عمرہ",n_contest:"مقابلہ",page_tag:"اسلامی کتابیں",page_title:"اسلامی لائبریری",page_desc:"اسلامی علوم میں منتخب کتابوں کا مجموعہ",search:"کتاب تلاش کریں...",books_count:"کتابیں",pages_count:"صفحات",author_label:"مؤلف",read_now:"ابھی پڑھیں",download:"PDF ڈاؤنلوڈ",close:"بند",about_book:"کتاب کے بارے میں",no_books:"اس زبان میں ابھی کوئی کتاب نہیں — جلد شامل ہوں گی",back:"واپس",ft_copy:"منافع — حقوق محفوظ",ft_langs:"زبانیں" },
  ms: { bismillah:"Dengan nama Allah",site_name:"Projek Manafea",site_desc:"Dakwah Haji & Umrah",login:"Log Masuk",n_home:"Utama",n_vid:"Video",n_quran:"Al-Quran",n_lib:"Perpustakaan",n_hajj:"Haji",n_umrah:"Umrah",n_contest:"Pertandingan",page_tag:"Buku Islam",page_title:"Perpustakaan Islam",page_desc:"Koleksi buku terpilih dalam ilmu Islam",search:"Cari buku...",books_count:"buku",pages_count:"halaman",author_label:"Pengarang",read_now:"Baca Sekarang",download:"Muat Turun PDF",close:"Tutup",about_book:"Tentang Buku",no_books:"Tiada buku dalam bahasa ini lagi — akan datang",back:"Kembali",ft_copy:"Manafea — Hak Cipta",ft_langs:"Bahasa" },
  fr: { bismillah:"Au nom d'Allah",site_name:"Projet Manafea",site_desc:"Dawah du Hajj",login:"Connexion",n_home:"Accueil",n_vid:"Vidéos",n_quran:"Coran",n_lib:"Bibliothèque",n_hajj:"Hajj",n_umrah:"Omra",n_contest:"Concours",page_tag:"Livres Islamiques",page_title:"Bibliothèque Islamique",page_desc:"Collection de livres en sciences islamiques",search:"Rechercher un livre...",books_count:"livres",pages_count:"pages",author_label:"Auteur",read_now:"Lire",download:"Télécharger PDF",close:"Fermer",about_book:"À Propos",no_books:"Pas encore de livres dans cette langue — bientôt",back:"Retour",ft_copy:"Manafea — Droits Réservés",ft_langs:"Langues" },
  fa: { bismillah:"به نام خداوند",site_name:"پروژه منافع",site_desc:"دعوت حاجیان",login:"ورود",n_home:"خانه",n_vid:"ویدیوها",n_quran:"قرآن",n_lib:"کتابخانه",n_hajj:"حج",n_umrah:"عمره",n_contest:"مسابقه",page_tag:"کتاب‌های اسلامی",page_title:"کتابخانه اسلامی",page_desc:"مجموعه منتخب کتاب‌ها در علوم اسلامی",search:"جستجوی کتاب...",books_count:"کتاب",pages_count:"صفحه",author_label:"نویسنده",read_now:"بخوانید",download:"دانلود PDF",close:"بستن",about_book:"درباره کتاب",no_books:"هنوز کتابی به این زبان نیست — به زودی",back:"بازگشت",ft_copy:"منافع — حقوق محفوظ",ft_langs:"زبان‌ها" },
  bn: { bismillah:"আল্লাহর নামে",site_name:"মানাফেয়া",site_desc:"হজ্জ দাওয়াহ",login:"লগইন",n_home:"হোম",n_vid:"ভিডিও",n_quran:"কুরআন",n_lib:"লাইব্রেরি",n_hajj:"হজ্জ",n_umrah:"উমরাহ",n_contest:"প্রতিযোগিতা",page_tag:"ইসলামিক বই",page_title:"ইসলামিক লাইব্রেরি",page_desc:"ইসলামি বিজ্ঞানে নির্বাচিত বইয়ের সংগ্রহ",search:"বই খুঁজুন...",books_count:"বই",pages_count:"পৃষ্ঠা",author_label:"লেখক",read_now:"এখনই পড়ুন",download:"PDF ডাউনলোড",close:"বন্ধ",about_book:"বই সম্পর্কে",no_books:"এই ভাষায় এখনো বই নেই — শীঘ্রই আসছে",back:"ফিরুন",ft_copy:"মানাফেয়া — সংরক্ষিত",ft_langs:"ভাষা" },
  hi: { bismillah:"अल्लाह के नाम से",site_name:"मनाफ़ेआ",site_desc:"हज दावत",login:"लॉगिन",n_home:"होम",n_vid:"वीडियो",n_quran:"कुरान",n_lib:"पुस्तकालय",n_hajj:"हज",n_umrah:"उमरा",n_contest:"प्रतियोगिता",page_tag:"इस्लामी किताबें",page_title:"इस्लामी पुस्तकालय",page_desc:"इस्लामी विज्ञान में पुस्तकों का चयनित संग्रह",search:"किताब खोजें...",books_count:"किताबें",pages_count:"पन्ने",author_label:"लेखक",read_now:"अभी पढ़ें",download:"PDF डाउनलोड",close:"बंद",about_book:"किताब के बारे में",no_books:"इस भाषा में अभी किताबें नहीं — जल्द आ रही हैं",back:"वापस",ft_copy:"मनाफ़ेआ — अधिकार सुरक्षित",ft_langs:"भाषाएं" },
};

// ─── Books per language (embedded fallback — real data comes from Supabase) ───
// Each language has its own set of books with its own PDF URLs
const BOOKS_BY_LANG = {
  ar: [
    { id:1, title:"الدين الصحيح", author:"د. أبو أمينة بلال فيلبس", desc:"كتاب يعرض حقيقة الإسلام ومبادئه الأساسية بأسلوب ميسر وواضح", pdf:"https://manafea.com/books/ar/true-religion.pdf", pages:120, cover:"", color:"#1B3A4B" },
    { id:2, title:"العقيدة الصحيحة وما يضادها", author:"الشيخ عبدالعزيز بن باز", desc:"رسالة مختصرة في بيان العقيدة الصحيحة التي يجب على المسلم التمسك بها", pdf:"https://manafea.com/books/ar/correct-creed.pdf", pages:85, color:"#2C5F7C" },
    { id:3, title:"حصن المسلم", author:"سعيد بن علي القحطاني", desc:"مجموعة شاملة من الأذكار والأدعية اليومية من القرآن والسنة", pdf:"https://manafea.com/books/ar/hisn-almuslim.pdf", pages:64, color:"#9E832E" },
    { id:4, title:"رياض الصالحين", author:"الإمام النووي", desc:"كتاب جامع في أحاديث الآداب والأخلاق والأحكام", pdf:"https://manafea.com/books/ar/riyadh-saliheen.pdf", pages:590, color:"#0F2530" },
    { id:5, title:"الأصول الثلاثة وأدلتها", author:"الشيخ محمد بن عبدالوهاب", desc:"رسالة في ثلاثة أصول يجب على كل مسلم معرفتها", pdf:"https://manafea.com/books/ar/three-fundamentals.pdf", pages:35, color:"#1B3A4B" },
    { id:6, title:"كتاب التوحيد", author:"الشيخ محمد بن عبدالوهاب", desc:"كتاب في بيان حقيقة التوحيد وما ينافيه من الشرك", pdf:"https://manafea.com/books/ar/tawheed.pdf", pages:160, color:"#2C5F7C" },
    { id:7, title:"الأربعون النووية", author:"الإمام النووي", desc:"أربعون حديثاً نبوياً جامعة لأصول الدين وقواعد الأحكام", pdf:"https://manafea.com/books/ar/40-nawawi.pdf", pages:45, color:"#9E832E" },
    { id:8, title:"تفسير ابن كثير", author:"الحافظ ابن كثير", desc:"من أشهر كتب التفسير بالمأثور", pdf:"https://manafea.com/books/ar/tafsir-ibn-kathir.pdf", pages:1800, color:"#0F2530" },
  ],
  en: [
    { id:1, title:"The True Religion", author:"Dr. Abu Ameenah Bilal Philips", desc:"A book presenting the truth of Islam and its core principles in a clear manner", pdf:"https://manafea.com/books/en/true-religion.pdf", pages:120, cover:"", color:"#1B3A4B" },
    { id:2, title:"The Correct Creed", author:"Sheikh Abdul-Aziz ibn Baz", desc:"A concise treatise on the correct Islamic creed every Muslim should hold", pdf:"https://manafea.com/books/en/correct-creed.pdf", pages:85, color:"#2C5F7C" },
    { id:3, title:"Fortress of the Muslim", author:"Said bin Ali Al-Qahtani", desc:"A comprehensive collection of daily supplications from the Quran and Sunnah", pdf:"https://manafea.com/books/en/hisn-almuslim.pdf", pages:64, color:"#9E832E" },
    { id:4, title:"Gardens of the Righteous", author:"Imam An-Nawawi", desc:"A comprehensive hadith collection on manners, ethics, and rulings", pdf:"https://manafea.com/books/en/riyadh-saliheen.pdf", pages:590, color:"#0F2530" },
    { id:5, title:"The Three Fundamentals", author:"Sheikh Muhammad ibn Abdul-Wahhab", desc:"A brief treatise on three fundamentals every Muslim must know", pdf:"https://manafea.com/books/en/three-fundamentals.pdf", pages:35, color:"#1B3A4B" },
    { id:6, title:"Book of Tawheed", author:"Sheikh Muhammad ibn Abdul-Wahhab", desc:"A book explaining the reality of monotheism and what contradicts it", pdf:"https://manafea.com/books/en/tawheed.pdf", pages:160, color:"#2C5F7C" },
    { id:7, title:"Nawawi's Forty Hadith", author:"Imam An-Nawawi", desc:"Forty prophetic hadiths covering the foundations of religion", pdf:"https://manafea.com/books/en/40-nawawi.pdf", pages:45, color:"#9E832E" },
    { id:8, title:"Tafsir Ibn Kathir", author:"Hafiz Ibn Kathir", desc:"One of the most renowned books of Quran interpretation", pdf:"https://manafea.com/books/en/tafsir-ibn-kathir.pdf", pages:1800, color:"#0F2530" },
  ],
  // Other languages: admin will upload books per language — these show "no books" message for now
};

const IP=()=><svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="igl" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M40 0L80 40L40 80L0 40Z" fill="none" stroke="currentColor" strokeWidth="0.5"/><circle cx="40" cy="40" r="15" fill="none" stroke="currentColor" strokeWidth="0.5"/><path d="M20 20L60 20L60 60L20 60Z" fill="none" stroke="currentColor" strokeWidth="0.3"/></pattern></defs><rect width="100%" height="100%" fill="url(#igl)"/></svg>;

export default function ManafaaLibraryPage() {
  const { lang, setLang } = useLang();
  const [showLM, setShowLM] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mob, setMob] = useState(false);
  const [search, setSearch] = useState("");
  const [activeBook, setActiveBook] = useState(null);
  const [readingPdf, setReadingPdf] = useState(null);
  const [dbBooks, setDbBooks] = useState([]);

  const lo = langs.find(l => l.code === lang) || langs[0];
  const dir = lo.dir;
  const ui = T[lang] || T.ar;
  const t = k => ui[k] || T.ar[k] || k;
  const arr = dir === "rtl" ? "←" : "→";

  // Books for current language
  const books = dbBooks.length > 0 ? dbBooks : (BOOKS_BY_LANG[lang] || []);
  const filtered = books.filter(b => b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()));

  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", h); return () => window.removeEventListener("scroll", h); }, []);
  useEffect(() => { setSearch(""); setActiveBook(null); setReadingPdf(null); }, [lang]);

  // جلب الكتب من Supabase
  useEffect(() => {
    async function fetchBooks() {
      const { data, error } = await supabase
        .from("books")
        .select(`
          id, pdf_url, cover_url, pages, sort_order, lang,
          book_translations(lang, title, author, description)
        `)
        .eq("lang", lang)
        .order("sort_order");

      if (error || !data) return;

      const mapped = data.map((b, i) => {
        const trans = b.book_translations?.find(t => t.lang === lang) || b.book_translations?.[0] || {};
        const colors = ["#1B3A4B","#2C5F7C","#9E832E","#0F2530","#1B3A4B","#2C5F7C","#9E832E","#0F2530"];
        return {
          id: b.id,
          title: trans.title || "",
          author: trans.author || "",
          desc: trans.description || "",
          pdf: b.pdf_url,
          cover: b.cover_url || "",
          pages: b.pages || 0,
          color: colors[i % colors.length],
        };
      });
      setDbBooks(mapped);
    }
    fetchBooks();
  }, [lang]);

  const nav = [{k:"n_home",h:"/"},{k:"n_vid",h:"/videos"},{k:"n_quran",h:"/quran"},{k:"n_lib",h:"/library"},{k:"n_hajj",h:"/hajj"},{k:"n_umrah",h:"/umrah"},{k:"n_contest",h:"/contest"}];

  return (
    <div dir={dir} className="min-h-screen bg-[#FAFBFC]" style={{ fontFamily:"'Tajawal','Segoe UI',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&family=Amiri:wght@400;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        :root{--primary:#1B3A4B;--primary-light:#2C5F7C;--primary-dark:#0F2530;--gold:#C8A951;--gold-light:#E8D48B;--gold-dark:#9E832E;--text:#1a1a2e;--text-light:#6B7280}
        @keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        .animate-fadeInUp{animation:fadeInUp .8s ease-out forwards}
        .animate-slideDown{animation:slideDown .3s ease-out forwards}
        .glass-nav{background:rgba(27,58,75,.95);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px)}
        .hero-gradient{background:linear-gradient(135deg,#0F2530 0%,#1B3A4B 30%,#2C5F7C 70%,#1B3A4B 100%)}
        .gold-shimmer{background:linear-gradient(90deg,var(--gold-dark),var(--gold),var(--gold-light),var(--gold),var(--gold-dark));background-size:200% 100%;animation:shimmer 4s linear infinite;-webkit-background-clip:text;-webkit-text-fill-color:transparent}
        .card-hover{transition:all .4s cubic-bezier(.4,0,.2,1)}.card-hover:hover{transform:translateY(-8px);box-shadow:0 25px 50px -12px rgba(27,58,75,.15)}
        .btn-primary{background:linear-gradient(135deg,var(--gold-dark),var(--gold));transition:all .3s}.btn-primary:hover{background:linear-gradient(135deg,var(--gold),var(--gold-light));transform:translateY(-2px);box-shadow:0 10px 30px rgba(200,169,81,.3)}
        .nav-item{position:relative;transition:all .3s}.nav-item::after{content:'';position:absolute;bottom:-4px;${dir==="rtl"?"right":"left"}:0;width:0;height:2px;background:var(--gold);transition:width .3s}.nav-item:hover::after{width:100%}
        .quran-font{font-family:'Amiri',serif}
      `}</style>


      <Navbar />


      {/* HERO */}
      <section className="hero-gradient relative overflow-hidden" style={{minHeight:'45vh'}}>
        <IP/>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center" style={{minHeight:'45vh'}}>
          <div className="text-center animate-fadeInUp">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-16 sm:w-24" style={{background:'var(--gold)'}}></div>
              <span className="text-sm font-medium tracking-widest" style={{color:'var(--gold)'}}>{t("page_tag")}</span>
              <div className="h-px w-16 sm:w-24" style={{background:'var(--gold)'}}></div>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black gold-shimmer mb-4 quran-font">{t("page_title")}</h1>
            <p className="text-base sm:text-lg text-white/60 font-light max-w-2xl mx-auto mb-8">{t("page_desc")}</p>
            <div className="flex items-center justify-center gap-6 sm:gap-10">
              <div className="text-center"><div className="text-2xl sm:text-3xl font-black" style={{color:'var(--gold)'}}>{books.length}</div><div className="text-xs text-white/40">{t("books_count")}</div></div>
              <div className="w-px h-10" style={{background:'rgba(255,255,255,0.1)'}}></div>
              <div className="text-center"><div className="text-2xl sm:text-3xl font-black" style={{color:'var(--gold)'}}>9+</div><div className="text-xs text-white/40">🌍</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* SEARCH */}
      <section className="relative -mt-8 z-20 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
          <div className="relative">
            <svg className={`absolute top-1/2 -translate-y-1/2 ${dir==="rtl"?"right-4":"left-4"} w-4 h-4`} fill="none" viewBox="0 0 24 24" stroke="var(--text-light)"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t("search")} className="w-full py-3 rounded-xl border-2 text-sm focus:outline-none transition-colors" style={{borderColor:'#E5E7EB',direction:dir,textAlign:dir==="rtl"?"right":"left",fontFamily:'Tajawal',paddingInlineStart:'44px',paddingInlineEnd:'16px'}} onFocus={e=>e.target.style.borderColor='var(--gold)'} onBlur={e=>e.target.style.borderColor='#E5E7EB'}/>
          </div>
        </div>
      </section>

      {/* BOOKS GRID */}
      <section className="py-12 sm:py-16 max-w-6xl mx-auto px-4 sm:px-6">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((book, i) => (
              <div key={book.id} onClick={()=>setActiveBook(book)} className="card-hover bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer group animate-fadeInUp" style={{animationDelay:`${Math.min(i*.08,.5)}s`}}>
                {/* Cover */}
                <div className="h-56 relative overflow-hidden" style={{background:`linear-gradient(135deg,${book.color},var(--primary))`}}>
                  {book.cover ? (
                    <img src={book.cover} alt={book.title}
                      className="w-full h-full object-cover"
                      onError={e=>{e.target.style.display='none'}} />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center p-4">
                      <span className="text-5xl opacity-15 absolute top-4 right-4">📖</span>
                      <div className="relative z-10 text-center">
                        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{background:'rgba(255,255,255,0.15)'}}>
                          <span className="text-2xl">📚</span>
                        </div>
                        <h3 className="text-white font-bold text-sm leading-tight px-2 quran-font">{book.title}</h3>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300" style={{background:'rgba(200,169,81,0.9)'}}>
                    <span className="text-white text-sm font-bold">{t("read_now")}</span>
                  </div>
                </div>
                {/* Info */}
                <div className="p-4">
                  <h4 className="font-bold text-sm mb-1 truncate" style={{color:'var(--text)'}}>{book.title}</h4>
                  <p className="text-xs mb-2 truncate" style={{color:'var(--text-light)'}}>{book.author}</p>
                  <span className="text-xs px-2 py-1 rounded-full" style={{background:'rgba(200,169,81,0.1)',color:'var(--gold-dark)'}}>{book.pages} {t("pages_count")}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <span className="text-6xl block mb-6">📚</span>
            <p className="text-lg font-medium mb-2" style={{color:'var(--primary)'}}>{t("no_books")}</p>
          </div>
        )}
      </section>

      {/* BOOK DETAIL MODAL */}
      {activeBook && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.7)',backdropFilter:'blur(8px)'}} onClick={()=>setActiveBook(null)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-fadeInUp" onClick={e=>e.stopPropagation()} style={{border:'1px solid rgba(200,169,81,0.2)',maxHeight:'90vh',overflowY:'auto'}}>
            {/* Header */}
            <div className="relative h-52 sm:h-64 overflow-hidden" style={{background:`linear-gradient(135deg,${activeBook.color},var(--primary))`}}>
              {activeBook.cover ? (
                <img src={activeBook.cover} alt={activeBook.title} className="w-full h-full object-cover" onError={e=>{e.target.style.display='none'}} />
              ) : (
                <>
                  <IP/>
                  <div className="relative z-10 text-center px-6 flex flex-col items-center justify-center h-full">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{background:'rgba(255,255,255,0.15)',border:'2px solid rgba(255,255,255,0.2)'}}>
                      <span className="text-3xl">📚</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white quran-font">{activeBook.title}</h2>
                    <p className="text-white/60 text-sm mt-1">{activeBook.author}</p>
                  </div>
                </>
              )}
              {activeBook.cover && (
                <div className="absolute bottom-0 left-0 right-0 p-4" style={{background:'linear-gradient(to top, rgba(0,0,0,0.7), transparent)'}}>
                  <h2 className="text-xl font-black text-white quran-font">{activeBook.title}</h2>
                  <p className="text-white/70 text-sm">{activeBook.author}</p>
                </div>
              )}
              <button onClick={()=>setActiveBook(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-all">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            {/* Info */}
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="text-xs px-3 py-1.5 rounded-full font-medium" style={{background:'rgba(27,58,75,0.05)',color:'var(--primary)'}}>📄 {activeBook.pages} {t("pages_count")}</span>
              </div>
              <div className="mb-6">
                <h3 className="text-sm font-bold mb-2" style={{color:'var(--primary)'}}>{t("about_book")}</h3>
                <p className="text-sm leading-relaxed" style={{color:'var(--text-light)'}}>{activeBook.desc}</p>
              </div>
              <div className="rounded-2xl p-4 mb-6" style={{background:'rgba(200,169,81,0.06)',border:'1px solid rgba(200,169,81,0.15)'}}>
                <p className="text-xs font-bold mb-1" style={{color:'var(--gold)'}}>{t("author_label")}</p>
                <p className="text-sm font-medium" style={{color:'var(--primary)'}}>{activeBook.author}</p>
              </div>
              {/* Actions */}
              <div className="flex gap-3">
                <button onClick={()=>{setReadingPdf(activeBook);setActiveBook(null)}} className="btn-primary flex-1 py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                  {t("read_now")} {arr}
                </button>
                <a href={activeBook.pdf} target="_blank" rel="noopener noreferrer" className="flex-1 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:bg-gray-100" style={{border:'2px solid #E5E7EB',color:'var(--primary)',textDecoration:'none'}}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                  {t("download")}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PDF READER (fullscreen) */}
      {readingPdf && (
        <div style={{position:'fixed',top:0,left:0,right:0,bottom:0,zIndex:9999,background:'#1a1a2e',display:'flex',flexDirection:'column'}}>
          {/* Reader Header */}
          <div style={{background:'rgba(27,58,75,0.98)',padding:'10px 16px',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
            <button onClick={()=>setReadingPdf(null)} style={{display:'flex',alignItems:'center',gap:'8px',color:'rgba(255,255,255,0.8)',fontSize:'14px',background:'none',border:'none',cursor:'pointer',fontFamily:'Tajawal'}}>
              <span>{dir==="rtl"?"→":"←"}</span>
              <span>{t("back")}</span>
            </button>
            <div style={{textAlign:'center'}}>
              <h2 style={{color:'white',fontWeight:'bold',fontSize:'14px',fontFamily:'Amiri,serif'}}>{readingPdf.title}</h2>
              <p style={{color:'rgba(255,255,255,0.4)',fontSize:'11px'}}>{readingPdf.author}</p>
            </div>
            <a href={readingPdf.pdf} target="_blank" rel="noopener noreferrer" style={{display:'flex',alignItems:'center',gap:'4px',color:'#C8A951',fontSize:'12px',fontWeight:'bold',textDecoration:'none',fontFamily:'Tajawal'}}>
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              PDF
            </a>
          </div>
          {/* PDF Embed */}
          <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',background:'#2a2a3e'}}>
            <iframe
              src={readingPdf.pdf}
              style={{width:'100%',height:'100%',border:'none'}}
              title={readingPdf.title}
            />
            {/* Fallback message if iframe doesn't load */}
            <div style={{position:'absolute',textAlign:'center',color:'rgba(255,255,255,0.5)',fontSize:'14px',fontFamily:'Tajawal',pointerEvents:'none'}}>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{background:'var(--primary-dark)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{background:'var(--gold)',color:'var(--primary-dark)'}}><span className="font-bold quran-font">م</span></div>
                <div><h3 className="text-white font-bold">{t("site_name")}</h3><p className="text-xs" style={{color:'var(--gold)'}}>{t("site_desc")}</p></div>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">{t("ft_langs")}</h4>
              <div className="flex flex-wrap gap-2">{langs.map(l=><button key={l.code} onClick={()=>setLang(l.code)} className="text-xs px-3 py-1.5 rounded-full transition-all" style={{background:lang===l.code?'var(--gold)':'rgba(255,255,255,.05)',color:lang===l.code?'var(--primary-dark)':'rgba(255,255,255,.6)',fontWeight:lang===l.code?'bold':'normal'}}>{l.name}</button>)}</div>
            </div>
          </div>
          <div className="mt-12 pt-8 text-center" style={{borderTop:'1px solid rgba(255,255,255,.05)'}}><p className="text-white/30 text-sm">© {new Date().getFullYear()} {t("ft_copy")}</p></div>
        </div>
      </footer>

      {(showLM||mob)&&<div className="fixed inset-0 z-40" onClick={()=>{setShowLM(false);setMob(false)}}></div>}
    </div>
  );
}
