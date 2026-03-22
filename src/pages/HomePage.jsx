import { useState, useEffect } from "react";
import { useLang } from "../lib/LangContext";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { supaInsert as supaIns, supabase } from "../lib/supabase";

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

const T = {
  ar:{bismillah:"بسم الله الرحمن الرحيم",site_name:"مشروع منافع",site_desc:"لدعوة الحجاج والمعتمرين",login:"تسجيل الدخول",hero_title:"منافع",hero_sub:"مشروع",n_home:"الرئيسية",n_vid:"الفيديوهات",n_quran:"القرآن الكريم",n_lib:"المكتبة",n_hajj:"الحج",n_umrah:"العمرة",n_contest:"المسابقة",s_vid:"فيديو تعليمي",s_book:"كتاب إسلامي",s_lang:"لغات مدعومة",s_visit:"زائر شهرياً",vid_tag:"فيديوهات مميزة",vid_title:"مكتبة الفيديوهات الإسلامية",vid_desc:"سلسلة متميزة من المحاضرات العلمية والدروس التعليمية",vid_all:"عرض جميع الفيديوهات",q_tag:"القرآن الكريم",q_title:"اقرأ واستمع للقرآن الكريم",q_desc:"قراءة وتلاوة وتفسير بأكثر من 9 لغات",q_browse:"تصفح القرآن الكريم",q_fatiha:"سورة الفاتحة",m_tag:"أدلة المناسك",hu_title:"الحج والعمرة",hu_desc:"دليل شامل خطوة بخطوة لأداء المناسك",h_guide:"دليل الحج",h_gdesc:"رحلة تفاعلية شاملة تأخذك خطوة بخطوة في مناسك الحج، من الإحرام حتى طواف الوداع",h_start:"ابدأ رحلة الحج",u_guide:"دليل العمرة",u_gdesc:"دليل تفاعلي ميسّر لأداء العمرة بالطريقة الصحيحة، مع الأدعية والنصائح العملية",u_start:"ابدأ رحلة العمرة",l_tag:"الكتب الإسلامية",l_title:"المكتبة الإسلامية",l_desc:"مجموعة مختارة من الكتب والرسائل في العلوم الشرعية",l_read:"قراءة الكتاب",l_all:"تصفح المكتبة كاملة",c_tag:"اختبر معلوماتك",c_title:"مسابقة منافع",c_desc:"شارك في المسابقة واربح جوائز قيمة",c_now:"شارك الآن",c_qlabel:"السؤال",f_title:"شاركنا رأيك",f_desc:"رأيك يهمنا لتحسين تجربتك",f_ph:"اكتب تعليقك هنا...",f_send:"إرسال التقييم",f_thx:"شكراً لك! تم إرسال تقييمك بنجاح",ft_links:"روابط سريعة",ft_langs:"اللغات المدعومة",ft_copy:"مشروع منافع — لدعوة الحجاج والمعتمرين. جميع الحقوق محفوظة",ft_about:"منصة إسلامية رقمية تهدف لنفع الحجاج والمعتمرين وعامة المسلمين حول العالم"},
  en:{bismillah:"In the Name of Allah, the Most Gracious, the Most Merciful",site_name:"Manafea Project",site_desc:"For Hajj & Umrah Dawah",login:"Login",hero_title:"Manafea",hero_sub:"Project",n_home:"Home",n_vid:"Videos",n_quran:"Holy Quran",n_lib:"Library",n_hajj:"Hajj",n_umrah:"Umrah",n_contest:"Contest",s_vid:"Educational Videos",s_book:"Islamic Books",s_lang:"Supported Languages",s_visit:"Monthly Visitors",vid_tag:"Featured Videos",vid_title:"Islamic Video Library",vid_desc:"A distinguished series of scientific lectures and educational lessons",vid_all:"View All Videos",q_tag:"Holy Quran",q_title:"Read & Listen to the Holy Quran",q_desc:"Reading, recitation and interpretation in 9+ languages",q_browse:"Browse the Holy Quran",q_fatiha:"Surah Al-Fatiha",m_tag:"Rituals Guides",hu_title:"Hajj & Umrah",hu_desc:"A comprehensive step-by-step guide to performing the rituals",h_guide:"Hajj Guide",h_gdesc:"A comprehensive interactive journey taking you step by step through Hajj rituals",h_start:"Start Hajj Journey",u_guide:"Umrah Guide",u_gdesc:"An easy interactive guide to performing Umrah correctly with duas and practical tips",u_start:"Start Umrah Journey",l_tag:"Islamic Books",l_title:"Islamic Library",l_desc:"A curated collection of books and treatises in Islamic sciences",l_read:"Read Book",l_all:"Browse Full Library",c_tag:"Test Your Knowledge",c_title:"Manafea Contest",c_desc:"Participate and win valuable prizes",c_now:"Participate Now",c_qlabel:"Question",f_title:"Share Your Feedback",f_desc:"Your feedback helps us improve your experience",f_ph:"Write your comment here...",f_send:"Submit Rating",f_thx:"Thank you! Your feedback has been submitted successfully",ft_links:"Quick Links",ft_langs:"Supported Languages",ft_copy:"Manafea Project — For Hajj & Umrah Dawah. All Rights Reserved",ft_about:"A digital Islamic platform aiming to benefit pilgrims and Muslims around the world"},
  tr:{bismillah:"Rahman ve Rahim olan Allah'ın adıyla",site_name:"Menafi Projesi",site_desc:"Hacılar için",login:"Giriş",hero_title:"Menafi",hero_sub:"Proje",n_home:"Ana Sayfa",n_vid:"Videolar",n_quran:"Kur'an",n_lib:"Kütüphane",n_hajj:"Hac",n_umrah:"Umre",n_contest:"Yarışma",s_vid:"Eğitim Videosu",s_book:"İslami Kitap",s_lang:"Desteklenen Dil",s_visit:"Aylık Ziyaretçi",vid_tag:"Öne Çıkan",vid_title:"İslami Video Kütüphanesi",vid_desc:"Seçkin ilmi dersler",vid_all:"Tüm Videoları Gör",q_tag:"Kur'an-ı Kerim",q_title:"Kur'an'ı Okuyun ve Dinleyin",q_desc:"9+ dilde okuma ve tefsir",q_browse:"Kur'an'ı İnceleyin",q_fatiha:"Fatiha Suresi",m_tag:"İbadet Rehberleri",hu_title:"Hac ve Umre",hu_desc:"Adım adım rehber",h_guide:"Hac Rehberi",h_gdesc:"Hac ibadetlerinde adım adım rehberlik",h_start:"Hac Yolculuğuna Başla",u_guide:"Umre Rehberi",u_gdesc:"Umre'yi doğru yapma rehberi",u_start:"Umre Yolculuğuna Başla",l_tag:"İslami Kitaplar",l_title:"İslami Kütüphane",l_desc:"Seçme kitap koleksiyonu",l_read:"Kitabı Oku",l_all:"Tüm Kütüphane",c_tag:"Bilgini Test Et",c_title:"Menafi Yarışması",c_desc:"Katılın ve ödüller kazanın",c_now:"Şimdi Katıl",c_qlabel:"Soru",f_title:"Görüşünüzü Paylaşın",f_desc:"Görüşünüz bize yardımcı olur",f_ph:"Yorumunuzu yazın...",f_send:"Gönder",f_thx:"Teşekkürler!",ft_links:"Hızlı Bağlantılar",ft_langs:"Desteklenen Diller",ft_copy:"Menafi Projesi — Tüm Hakları Saklıdır",ft_about:"Hacılar için dijital İslami platform"},
  ur:{bismillah:"اللہ کے نام سے",site_name:"منافع پروجیکٹ",site_desc:"حاجیوں کی دعوت",login:"لاگ ان",hero_title:"منافع",hero_sub:"پروجیکٹ",n_home:"ہوم",n_vid:"ویڈیوز",n_quran:"قرآن کریم",n_lib:"لائبریری",n_hajj:"حج",n_umrah:"عمرہ",n_contest:"مقابلہ",s_vid:"تعلیمی ویڈیوز",s_book:"اسلامی کتابیں",s_lang:"معاون زبانیں",s_visit:"ماہانہ زائرین",vid_tag:"نمایاں ویڈیوز",vid_title:"اسلامی ویڈیو لائبریری",vid_desc:"علمی محاضرات",vid_all:"تمام ویڈیوز",q_tag:"قرآن کریم",q_title:"قرآن پڑھیں",q_desc:"9+ زبانوں میں",q_browse:"قرآن براؤز کریں",q_fatiha:"سورۃ الفاتحہ",m_tag:"مناسک گائیڈ",hu_title:"حج اور عمرہ",hu_desc:"مکمل گائیڈ",h_guide:"حج گائیڈ",h_gdesc:"حج کے مناسک",h_start:"حج شروع کریں",u_guide:"عمرہ گائیڈ",u_gdesc:"عمرہ گائیڈ",u_start:"عمرہ شروع کریں",l_tag:"اسلامی کتابیں",l_title:"اسلامی لائبریری",l_desc:"منتخب کتابیں",l_read:"پڑھیں",l_all:"پوری لائبریری",c_tag:"معلومات جانچیں",c_title:"منافع مقابلہ",c_desc:"حصہ لیں اور جیتیں",c_now:"شرکت کریں",c_qlabel:"سوال",f_title:"رائے دیں",f_desc:"آپ کی رائے اہم ہے",f_ph:"تبصرہ لکھیں...",f_send:"بھیجیں",f_thx:"شکریہ!",ft_links:"فوری لنکس",ft_langs:"زبانیں",ft_copy:"منافع پروجیکٹ",ft_about:"حاجیوں کے لیے ڈیجیٹل پلیٹ فارم"},
  ms:{bismillah:"Dengan nama Allah",site_name:"Projek Manafea",site_desc:"Dakwah Haji & Umrah",login:"Log Masuk",hero_title:"Manafea",hero_sub:"Projek",n_home:"Utama",n_vid:"Video",n_quran:"Al-Quran",n_lib:"Perpustakaan",n_hajj:"Haji",n_umrah:"Umrah",n_contest:"Pertandingan",s_vid:"Video Pendidikan",s_book:"Buku Islam",s_lang:"Bahasa",s_visit:"Pelawat",vid_tag:"Video Pilihan",vid_title:"Perpustakaan Video Islam",vid_desc:"Kuliah ilmiah terpilih",vid_all:"Lihat Semua",q_tag:"Al-Quran",q_title:"Baca & Dengar Al-Quran",q_desc:"9+ bahasa",q_browse:"Layari Al-Quran",q_fatiha:"Surah Al-Fatihah",m_tag:"Panduan Manasik",hu_title:"Haji & Umrah",hu_desc:"Panduan lengkap",h_guide:"Panduan Haji",h_gdesc:"Panduan langkah demi langkah",h_start:"Mulakan Haji",u_guide:"Panduan Umrah",u_gdesc:"Panduan Umrah",u_start:"Mulakan Umrah",l_tag:"Buku Islam",l_title:"Perpustakaan Islam",l_desc:"Koleksi buku",l_read:"Baca",l_all:"Semua",c_tag:"Uji Pengetahuan",c_title:"Pertandingan Manafea",c_desc:"Sertai dan menang",c_now:"Sertai",c_qlabel:"Soalan",f_title:"Maklum Balas",f_desc:"Pendapat anda penting",f_ph:"Tulis ulasan...",f_send:"Hantar",f_thx:"Terima kasih!",ft_links:"Pautan",ft_langs:"Bahasa",ft_copy:"Projek Manafea",ft_about:"Platform Islam digital"},
  fr:{bismillah:"Au nom d'Allah",site_name:"Projet Manafea",site_desc:"Dawah Hajj & Omra",login:"Connexion",hero_title:"Manafea",hero_sub:"Projet",n_home:"Accueil",n_vid:"Vidéos",n_quran:"Le Saint Coran",n_lib:"Bibliothèque",n_hajj:"Hajj",n_umrah:"Omra",n_contest:"Concours",s_vid:"Vidéos",s_book:"Livres",s_lang:"Langues",s_visit:"Visiteurs",vid_tag:"Vidéos",vid_title:"Bibliothèque Vidéo",vid_desc:"Conférences islamiques",vid_all:"Voir tout",q_tag:"Le Coran",q_title:"Lisez le Coran",q_desc:"9+ langues",q_browse:"Parcourir",q_fatiha:"Al-Fatiha",m_tag:"Guides",hu_title:"Hajj & Omra",hu_desc:"Guide complet",h_guide:"Guide Hajj",h_gdesc:"Guide étape par étape",h_start:"Commencer",u_guide:"Guide Omra",u_gdesc:"Guide Omra",u_start:"Commencer",l_tag:"Livres",l_title:"Bibliothèque",l_desc:"Collection",l_read:"Lire",l_all:"Tout voir",c_tag:"Quiz",c_title:"Concours",c_desc:"Participez et gagnez",c_now:"Participer",c_qlabel:"Question",f_title:"Feedback",f_desc:"Votre avis",f_ph:"Commentaire...",f_send:"Envoyer",f_thx:"Merci!",ft_links:"Liens",ft_langs:"Langues",ft_copy:"Projet Manafea",ft_about:"Plateforme islamique"},
  fa:{bismillah:"به نام خداوند",site_name:"پروژه منافع",site_desc:"دعوت حاجیان",login:"ورود",hero_title:"منافع",hero_sub:"پروژه",n_home:"خانه",n_vid:"ویدیوها",n_quran:"قرآن",n_lib:"کتابخانه",n_hajj:"حج",n_umrah:"عمره",n_contest:"مسابقه",s_vid:"ویدیو",s_book:"کتاب",s_lang:"زبان",s_visit:"بازدید",vid_tag:"ویدیوهای ویژه",vid_title:"کتابخانه ویدیو",vid_desc:"سخنرانی‌های علمی",vid_all:"همه ویدیوها",q_tag:"قرآن",q_title:"قرآن بخوانید",q_desc:"9+ زبان",q_browse:"مرور",q_fatiha:"سوره فاتحه",m_tag:"راهنمای مناسک",hu_title:"حج و عمره",hu_desc:"راهنمای کامل",h_guide:"راهنمای حج",h_gdesc:"راهنمای گام به گام",h_start:"شروع",u_guide:"راهنمای عمره",u_gdesc:"راهنمای عمره",u_start:"شروع",l_tag:"کتاب‌ها",l_title:"کتابخانه",l_desc:"مجموعه کتاب",l_read:"خواندن",l_all:"همه",c_tag:"مسابقه",c_title:"مسابقه منافع",c_desc:"شرکت کنید",c_now:"شرکت",c_qlabel:"سؤال",f_title:"نظر شما",f_desc:"نظرتان مهم است",f_ph:"نظر بنویسید...",f_send:"ارسال",f_thx:"ممنون!",ft_links:"لینک‌ها",ft_langs:"زبان‌ها",ft_copy:"پروژه منافع",ft_about:"پلتفرم اسلامی"},
  bn:{bismillah:"আল্লাহর নামে",site_name:"মানাফেয়া",site_desc:"হজ্জ দাওয়াহ",login:"লগইন",hero_title:"মানাফেয়া",hero_sub:"প্রকল্প",n_home:"হোম",n_vid:"ভিডিও",n_quran:"কুরআন",n_lib:"লাইব্রেরি",n_hajj:"হজ্জ",n_umrah:"উমরাহ",n_contest:"প্রতিযোগিতা",s_vid:"ভিডিও",s_book:"বই",s_lang:"ভাষা",s_visit:"দর্শক",vid_tag:"বৈশিষ্ট্য",vid_title:"ইসলামিক ভিডিও",vid_desc:"বৈজ্ঞানিক বক্তৃতা",vid_all:"সব দেখুন",q_tag:"কুরআন",q_title:"কুরআন পড়ুন",q_desc:"9+ ভাষা",q_browse:"ব্রাউজ",q_fatiha:"সূরা ফাতিহা",m_tag:"গাইড",hu_title:"হজ্জ ও উমরাহ",hu_desc:"সম্পূর্ণ গাইড",h_guide:"হজ্জ গাইড",h_gdesc:"ধাপে ধাপে গাইড",h_start:"শুরু করুন",u_guide:"উমরাহ গাইড",u_gdesc:"উমরাহ গাইড",u_start:"শুরু করুন",l_tag:"বই",l_title:"লাইব্রেরি",l_desc:"বই সংগ্রহ",l_read:"পড়ুন",l_all:"সব",c_tag:"কুইজ",c_title:"প্রতিযোগিতা",c_desc:"অংশ নিন",c_now:"অংশ নিন",c_qlabel:"প্রশ্ন",f_title:"মতামত",f_desc:"আপনার মতামত",f_ph:"মন্তব্য...",f_send:"পাঠান",f_thx:"ধন্যবাদ!",ft_links:"লিঙ্ক",ft_langs:"ভাষা",ft_copy:"মানাফেয়া",ft_about:"ইসলামিক প্ল্যাটফর্ম"},
  hi:{bismillah:"अल्लाह के नाम से",site_name:"मनाफ़ेआ",site_desc:"हज दावत",login:"लॉगिन",hero_title:"मनाफ़ेआ",hero_sub:"प्रोजेक्ट",n_home:"होम",n_vid:"वीडियो",n_quran:"कुरान",n_lib:"पुस्तकालय",n_hajj:"हज",n_umrah:"उमरा",n_contest:"प्रतियोगिता",s_vid:"वीडियो",s_book:"किताब",s_lang:"भाषा",s_visit:"आगंतुक",vid_tag:"विशेष",vid_title:"इस्लामी वीडियो",vid_desc:"वैज्ञानिक व्याख्यान",vid_all:"सभी देखें",q_tag:"कुरान",q_title:"कुरान पढ़ें",q_desc:"9+ भाषाएं",q_browse:"ब्राउज़",q_fatiha:"सूरह फ़ातिहा",m_tag:"गाइड",hu_title:"हज और उमरा",hu_desc:"पूरी गाइड",h_guide:"हज गाइड",h_gdesc:"चरण-दर-चरण",h_start:"शुरू करें",u_guide:"उमरा गाइड",u_gdesc:"उमरा गाइड",u_start:"शुरू करें",l_tag:"किताबें",l_title:"पुस्तकालय",l_desc:"किताब संग्रह",l_read:"पढ़ें",l_all:"सभी",c_tag:"क्विज़",c_title:"प्रतियोगिता",c_desc:"भाग लें",c_now:"भाग लें",c_qlabel:"प्रश्न",f_title:"राय",f_desc:"आपकी राय",f_ph:"टिप्पणी...",f_send:"भेजें",f_thx:"धन्यवाद!",ft_links:"लिंक",ft_langs:"भाषाएं",ft_copy:"मनाफ़ेआ",ft_about:"इस्लामी प्लेटफ़ॉर्म"},
};

