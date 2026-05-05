import { useState, useEffect } from "react";
import { trackPage } from "../lib/analytics";
import { supabase } from "../lib/supabase";
import { useLang } from "../lib/LangContext";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";


// ─── Same config as homepage ───
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

// ─── UI Translations for Videos Page (9 Languages) ───
const T = {
  ar: { bismillah:"بسم الله الرحمن الرحيم", site_name:"مشروع منافع", site_desc:"لدعوة الحجاج والمعتمرين", login:"تسجيل الدخول", n_home:"الرئيسية", n_vid:"الفيديوهات", n_quran:"القرآن الكريم", n_lib:"المكتبة", n_hajj:"الحج", n_umrah:"العمرة", n_contest:"المسابقة", page_tag:"المكتبة المرئية", page_title:"مكتبة الفيديوهات الإسلامية", page_desc:"سلسلة متميزة من المحاضرات العلمية والدروس التعليمية بأكثر من 9 لغات", all_cats:"جميع الأقسام", featured:"مميز", videos_count:"فيديو", watch_now:"مشاهدة الآن", back_home:"العودة للرئيسية", ft_copy:"مشروع منافع — لدعوة الحجاج والمعتمرين. جميع الحقوق محفوظة", ft_langs:"اللغات المدعومة", no_videos:"لا توجد فيديوهات بهذه اللغة حالياً — سيتم إضافتها قريباً", close:"إغلاق" },
  en: { bismillah:"In the Name of Allah, the Most Gracious, the Most Merciful", site_name:"Manafea Project", site_desc:"For Hajj & Umrah Dawah", login:"Login", n_home:"Home", n_vid:"Videos", n_quran:"Holy Quran", n_lib:"Library", n_hajj:"Hajj", n_umrah:"Umrah", n_contest:"Contest", page_tag:"Visual Library", page_title:"Islamic Video Library", page_desc:"A distinguished series of scientific lectures and educational lessons in 9+ languages", all_cats:"All Categories", featured:"Featured", videos_count:"videos", watch_now:"Watch Now", back_home:"Back to Home", ft_copy:"Manafea Project — For Hajj & Umrah Dawah. All Rights Reserved", ft_langs:"Supported Languages", no_videos:"No videos available in this language yet — coming soon", close:"Close" },
  tr: { bismillah:"Rahman ve Rahim olan Allah'ın adıyla", site_name:"Menafi Projesi", site_desc:"Hacılar ve Umreciler İçin", login:"Giriş", n_home:"Ana Sayfa", n_vid:"Videolar", n_quran:"Kur'an-ı Kerim", n_lib:"Kütüphane", n_hajj:"Hac", n_umrah:"Umre", n_contest:"Yarışma", page_tag:"Görsel Kütüphane", page_title:"İslami Video Kütüphanesi", page_desc:"9+ dilde seçkin ilmi dersler ve eğitim serisi", all_cats:"Tüm Kategoriler", featured:"Öne Çıkan", videos_count:"video", watch_now:"Şimdi İzle", back_home:"Ana Sayfaya Dön", ft_copy:"Menafi Projesi — Tüm Hakları Saklıdır", ft_langs:"Desteklenen Diller", no_videos:"Bu dilde henüz video yok — yakında eklenecek", close:"Kapat" },
  ur: { bismillah:"اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے", site_name:"منافع پروجیکٹ", site_desc:"حاجیوں اور عمرہ کرنے والوں کی دعوت", login:"لاگ ان", n_home:"ہوم", n_vid:"ویڈیوز", n_quran:"قرآن کریم", n_lib:"لائبریری", n_hajj:"حج", n_umrah:"عمرہ", n_contest:"مقابلہ", page_tag:"ویڈیو لائبریری", page_title:"اسلامی ویڈیو لائبریری", page_desc:"9+ زبانوں میں علمی محاضرات اور تعلیمی اسباق کا ایک ممتاز سلسلہ", all_cats:"تمام اقسام", featured:"نمایاں", videos_count:"ویڈیوز", watch_now:"ابھی دیکھیں", back_home:"واپس ہوم", ft_copy:"منافع پروجیکٹ — جملہ حقوق محفوظ ہیں", ft_langs:"معاون زبانیں", no_videos:"اس زبان میں ابھی ویڈیوز نہیں — جلد شامل ہوں گے", close:"بند کریں" },
  ms: { bismillah:"Dengan nama Allah Yang Maha Pemurah lagi Maha Penyayang", site_name:"Projek Manafea", site_desc:"Untuk Dakwah Haji & Umrah", login:"Log Masuk", n_home:"Utama", n_vid:"Video", n_quran:"Al-Quran", n_lib:"Perpustakaan", n_hajj:"Haji", n_umrah:"Umrah", n_contest:"Pertandingan", page_tag:"Perpustakaan Visual", page_title:"Perpustakaan Video Islam", page_desc:"Siri kuliah ilmiah dan pelajaran pendidikan dalam 9+ bahasa", all_cats:"Semua Kategori", featured:"Pilihan", videos_count:"video", watch_now:"Tonton Sekarang", back_home:"Kembali ke Utama", ft_copy:"Projek Manafea — Hak Cipta Terpelihara", ft_langs:"Bahasa Disokong", no_videos:"Tiada video dalam bahasa ini lagi — akan datang", close:"Tutup" },
  fr: { bismillah:"Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux", site_name:"Projet Manafea", site_desc:"Pour la Dawah du Hajj et de la Omra", login:"Connexion", n_home:"Accueil", n_vid:"Vidéos", n_quran:"Le Saint Coran", n_lib:"Bibliothèque", n_hajj:"Hajj", n_umrah:"Omra", n_contest:"Concours", page_tag:"Bibliothèque Visuelle", page_title:"Bibliothèque Vidéo Islamique", page_desc:"Conférences et cours éducatifs en 9+ langues", all_cats:"Toutes les Catégories", featured:"En Vedette", videos_count:"vidéos", watch_now:"Regarder", back_home:"Retour à l'accueil", ft_copy:"Projet Manafea — Tous Droits Réservés", ft_langs:"Langues Supportées", no_videos:"Pas encore de vidéos dans cette langue — bientôt", close:"Fermer" },
  fa: { bismillah:"به نام خداوند بخشنده مهربان", site_name:"پروژه منافع", site_desc:"برای دعوت حاجیان و معتمرین", login:"ورود", n_home:"خانه", n_vid:"ویدیوها", n_quran:"قرآن کریم", n_lib:"کتابخانه", n_hajj:"حج", n_umrah:"عمره", n_contest:"مسابقه", page_tag:"کتابخانه تصویری", page_title:"کتابخانه ویدیوی اسلامی", page_desc:"مجموعه‌ای از سخنرانی‌های علمی و درس‌ها در بیش از 9 زبان", all_cats:"همه دسته‌ها", featured:"ویژه", videos_count:"ویدیو", watch_now:"مشاهده", back_home:"بازگشت به خانه", ft_copy:"پروژه منافع — تمامی حقوق محفوظ است", ft_langs:"زبان‌های پشتیبانی شده", no_videos:"هنوز ویدیویی به این زبان نیست — به زودی", close:"بستن" },
  bn: { bismillah:"পরম করুণাময় অসীম দয়ালু আল্লাহর নামে", site_name:"মানাফেয়া প্রকল্প", site_desc:"হজ্জ ও উমরাহ দাওয়াহর জন্য", login:"লগইন", n_home:"হোম", n_vid:"ভিডিও", n_quran:"পবিত্র কুরআন", n_lib:"লাইব্রেরি", n_hajj:"হজ্জ", n_umrah:"উমরাহ", n_contest:"প্রতিযোগিতা", page_tag:"ভিজ্যুয়াল লাইব্রেরি", page_title:"ইসলামিক ভিডিও লাইব্রেরি", page_desc:"9+ ভাষায় বৈজ্ঞানিক বক্তৃতা এবং শিক্ষামূলক পাঠের সিরিজ", all_cats:"সব বিভাগ", featured:"বৈশিষ্ট্যযুক্ত", videos_count:"ভিডিও", watch_now:"এখনই দেখুন", back_home:"হোমে ফিরুন", ft_copy:"মানাফেয়া প্রকল্প — সর্বস্বত্ব সংরক্ষিত", ft_langs:"সমর্থিত ভাষাসমূহ", no_videos:"এই ভাষায় এখনো কোনো ভিডিও নেই — শীঘ্রই আসছে", close:"বন্ধ" },
  hi: { bismillah:"अल्लाह के नाम से जो बड़ा कृपाशील अत्यंत दयावान है", site_name:"मनाफ़ेआ प्रोजेक्ट", site_desc:"हज और उमरा दावत के लिए", login:"लॉगिन", n_home:"होम", n_vid:"वीडियो", n_quran:"पवित्र कुरान", n_lib:"पुस्तकालय", n_hajj:"हज", n_umrah:"उमरा", n_contest:"प्रतियोगिता", page_tag:"विजुअल लाइब्रेरी", page_title:"इस्लामी वीडियो पुस्तकालय", page_desc:"9+ भाषाओं में वैज्ञानिक व्याख्यान और शैक्षिक पाठों की श्रृंखला", all_cats:"सभी श्रेणियां", featured:"विशेष", videos_count:"वीडियो", watch_now:"अभी देखें", back_home:"होम पर वापस", ft_copy:"मनाफ़ेआ प्रोजेक्ट — सभी अधिकार सुरक्षित", ft_langs:"समर्थित भाषाएं", no_videos:"इस भाषा में अभी वीडियो नहीं — जल्द आ रहे हैं", close:"बंद करें" },
};

