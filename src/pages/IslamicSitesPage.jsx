import { useLang } from "../lib/LangContext";
import { trackPage } from "../lib/analytics";
import { useEffect } from "react";
import Navbar from "../components/Navbar";

const SITES = [
  { id:1, icon:"📚", url:"https://docs.osoulcontent.org.sa/reports/OsoulSites.html",
    name:{ar:"موقع أصول المحتوى",en:"Osoul Content",tr:"Osoul Content",ur:"اصول کنٹینٹ",ms:"Osoul Content",fr:"Osoul Contenu",fa:"اصول محتوا",bn:"ওসুল",hi:"ओसूल"},
    desc:{ar:"موقع شامل للمواقع الإسلامية الموثوقة",en:"Comprehensive directory of trusted Islamic websites",tr:"Güvenilir İslam sitelerinin kapsamlı rehberi",ur:"مستند اسلامی ویبسائٹس کی فہرست",ms:"Direktori laman web Islam",fr:"Annuaire de sites islamiques",fa:"فهرست سایت‌های اسلامی",bn:"ইসলামিক সাইটের ডিরেক্টরি",hi:"इस्लामिक वेबसाइटों की डायरेक्टरी"}
  },
  { id:2, icon:"🏕️", url:"https://guidetomecca.com/hajj/#videos",
    name:{ar:"دليل مكة - فيديوهات الحج",en:"Guide to Mecca - Hajj Videos",tr:"Mekke Rehberi",ur:"رہنمائے مکہ",ms:"Panduan ke Makkah",fr:"Guide de La Mecque",fa:"راهنمای مکه",bn:"মাক্কা গাইড",hi:"मक्का गाइड"},
    desc:{ar:"فيديوهات تعليمية شاملة عن مناسك الحج",en:"Educational videos about Hajj rituals",tr:"Hac ibadetine ait eğitim videoları",ur:"حج کے مناسک کے تعلیمی ویڈیوز",ms:"Video pendidikan tentang manasik haji",fr:"Vidéos éducatives sur les rites du Hajj",fa:"ویدیوهای آموزشی درباره مناسک حج",bn:"হজ্জের মানাসিক সম্পর্কে শিক্ষামূলক ভিডিও",hi:"हज के मनासिक के शैक्षिक वीडियो"}
  },
  { id:3, icon:"📰", url:"https://bit.ly/4kf4NtY",
    name:{ar:"موقع إسلامي 1",en:"Islamic Site 1",tr:"İslam Sitesi 1",ur:"اسلامی سائٹ 1",ms:"Laman Islam 1",fr:"Site Islamique 1",fa:"سایت اسلامی 1",bn:"ইসলামিক সাইট 1",hi:"इस्लामिक साइट 1"},
    desc:{ar:"موقع إسلامي موثوق",en:"Trusted Islamic website",tr:"Güvenilir İslam sitesi",ur:"مستند اسلامی ویبسائٹ",ms:"Laman web Islam dipercayai",fr:"Site islamique de confiance",fa:"سایت اسلامی معتبر",bn:"বিশ্বস্ত ইসলামিক ওয়েবসাইট",hi:"विश्वसनीय इस्लामिक वेबसाइट"}
  },
  { id:4, icon:"🌍", url:"https://bit.ly/4kA3Oo0",
    name:{ar:"موقع إسلامي 2",en:"Islamic Site 2",tr:"İslam Sitesi 2",ur:"اسلامی سائٹ 2",ms:"Laman Islam 2",fr:"Site Islamique 2",fa:"سایت اسلامی 2",bn:"ইসলামিক সাইট 2",hi:"इस्लामिक साइट 2"},
    desc:{ar:"موقع إسلامي موثوق",en:"Trusted Islamic website",tr:"Güvenilir İslam sitesi",ur:"مستند اسلامی ویبسائٹ",ms:"Laman web Islam dipercayai",fr:"Site islamique de confiance",fa:"سایت اسلامی معتبر",bn:"বিশ্বস্ত ইসলামিক ওয়েবসাইট",hi:"विश्वसनीय इस्लामिक वेबसाइट"}
  },
  { id:5, icon:"🔗", url:"https://bit.ly/2XmPw2Z",
    name:{ar:"موقع إسلامي 3",en:"Islamic Site 3",tr:"İslam Sitesi 3",ur:"اسلامی سائٹ 3",ms:"Laman Islam 3",fr:"Site Islamique 3",fa:"سایت اسلامی 3",bn:"ইসলামিক সাইট 3",hi:"इस्लामिक साइट 3"},
    desc:{ar:"موقع إسلامي موثوق",en:"Trusted Islamic website",tr:"Güvenilir İslam sitesi",ur:"مستند اسلامی ویبسائٹ",ms:"Laman web Islam dipercayai",fr:"Site islamique de confiance",fa:"سایت اسلامی معتبر",bn:"বিশ্বস্ত ইসলামিক ওয়েবসাইট",hi:"विश्वसनीय इस्लामिक वेबसाइट"}
  },
  { id:6, icon:"📖", url:"https://risala.prh.gov.sa/ur",
    name:{ar:"🎉 كتب الحرمين PDF - 58 لغة",en:"🎉 Haramain Books - PDF 58 languages",tr:"🎉 Haremeyn Kitapları",ur:"🎉 حرمین کی کتبیں",ms:"🎉 Buku Haramain PDF",fr:"🎉 Livres Haramayn PDF",fa:"🎉 کتاب‌های حرمین",bn:"🎉 হারামাইন বই",hi:"🎉 हरमैन किताबें"},
    desc:{ar:"الكتب الإسلامية الموثوقة التي تُوزَع في الحرمين، متاحة PDF بـ 58 لغة",en:"Authentic books distributed in the Two Holy Mosques, available as PDF in 58 languages",tr:"İki Kutsal Camide dağıtılan orijinal İslam kitapları, 58 dilde PDF",ur:"حرمین شریفین میں تقسیم کتبیں 58 زبانوں میں PDF",ms:"Buku Islam sahih dari Masjid Suci, tersedia 58 bahasa PDF",fr:"Livres islamiques des Deux Saintes Mosquées en 58 langues PDF",fa:"کتاب‌های معتبر حرمین به 58 زبان PDF",bn:"দুই পবিত্র মসজিদের বই 58 ভাষায় PDF",hi:"हरमैन की प्रामाणिक पुस्तकें 58 भाषाओं में PDF"}
  },
  { id:7, icon:"🎓", url:"https://bap.baseerat.academy/register",
    name:{ar:"أكاديمية بصيرة",en:"Baseerat Academy",tr:"Baseerat Akademisi",ur:"بصیرت ایکیڈمی",ms:"Akademi Baseerat",fr:"Académie Baseerat",fa:"آکادمی بصیرت",bn:"বাসিরাত অ্যাকাডেমি",hi:"आधारित अकादमी"},
    desc:{ar:"منصة تعليمية إسلامية عبر الإنترنت",en:"Online Islamic educational platform",tr:"Çevrimiiçi İslam eğitim platformu",ur:"آنلائن اسلامی تعلیمی پلیٹ فارم",ms:"Platform pendidikan Islam dalam talian",fr:"Plateforme éducative islamique en ligne",fa:"پلتفرم آموزشی اسلامی آنلاین",bn:"অনলাইন ইসলামিক শিক্ষা প্লাটফর্ম",hi:"ऑनलाइन इस्लामिक शैक्षिक प्लेटफॉर्म"}
  }
];