const SL = {
  ar:[{a:"﴿ لِيَشْهَدُوا مَنَافِعَ لَهُمْ وَيَذْكُرُوا اسْمَ اللَّهِ فِي أَيَّامٍ مَعْلُومَاتٍ ﴾",s:"سورة الحج ٢٨"},{a:"﴿ وَلِلَّهِ عَلَى النَّاسِ حِجُّ الْبَيْتِ مَنِ اسْتَطَاعَ إِلَيْهِ سَبِيلًا ﴾",s:"آل عمران ٩٧"},{a:"﴿ وَأَتِمُّوا الْحَجَّ وَالْعُمْرَةَ لِلَّهِ ﴾",s:"البقرة ١٩٦"}],
  en:[{a:"That they may witness benefits for themselves and mention the name of Allah on known days",s:"Al-Hajj 28"},{a:"And to Allah from the people is a pilgrimage to the House for whoever is able",s:"Aal-e-Imran 97"},{a:"And complete the Hajj and Umrah for Allah",s:"Al-Baqarah 196"}],
  tr:[{a:"Kendilerine ait menfaatlere şahit olsunlar",s:"Hac 28"},{a:"Beyt'i haccetmesi Allah'ın insanlar üzerindeki hakkıdır",s:"Âl-i İmran 97"},{a:"Haccı ve umreyi Allah için tamamlayın",s:"Bakara 196"}],
  ur:[{a:"﴿ تاکہ وہ اپنے فائدے دیکھیں ﴾",s:"الحج ٢٨"},{a:"﴿ اللہ کے لیے بیت اللہ کا حج فرض ہے ﴾",s:"آل عمران ٩٧"},{a:"﴿ حج اور عمرہ اللہ کے لیے پورے کرو ﴾",s:"البقرۃ ١٩٦"}],
  ms:[{a:"Supaya mereka menyaksikan manfaat bagi mereka",s:"Al-Hajj 28"},{a:"Allah mewajibkan manusia mengerjakan haji",s:"Ali Imran 97"},{a:"Sempurnakanlah ibadah haji dan umrah",s:"Al-Baqarah 196"}],
  fr:[{a:"Pour témoigner des bienfaits",s:"Al-Hajj 28"},{a:"C'est un devoir envers Allah",s:"Al Imran 97"},{a:"Accomplissez le Hajj et la Omra",s:"Al-Baqarah 196"}],
  fa:[{a:"﴿ تا منافعی را برای خود شاهد باشند ﴾",s:"حج ٢٨"},{a:"﴿ حج خانه بر مردم واجب است ﴾",s:"آل عمران ٩٧"},{a:"﴿ حج و عمره را برای خدا تمام کنید ﴾",s:"بقره ١٩٦"}],
  bn:[{a:"যাতে তারা তাদের কল্যাণ প্রত্যক্ষ করে",s:"আল-হাজ্জ ২৮"},{a:"হজ্জ ফরজ যারা সামর্থ্য রাখে তাদের উপর",s:"আলে ইমরান ৯৭"},{a:"হজ্জ ও উমরাহ পূর্ণ করো",s:"আল-বাকারাহ ১৯৬"}],
  hi:[{a:"ताकि वे अपने लाभ देखें",s:"अल-हज्ज 28"},{a:"हज फ़र्ज़ है जो सामर्थ्य रखते हैं",s:"आले इमरान 97"},{a:"हज और उमरा को अल्लाह के लिए पूरा करो",s:"अल-बक़रह 196"}],
};