// ─── Categories (8 sections, 9 Languages) ───
const CATS = {
  ar: [{id:"aqeedah",name:"العقيدة",icon:"☪️",desc:"أصول الإيمان والتوحيد"},{id:"hajj",name:"الحج",icon:"🕋",desc:"مناسك الحج والعمرة"}],
  en: [{id:"aqeedah",name:"Aqeedah (Creed)",icon:"☪️",desc:"Foundations of faith and monotheism"},{id:"hajj",name:"Hajj",icon:"🕋",desc:"Hajj and Umrah rituals"}],
  tr: [{id:"aqeedah",name:"Akaid",icon:"☪️",desc:"İman ve tevhid esasları"},{id:"hajj",name:"Hac",icon:"🕋",desc:"Hac ve umre menasiki"}],
  ur: [{id:"aqeedah",name:"عقیدہ",icon:"☪️",desc:"ایمان اور توحید کے اصول"},{id:"hajj",name:"حج",icon:"🕋",desc:"حج اور عمرہ کے مناسک"}],
  ms: [{id:"aqeedah",name:"Akidah",icon:"☪️",desc:"Asas iman dan tauhid"},{id:"hajj",name:"Haji",icon:"🕋",desc:"Manasik Haji dan Umrah"}],
  fr: [{id:"aqeedah",name:"Aqida",icon:"☪️",desc:"Les fondements de la foi"},{id:"hajj",name:"Hajj",icon:"🕋",desc:"Rituels du Hajj et de la Omra"}],
  fa: [{id:"aqeedah",name:"عقیده",icon:"☪️",desc:"اصول ایمان و توحید"},{id:"hajj",name:"حج",icon:"🕋",desc:"مناسک حج و عمره"}],
  bn: [{id:"aqeedah",name:"আকীদা",icon:"☪️",desc:"ঈমান ও তাওহীদের ভিত্তি"},{id:"hajj",name:"হজ্জ",icon:"🕋",desc:"হজ্জ ও উমরাহ মানাসিক"}],
  hi: [{id:"aqeedah",name:"अक़ीदा",icon:"☪️",desc:"ईमान और तौहीद की बुनियाद"},{id:"hajj",name:"हज",icon:"🕋",desc:"हज और उमरा के मनासिक"}],
};

