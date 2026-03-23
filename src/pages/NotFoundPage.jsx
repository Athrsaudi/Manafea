import { useNavigate } from "react-router-dom";
import { useLang } from "../lib/LangContext";
import Navbar from "../components/Navbar";

const T = {
  ar:{ title:"٤٠٤", sub:"الصفحة غير موجودة", desc:"عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.", btn:"العودة للرئيسية" },
  en:{ title:"404", sub:"Page Not Found", desc:"Sorry, the page you're looking for doesn't exist or has been moved.", btn:"Back to Home" },
  tr:{ title:"404", sub:"Sayfa Bulunamadı", desc:"Aradığınız sayfa bulunamadı.", btn:"Ana Sayfaya Dön" },
  ur:{ title:"٤٠٤", sub:"صفحہ نہیں ملا", desc:"معذرت، یہ صفحہ موجود نہیں۔", btn:"ہوم پر واپس" },
  ms:{ title:"404", sub:"Halaman Tidak Dijumpai", desc:"Maaf, halaman yang dicari tidak wujud.", btn:"Kembali ke Utama" },
  fr:{ title:"404", sub:"Page Introuvable", desc:"Désolé, cette page n'existe pas.", btn:"Retour à l'Accueil" },
  fa:{ title:"۴۰۴", sub:"صفحه پیدا نشد", desc:"متأسفم، این صفحه وجود ندارد.", btn:"بازگشت به خانه" },
  bn:{ title:"৪০৪", sub:"পৃষ্ঠা পাওয়া যায়নি", desc:"দুঃখিত, এই পৃষ্ঠাটি নেই।", btn:"হোমে ফিরুন" },
  hi:{ title:"४०४", sub:"पृष्ठ नहीं मिला", desc:"क्षमा करें, यह पृष्ठ मौजूद नहीं है।", btn:"होम पर वापस" },
};

export default function NotFoundPage() {
  const { lang, dir } = useLang();
  const navigate = useNavigate();
  const t = T[lang] || T.ar;

  return (
    <div dir={dir} style={{ fontFamily:"'Tajawal','Segoe UI',sans-serif", minHeight:"100vh", background:"#FAFBFC" }}>
      <Navbar />
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"70vh", padding:"40px 20px", textAlign:"center" }}>
        <div style={{ fontSize:"6rem", fontWeight:900, color:"#C8A951", lineHeight:1, marginBottom:"16px" }}>{t.title}</div>
        <h1 style={{ fontSize:"1.5rem", fontWeight:700, color:"#1B3A4B", marginBottom:"12px" }}>{t.sub}</h1>
        <p style={{ color:"#6B7280", marginBottom:"32px", maxWidth:"400px" }}>{t.desc}</p>
        <button onClick={() => navigate("/")}
          style={{ background:"linear-gradient(135deg,#C8A951,#B8942E)", color:"#0F2530", fontWeight:"bold", border:"none", borderRadius:"12px", padding:"14px 32px", fontSize:"1rem", cursor:"pointer" }}>
          {t.btn}
        </button>
      </div>
    </div>
  );
}
