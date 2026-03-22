import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { supaInsert as supaIns } from "../lib/supabase";
// This file was already written above - copying exact same content
// Re-creating due to filesystem issue

import { useState, useEffect, useRef } from "react";
import { useLang } from "../lib/LangContext";

const langs = [
  { code: "ar", name: "العربية", dir: "rtl" },{ code: "en", name: "English", dir: "ltr" },{ code: "tr", name: "Türkçe", dir: "ltr" },{ code: "ur", name: "اردو", dir: "rtl" },{ code: "ms", name: "Melayu", dir: "ltr" },{ code: "fr", name: "Français", dir: "ltr" },{ code: "fa", name: "فارسی", dir: "rtl" },{ code: "bn", name: "বাংলা", dir: "ltr" },{ code: "hi", name: "हिन्दी", dir: "ltr" },
];
const T={ar:{bismillah:"بسم الله الرحمن الرحيم",site_name:"مشروع منافع",site_desc:"لدعوة الحجاج والمعتمرين",login:"تسجيل الدخول",n_home:"الرئيسية",n_vid:"الفيديوهات",n_quran:"القرآن الكريم",n_lib:"المكتبة",n_hajj:"الحج",n_umrah:"العمرة",n_contest:"المسابقة",page_tag:"كتاب الله",page_title:"القرآن الكريم",page_desc:"اقرأ واستمع للقرآن الكريم بصوت أشهر القراء",search:"ابحث عن سورة...",all:"الكل",meccan:"مكية",medinan:"مدنية",ayahs:"آيات",juz:"الجزء",surah:"سورة",loading:"جارٍ التحميل...",read_listen:"اقرأ واستمع",select_reciter:"القارئ",playing:"يتم التشغيل",paused:"إيقاف",close:"إغلاق",back_index:"العودة لفهرس السور",ft_copy:"مشروع منافع — جميع الحقوق محفوظة",ft_langs:"اللغات المدعومة",error:"حدث خطأ",retry:"إعادة المحاولة"},en:{bismillah:"In the Name of Allah, the Most Gracious, the Most Merciful",site_name:"Manafea Project",site_desc:"For Hajj & Umrah Dawah",login:"Login",n_home:"Home",n_vid:"Videos",n_quran:"Holy Quran",n_lib:"Library",n_hajj:"Hajj",n_umrah:"Umrah",n_contest:"Contest",page_tag:"The Book of Allah",page_title:"The Holy Quran",page_desc:"Read and listen to the Holy Quran with renowned reciters",search:"Search for a surah...",all:"All",meccan:"Meccan",medinan:"Medinan",ayahs:"Ayahs",juz:"Juz",surah:"Surah",loading:"Loading...",read_listen:"Read & Listen",select_reciter:"Reciter",playing:"Playing",paused:"Pause",close:"Close",back_index:"Back to Index",ft_copy:"Manafea Project — All Rights Reserved",ft_langs:"Supported Languages",error:"Error loading data",retry:"Retry"},tr:{bismillah:"Rahman ve Rahim olan Allah'ın adıyla",site_name:"Menafi Projesi",site_desc:"Hacılar İçin",login:"Giriş",n_home:"Ana Sayfa",n_vid:"Videolar",n_quran:"Kur'an",n_lib:"Kütüphane",n_hajj:"Hac",n_umrah:"Umre",n_contest:"Yarışma",page_tag:"Allah'ın Kitabı",page_title:"Kur'an-ı Kerim",page_desc:"Ünlü hafızlarla Kur'an okuyun ve dinleyin",search:"Sure ara...",all:"Tümü",meccan:"Mekki",medinan:"Medeni",ayahs:"Ayet",juz:"Cüz",surah:"Sure",loading:"Yükleniyor...",read_listen:"Oku ve Dinle",select_reciter:"Hafız",playing:"Çalınıyor",paused:"Durdur",close:"Kapat",back_index:"Dizine Dön",ft_copy:"Menafi — Tüm Hakları Saklıdır",ft_langs:"Diller",error:"Hata",retry:"Tekrar"},ur:{bismillah:"اللہ کے نام سے",site_name:"منافع پروجیکٹ",site_desc:"حاجیوں کی دعوت",login:"لاگ ان",n_home:"ہوم",n_vid:"ویڈیوز",n_quran:"قرآن",n_lib:"لائبریری",n_hajj:"حج",n_umrah:"عمرہ",n_contest:"مقابلہ",page_tag:"اللہ کی کتاب",page_title:"قرآن کریم",page_desc:"مشہور قراء کی آواز میں قرآن پڑھیں اور سنیں",search:"سورت تلاش...",all:"سب",meccan:"مکی",medinan:"مدنی",ayahs:"آیات",juz:"پارہ",surah:"سورۃ",loading:"لوڈ ہو رہا ہے...",read_listen:"پڑھیں اور سنیں",select_reciter:"قاری",playing:"چل رہا ہے",paused:"روکیں",close:"بند",back_index:"فہرست",ft_copy:"منافع — حقوق محفوظ",ft_langs:"زبانیں",error:"خرابی",retry:"دوبارہ"},ms:{bismillah:"Dengan nama Allah",site_name:"Projek Manafea",site_desc:"Dakwah Haji & Umrah",login:"Log Masuk",n_home:"Utama",n_vid:"Video",n_quran:"Al-Quran",n_lib:"Perpustakaan",n_hajj:"Haji",n_umrah:"Umrah",n_contest:"Pertandingan",page_tag:"Kitab Allah",page_title:"Al-Quran",page_desc:"Baca dan dengar Al-Quran dengan qari terkenal",search:"Cari surah...",all:"Semua",meccan:"Makkiyyah",medinan:"Madaniyyah",ayahs:"Ayat",juz:"Juzuk",surah:"Surah",loading:"Memuatkan...",read_listen:"Baca & Dengar",select_reciter:"Qari",playing:"Dimainkan",paused:"Jeda",close:"Tutup",back_index:"Kembali",ft_copy:"Manafea — Hak Cipta",ft_langs:"Bahasa",error:"Ralat",retry:"Cuba lagi"},fr:{bismillah:"Au nom d'Allah",site_name:"Projet Manafea",site_desc:"Dawah du Hajj",login:"Connexion",n_home:"Accueil",n_vid:"Vidéos",n_quran:"Coran",n_lib:"Bibliothèque",n_hajj:"Hajj",n_umrah:"Omra",n_contest:"Concours",page_tag:"Le Livre d'Allah",page_title:"Le Saint Coran",page_desc:"Lisez et écoutez le Coran avec des récitants célèbres",search:"Rechercher...",all:"Tout",meccan:"Mecquoise",medinan:"Médinoise",ayahs:"Versets",juz:"Juz",surah:"Sourate",loading:"Chargement...",read_listen:"Lire et Écouter",select_reciter:"Récitant",playing:"En lecture",paused:"Pause",close:"Fermer",back_index:"Retour",ft_copy:"Manafea — Droits Réservés",ft_langs:"Langues",error:"Erreur",retry:"Réessayer"},fa:{bismillah:"به نام خداوند",site_name:"پروژه منافع",site_desc:"دعوت حاجیان",login:"ورود",n_home:"خانه",n_vid:"ویدیوها",n_quran:"قرآن",n_lib:"کتابخانه",n_hajj:"حج",n_umrah:"عمره",n_contest:"مسابقه",page_tag:"کتاب خدا",page_title:"قرآن کریم",page_desc:"قرآن را بخوانید و با صدای قاریان مشهور بشنوید",search:"جستجوی سوره...",all:"همه",meccan:"مکی",medinan:"مدنی",ayahs:"آیات",juz:"جزء",surah:"سوره",loading:"بارگذاری...",read_listen:"بخوانید و بشنوید",select_reciter:"قاری",playing:"پخش",paused:"توقف",close:"بستن",back_index:"بازگشت",ft_copy:"منافع — حقوق محفوظ",ft_langs:"زبان‌ها",error:"خطا",retry:"تلاش مجدد"},bn:{bismillah:"আল্লাহর নামে",site_name:"মানাফেয়া",site_desc:"হজ্জ দাওয়াহ",login:"লগইন",n_home:"হোম",n_vid:"ভিডিও",n_quran:"কুরআন",n_lib:"লাইব্রেরি",n_hajj:"হজ্জ",n_umrah:"উমরাহ",n_contest:"প্রতিযোগিতা",page_tag:"আল্লাহর কিতাব",page_title:"পবিত্র কুরআন",page_desc:"বিখ্যাত ক্বারীদের কণ্ঠে কুরআন পড়ুন ও শুনুন",search:"সূরা খুঁজুন...",all:"সব",meccan:"মাক্কী",medinan:"মাদানী",ayahs:"আয়াত",juz:"জুয",surah:"সূরা",loading:"লোড হচ্ছে...",read_listen:"পড়ুন ও শুনুন",select_reciter:"ক্বারী",playing:"চলছে",paused:"বিরতি",close:"বন্ধ",back_index:"ফিরুন",ft_copy:"মানাফেয়া — সংরক্ষিত",ft_langs:"ভাষা",error:"ত্রুটি",retry:"পুনরায়"},hi:{bismillah:"अल्लाह के नाम से",site_name:"मनाफ़ेआ",site_desc:"हज दावत",login:"लॉगिन",n_home:"होम",n_vid:"वीडियो",n_quran:"कुरान",n_lib:"पुस्तकालय",n_hajj:"हज",n_umrah:"उमरा",n_contest:"प्रतियोगिता",page_tag:"अल्लाह की किताब",page_title:"पवित्र कुरान",page_desc:"प्रसिद्ध क़ारियों की आवाज़ में कुरान पढ़ें और सुनें",search:"सूरह खोजें...",all:"सभी",meccan:"मक्की",medinan:"मदनी",ayahs:"आयतें",juz:"जुज़",surah:"सूरह",loading:"लोड हो रहा...",read_listen:"पढ़ें और सुनें",select_reciter:"क़ारी",playing:"चल रहा",paused:"रुकें",close:"बंद",back_index:"वापस",ft_copy:"मनाफ़ेआ — अधिकार सुरक्षित",ft_langs:"भाषाएं",error:"त्रुटि",retry:"पुनः प्रयास"}};