// ─── Videos Data (24 videos across 8 categories — ar/en, others fallback to en) ───
const VIDS = {
  ar: {
    aqeedah: [{t:"أركان الإسلام الخمسة",d:"شرح مفصل لأركان الإسلام الخمسة وأهميتها في حياة المسلم",f:true},{t:"أركان الإيمان الستة",d:"تعرف على أركان الإيمان الستة التي يجب على كل مسلم الإيمان بها",f:false},{t:"التوحيد وأقسامه",d:"شرح أقسام التوحيد الثلاثة: الربوبية والألوهية والأسماء والصفات",f:false}],
    fiqh: [{t:"صفة الوضوء الصحيحة",d:"تعلم كيفية الوضوء بالطريقة الصحيحة كما وردت في السنة النبوية",f:true},{t:"أحكام الصلاة للمبتدئين",d:"دليل شامل لأحكام الصلاة من التكبير إلى التسليم",f:false},{t:"أحكام الصيام",d:"تعرف على أحكام الصيام وشروطه ومفسداته",f:false}],
    tafseer: [{t:"تفسير سورة الفاتحة",d:"شرح وتفسير معاني سورة الفاتحة آية بآية",f:true},{t:"تفسير سورة الكهف",d:"دروس وعبر من سورة الكهف",f:false},{t:"تفسير جزء عم",d:"تفسير ميسر لسور جزء عم",f:false}],
    seerah: [{t:"مولد النبي ﷺ ونشأته",d:"قصة مولد النبي محمد ﷺ ونشأته في مكة",f:true},{t:"الهجرة النبوية",d:"قصة هجرة النبي ﷺ من مكة إلى المدينة",f:false},{t:"غزوة بدر الكبرى",d:"أحداث غزوة بدر الكبرى ودروسها",f:false}],
    hadith: [{t:"شرح الأربعين النووية",d:"شرح مختصر للأحاديث الأربعين النووية",f:true},{t:"حديث جبريل عليه السلام",d:"شرح حديث جبريل في الإسلام والإيمان والإحسان",f:false},{t:"أحاديث الأذكار اليومية",d:"أحاديث نبوية في أذكار الصباح والمساء",f:false}],
    ethics: [{t:"حسن الخلق في الإسلام",d:"أهمية حسن الخلق ومكانته في الإسلام",f:true},{t:"آداب المسجد",d:"تعرف على آداب دخول المسجد والجلوس فيه",f:false},{t:"فضل الصدقة",d:"فضائل الصدقة وأجرها عند الله",f:false}],
    ramadan: [{t:"كيف نستغل شهر رمضان",d:"نصائح عملية لاستغلال شهر رمضان المبارك",f:true},{t:"فضائل ليلة القدر",d:"فضائل ليلة القدر وكيفية إحيائها",f:false},{t:"أحكام زكاة الفطر",d:"متى وكيف تُخرج زكاة الفطر",f:false}],
    hajj: [{t:"صفة الحج كاملة",d:"شرح مناسك الحج كاملة من الإحرام إلى طواف الوداع",f:true},{t:"أخطاء شائعة في الحج",d:"تعرف على الأخطاء الشائعة التي يقع فيها الحجاج",f:false},{t:"أدعية الحج والعمرة",d:"مجموعة من الأدعية المأثورة في الحج والعمرة",f:false}],
  },
  en: {
    aqeedah: [{t:"Five Pillars of Islam",d:"A detailed explanation of the five pillars of Islam and their importance",f:true},{t:"Six Pillars of Faith",d:"Learn about the six pillars of faith every Muslim must believe in",f:false},{t:"Tawheed and Its Categories",d:"Explanation of the three categories of Tawheed",f:false}],
    fiqh: [{t:"How to Perform Wudu Correctly",d:"Learn the correct way to perform Wudu as described in the Prophetic Sunnah",f:true},{t:"Prayer Rulings for Beginners",d:"A comprehensive guide to prayer rulings from Takbeer to Tasleem",f:false},{t:"Rulings of Fasting",d:"Learn about fasting rulings, conditions, and invalidators",f:false}],
    tafseer: [{t:"Tafseer of Surah Al-Fatiha",d:"Explanation of the meanings of Surah Al-Fatiha verse by verse",f:true},{t:"Tafseer of Surah Al-Kahf",d:"Lessons and morals from Surah Al-Kahf",f:false},{t:"Tafseer of Juz Amma",d:"Simplified Tafseer of Juz Amma surahs",f:false}],
    seerah: [{t:"Birth and Early Life of the Prophet ﷺ",d:"The story of Prophet Muhammad's birth and upbringing in Makkah",f:true},{t:"The Prophetic Migration",d:"The story of the Prophet's migration from Makkah to Madinah",f:false},{t:"The Battle of Badr",d:"Events and lessons from the great Battle of Badr",f:false}],
    hadith: [{t:"Explanation of Nawawi's 40 Hadith",d:"Brief explanation of Imam Nawawi's 40 Hadith collection",f:true},{t:"Hadith of Jibreel",d:"Explanation of the Hadith of Jibreel about Islam, Iman, and Ihsan",f:false},{t:"Daily Remembrance Hadiths",d:"Prophetic hadiths on morning and evening supplications",f:false}],
    ethics: [{t:"Good Character in Islam",d:"The importance and status of good character in Islam",f:true},{t:"Mosque Etiquette",d:"Learn about the etiquettes of entering and sitting in the mosque",f:false},{t:"Virtue of Charity",d:"The virtues and rewards of charity with Allah",f:false}],
    ramadan: [{t:"How to Benefit from Ramadan",d:"Practical tips to make the most of Ramadan",f:true},{t:"Virtues of Laylat Al-Qadr",d:"Virtues of the Night of Decree and how to observe it",f:false},{t:"Rulings of Zakat Al-Fitr",d:"When and how to pay Zakat Al-Fitr",f:false}],
    hajj: [{t:"Complete Hajj Guide",d:"Full explanation of Hajj rituals from Ihram to Farewell Tawaf",f:true},{t:"Common Hajj Mistakes",d:"Learn about common mistakes pilgrims make and how to avoid them",f:false},{t:"Hajj and Umrah Supplications",d:"Collection of authentic supplications for Hajj and Umrah",f:false}],
  },
};