const VD = {
  ar:[{t:"أركان الإسلام الخمسة",c:"عقيدة",e:"☪️"},{t:"صفة الوضوء الصحيحة",c:"فقه",e:"💧"},{t:"تفسير سورة الفاتحة",c:"تفسير",e:"📖"},{t:"سيرة النبي ﷺ",c:"سيرة",e:"✨"}],
  en:[{t:"Five Pillars of Islam",c:"Creed",e:"☪️"},{t:"How to Perform Wudu",c:"Fiqh",e:"💧"},{t:"Tafseer of Al-Fatiha",c:"Tafseer",e:"📖"},{t:"Biography of the Prophet ﷺ",c:"Seerah",e:"✨"}],
  tr:[{t:"İslam'ın Beş Şartı",c:"Akaid",e:"☪️"},{t:"Abdest Nasıl Alınır",c:"Fıkıh",e:"💧"},{t:"Fatiha Tefsiri",c:"Tefsir",e:"📖"},{t:"Hz. Peygamber'in Hayatı",c:"Siyer",e:"✨"}],
  ur:[{t:"اسلام کے پانچ ارکان",c:"عقیدہ",e:"☪️"},{t:"وضو کا طریقہ",c:"فقہ",e:"💧"},{t:"تفسیر فاتحہ",c:"تفسیر",e:"📖"},{t:"سیرت النبی ﷺ",c:"سیرت",e:"✨"}],
  ms:[{t:"Lima Rukun Islam",c:"Akidah",e:"☪️"},{t:"Cara Berwuduk",c:"Fiqh",e:"💧"},{t:"Tafsir Al-Fatihah",c:"Tafsir",e:"📖"},{t:"Sirah Nabi ﷺ",c:"Sirah",e:"✨"}],
  fr:[{t:"Les Cinq Piliers",c:"Akida",e:"☪️"},{t:"Ablutions",c:"Fiqh",e:"💧"},{t:"Tafsir Al-Fatiha",c:"Tafsir",e:"📖"},{t:"Biographie du Prophète",c:"Sira",e:"✨"}],
  fa:[{t:"پنج رکن اسلام",c:"عقیده",e:"☪️"},{t:"طریقه وضو",c:"فقه",e:"💧"},{t:"تفسیر فاتحه",c:"تفسیر",e:"📖"},{t:"سیره نبوی",c:"سیره",e:"✨"}],
  bn:[{t:"ইসলামের পাঁচ স্তম্ভ",c:"আকিদা",e:"☪️"},{t:"ওযুর নিয়ম",c:"ফিকহ",e:"💧"},{t:"ফাতিহার তাফসীর",c:"তাফসীর",e:"📖"},{t:"নবীর জীবনী",c:"সিরাহ",e:"✨"}],
  hi:[{t:"इस्लाम के पाँच स्तंभ",c:"अकीदा",e:"☪️"},{t:"वज़ू का तरीका",c:"फ़िक़ह",e:"💧"},{t:"फ़ातिहा की तफ़सीर",c:"तफ़सीर",e:"📖"},{t:"नबी की जीवनी",c:"सीरत",e:"✨"}],
};