const RECITERS=[{id:"ar.alafasy",ar:"مشاري العفاسي",en:"Mishary Alafasy",pfx:"https://cdn.islamic.network/quran/audio/128/ar.alafasy/"},{id:"ar.abdulbasitmurattal",ar:"عبدالباسط عبدالصمد",en:"Abdul Basit",pfx:"https://cdn.islamic.network/quran/audio/128/ar.abdulbasitmurattal/"},{id:"ar.hudhaify",ar:"علي الحذيفي",en:"Ali Al-Hudhaify",pfx:"https://cdn.islamic.network/quran/audio/128/ar.hudhaify/"},{id:"ar.husary",ar:"محمود خليل الحصري",en:"Al-Husary",pfx:"https://cdn.islamic.network/quran/audio/128/ar.husary/"},{id:"ar.minshawi",ar:"محمد صديق المنشاوي",en:"Al-Minshawi",pfx:"https://cdn.islamic.network/quran/audio/128/ar.minshawi/"}];

// Translation editions per language from Alquran Cloud API
const TRANS_EDITIONS = {
  en: "en.sahih",
  tr: "tr.diyanet",
  ur: "ur.jalandhry",
  fr: "fr.hamidullah",
  fa: "fa.makarem",
  bn: "bn.bengali",
  hi: "hi.hindi",
  ms: "ms.basmeih",
  // ar: no translation needed — it's the original
};