// ─── Pattern ───
const IslamicPattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
    <defs><pattern id="islamic-geo-v" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
      <path d="M40 0L80 40L40 80L0 40Z" fill="none" stroke="currentColor" strokeWidth="0.5"/>
      <circle cx="40" cy="40" r="15" fill="none" stroke="currentColor" strokeWidth="0.5"/>
      <path d="M20 20L60 20L60 60L20 60Z" fill="none" stroke="currentColor" strokeWidth="0.3"/>
      <circle cx="40" cy="40" r="28" fill="none" stroke="currentColor" strokeWidth="0.3"/>
    </pattern></defs>
    <rect width="100%" height="100%" fill="url(#islamic-geo-v)"/>
  </svg>
);

// ═══════════════════════════════════════
// ─── MAIN COMPONENT ───
// ═══════════════════════════════════════
export default function ManafaaVideosPage() {
  const { lang, setLang } = useLang();

  useEffect(() => { trackPage("/videos", lang); }, [lang]);
  const [showLM, setShowLM] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mob, setMob] = useState(false);
  const [activeCat, setActiveCat] = useState("all");
  const [activeVideo, setActiveVideo] = useState(null);
  const [dbVids, setDbVids] = useState({});

  const lo = langs.find(l => l.code === lang) || langs[0];
  const dir = lo.dir;
  const ui = T[lang] || T.ar;
  const t = k => ui[k] || T.ar[k] || k;
  const arr = dir === "rtl" ? "←" : "→";
  const cats = CATS[lang] || CATS.en;
  const vids = Object.keys(dbVids).length > 0 ? dbVids : (VIDS[lang] || {});
  const hasVideos = Object.keys(vids).length > 0;

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => { setActiveCat("all"); setActiveVideo(null); }, [lang]);

  // جلب الفيديوهات من Supabase
  useEffect(() => {
    async function fetchVideos() {
      const { data, error } = await supabase
        .from("videos")
        .select(`
          id, video_url, is_featured, sort_order, lang,
          video_categories!inner(slug),
          video_translations(lang, title, description)
        `)
        .eq("lang", lang)
        .order("sort_order");

      if (error || !data) return;

      // تحويل البيانات لنفس بنية VIDS
      const grouped = {};
      data.forEach(v => {
        const cat = v.video_categories?.slug;
        const trans = v.video_translations?.find(t => t.lang === lang) || v.video_translations?.[0] || {};
        const ytId = (() => {
          let u = v.video_url;
          if (!u) return u;
          // Handle double-URL case: youtube.com/watch?v=https://youtu.be/ID
          const vParam = u.match(/[?&]v=([^&]+)/);
          if (vParam) {
            const val = decodeURIComponent(vParam[1]);
            // Check if the v= value is itself a URL
            const innerShort = val.match(/youtu\.be\/([^?&]+)/);
            if (innerShort) return innerShort[1];
            const innerWatch = val.match(/[?&]v=([^&]+)/);
            if (innerWatch) return innerWatch[1];
            // If it looks like a plain ID (no slashes/dots), use it
            if (/^[A-Za-z0-9_-]{8,15}$/.test(val)) return val;
            // Fallback: try to extract ID-like pattern from the value
            const idMatch = val.match(/([A-Za-z0-9_-]{11})/);
            if (idMatch) return idMatch[1];
            return val;
          }
          const sm = u.match(/youtu\.be\/([^?&]+)/); if (sm) return sm[1];
          const em = u.match(/youtube\.com\/embed\/([^?&]+)/); if (em) return em[1];
          // Already an ID
          if (/^[A-Za-z0-9_-]{8,15}$/.test(u)) return u;
          return u;
        })();
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push({
          t: trans.title || "",
          d: trans.description || "",
          f: v.is_featured,
          ytId
        });
      });
      setDbVids(grouped);
    }
    fetchVideos();
  }, [lang]);

  const navItems = [
    { k: "n_home", href: "/" }, { k: "n_vid", href: "/videos" }, { k: "n_quran", href: "/quran" },
    { k: "n_lib", href: "/library" }, { k: "n_hajj", href: "/hajj" }, { k: "n_umrah", href: "/umrah" }, { k: "n_contest", href: "/contest" },
  ];

  // Gather all videos for "all" filter or filter by category
  const getVisibleVideos = () => {
    if (activeCat === "all") {
      return cats.flatMap(cat => (vids[cat.id] || []).map(v => ({ ...v, catId: cat.id, catName: cat.name, catIcon: cat.icon })));
    }
    const cat = cats.find(c => c.id === activeCat);
    return (vids[activeCat] || []).map(v => ({ ...v, catId: activeCat, catName: cat?.name, catIcon: cat?.icon }));
  };

  const visibleVideos = getVisibleVideos();
  const featuredVideos = visibleVideos.filter(v => v.f);

  return (
    <div dir={dir} className="min-h-screen bg-[#FAFBFC]" style={{ fontFamily: "'Tajawal', 'Segoe UI', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&family=Amiri:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --primary: #1B3A4B; --primary-light: #2C5F7C; --primary-dark: #0F2530;
          --gold: #C8A951; --gold-light: #E8D48B; --gold-dark: #9E832E;
          --cream: #FFF9EE; --text: #1a1a2e; --text-light: #6B7280;
        }
        @keyframes fadeInUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        @keyframes slideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shimmer { 0% { background-position:-200% 0; } 100% { background-position:200% 0; } }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-slideDown { animation: slideDown 0.3s ease-out forwards; }
        .glass-nav { background: rgba(27, 58, 75, 0.95); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); }
        .hero-gradient { background: linear-gradient(135deg, #0F2530 0%, #1B3A4B 30%, #2C5F7C 70%, #1B3A4B 100%); }
        .gold-shimmer { background: linear-gradient(90deg, var(--gold-dark), var(--gold), var(--gold-light), var(--gold), var(--gold-dark)); background-size: 200% 100%; animation: shimmer 4s linear infinite; -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .card-hover { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .card-hover:hover { transform: translateY(-8px); box-shadow: 0 25px 50px -12px rgba(27, 58, 75, 0.15); }
        .section-divider { background: linear-gradient(90deg, transparent, var(--gold), transparent); height: 1px; }
        .quran-font { font-family: 'Amiri', serif; }
        .btn-primary { background: linear-gradient(135deg, var(--gold-dark), var(--gold)); transition: all 0.3s ease; }
        .btn-primary:hover { background: linear-gradient(135deg, var(--gold), var(--gold-light)); transform: translateY(-2px); box-shadow: 0 10px 30px rgba(200,169,81,0.3); }
        .nav-item { position: relative; transition: all 0.3s ease; }
        .nav-item::after { content: ''; position: absolute; bottom: -4px; ${dir === "rtl" ? "right" : "left"}: 0; width: 0; height: 2px; background: var(--gold); transition: width 0.3s ease; }
        .nav-item:hover::after { width: 100%; }
        .cat-pill { transition: all 0.3s ease; }
        .cat-pill:hover { transform: translateY(-2px); }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>


      <Navbar />


      {/* ===== HERO SECTION ===== */}
      <section className="hero-gradient relative overflow-hidden" style={{ minHeight: '50vh' }}>
        <IslamicPattern />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center" style={{ minHeight: '50vh' }}>
          <div className="text-center animate-fadeInUp">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-16 sm:w-24" style={{ background: 'var(--gold)' }}></div>
              <span className="text-sm font-medium tracking-widest" style={{ color: 'var(--gold)' }}>{t("page_tag")}</span>
              <div className="h-px w-16 sm:w-24" style={{ background: 'var(--gold)' }}></div>
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black gold-shimmer mb-4" style={{ fontFamily: 'Amiri, serif' }}>
              {t("page_title")}
            </h1>
            <p className="text-base sm:text-lg text-white/60 font-light max-w-2xl mx-auto">
              {t("page_desc")}
            </p>
            {/* Stats strip */}
            <div className="flex items-center justify-center gap-6 sm:gap-10 mt-8">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-black" style={{ color: 'var(--gold)' }}>{hasVideos ? Object.keys(vids).length : 0}</div>
                <div className="text-xs text-white/40">{t("all_cats")}</div>
              </div>
              <div className="w-px h-10" style={{ background: 'rgba(255,255,255,0.1)' }}></div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-black" style={{ color: 'var(--gold)' }}>{visibleVideos.length}</div>
                <div className="text-xs text-white/40">{t("videos_count")}</div>
              </div>
              <div className="w-px h-10" style={{ background: 'rgba(255,255,255,0.1)' }}></div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-black" style={{ color: 'var(--gold)' }}>9</div>
                <div className="text-xs text-white/40">🌍</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CATEGORY TABS ===== */}
      {hasVideos ? (
        <>
        <section className="relative -mt-8 z-20 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {/* "All" tab */}
            <button
              onClick={() => setActiveCat("all")}
              className="cat-pill flex-shrink-0 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{
                background: activeCat === "all" ? 'var(--primary)' : 'transparent',
                color: activeCat === "all" ? 'white' : 'var(--text-light)',
                border: activeCat === "all" ? 'none' : '1px solid #E5E7EB',
              }}
            >
              {t("all_cats")}
            </button>
            {cats.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className="cat-pill flex-shrink-0 flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
                style={{
                  background: activeCat === cat.id ? 'var(--gold)' : 'transparent',
                  color: activeCat === cat.id ? 'var(--primary-dark)' : 'var(--text-light)',
                  border: activeCat === cat.id ? 'none' : '1px solid #E5E7EB',
                }}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED VIDEOS (only on "all") ===== */}
      {activeCat === "all" && featuredVideos.length > 0 && (
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-px w-16 sm:w-24" style={{ background: 'var(--gold)' }}></div>
            <span className="text-sm font-medium tracking-widest" style={{ color: 'var(--gold)' }}>{t("featured")}</span>
            <div className="h-px w-16 sm:w-24" style={{ background: 'var(--gold)' }}></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredVideos.slice(0, 4).map((v, i) => (
              <div key={i} onClick={() => setActiveVideo(v)} className="card-hover group rounded-2xl overflow-hidden bg-white shadow-md cursor-pointer animate-fadeInUp" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="relative h-48 overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--primary-dark), var(--primary))' }}>
                  {v.ytId && <img src={`https://img.youtube.com/vi/${v.ytId}/mqdefault.jpg`} alt={v.t} className="w-full h-full object-cover" onError={e=>{e.target.style.display='none'}} />}
                  {!v.ytId && <span className="text-6xl opacity-20 absolute inset-0 flex items-center justify-center">{v.catIcon}</span>}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300" style={{background:'rgba(0,0,0,0.4)'}}>
                    <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ background: 'var(--gold)' }}>
                      <svg className="w-7 h-7" style={{ marginInlineStart: '3px' }} fill="white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                  </div>
                  <div className={`absolute top-3 ${dir === "rtl" ? "right-3" : "left-3"} px-3 py-1 rounded-full text-xs font-medium text-white`} style={{ background: 'rgba(200, 169, 81, 0.9)' }}>{v.catName}</div>
                  <div className={`absolute top-3 ${dir === "rtl" ? "left-3" : "right-3"} px-2 py-1 rounded-full text-xs font-bold`} style={{ background: 'var(--gold)', color: 'var(--primary-dark)' }}>⭐ {t("featured")}</div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-base leading-relaxed mb-2" style={{ color: 'var(--text)' }}>{v.t}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-light)' }}>{v.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ===== DIVIDER ===== */}
      {activeCat === "all" && <div className="section-divider max-w-xs mx-auto"></div>}

      {/* ===== VIDEOS BY CATEGORY ===== */}
      {activeCat === "all" ? (
        // Show all categories with their videos
        cats.map((cat, ci) => {
          const catVids = vids[cat.id] || [];
          if (catVids.length === 0) return null;
          return (
            <section key={cat.id} className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6">
              {/* Section Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(200, 169, 81, 0.1)' }}>
                  <span className="text-2xl">{cat.icon}</span>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black" style={{ color: 'var(--primary)' }}>{cat.name}</h2>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-light)' }}>{cat.desc}</p>
                </div>
                <div className={`${dir === "rtl" ? "mr-auto" : "ml-auto"} hidden sm:flex`}>
                  <span className="text-sm px-3 py-1 rounded-full" style={{ background: 'rgba(200, 169, 81, 0.1)', color: 'var(--gold-dark)' }}>
                    {catVids.length} {t("videos_count")}
                  </span>
                </div>
              </div>
              {/* Videos Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {catVids.map((v, vi) => (
                  <div key={vi} onClick={() => setActiveVideo({ ...v, catName: cat.name, catIcon: cat.icon })} className="card-hover group rounded-2xl overflow-hidden bg-white shadow-md cursor-pointer">
                    <div className="relative h-44 overflow-hidden" style={{ background: `linear-gradient(135deg, ${vi % 2 === 0 ? 'var(--primary-dark)' : 'var(--primary-light)'}, var(--primary))` }}>
                      {v.ytId && <img src={`https://img.youtube.com/vi/${v.ytId}/mqdefault.jpg`} alt={v.t} className="w-full h-full object-cover" onError={e=>{e.target.style.display='none'}} />}
                      {!v.ytId && <span className="text-5xl opacity-20 absolute inset-0 flex items-center justify-center">{cat.icon}</span>}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300" style={{background:'rgba(0,0,0,0.4)'}}>
                        <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg" style={{ background: 'var(--gold)' }}>
                          <svg className="w-6 h-6" style={{ marginInlineStart: '2px' }} fill="white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        </div>
                      </div>
                      {v.f && <div className={`absolute top-3 ${dir === "rtl" ? "right-3" : "left-3"} px-2 py-1 rounded-full text-xs font-bold`} style={{ background: 'var(--gold)', color: 'var(--primary-dark)' }}>⭐</div>}
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-sm leading-relaxed mb-2" style={{ color: 'var(--text)' }}>{v.t}</h3>
                      <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--text-light)' }}>{v.d}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Divider between categories */}
              {ci < cats.length - 1 && <div className="section-divider max-w-xs mx-auto mt-16"></div>}
            </section>
          );
        })
      ) : (
        // Single category view
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6">
          {(() => {
            const cat = cats.find(c => c.id === activeCat);
            const catVids = vids[activeCat] || [];
            return (
              <>
                <div className="text-center mb-12">
                  <span className="text-5xl block mb-4">{cat?.icon}</span>
                  <h2 className="text-3xl sm:text-4xl font-black" style={{ color: 'var(--primary)' }}>{cat?.name}</h2>
                  <p className="mt-3 text-base" style={{ color: 'var(--text-light)' }}>{cat?.desc}</p>
                  <span className="inline-block mt-3 text-sm px-4 py-1.5 rounded-full" style={{ background: 'rgba(200, 169, 81, 0.1)', color: 'var(--gold-dark)' }}>
                    {catVids.length} {t("videos_count")}
                  </span>
                </div>
                {catVids.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {catVids.map((v, vi) => (
                      <div key={vi} onClick={() => setActiveVideo({ ...v, catName: cat?.name, catIcon: cat?.icon })} className="card-hover group rounded-2xl overflow-hidden bg-white shadow-md cursor-pointer animate-fadeInUp" style={{ animationDelay: `${vi * 0.1}s` }}>
                        <div className="relative h-48 overflow-hidden" style={{ background: `linear-gradient(135deg, ${vi % 2 === 0 ? 'var(--primary-dark)' : 'var(--primary-light)'}, var(--primary))` }}>
                          {v.ytId && <img src={`https://img.youtube.com/vi/${v.ytId}/mqdefault.jpg`} alt={v.t} className="w-full h-full object-cover" onError={e=>{e.target.style.display='none'}} />}
                          {!v.ytId && <span className="text-6xl opacity-20 absolute inset-0 flex items-center justify-center">{cat?.icon}</span>}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300" style={{background:'rgba(0,0,0,0.4)'}}>
                            <div className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg" style={{ background: 'var(--gold)' }}>
                              <svg className="w-7 h-7" style={{ marginInlineStart: '3px' }} fill="white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                            </div>
                          </div>
                          {v.f && <div className={`absolute top-3 ${dir === "rtl" ? "right-3" : "left-3"} px-2.5 py-1 rounded-full text-xs font-bold`} style={{ background: 'var(--gold)', color: 'var(--primary-dark)' }}>⭐ {t("featured")}</div>}
                        </div>
                        <div className="p-5">
                          <h3 className="font-bold text-base leading-relaxed mb-2" style={{ color: 'var(--text)' }}>{v.t}</h3>
                          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-light)' }}>{v.d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <span className="text-5xl block mb-4">📭</span>
                    <p style={{ color: 'var(--text-light)' }}>{t("no_videos")}</p>
                  </div>
                )}
              </>
            );
          })()}
        </section>
      )}

      {/* ===== VIDEO MODAL ===== */}
      {activeVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }} onClick={() => setActiveVideo(null)}>
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-fadeInUp" onClick={e => e.stopPropagation()} style={{ border: '1px solid rgba(200,169,81,0.2)' }}>
            {/* YouTube Player */}
            <div className="relative" style={{ background: '#000' }}>
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.ytId}?autoplay=1&rel=0`}
                width="100%" height="315"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ display: 'block' }}
              />
              <button onClick={() => setActiveVideo(null)} className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-all">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <div className={`absolute bottom-3 ${dir === "rtl" ? "right-3" : "left-3"} px-3 py-1.5 rounded-full text-xs font-medium text-white`} style={{ background: 'rgba(200,169,81,0.9)' }}>
                {activeVideo.catName}
              </div>
            </div>
            {/* Video Info */}
            <div className="p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-black mb-3" style={{ color: 'var(--primary)' }}>{activeVideo.t}</h2>
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--text-light)' }}>{activeVideo.d}</p>
              <a
                href={activeVideo.ytId ? `https://www.youtube.com/watch?v=${activeVideo.ytId}` : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full py-3.5 rounded-xl text-white font-bold text-sm block text-center"
                style={{ textDecoration: 'none' }}
              >
                {t("watch_now")} {arr}
              </a>
            </div>
          </div>
        </div>
      )}

      </>
      ) : (
        /* No videos for this language */
        <section className="py-20 sm:py-28 max-w-3xl mx-auto px-4 sm:px-6 text-center" style={{ marginTop: '-32px' }}>
          <div className="bg-white rounded-3xl shadow-xl p-12" style={{ border: '1px solid rgba(200,169,81,0.15)' }}>
            <span className="text-6xl block mb-6">🎬</span>
            <h3 className="text-xl font-black mb-3" style={{ color: 'var(--primary)' }}>{t("no_videos")}</h3>
          </div>
        </section>
      )}

      {/* ===== FOOTER (matching homepage) ===== */}
      <footer style={{ background: 'var(--primary-dark)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* About */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--gold)', color: 'var(--primary-dark)' }}>
                  <span className="font-bold quran-font">م</span>
                </div>
                <div>
                  <h3 className="text-white font-bold">{t("site_name")}</h3>
                  <p className="text-xs" style={{ color: 'var(--gold)' }}>{t("site_desc")}</p>
                </div>
              </div>
            </div>
            {/* Languages */}
            <div>
              <h4 className="text-white font-bold mb-4">{t("ft_langs")}</h4>
              <div className="flex flex-wrap gap-2">
                {langs.map(l => (
                  <button key={l.code} onClick={() => setLang(l.code)} className="text-xs px-3 py-1.5 rounded-full transition-all"
                    style={{ background: lang === l.code ? 'var(--gold)' : 'rgba(255,255,255,0.05)', color: lang === l.code ? 'var(--primary-dark)' : 'rgba(255,255,255,0.6)', fontWeight: lang === l.code ? 'bold' : 'normal' }}>
                    {l.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p className="text-white/30 text-sm">© {new Date().getFullYear()} {t("ft_copy")}</p>
          </div>
        </div>
      </footer>

      {/* Overlay to close menus */}
      {(showLM || mob) && <div className="fixed inset-0 z-40" onClick={() => { setShowLM(false); setMob(false); }}></div>}
    </div>
  );
}