const BK = {
  ar:[{t:"رياض الصالحين",a:"النووي"},{t:"فقه السنة",a:"سيد سابق"},{t:"زاد المعاد",a:"ابن القيم"},{t:"صحيح البخاري",a:"البخاري"},{t:"تفسير ابن كثير",a:"ابن كثير"}],
  en:[{t:"Riyadh Al-Saliheen",a:"Al-Nawawi"},{t:"Fiqh Al-Sunnah",a:"Sayyid Sabiq"},{t:"Zad Al-Maad",a:"Ibn Al-Qayyim"},{t:"Sahih Al-Bukhari",a:"Al-Bukhari"},{t:"Tafseer Ibn Katheer",a:"Ibn Katheer"}],
  tr:[{t:"Riyazüs Salihin",a:"Nevevi"},{t:"Fıkhu's-Sünne",a:"Seyyid Sabık"},{t:"Zadü'l-Mead",a:"İbn Kayyim"},{t:"Sahih-i Buhari",a:"Buhari"},{t:"İbn Kesir Tefsiri",a:"İbn Kesir"}],
  ur:[{t:"ریاض الصالحین",a:"نووی"},{t:"فقہ السنۃ",a:"سید سابق"},{t:"زاد المعاد",a:"ابن القیم"},{t:"صحیح بخاری",a:"بخاری"},{t:"تفسیر ابن کثیر",a:"ابن کثیر"}],
  ms:[{t:"Riyadhus Salihin",a:"Al-Nawawi"},{t:"Fiqh Al-Sunnah",a:"Sayyid Sabiq"},{t:"Zad Al-Maad",a:"Ibn Qayyim"},{t:"Sahih Bukhari",a:"Al-Bukhari"},{t:"Tafsir Ibn Kathir",a:"Ibn Kathir"}],
  fr:[{t:"Riyad Al-Saliheen",a:"Al-Nawawi"},{t:"Fiqh de la Sunna",a:"Sayyid Sabiq"},{t:"Zad Al-Maad",a:"Ibn Qayyim"},{t:"Sahih Al-Bukhari",a:"Al-Bukhari"},{t:"Tafsir Ibn Kathir",a:"Ibn Kathir"}],
  fa:[{t:"ریاض الصالحین",a:"نووی"},{t:"فقه السنه",a:"سید سابق"},{t:"زادالمعاد",a:"ابن قیم"},{t:"صحیح بخاری",a:"بخاری"},{t:"تفسیر ابن کثیر",a:"ابن کثیر"}],
  bn:[{t:"রিয়াদুস সালেহীন",a:"আন-নাওয়াওয়ী"},{t:"ফিকহুস সুন্নাহ",a:"সাইয়্যেদ সাবিক"},{t:"যাদুল মাআদ",a:"ইবনুল কাইয়্যিম"},{t:"সহীহ বুখারী",a:"বুখারী"},{t:"তাফসীর ইবন কাসীর",a:"ইবন কাসীর"}],
  hi:[{t:"रियाद अल-सालिहीन",a:"अल-नवावी"},{t:"फ़िक़्ह अल-सुन्नह",a:"सय्यिद साबिक़"},{t:"ज़ाद अल-मआद",a:"इब्न अल-क़य्यिम"},{t:"सहीह अल-बुख़ारी",a:"अल-बुख़ारी"},{t:"तफ़सीर इब्न कसीर",a:"इब्न कसीर"}],
};