const S=[{n:1,ar:"الفاتحة",en:"Al-Fatiha",ay:7,tp:"meccan",j:1},{n:2,ar:"البقرة",en:"Al-Baqarah",ay:286,tp:"medinan",j:1},{n:3,ar:"آل عمران",en:"Aal-e-Imran",ay:200,tp:"medinan",j:3},{n:4,ar:"النساء",en:"An-Nisa",ay:176,tp:"medinan",j:4},{n:5,ar:"المائدة",en:"Al-Ma'idah",ay:120,tp:"medinan",j:6},{n:6,ar:"الأنعام",en:"Al-An'am",ay:165,tp:"meccan",j:7},{n:7,ar:"الأعراف",en:"Al-A'raf",ay:206,tp:"meccan",j:8},{n:8,ar:"الأنفال",en:"Al-Anfal",ay:75,tp:"medinan",j:9},{n:9,ar:"التوبة",en:"At-Tawbah",ay:129,tp:"medinan",j:10},{n:10,ar:"يونس",en:"Yunus",ay:109,tp:"meccan",j:11},{n:11,ar:"هود",en:"Hud",ay:123,tp:"meccan",j:11},{n:12,ar:"يوسف",en:"Yusuf",ay:111,tp:"meccan",j:12},{n:13,ar:"الرعد",en:"Ar-Ra'd",ay:43,tp:"medinan",j:13},{n:14,ar:"إبراهيم",en:"Ibrahim",ay:52,tp:"meccan",j:13},{n:15,ar:"الحجر",en:"Al-Hijr",ay:99,tp:"meccan",j:14},{n:16,ar:"النحل",en:"An-Nahl",ay:128,tp:"meccan",j:14},{n:17,ar:"الإسراء",en:"Al-Isra",ay:111,tp:"meccan",j:15},{n:18,ar:"الكهف",en:"Al-Kahf",ay:110,tp:"meccan",j:15},{n:19,ar:"مريم",en:"Maryam",ay:98,tp:"meccan",j:16},{n:20,ar:"طه",en:"Taha",ay:135,tp:"meccan",j:16},{n:21,ar:"الأنبياء",en:"Al-Anbiya",ay:112,tp:"meccan",j:17},{n:22,ar:"الحج",en:"Al-Hajj",ay:78,tp:"medinan",j:17},{n:23,ar:"المؤمنون",en:"Al-Mu'minun",ay:118,tp:"meccan",j:18},{n:24,ar:"النور",en:"An-Nur",ay:64,tp:"medinan",j:18},{n:25,ar:"الفرقان",en:"Al-Furqan",ay:77,tp:"meccan",j:18},{n:26,ar:"الشعراء",en:"Ash-Shu'ara",ay:227,tp:"meccan",j:19},{n:27,ar:"النمل",en:"An-Naml",ay:93,tp:"meccan",j:19},{n:28,ar:"القصص",en:"Al-Qasas",ay:88,tp:"meccan",j:20},{n:29,ar:"العنكبوت",en:"Al-Ankabut",ay:69,tp:"meccan",j:20},{n:30,ar:"الروم",en:"Ar-Rum",ay:60,tp:"meccan",j:21},{n:31,ar:"لقمان",en:"Luqman",ay:34,tp:"meccan",j:21},{n:32,ar:"السجدة",en:"As-Sajdah",ay:30,tp:"meccan",j:21},{n:33,ar:"الأحزاب",en:"Al-Ahzab",ay:73,tp:"medinan",j:21},{n:34,ar:"سبأ",en:"Saba",ay:54,tp:"meccan",j:22},{n:35,ar:"فاطر",en:"Fatir",ay:45,tp:"meccan",j:22},{n:36,ar:"يس",en:"Ya-Sin",ay:83,tp:"meccan",j:22},{n:37,ar:"الصافات",en:"As-Saffat",ay:182,tp:"meccan",j:23},{n:38,ar:"ص",en:"Sad",ay:88,tp:"meccan",j:23},{n:39,ar:"الزمر",en:"Az-Zumar",ay:75,tp:"meccan",j:23},{n:40,ar:"غافر",en:"Ghafir",ay:85,tp:"meccan",j:24},{n:41,ar:"فصلت",en:"Fussilat",ay:54,tp:"meccan",j:24},{n:42,ar:"الشورى",en:"Ash-Shura",ay:53,tp:"meccan",j:25},{n:43,ar:"الزخرف",en:"Az-Zukhruf",ay:89,tp:"meccan",j:25},{n:44,ar:"الدخان",en:"Ad-Dukhan",ay:59,tp:"meccan",j:25},{n:45,ar:"الجاثية",en:"Al-Jathiyah",ay:37,tp:"meccan",j:25},{n:46,ar:"الأحقاف",en:"Al-Ahqaf",ay:35,tp:"meccan",j:26},{n:47,ar:"محمد",en:"Muhammad",ay:38,tp:"medinan",j:26},{n:48,ar:"الفتح",en:"Al-Fath",ay:29,tp:"medinan",j:26},{n:49,ar:"الحجرات",en:"Al-Hujurat",ay:18,tp:"medinan",j:26},{n:50,ar:"ق",en:"Qaf",ay:45,tp:"meccan",j:26},{n:51,ar:"الذاريات",en:"Adh-Dhariyat",ay:60,tp:"meccan",j:26},{n:52,ar:"الطور",en:"At-Tur",ay:49,tp:"meccan",j:27},{n:53,ar:"النجم",en:"An-Najm",ay:62,tp:"meccan",j:27},{n:54,ar:"القمر",en:"Al-Qamar",ay:55,tp:"meccan",j:27},{n:55,ar:"الرحمن",en:"Ar-Rahman",ay:78,tp:"medinan",j:27},{n:56,ar:"الواقعة",en:"Al-Waqi'ah",ay:96,tp:"meccan",j:27},{n:57,ar:"الحديد",en:"Al-Hadid",ay:29,tp:"medinan",j:27},{n:58,ar:"المجادلة",en:"Al-Mujadilah",ay:22,tp:"medinan",j:28},{n:59,ar:"الحشر",en:"Al-Hashr",ay:24,tp:"medinan",j:28},{n:60,ar:"الممتحنة",en:"Al-Mumtahanah",ay:13,tp:"medinan",j:28},{n:61,ar:"الصف",en:"As-Saff",ay:14,tp:"medinan",j:28},{n:62,ar:"الجمعة",en:"Al-Jumu'ah",ay:11,tp:"medinan",j:28},{n:63,ar:"المنافقون",en:"Al-Munafiqun",ay:11,tp:"medinan",j:28},{n:64,ar:"التغابن",en:"At-Taghabun",ay:18,tp:"medinan",j:28},{n:65,ar:"الطلاق",en:"At-Talaq",ay:12,tp:"medinan",j:28},{n:66,ar:"التحريم",en:"At-Tahrim",ay:12,tp:"medinan",j:28},{n:67,ar:"الملك",en:"Al-Mulk",ay:30,tp:"meccan",j:29},{n:68,ar:"القلم",en:"Al-Qalam",ay:52,tp:"meccan",j:29},{n:69,ar:"الحاقة",en:"Al-Haqqah",ay:52,tp:"meccan",j:29},{n:70,ar:"المعارج",en:"Al-Ma'arij",ay:44,tp:"meccan",j:29},{n:71,ar:"نوح",en:"Nuh",ay:28,tp:"meccan",j:29},{n:72,ar:"الجن",en:"Al-Jinn",ay:28,tp:"meccan",j:29},{n:73,ar:"المزمل",en:"Al-Muzzammil",ay:20,tp:"meccan",j:29},{n:74,ar:"المدثر",en:"Al-Muddathir",ay:56,tp:"meccan",j:29},{n:75,ar:"القيامة",en:"Al-Qiyamah",ay:40,tp:"meccan",j:29},{n:76,ar:"الإنسان",en:"Al-Insan",ay:31,tp:"medinan",j:29},{n:77,ar:"المرسلات",en:"Al-Mursalat",ay:50,tp:"meccan",j:29},{n:78,ar:"النبأ",en:"An-Naba",ay:40,tp:"meccan",j:30},{n:79,ar:"النازعات",en:"An-Nazi'at",ay:46,tp:"meccan",j:30},{n:80,ar:"عبس",en:"Abasa",ay:42,tp:"meccan",j:30},{n:81,ar:"التكوير",en:"At-Takwir",ay:29,tp:"meccan",j:30},{n:82,ar:"الانفطار",en:"Al-Infitar",ay:19,tp:"meccan",j:30},{n:83,ar:"المطففين",en:"Al-Mutaffifin",ay:36,tp:"meccan",j:30},{n:84,ar:"الانشقاق",en:"Al-Inshiqaq",ay:25,tp:"meccan",j:30},{n:85,ar:"البروج",en:"Al-Buruj",ay:22,tp:"meccan",j:30},{n:86,ar:"الطارق",en:"At-Tariq",ay:17,tp:"meccan",j:30},{n:87,ar:"الأعلى",en:"Al-A'la",ay:19,tp:"meccan",j:30},{n:88,ar:"الغاشية",en:"Al-Ghashiyah",ay:26,tp:"meccan",j:30},{n:89,ar:"الفجر",en:"Al-Fajr",ay:30,tp:"meccan",j:30},{n:90,ar:"البلد",en:"Al-Balad",ay:20,tp:"meccan",j:30},{n:91,ar:"الشمس",en:"Ash-Shams",ay:15,tp:"meccan",j:30},{n:92,ar:"الليل",en:"Al-Layl",ay:21,tp:"meccan",j:30},{n:93,ar:"الضحى",en:"Ad-Duha",ay:11,tp:"meccan",j:30},{n:94,ar:"الشرح",en:"Ash-Sharh",ay:8,tp:"meccan",j:30},{n:95,ar:"التين",en:"At-Tin",ay:8,tp:"meccan",j:30},{n:96,ar:"العلق",en:"Al-Alaq",ay:19,tp:"meccan",j:30},{n:97,ar:"القدر",en:"Al-Qadr",ay:5,tp:"meccan",j:30},{n:98,ar:"البينة",en:"Al-Bayyinah",ay:8,tp:"medinan",j:30},{n:99,ar:"الزلزلة",en:"Az-Zalzalah",ay:8,tp:"medinan",j:30},{n:100,ar:"العاديات",en:"Al-Adiyat",ay:11,tp:"meccan",j:30},{n:101,ar:"القارعة",en:"Al-Qari'ah",ay:11,tp:"meccan",j:30},{n:102,ar:"التكاثر",en:"At-Takathur",ay:8,tp:"meccan",j:30},{n:103,ar:"العصر",en:"Al-Asr",ay:3,tp:"meccan",j:30},{n:104,ar:"الهمزة",en:"Al-Humazah",ay:9,tp:"meccan",j:30},{n:105,ar:"الفيل",en:"Al-Fil",ay:5,tp:"meccan",j:30},{n:106,ar:"قريش",en:"Quraysh",ay:4,tp:"meccan",j:30},{n:107,ar:"الماعون",en:"Al-Ma'un",ay:7,tp:"meccan",j:30},{n:108,ar:"الكوثر",en:"Al-Kawthar",ay:3,tp:"meccan",j:30},{n:109,ar:"الكافرون",en:"Al-Kafirun",ay:6,tp:"meccan",j:30},{n:110,ar:"النصر",en:"An-Nasr",ay:3,tp:"medinan",j:30},{n:111,ar:"المسد",en:"Al-Masad",ay:5,tp:"meccan",j:30},{n:112,ar:"الإخلاص",en:"Al-Ikhlas",ay:4,tp:"meccan",j:30},{n:113,ar:"الفلق",en:"Al-Falaq",ay:5,tp:"meccan",j:30},{n:114,ar:"الناس",en:"An-Nas",ay:6,tp:"medinan",j:30}];

