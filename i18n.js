import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// import arTranslations from './locales/ar.json';
// import enTranslations from './locales/en.json';
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          "English": "English",
          "Home": "Home",
          "Videos": "Videos",
          "Translations of Quran": "Translations of Quran",
          "Interactive files": "Interactive files",
          "Islamic applications": "Islamic applications",
          "Another Islamic sites": "Another Islamic sites",
          "View more": "View more",
          "Rate your experience": "Rate your experience",
          "Enter your comment here...": "Enter your comment here...",
          "Send": "Send",
          "Your comment has been sent successfully": "Your comment has been sent successfully",
          videoLinks: {
            video1: "https://www.youtube.com/embed/f8PTOQFl4f4?si=2TJ3xIob6pZcAgEz",
            video2: "https://www.youtube.com/embed/6tJqEU9W4jg?si=n_EOnuzmkO8ATAx2",
            video3: "https://www.youtube.com/embed/rjcMwuVMuYc?si=coI-ULqr5Au1sNgZ",
            video4: "https://www.youtube.com/embed/XPOX5QedkGo?si=a6UeOVILT4nQUWxb", 
            video5: "https://www.youtube.com/embed/UK94ne7RrIM?si=8ZXYlfLeI9QDe3YI",
            video6: "https://www.youtube.com/embed/GIHr2PmrH_8?si=DJcmHItNYk-F10Bx"
          }
      }
      },
      ar: {
        translation: {
          "English": "العربية",
          "Home": "الرئيسية",
          "Videos": "الفيديوهات",
          "Translations of Quran": "ترجمات القرآن",
          "Interactive files": "ملفات تفاعلية",
          "Islamic applications": "تطبيقات إسلامية",
          "Another Islamic sites": "مواقع إسلامية أخرى",
          "View more": "عرض المزيد",
          "Rate your experience": "قيّم تجربتك",
          "Enter your comment here...": "أدخل تعليقك هنا...",
          "Send": "إرسال",
          "Your comment has been sent successfully": "تم إرسال تعليقك بنجاح",
          videoLinks: {
            video1: "https://www.youtube.com/embed/Ben2hLU0Odg?si=dDqNzL-gLQW2Y8e1",
            video2: "https://www.youtube.com/embed/ZINju zYQxX4?si=r3ZYWJR8xZnJxY1W",
            video3: "https://www.youtube.com/embed/IOcjzYNEjYY?si=fcBY66trwBhBUb8q",
            video4: "https://www.youtube.com/embed/tjp7wiUaPZk?si=KvDb2m2IvXftYJvU",
            video5: "https://www.youtube.com/embed/FsDrBKQy7gM?si=QH0VyNpSmbjPetD2",
            video6: "https://www.youtube.com/embed/3WxjaH10TBs?si=TfpjBpvLIMHXft4z"
          }
        }
      }
    },
    fallbackLng: 'ar',
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;