const CQ = {
  ar:[{q:"ما أعظم أركان الحج؟",a:"الطواف",b:"السعي",c:"الوقوف بعرفة",x:"c"}],
  en:[{q:"What is the greatest pillar of Hajj?",a:"Tawaf",b:"Sa'i",c:"Standing at Arafah",x:"c"}],
  tr:[{q:"Haccın en büyük rüknü nedir?",a:"Tavaf",b:"Say",c:"Arafat vakfesi",x:"c"}],
  ur:[{q:"حج کا سب سے بڑا رکن؟",a:"طواف",b:"سعی",c:"وقوف عرفہ",x:"c"}],
  ms:[{q:"Rukun Haji terbesar?",a:"Tawaf",b:"Saie",c:"Wukuf Arafah",x:"c"}],
  fr:[{q:"Le plus grand pilier du Hajj?",a:"Tawaf",b:"Sa'i",c:"Station à Arafat",x:"c"}],
  fa:[{q:"بزرگترین رکن حج؟",a:"طواف",b:"سعی",c:"وقوف عرفات",x:"c"}],
  bn:[{q:"হজ্জের সবচেয়ে বড় রুকন?",a:"তাওয়াফ",b:"সাঈ",c:"আরাফায় অবস্থান",x:"c"}],
  hi:[{q:"हज का सबसे बड़ा रुक्न?",a:"तवाफ़",b:"सई",c:"अरफ़ात में ठहरना",x:"c"}],
};

const IP = () => (
  <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
    <defs><pattern id="ip" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
      <path d="M40 0L80 40L40 80L0 40Z" fill="none" stroke="currentColor" strokeWidth="0.5"/>
      <circle cx="40" cy="40" r="15" fill="none" stroke="currentColor" strokeWidth="0.5"/>
    </pattern></defs>
    <rect width="100%" height="100%" fill="url(#ip)"/>
  </svg>
);