const IP=()=><svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="igq" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M40 0L80 40L40 80L0 40Z" fill="none" stroke="currentColor" strokeWidth="0.5"/><circle cx="40" cy="40" r="15" fill="none" stroke="currentColor" strokeWidth="0.5"/><path d="M20 20L60 20L60 60L20 60Z" fill="none" stroke="currentColor" strokeWidth="0.3"/></pattern></defs><rect width="100%" height="100%" fill="url(#igq)"/></svg>;

// ─── Embedded Ayahs (offline fallback) ───
const EMBEDDED = {
  1: [
    {text:"بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ"},
    {text:"الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ"},
    {text:"الرَّحْمَـٰنِ الرَّحِيمِ"},
    {text:"مَالِكِ يَوْمِ الدِّينِ"},
    {text:"إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ"},
    {text:"اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ"},
    {text:"صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ"},
  ],
};
const EMBEDDED_TRANS = {
  1: {
    en:["In the name of Allah, the Entirely Merciful, the Especially Merciful","All praise is due to Allah, Lord of the worlds","The Entirely Merciful, the Especially Merciful","Sovereign of the Day of Recompense","It is You we worship and You we ask for help","Guide us to the straight path","The path of those upon whom You have bestowed favor, not of those who have earned anger nor of those who are astray"],
    tr:["Rahman ve Rahim olan Allah'ın adıyla","Hamd, Âlemlerin Rabbi Allah'a mahsustur","Rahman'dır, Rahim'dir","Din gününün sahibidir","Yalnız sana ibadet ederiz ve yalnız senden yardım dileriz","Bizi doğru yola ilet","Kendilerine nimet verdiklerinin yoluna; gazaba uğrayanların ve sapkınların yoluna değil"],
    ur:["شروع اللہ کے نام سے جو بڑا مہربان نہایت رحم والا ہے","سب تعریفیں اللہ کے لیے ہیں جو تمام جہانوں کا پالنے والا ہے","بڑا مہربان نہایت رحم والا","بدلے کے دن کا مالک","ہم تیری ہی عبادت کرتے ہیں اور تجھ ہی سے مدد مانگتے ہیں","ہمیں سیدھا راستہ دکھا","ان لوگوں کا راستہ جن پر تو نے انعام کیا نہ ان کا جن پر غضب ہوا اور نہ گمراہوں کا"],
    fr:["Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux","Louange à Allah, Seigneur de l'univers","Le Tout Miséricordieux, le Très Miséricordieux","Maître du Jour de la rétribution","C'est Toi que nous adorons, et c'est Toi dont nous implorons secours","Guide-nous dans le droit chemin","Le chemin de ceux que Tu as comblés de faveurs, non pas de ceux qui ont encouru Ta colère, ni des égarés"],
    fa:["به نام خداوند بخشنده مهربان","ستایش خدای را که پروردگار جهانیان است","بخشنده مهربان","مالک روز جزا","تنها تو را می‌پرستیم و تنها از تو یاری می‌جوییم","ما را به راه راست هدایت کن","راه آنان که بر ایشان نعمت داده‌ای نه آنان که بر ایشان غضب شده و نه گمراهان"],
    ms:["Dengan nama Allah, Yang Maha Pemurah, lagi Maha Mengasihani","Segala puji bagi Allah, Tuhan sekalian alam","Yang Maha Pemurah, lagi Maha Mengasihani","Yang Menguasai hari pembalasan","Engkaulah sahaja yang kami sembah, dan Engkaulah sahaja yang kami minta pertolongan","Tunjukilah kami jalan yang lurus","Iaitu jalan orang-orang yang Engkau kurniakan nikmat kepada mereka, bukan jalan orang-orang yang dimurkai dan bukan jalan orang-orang yang sesat"],
    bn:["পরম করুণাময় অতি দয়ালু আল্লাহর নামে","সকল প্রশংসা আল্লাহর জন্য, যিনি সকল সৃষ্টির প্রতিপালক","পরম করুণাময়, অতি দয়ালু","বিচার দিনের মালিক","আমরা কেবল তোমারই ইবাদত করি এবং কেবল তোমারই কাছে সাহায্য চাই","আমাদের সরল পথ দেখাও","তাদের পথ যাদের তুমি অনুগ্রহ করেছ, তাদের পথ নয় যাদের প্রতি গজব নাযিল হয়েছে এবং যারা পথভ্রষ্ট"],
    hi:["अल्लाह के नाम से जो बड़ा कृपाशील अत्यंत दयावान है","सब तारीफ़ अल्लाह के लिए है जो सारे जहानों का पालनहार है","बड़ा कृपाशील अत्यंत दयावान","बदले के दिन का मालिक","हम तेरी ही इबादत करते हैं और तुझी से मदद चाहते हैं","हमें सीधा रास्ता दिखा","उन लोगों का रास्ता जिन पर तूने इनाम किया न उनका जिन पर ग़ज़ब हुआ और न गुमराहों का"],
  },
};

// ─── Surah Reader ───
const Reader=({su,rec,t,dir,onBack,lang})=>{
  const[ayahs,setAyahs]=useState([]);const[trans,setTrans]=useState([]);const[ld,setLd]=useState(true);const[err,setErr]=useState(false);const[pAy,setPAy]=useState(null);const[playing,setPlaying]=useState(false);const[showTrans,setShowTrans]=useState(lang!=="ar");const aRef=useRef(null);
  const gNum=(sn,ln)=>{let t=0;for(let i=0;i<sn-1;i++)t+=S[i].ay;return t+ln};
  const load=async()=>{setLd(true);setErr(false);setTrans([]);
    // Try embedded first (offline-safe)
    if(EMBEDDED[su.n]){
      setAyahs(EMBEDDED[su.n]);
      // Load embedded translations if available
      if(EMBEDDED_TRANS[su.n]&&EMBEDDED_TRANS[su.n][lang]){
        setTrans(EMBEDDED_TRANS[su.n][lang]);
      }
      setLd(false);return;
    }
    // Otherwise fetch from API
    try{
      const r=await fetch(`https://api.alquran.cloud/v1/surah/${su.n}/quran-uthmani`);
      const d=await r.json();
      if(d.code===200) setAyahs(d.data.ayahs); else { setErr(true); setLd(false); return; }
      // Fetch translation if not Arabic
      const edition = TRANS_EDITIONS[lang];
      if(edition){
        try{
          const tr=await fetch(`https://api.alquran.cloud/v1/surah/${su.n}/${edition}`);
          const td=await tr.json();
          if(td.code===200) setTrans(td.data.ayahs.map(a=>a.text));
        }catch{}
      }
    }catch{setErr(true)}
    setLd(false);
  };
  useEffect(()=>{load()},[su.n]);
  const play=(ln)=>{const g=gNum(su.n,ln);const u=`${rec.pfx}${g}.mp3`;if(aRef.current)aRef.current.pause();const a=new Audio(u);aRef.current=a;setPAy(ln);setPlaying(true);a.play().catch(()=>{});a.onended=()=>{setPAy(null);setPlaying(false);if(ln<ayahs.length)play(ln+1)};a.onerror=()=>{setPAy(null);setPlaying(false)}};
  const stop=()=>{if(aRef.current){aRef.current.pause();aRef.current=null}setPAy(null);setPlaying(false)};
  useEffect(()=>()=>{if(aRef.current)aRef.current.pause()},[]);
  return(<div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
    <button onClick={()=>{stop();onBack()}} className="flex items-center gap-2 mb-8 text-sm font-medium px-4 py-2 rounded-xl hover:bg-gray-100 transition-all" style={{color:'var(--primary)'}}><span>{dir==="rtl"?"→":"←"}</span>{t("back_index")}</button>
    {/* Header */}
    <div className="rounded-3xl overflow-hidden shadow-xl mb-8" style={{border:'1px solid rgba(200,169,81,0.2)'}}>
      <div className="p-8 sm:p-12 text-center relative" style={{background:'linear-gradient(135deg,var(--primary-dark),var(--primary))'}}><IP/><div className="relative z-10">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{background:'rgba(200,169,81,0.15)',border:'2px solid rgba(200,169,81,0.3)'}}><span className="text-2xl font-black" style={{color:'var(--gold)'}}>{su.n}</span></div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-1" style={{fontFamily:'Amiri,serif'}}>{su.ar}</h1>
        <p className="text-sm text-white/50 mb-6">{su.en} — {su.ay} {t("ayahs")}</p>
        <button onClick={playing?stop:()=>play(1)} className="inline-flex items-center gap-3 px-8 py-3.5 rounded-xl text-white font-bold text-sm" style={{background:'linear-gradient(135deg,var(--gold-dark),var(--gold))',transition:'all .3s'}}>
          {playing?<><svg className="w-5 h-5" fill="white" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>{t("paused")}</>:<><svg className="w-5 h-5" fill="white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>{t("read_listen")}</>}
        </button>
      </div></div>
      <div className="bg-white px-6 py-3 flex items-center justify-center gap-4 text-sm" style={{color:'var(--text-light)'}}>
        <div className="flex items-center gap-2"><span>🎙️</span><span className="font-bold" style={{color:'var(--primary)'}}>{dir==="rtl"?rec.ar:rec.en}</span></div>
        {lang!=="ar"&&<button onClick={()=>setShowTrans(!showTrans)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all" style={{background:showTrans?'rgba(200,169,81,0.15)':'rgba(0,0,0,0.04)',color:showTrans?'var(--gold-dark)':'var(--text-light)',border:showTrans?'1px solid rgba(200,169,81,0.3)':'1px solid #E5E7EB'}}>
          <span>🌐</span>{showTrans?(lang==="ar"?"إخفاء الترجمة":"Hide Translation"):(lang==="ar"?"إظهار الترجمة":"Show Translation")}
        </button>}
      </div>
    </div>
    {su.n!==9&&<div className="text-center py-6 mb-6"><p className="text-2xl sm:text-3xl leading-loose" style={{fontFamily:'Amiri,serif',color:'var(--primary)'}}>بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p></div>}
    {ld?<div className="text-center py-20"><div className="w-12 h-12 rounded-full border-4 border-gray-200 mx-auto mb-4" style={{borderTopColor:'var(--gold)',animation:'sp 1s linear infinite'}}></div><p style={{color:'var(--text-light)'}}>{t("loading")}</p><style>{`@keyframes sp{to{transform:rotate(360deg)}}`}</style></div>
    :err?<div className="text-center py-20"><span className="text-5xl block mb-4">⚠️</span><p className="mb-4" style={{color:'var(--text-light)'}}>{t("error")}</p><button onClick={load} className="px-6 py-2 rounded-xl text-white text-sm font-bold" style={{background:'linear-gradient(135deg,var(--gold-dark),var(--gold))'}}>{t("retry")}</button></div>
    :<div className="bg-white rounded-3xl shadow-lg p-6 sm:p-10" style={{border:'1px solid rgba(200,169,81,0.1)'}}>
      <div className="space-y-6">{ayahs.map((a,i)=>{const ln=i+1;const act=pAy===ln;return(
        <div key={i} className="group flex gap-4 items-start p-4 rounded-2xl transition-all" style={{background:act?'rgba(200,169,81,0.08)':'transparent',border:act?'1px solid rgba(200,169,81,0.2)':'1px solid transparent'}}>
          <button onClick={()=>act?stop():play(ln)} className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all" style={{background:act?'var(--gold)':'rgba(27,58,75,0.05)',color:act?'white':'var(--primary)'}}>
            {act?<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>:<span className="text-sm font-bold">{ln}</span>}
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xl sm:text-2xl leading-[2.2] text-right" style={{fontFamily:'Amiri,serif',color:'var(--text)',direction:'rtl'}}>{a.text} <span className="inline-block text-xs px-2 py-0.5 rounded-full mx-1" style={{background:'rgba(200,169,81,0.1)',color:'var(--gold-dark)',fontFamily:'Tajawal'}}>﴿{ln}﴾</span></p>
            {showTrans && trans[i] && <p className="mt-3 text-sm leading-relaxed pt-3" style={{color:'var(--text-light)',borderTop:'1px solid rgba(200,169,81,0.1)',direction:dir,textAlign:dir==="rtl"?"right":"left"}}>{trans[i]}</p>}
          </div>
          <button onClick={()=>act?stop():play(ln)} className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all" style={{background:'var(--gold)',color:'white'}}><svg className="w-4 h-4" style={{marginInlineStart:'1px'}} fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></button>
        </div>
      )})}</div>
    </div>}
  </div>);
};

// ─── Main ───
export default function ManafaaQuranPage(){
  const {lang,setLang}=useLang();const[showLM,setShowLM]=useState(false);const[scrolled,setScrolled]=useState(false);const[mob,setMob]=useState(false);const[search,setSearch]=useState("");const[typeF,setTypeF]=useState("all");const[selSu,setSelSu]=useState(null);const[recIdx,setRecIdx]=useState(0);const[showRec,setShowRec]=useState(false);
  const lo=langs.find(l=>l.code===lang)||langs[0];const dir=lo.dir;const ui=T[lang]||T.ar;const t=k=>ui[k]||T.ar[k]||k;const rec=RECITERS[recIdx];
  useEffect(()=>{const h=()=>setScrolled(window.scrollY>50);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h)},[]);
  useEffect(()=>{window.scrollTo(0,0)},[selSu]);
  const nav=[{k:"n_home",href:"/"},{k:"n_vid",href:"/videos"},{k:"n_quran",href:"/quran"},{k:"n_lib",href:"/library"},{k:"n_hajj",href:"/hajj"},{k:"n_umrah",href:"/umrah"},{k:"n_contest",href:"/contest"}];
  const filtered=S.filter(s=>{const ms=s.ar.includes(search)||s.en.toLowerCase().includes(search.toLowerCase())||String(s.n).includes(search);const mt=typeF==="all"||s.tp===typeF;return ms&&mt});

  return(<div dir={dir} className="min-h-screen bg-[#FAFBFC]" style={{fontFamily:"'Tajawal','Segoe UI',sans-serif"}}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&family=Amiri:wght@400;700&display=swap');*{box-sizing:border-box;margin:0;padding:0}:root{--primary:#1B3A4B;--primary-light:#2C5F7C;--primary-dark:#0F2530;--gold:#C8A951;--gold-light:#E8D48B;--gold-dark:#9E832E;--text:#1a1a2e;--text-light:#6B7280}@keyframes fu{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}@keyframes sd{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}@keyframes sh{0%{background-position:-200% 0}100%{background-position:200% 0}}.afu{animation:fu .8s ease-out forwards}.asd{animation:sd .3s ease-out forwards}.gn{background:rgba(27,58,75,.95);backdrop-filter:blur(20px)}.hg{background:linear-gradient(135deg,#0F2530 0%,#1B3A4B 30%,#2C5F7C 70%,#1B3A4B 100%)}.gs{background:linear-gradient(90deg,var(--gold-dark),var(--gold),var(--gold-light),var(--gold),var(--gold-dark));background-size:200% 100%;animation:sh 4s linear infinite;-webkit-background-clip:text;-webkit-text-fill-color:transparent}.ch{transition:all .4s cubic-bezier(.4,0,.2,1)}.ch:hover{transform:translateY(-6px);box-shadow:0 20px 40px -12px rgba(27,58,75,.12)}.ni{position:relative;transition:all .3s}.ni::after{content:'';position:absolute;bottom:-4px;${dir==="rtl"?"right":"left"}:0;width:0;height:2px;background:var(--gold);transition:width .3s}.ni:hover::after{width:100%}.sb::-webkit-scrollbar{display:none}.sb{-ms-overflow-style:none;scrollbar-width:none}`}</style>

    <Navbar />

    {selSu?<Reader su={selSu} rec={rec} t={t} dir={dir} lang={lang} onBack={()=>setSelSu(null)}/>:<>
      {/* Hero */}
      <section className="hg relative overflow-hidden" style={{minHeight:'45vh'}}><IP/><div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center" style={{minHeight:'45vh'}}><div className="text-center afu">
        <div className="flex items-center justify-center gap-4 mb-6"><div className="h-px w-16 sm:w-24" style={{background:'var(--gold)'}}></div><span className="text-sm font-medium tracking-widest" style={{color:'var(--gold)'}}>{t("page_tag")}</span><div className="h-px w-16 sm:w-24" style={{background:'var(--gold)'}}></div></div>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black gs mb-4" style={{fontFamily:'Amiri,serif'}}>{t("page_title")}</h1>
        <p className="text-base sm:text-lg text-white/60 font-light max-w-2xl mx-auto mb-8">{t("page_desc")}</p>
        <div className="flex items-center justify-center gap-6 sm:gap-10">
          <div className="text-center"><div className="text-2xl sm:text-3xl font-black" style={{color:'var(--gold)'}}>114</div><div className="text-xs text-white/40">{t("surah")}</div></div>
          <div className="w-px h-10" style={{background:'rgba(255,255,255,0.1)'}}></div>
          <div className="text-center"><div className="text-2xl sm:text-3xl font-black" style={{color:'var(--gold)'}}>30</div><div className="text-xs text-white/40">{t("juz")}</div></div>
          <div className="w-px h-10" style={{background:'rgba(255,255,255,0.1)'}}></div>
          <div className="text-center"><div className="text-2xl sm:text-3xl font-black" style={{color:'var(--gold)'}}>6236</div><div className="text-xs text-white/40">{t("ayahs")}</div></div>
        </div>
      </div></div></section>

      {/* Search + Filter */}
      <section className="relative -mt-8 z-20 max-w-5xl mx-auto px-4 sm:px-6"><div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6"><div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative"><svg className={`absolute top-1/2 -translate-y-1/2 ${dir==="rtl"?"right-4":"left-4"} w-4 h-4`} fill="none" viewBox="0 0 24 24" stroke="var(--text-light)"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t("search")} className="w-full py-3 rounded-xl border-2 text-sm focus:outline-none transition-colors" style={{borderColor:'#E5E7EB',direction:dir,textAlign:dir==="rtl"?"right":"left",fontFamily:'Tajawal',paddingInlineStart:'44px',paddingInlineEnd:'16px'}} onFocus={e=>e.target.style.borderColor='var(--gold)'} onBlur={e=>e.target.style.borderColor='#E5E7EB'}/></div>
        <div className="flex gap-2 flex-shrink-0">{["all","meccan","medinan"].map(tp=><button key={tp} onClick={()=>setTypeF(tp)} className="px-4 py-2.5 rounded-xl text-sm font-bold transition-all" style={{background:typeF===tp?(tp==="meccan"?'var(--primary)':tp==="medinan"?'var(--gold)':'var(--primary)'):'transparent',color:typeF===tp?'white':'var(--text-light)',border:typeF===tp?'none':'1px solid #E5E7EB'}}>{t(tp)}</button>)}</div>
      </div></div></section>

      {/* Surah Grid */}
      <section className="py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">{filtered.map((s,i)=><div key={s.n} onClick={()=>setSelSu(s)} className="ch bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer group afu" style={{animationDelay:`${Math.min(i*.03,.5)}s`}}>
        <div className="flex items-center gap-4 p-5">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{background:'linear-gradient(135deg,var(--primary-dark),var(--primary))'}}><span className="text-white font-bold text-sm">{s.n}</span></div>
          <div className="flex-1 min-w-0"><h3 className="font-bold text-sm truncate" style={{color:'var(--text)'}}>{["ar","ur","fa"].includes(lang)?s.ar:s.en}</h3><div className="flex items-center gap-2 mt-1">{!["ar","ur","fa"].includes(lang)&&<span className="text-xs" style={{fontFamily:'Amiri,serif',color:'var(--text-light)'}}>{s.ar}</span>}<span className="text-xs" style={{color:'var(--text-light)'}}>{s.ay} {t("ayahs")}</span><span className="text-xs px-2 py-0.5 rounded-full" style={{background:s.tp==="meccan"?'rgba(27,58,75,0.08)':'rgba(200,169,81,0.1)',color:s.tp==="meccan"?'var(--primary)':'var(--gold-dark)',fontSize:'10px'}}>{t(s.tp)}</span></div></div>
          <div className="opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"><div className="w-10 h-10 rounded-full flex items-center justify-center" style={{background:'var(--gold)'}}><svg className="w-4 h-4" style={{marginInlineStart:'2px'}} fill="white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div></div>
        </div>
      </div>)}</div>{filtered.length===0&&<div className="text-center py-20"><span className="text-5xl block mb-4">🔍</span></div>}</section>
    </>}

    {/* Footer */}
    <footer style={{background:'var(--primary-dark)'}}><div className="max-w-7xl mx-auto px-4 sm:px-6 py-16"><div className="grid grid-cols-1 md:grid-cols-2 gap-10"><div><div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 rounded-full flex items-center justify-center" style={{background:'var(--gold)',color:'var(--primary-dark)'}}><span className="font-bold" style={{fontFamily:'Amiri,serif'}}>م</span></div><div><h3 className="text-white font-bold">{t("site_name")}</h3><p className="text-xs" style={{color:'var(--gold)'}}>{t("site_desc")}</p></div></div></div><div><h4 className="text-white font-bold mb-4">{t("ft_langs")}</h4><div className="flex flex-wrap gap-2">{langs.map(l=><button key={l.code} onClick={()=>setLang(l.code)} className="text-xs px-3 py-1.5 rounded-full transition-all" style={{background:lang===l.code?'var(--gold)':'rgba(255,255,255,.05)',color:lang===l.code?'var(--primary-dark)':'rgba(255,255,255,.6)',fontWeight:lang===l.code?'bold':'normal'}}>{l.name}</button>)}</div></div></div><div className="mt-12 pt-8 text-center" style={{borderTop:'1px solid rgba(255,255,255,.05)'}}><p className="text-white/30 text-sm">© {new Date().getFullYear()} {t("ft_copy")}</p></div></div></footer>

    {(showLM||mob||showRec)&&<div className="fixed inset-0 z-40" onClick={()=>{setShowLM(false);setMob(false);setShowRec(false)}}/>}
  </div>);
}