const LB = {
  ar:{title:"مواقع إسلامية",sub:"مجموعة من أفضل المواقع الإسلامية الموثوقة",visit:"زيارة الموقع"},
  en:{title:"Islamic Sites",sub:"A collection of the best trusted Islamic websites",visit:"Visit Site"},
  tr:{title:"İslam Siteleri",sub:"En iyi güvenilir İslam sitelerinin koleksiyonu",visit:"Siteyi Ziyaret Et"},
  ur:{title:"اسلامی ویبسائٹس",sub:"بہترین مستند اسلامی ویبسائٹس کا مجموعہ",visit:"سائٹ دیکھیں"},
  ms:{title:"Laman Islam",sub:"Koleksi laman web Islam terbaik",visit:"Lawati Laman"},
  fr:{title:"Sites Islamiques",sub:"Une collection des meilleurs sites islamiques",visit:"Visiter"},
  fa:{title:"سایت‌های اسلامی",sub:"مجموعه‌ای از بهترین سایت‌های اسلامی",visit:"بازدید"},
  bn:{title:"ইসলামিক সাইট",sub:"সর্বশ্রেষ্ঠ বিশ্বস্ত ইসলামিক সাইটের সংকলন",visit:"সাইট দেখুন"},
  hi:{title:"इस्लामिक साइट",sub:"सर्वश्रेष्ठ विश्वसनीय इस्लामिक वेबसाइटों का संग्रह",visit:"साइट देखें"},
};

export default function IslamicSitesPage() {
  const { lang, dir } = useLang();
  const lb = LB[lang] || LB.ar;
  useEffect(() => { trackPage("/sites", lang); }, [lang]);

  return (
    <div dir={dir} style={{ fontFamily: "'Tajawal','Segoe UI',sans-serif", minHeight: "100vh", background: "#FAFBFC" }}>
      <Navbar />
      <div style={{ background: "linear-gradient(135deg,#0F2530,#1B3A4B)", padding: "60px 20px 50px", textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🌐</div>
        <h1 style={{ color: "#C8A951", fontSize: "2rem", fontWeight: 900, margin: "0 0 10px" }}>{lb.title}</h1>
        <p style={{ color: "rgba(255,255,255,.7)", fontSize: "1rem", maxWidth: "500px", margin: "0 auto" }}>{lb.sub}</p>
      </div>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "20px" }}>
          {SITES.map(site => (
            <div key={site.id} style={{ background: "white", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 16px rgba(0,0,0,.06)", border: "1px solid rgba(200,169,81,.15)", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ fontSize: "2.2rem", lineHeight: 1 }}>{site.icon}</div>
                <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#1B3A4B", lineHeight: 1.4 }}>{site.name[lang] || site.name.ar}</h2>
              </div>
              <p style={{ margin: 0, fontSize: ".85rem", color: "#6B7280", lineHeight: 1.7, flex: 1 }}>{site.desc[lang] || site.desc.ar}</p>
              <a href={site.url} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "linear-gradient(135deg,#C8A951,#B8942E)", color: "#0F2530", fontWeight: 700, fontSize: ".85rem", padding: "10px 20px", borderRadius: "10px", textDecoration: "none", alignSelf: "flex-start" }}>
                {lb.visit} →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