export default function ManafaaHomepage() {
  const navigate = useNavigate();
  const { lang, setLang } = useLang();
  const [slide, setSlide] = useState(0);
  const [rat, setRat] = useState(0);
  const [hRat, setHRat] = useState(0);
  const [cmt, setCmt] = useState("");
  const [sent, setSent] = useState(false);
  const [dbVids, setDbVids] = useState([]);
  const [dbBooks, setDbBooks] = useState([]);

  // جلب الفيديوهات المميزة والكتب من Supabase
  useEffect(() => {
    // فيديوهات مميزة
    supabase
      .from("videos")
      .select(`id, video_url, lang, category_id, video_translations(lang,title), video_categories(slug, video_category_translations(lang,name))`)
      .eq("lang", lang)
      .eq("is_featured", true)
      .order("sort_order")
      .limit(4)
      .then(({ data }) => {
        if (data?.length) {
          setDbVids(data.map(v => {
            const trans = v.video_translations?.find(t => t.lang === lang) || v.video_translations?.[0] || {};
            const catTrans = v.video_categories?.video_category_translations?.find(t => t.lang === lang) || v.video_categories?.video_category_translations?.[0] || {};
            const ytId = v.video_url?.includes("watch?v=") ? v.video_url.split("watch?v=")[1] : v.video_url;
            return { t: trans.title || "", c: catTrans.name || "", ytId };
          }));
        } else { setDbVids([]); }
      });
    // كتب
    supabase
      .from("books")
      .select(`id, cover_url, pages, lang, book_translations(lang,title,author)`)
      .eq("lang", lang)
      .order("sort_order")
      .limit(4)
      .then(({ data }) => {
        if (data?.length) {
          setDbBooks(data.map(b => {
            const trans = b.book_translations?.find(t => t.lang === lang) || b.book_translations?.[0] || {};
            return { t: trans.title || "", a: trans.author || "", cover: b.cover_url || "" };
          }));
        } else { setDbBooks([]); }
      });
  }, [lang]);

  const lo = langs.find(l => l.code === lang) || langs[0];
  const dir = lo.dir;
  const ui = T[lang] || T.ar;
  const t = k => ui[k] || T.ar[k] || k;
  const arr = dir === "rtl" ? "←" : "→";
  const slides = SL[lang] || SL.ar;
  const vids = dbVids;
  const books = dbBooks;
  const cq = (CQ[lang] || CQ.ar)[0];

  const nav = [
    {k:"n_home", h:"/"},
    {k:"n_vid",  h:"/videos"},
    {k:"n_quran",h:"/quran"},
    {k:"n_lib",  h:"/library"},
    {k:"n_hajj", h:"/hajj"},
    {k:"n_umrah",h:"/umrah"},
    {k:"n_contest",h:"/contest"},
  ];

  useEffect(() => { setSlide(0); }, [lang]);
  useEffect(() => {
    const i = setInterval(() => setSlide(p => (p + 1) % 3), 6000);
    return () => clearInterval(i);
  }, [lang]);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const doFeedback = async () => {
    if (!rat) return;
    await supaIns("feedback", { rating: rat, comment: cmt || null, lang });
    setSent(true); setRat(0); setCmt("");
    setTimeout(() => setSent(false), 3000);
  };

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&family=Amiri:wght@400;700&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    :root{--p:#1B3A4B;--pl:#2C5F7C;--pd:#0F2530;--g:#C8A951;--gl:#E8D48B;--gd:#9E832E;--cr:#FFF9EE;--tx:#1a1a2e;--tl:#6B7280}
    @keyframes fu{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
    @keyframes sd{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fl{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
    @keyframes sh{0%{background-position:-200% 0}100%{background-position:200% 0}}
    @keyframes rs{from{transform:rotate(0)}to{transform:rotate(360deg)}}
    @keyframes ae{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
    .afu{animation:fu .8s ease-out forwards}
    .asd{animation:sd .3s ease-out forwards}
    .afl{animation:fl 4s ease-in-out infinite}
    .aae{animation:ae .8s ease-out forwards}
    .gn{background:rgba(27,58,75,.95);backdrop-filter:blur(20px)}
    .hg{background:linear-gradient(135deg,#0F2530 0%,#1B3A4B 30%,#2C5F7C 70%,#1B3A4B 100%)}
    .gs{background:linear-gradient(90deg,var(--gd),var(--g),var(--gl),var(--g),var(--gd));background-size:200% 100%;animation:sh 4s linear infinite;-webkit-background-clip:text;-webkit-text-fill-color:transparent}
    .ch{transition:all .4s cubic-bezier(.4,0,.2,1)}
    .ch:hover{transform:translateY(-8px);box-shadow:0 25px 50px -12px rgba(27,58,75,.15)}
    .sd2{background:linear-gradient(90deg,transparent,var(--g),transparent);height:1px}
    .qf{font-family:'Amiri',serif}
    .bp{background:linear-gradient(135deg,var(--gd),var(--g));transition:all .3s ease;cursor:pointer;border:none}
    .bp:hover{background:linear-gradient(135deg,var(--g),var(--gl));transform:translateY(-2px);box-shadow:0 10px 30px rgba(200,169,81,.3)}
    .ni{position:relative;transition:all .3s;text-decoration:none}
    .sr{cursor:pointer;transition:all .2s;background:none;border:none}
    .sr:hover{transform:scale(1.2)}
  `;

  return (
    <div dir={dir} className="min-h-screen" style={{fontFamily:"'Tajawal','Segoe UI',sans-serif",background:'#FAFBFC'}}>
      <style>{CSS}</style>

      <Navbar />


      {/* Hero */}
      <section className="hg relative overflow-hidden" style={{minHeight:'85vh'}}>
        <IP/>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center" style={{minHeight:'85vh'}}>
          <div className="mb-8 afu" style={{animationDelay:'.2s'}}>
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full flex items-center justify-center relative" style={{background:'rgba(200,169,81,.1)',border:'2px solid rgba(200,169,81,.3)'}}>
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full flex items-center justify-center" style={{background:'rgba(200,169,81,.15)'}}>
                <span className="text-4xl sm:text-5xl font-black qf" style={{color:'var(--g)'}}>{t("hero_title")}</span>
              </div>
            </div>
          </div>

          <div className="text-center mb-6 afu" style={{animationDelay:'.4s'}}>
            <h2 className="text-lg sm:text-xl font-light text-white/70 mb-2">{t("hero_sub")}</h2>
            <h1 className="text-4xl sm:text-6xl font-black gs mb-3 qf">{t("hero_title")}</h1>
            <p className="text-base sm:text-lg text-white/60">{t("site_desc")}</p>
          </div>

          {/* Quran verse slider */}
          <div className="w-full max-w-4xl mb-12 afu" style={{animationDelay:'.6s'}}>
            <div className="relative rounded-2xl p-6 sm:p-10" style={{background:'rgba(255,255,255,.03)',border:'1px solid rgba(200,169,81,.15)'}}>
              <div key={`${lang}-${slide}`} className="text-center aae">
                <p className="text-xl sm:text-2xl leading-loose qf" style={{color:'var(--gl)'}}>{slides[slide]?.a}</p>
                <p className="mt-4 text-sm text-white/40">{slides[slide]?.s}</p>
              </div>
              <div className="flex justify-center gap-2 mt-6">
                {slides.map((_,i) => (
                  <button key={i} onClick={() => setSlide(i)} className="h-2 rounded-full transition-all duration-300" style={{background:i===slide?'var(--g)':'rgba(255,255,255,.2)',width:i===slide?'24px':'8px',border:'none',cursor:'pointer'}}/>
                ))}
              </div>
            </div>
          </div>

          {/* Quick nav icons — كل زر يذهب لصفحته */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 w-full max-w-3xl afu" style={{animationDelay:'.8s'}}>
            {[
              {i:"🎬",k:"n_vid",  to:"/videos"},
              {i:"📖",k:"n_quran",to:"/quran"},
              {i:"📚",k:"n_lib",  to:"/library"},
              {i:"🕋",k:"n_hajj", to:"/hajj"},
              {i:"🕌",k:"n_umrah",to:"/umrah"},
              {i:"🏆",k:"n_contest",to:"/contest"},
            ].map((x,i) => (
              <button key={i} onClick={() => navigate(x.to)} className="flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl transition-all hover:scale-105" style={{background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.08)',cursor:'pointer'}}>
                <span className="text-2xl sm:text-3xl">{x.i}</span>
                <span className="text-xs sm:text-sm text-white/70">{t(x.k)}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative -mt-12 z-20 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[{n:"500+",k:"s_vid",i:"🎬"},{n:"200+",k:"s_book",i:"📚"},{n:"9",k:"s_lang",i:"🌍"},{n:"50K+",k:"s_visit",i:"👥"}].map((s,i) => (
            <div key={i} className="text-center">
              <span className="text-3xl mb-2 block">{s.i}</span>
              <div className="text-2xl sm:text-3xl font-black" style={{color:'var(--p)'}}>{s.n}</div>
              <div className="text-sm mt-1" style={{color:'var(--tl)'}}>{t(s.k)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Videos section */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-16 sm:w-24" style={{background:'var(--g)'}}></div>
            <span className="text-sm font-medium tracking-widest" style={{color:'var(--g)'}}>{t("vid_tag")}</span>
            <div className="h-px w-16 sm:w-24" style={{background:'var(--g)'}}></div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black" style={{color:'var(--p)'}}>{t("vid_title")}</h2>
          <p className="mt-3 text-base" style={{color:'var(--tl)'}}>{t("vid_desc")}</p>
        </div>

        {/* Video cards — كل كارد ينقل لصفحة الفيديوهات */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {vids.map((v,i) => (
            <div key={i} onClick={() => navigate("/videos")} className="ch group rounded-2xl overflow-hidden bg-white shadow-md" style={{cursor:'pointer'}}>
              <div className="relative h-48 overflow-hidden" style={{background:'var(--p)'}}>
                {v.ytId
                  ? <img src={`https://img.youtube.com/vi/${v.ytId}/mqdefault.jpg`} alt={v.t} className="w-full h-full object-cover" onError={e=>{e.target.style.display='none'}} />
                  : <span className="text-6xl opacity-30 absolute inset-0 flex items-center justify-center">{v.e||"🎬"}</span>
                }
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300" style={{background:'rgba(0,0,0,0.4)'}}>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg" style={{background:'var(--g)'}}>
                    <svg className="w-6 h-6" style={{marginInlineStart:'2px'}} fill="white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
                <div className={`absolute top-3 ${dir==="rtl"?"right-3":"left-3"} px-3 py-1 rounded-full text-xs font-medium text-white`} style={{background:'rgba(200,169,81,.9)'}}>{v.c}</div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-sm leading-relaxed" style={{color:'var(--tx)'}}>{v.t}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* "View all" button — ينقل لصفحة الفيديوهات */}
        <div className="text-center mt-10">
          <button onClick={() => navigate("/videos")} className="bp px-8 py-3 rounded-xl text-white font-bold text-sm">
            {t("vid_all")} {arr}
          </button>
        </div>
      </section>

      <div className="sd2 max-w-xs mx-auto"></div>

      {/* Quran section */}
      <section className="py-20 sm:py-28 relative overflow-hidden" style={{background:'var(--cr)'}}>
        <IP/>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-16 sm:w-24" style={{background:'var(--g)'}}></div>
              <span className="text-sm font-medium tracking-widest" style={{color:'var(--g)'}}>{t("q_tag")}</span>
              <div className="h-px w-16 sm:w-24" style={{background:'var(--g)'}}></div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black" style={{color:'var(--p)'}}>{t("q_title")}</h2>
            <p className="mt-3 text-base" style={{color:'var(--tl)'}}>{t("q_desc")}</p>
          </div>
          <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden" style={{border:'1px solid rgba(200,169,81,.2)'}}>
            <div className="p-8 sm:p-12 text-center" style={{background:'linear-gradient(135deg,var(--pd),var(--p))'}}>
              <p className="text-sm mb-4" style={{color:'var(--g)'}}>{t("q_fatiha")}</p>
              <div className="qf text-2xl sm:text-3xl leading-[2.5] text-white/90 space-y-2">
                <p>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
                <p>الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ</p>
                <p>الرَّحْمَنِ الرَّحِيمِ</p>
                <p>مَالِكِ يَوْمِ الدِّينِ</p>
              </div>
            </div>
            {/* زر القرآن — ينقل لصفحة القرآن */}
            <div className="p-6 text-center">
              <button onClick={() => navigate("/quran")} className="bp px-8 py-3 rounded-xl text-white font-bold text-sm">
                {t("q_browse")} {arr}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Hajj & Umrah */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-16 sm:w-24" style={{background:'var(--g)'}}></div>
            <span className="text-sm font-medium tracking-widest" style={{color:'var(--g)'}}>{t("m_tag")}</span>
            <div className="h-px w-16 sm:w-24" style={{background:'var(--g)'}}></div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black" style={{color:'var(--p)'}}>{t("hu_title")}</h2>
          <p className="mt-3 text-base" style={{color:'var(--tl)'}}>{t("hu_desc")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Hajj card */}
          <div onClick={() => navigate("/hajj")} className="ch rounded-3xl overflow-hidden shadow-lg relative" style={{minHeight:'380px',background:'linear-gradient(135deg,#0F2530,#1B3A4B)',cursor:'pointer'}}>
            <IP/>
            <div className="relative z-10 p-8 sm:p-10 h-full flex flex-col justify-between" style={{minHeight:'380px'}}>
              <div>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{background:'rgba(200,169,81,.15)'}}>
                  <span className="text-3xl">🕋</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">{t("h_guide")}</h3>
                <p className="text-white/60 leading-relaxed text-sm">{t("h_gdesc")}</p>
              </div>
              <div className="mt-8">
                <button onClick={(e) => {e.stopPropagation(); navigate("/hajj");}} className="bp px-6 py-3 rounded-xl text-white font-bold text-sm">
                  {t("h_start")} {arr}
                </button>
              </div>
            </div>
          </div>

          {/* Umrah card */}
          <div onClick={() => navigate("/umrah")} className="ch rounded-3xl overflow-hidden shadow-lg relative" style={{minHeight:'380px',background:'linear-gradient(135deg,#1B3A4B,#2C5F7C)',cursor:'pointer'}}>
            <IP/>
            <div className="relative z-10 p-8 sm:p-10 h-full flex flex-col justify-between" style={{minHeight:'380px'}}>
              <div>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6" style={{background:'rgba(200,169,81,.15)'}}>
                  <span className="text-3xl">🕌</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">{t("u_guide")}</h3>
                <p className="text-white/60 leading-relaxed text-sm">{t("u_gdesc")}</p>
              </div>
              <div className="mt-8">
                <button onClick={(e) => {e.stopPropagation(); navigate("/umrah");}} className="bp px-6 py-3 rounded-xl text-white font-bold text-sm">
                  {t("u_start")} {arr}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="sd2 max-w-xs mx-auto"></div>

      {/* Library */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-16 sm:w-24" style={{background:'var(--g)'}}></div>
            <span className="text-sm font-medium tracking-widest" style={{color:'var(--g)'}}>{t("l_tag")}</span>
            <div className="h-px w-16 sm:w-24" style={{background:'var(--g)'}}></div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black" style={{color:'var(--p)'}}>{t("l_title")}</h2>
          <p className="mt-3 text-base" style={{color:'var(--tl)'}}>{t("l_desc")}</p>
        </div>

        {/* Book cards — ينقل لصفحة المكتبة */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {books.map((b,i) => (
            <div key={i} onClick={() => navigate("/library")} className="ch bg-white rounded-2xl shadow-md overflow-hidden group" style={{cursor:'pointer'}}>
              <div className="h-52 overflow-hidden relative" style={{background:`linear-gradient(135deg,${i%2===0?'var(--pd)':'var(--pl)'},var(--p))`}}>
                {b.cover
                  ? <img src={b.cover} alt={b.t} className="w-full h-full object-cover" onError={e=>{e.target.style.display='none'}} />
                  : <span className="text-5xl opacity-20 absolute inset-0 flex items-center justify-center">📖</span>
                }
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all" style={{background:'rgba(200,169,81,.9)'}}>
                  <span className="text-white text-sm font-bold">{t("l_read")}</span>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-sm mb-1" style={{color:'var(--tx)'}}>{b.t}</h4>
                <p className="text-xs" style={{color:'var(--tl)'}}>{b.a}</p>
              </div>
            </div>
          ))}
        </div>

        {/* "Browse library" button */}
        <div className="text-center mt-10">
          <button onClick={() => navigate("/library")} className="bp px-8 py-3 rounded-xl text-white font-bold text-sm">
            {t("l_all")} {arr}
          </button>
        </div>
      </section>

      {/* Contest */}
      <section className="py-20 sm:py-28 relative overflow-hidden" style={{background:'var(--p)'}}>
        <IP/>
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-16 sm:w-24" style={{background:'var(--g)'}}></div>
            <span className="text-sm font-medium tracking-widest" style={{color:'var(--g)'}}>{t("c_tag")}</span>
            <div className="h-px w-16 sm:w-24" style={{background:'var(--g)'}}></div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">{t("c_title")}</h2>
          <p className="text-white/60 mb-10">{t("c_desc")}</p>

          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-2xl" style={{textAlign:dir==="rtl"?"right":"left"}}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:'rgba(200,169,81,.1)'}}>
                <span className="text-xl">❓</span>
              </div>
              <div>
                <p className="text-xs" style={{color:'var(--tl)'}}>{t("c_qlabel")}</p>
                <p className="font-bold text-sm" style={{color:'var(--p)'}}>{cq.q}</p>
              </div>
            </div>
            <div className="space-y-3 mb-6">
              {[{l:cq.a,k:"a"},{l:cq.b,k:"b"},{l:cq.c,k:"c"}].map((o,i) => (
                <button key={i} onClick={() => navigate("/contest")} className="w-full px-5 py-3.5 rounded-xl border-2 transition-all hover:border-current text-sm font-medium" style={{textAlign:dir==="rtl"?"right":"left",borderColor:o.k===cq.x?'var(--g)':'#E5E7EB',background:o.k===cq.x?'rgba(200,169,81,.05)':'white',color:o.k===cq.x?'var(--gd)':'var(--tx)',cursor:'pointer'}}>
                  {o.l}
                </button>
              ))}
            </div>
            {/* زر المسابقة — ينقل لصفحة المسابقة */}
            <button onClick={() => navigate("/contest")} className="bp w-full py-3.5 rounded-xl text-white font-bold text-sm">
              {t("c_now")} {arr}
            </button>
          </div>
        </div>
      </section>

      {/* Feedback */}
      <section className="py-20 sm:py-28 max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-black" style={{color:'var(--p)'}}>{t("f_title")}</h2>
          <p className="mt-3 text-base" style={{color:'var(--tl)'}}>{t("f_desc")}</p>
        </div>
        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10" style={{border:'1px solid rgba(200,169,81,.15)'}}>
          {sent ? (
            <div className="text-center py-8">
              <span className="text-5xl block mb-4">✅</span>
              <p className="text-lg font-bold" style={{color:'var(--p)'}}>{t("f_thx")}</p>
            </div>
          ) : (
            <>
              <div className="flex justify-center gap-2 mb-8">
                {[1,2,3,4,5].map(s => (
                  <button key={s} onClick={() => setRat(s)} onMouseEnter={() => setHRat(s)} onMouseLeave={() => setHRat(0)} className="sr text-3xl sm:text-4xl" style={{color:s<=(hRat||rat)?'var(--g)':'#D1D5DB'}}>
                    {s<=(hRat||rat)?"★":"☆"}
                  </button>
                ))}
              </div>
              <textarea value={cmt} onChange={e => setCmt(e.target.value)} placeholder={t("f_ph")} className="w-full h-32 rounded-xl border-2 p-4 text-sm resize-none focus:outline-none transition-colors" style={{borderColor:'#E5E7EB',fontFamily:'Tajawal,sans-serif',direction:dir,textAlign:dir==="rtl"?"right":"left"}} onFocus={e => e.target.style.borderColor='var(--g)'} onBlur={e => e.target.style.borderColor='#E5E7EB'}/>
              <button onClick={doFeedback} className="bp w-full mt-4 py-3.5 rounded-xl text-white font-bold text-sm">
                {t("f_send")}
              </button>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{background:'var(--pd)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{background:'var(--g)',color:'var(--pd)'}}>
                  <span className="font-bold qf">م</span>
                </div>
                <div>
                  <h3 className="text-white font-bold">{t("site_name")}</h3>
                  <p className="text-xs" style={{color:'var(--g)'}}>{t("site_desc")}</p>
                </div>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">{t("ft_about")}</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">{t("ft_links")}</h4>
              <div className="space-y-2">
                {nav.map((n,i) => (
                  <Link key={i} to={n.h} className="block text-white/50 hover:text-white text-sm transition-colors" style={{textDecoration:'none'}}>
                    {t(n.k)}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">{t("ft_langs")}</h4>
              <div className="flex flex-wrap gap-2">
                {langs.map(l => (
                  <button key={l.code} onClick={() => setLang(l.code)} className="text-xs px-3 py-1.5 rounded-full transition-all" style={{background:lang===l.code?'var(--g)':'rgba(255,255,255,.05)',color:lang===l.code?'var(--pd)':'rgba(255,255,255,.6)',fontWeight:lang===l.code?'bold':'normal',border:'none',cursor:'pointer'}}>
                    {l.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 text-center" style={{borderTop:'1px solid rgba(255,255,255,.05)'}}>
            <p className="text-white/30 text-sm">© {new Date().getFullYear()} {t("ft_copy")}</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
