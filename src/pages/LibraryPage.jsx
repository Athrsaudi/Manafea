import { useState } from "react";
import Navbar from "../components/Navbar";

const langs = [
  {code:"ar",name:"العربية",dir:"rtl"},{code:"en",name:"English",dir:"ltr"},
  {code:"tr",name:"Türkçe",dir:"ltr"},{code:"ur",name:"اردو",dir:"rtl"},
  {code:"ms",name:"Melayu",dir:"ltr"},{code:"fr",name:"Français",dir:"ltr"},
  {code:"fa",name:"فارسی",dir:"rtl"},{code:"bn",name:"বাংলা",dir:"ltr"},
  {code:"hi",name:"हिन्दी",dir:"ltr"},
];

const T = {
  ar:{title:"المكتبة الإسلامية",desc:"مجموعة مختارة من أمهات الكتب الإسلامية — متاحة للتحميل مجاناً",
      read:"قراءة الكتاب",download:"تحميل PDF",all:"جميع الأقسام",pages:"صفحة",
      cats:["العقيدة","الفقه","التفسير","الحديث","السيرة","الدعوة"]},
  en:{title:"Islamic Library",desc:"A curated collection of classic Islamic books — free to download",
      read:"Read Book",download:"Download PDF",all:"All Categories",pages:"pages",
      cats:["Creed","Fiqh","Tafseer","Hadith","Biography","Dawah"]},
  tr:{title:"İslami Kütüphane",desc:"Seçme klasik İslami kitaplar — ücretsiz indirin",
      read:"Kitabı Oku",download:"PDF İndir",all:"Tümü",pages:"sayfa",
      cats:["Akaid","Fıkıh","Tefsir","Hadis","Siyer","Davet"]},
  ur:{title:"اسلامی لائبریری",desc:"منتخب کلاسیکی اسلامی کتابیں — مفت ڈاؤنلوڈ",
      read:"کتاب پڑھیں",download:"PDF ڈاؤنلوڈ",all:"تمام",pages:"صفحات",
      cats:["عقیدہ","فقہ","تفسیر","حدیث","سیرت","دعوت"]},
  ms:{title:"Perpustakaan Islam",desc:"Koleksi buku Islam klasik — muat turun percuma",
      read:"Baca Buku",download:"Muat Turun PDF",all:"Semua",pages:"halaman",
      cats:["Akidah","Fiqh","Tafsir","Hadis","Sirah","Dakwah"]},
  fr:{title:"Bibliothèque Islamique",desc:"Collection de livres islamiques classiques — téléchargement gratuit",
      read:"Lire",download:"Télécharger PDF",all:"Tous",pages:"pages",
      cats:["Akida","Fiqh","Tafsir","Hadith","Sira","Dawah"]},
  fa:{title:"کتابخانه اسلامی",desc:"مجموعه کتاب‌های اسلامی کلاسیک — دانلود رایگان",
      read:"خواندن",download:"دانلود PDF",all:"همه",pages:"صفحه",
      cats:["عقیده","فقه","تفسیر","حدیث","سیره","دعوت"]},
  bn:{title:"ইসলামিক লাইব্রেরি",desc:"নির্বাচিত ইসলামিক বই — বিনামূল্যে ডাউনলোড",
      read:"পড়ুন",download:"PDF ডাউনলোড",all:"সব",pages:"পৃষ্ঠা",
      cats:["আকিদা","ফিকহ","তাফসীর","হাদিস","সিরাহ","দাওয়াহ"]},
  hi:{title:"इस्लामी पुस्तकालय",desc:"चयनित इस्लामी पुस्तकें — मुफ्त डाउनलोड",
      read:"पढ़ें",download:"PDF डाउनलोड",all:"सभी",pages:"पृष्ठ",
      cats:["अकीदा","फिकह","तफ़सीर","हदीस","सीरत","दावत"]},
};

// كتب إسلامية حقيقية مع روابط PDF مجانية
const BOOKS = [
  {
    title:"رياض الصالحين", author:"الإمام النووي", cat:0, pages:536,
    cover:"https://covers.openlibrary.org/b/id/8739161-L.jpg",
    pdf:"https://ia800708.us.archive.org/3/items/Riyadalsaliheen/riyadalsaliheen.pdf",
    desc:"كتاب جامع للأحاديث النبوية في الآداب والأخلاق والعبادات"
  },
  {
    title:"صحيح البخاري", author:"الإمام البخاري", cat:3, pages:1690,
    cover:"https://covers.openlibrary.org/b/id/8222526-L.jpg",
    pdf:"https://ia800500.us.archive.org/7/items/BukhariSharif/BukhariSharif.pdf",
    desc:"أصح كتاب بعد القرآن الكريم في الحديث النبوي الشريف"
  },
  {
    title:"تفسير ابن كثير", author:"ابن كثير الدمشقي", cat:2, pages:2200,
    cover:"https://covers.openlibrary.org/b/id/9257993-L.jpg",
    pdf:"https://ia800500.us.archive.org/19/items/TafsirIbnKathir/TafsirIbnKathir.pdf",
    desc:"من أشهر كتب التفسير بالمأثور للقرآن الكريم"
  },
  {
    title:"العقيدة الواسطية", author:"ابن تيمية", cat:0, pages:120,
    cover:"https://covers.openlibrary.org/b/id/8091016-L.jpg",
    pdf:"https://ia800500.us.archive.org/6/items/Alwasiteyah/Alwasiteyah.pdf",
    desc:"رسالة مختصرة في بيان عقيدة أهل السنة والجماعة"
  },
  {
    title:"زاد المعاد", author:"ابن القيم الجوزية", cat:4, pages:768,
    cover:"https://covers.openlibrary.org/b/id/8222524-L.jpg",
    pdf:"https://ia800201.us.archive.org/5/items/waq9670/9670.pdf",
    desc:"كتاب في هدي النبي ﷺ في شؤون حياته وعبادته وجهاده"
  },
  {
    title:"فقه السنة", author:"سيد سابق", cat:1, pages:580,
    cover:"https://covers.openlibrary.org/b/id/8091015-L.jpg",
    pdf:"https://ia800500.us.archive.org/1/items/FiqhAl-sunna/FiqhAl-sunna.pdf",
    desc:"كتاب شامل في الفقه الإسلامي مع أدلته من السنة النبوية"
  },
  {
    title:"السيرة النبوية — ابن هشام", author:"ابن هشام", cat:4, pages:1050,
    cover:"https://covers.openlibrary.org/b/id/8739162-L.jpg",
    pdf:"https://ia800205.us.archive.org/11/items/waq70419/70419.pdf",
    desc:"أشهر كتب السيرة النبوية وأوثقها"
  },
  {
    title:"مختصر صحيح مسلم", author:"المنذري", cat:3, pages:890,
    cover:"https://covers.openlibrary.org/b/id/8222527-L.jpg",
    pdf:"https://ia800201.us.archive.org/15/items/waq25872/25872.pdf",
    desc:"مختصر من أصح كتب الحديث النبوي"
  },
  {
    title:"كيف تكون داعية ناجحاً", author:"د. خالد الجريسي", cat:5, pages:180,
    cover:"https://covers.openlibrary.org/b/id/9257992-L.jpg",
    pdf:"https://ia800300.us.archive.org/7/items/kdf_dawah/kdf_dawah.pdf",
    desc:"دليل عملي للداعية في أساليب الدعوة إلى الله"
  },
  {
    title:"تيسير الكريم الرحمن", author:"السعدي", cat:2, pages:942,
    cover:"https://covers.openlibrary.org/b/id/8091017-L.jpg",
    pdf:"https://ia800203.us.archive.org/27/items/TafsirAlSaadi/TafsirAlSaadi.pdf",
    desc:"تفسير ميسر للقرآن الكريم يسهل على القارئ"
  },
];

const COLORS = ["#1B3A4B","#2C5F7C","#0F2530","#1a4a5e","#164050","#0d3040","#1e4d60","#254d5a","#163040","#1B3A4B"];

export default function LibraryPage() {
  const [lang, setLang] = useState("ar");
  const [activeCat, setActiveCat] = useState(-1);
  const [search, setSearch] = useState("");
  const lo = langs.find(l=>l.code===lang)||langs[0];
  const dir = lo.dir;
  const ui = T[lang]||T.ar;

  const filtered = BOOKS.filter(b=>{
    const matchCat = activeCat === -1 || b.cat === activeCat;
    const matchSearch = !search || b.title.includes(search) || b.author.includes(search);
    return matchCat && matchSearch;
  });

  return (
    <div dir={dir} style={{fontFamily:"'Tajawal',sans-serif",background:"#FAFBFC",minHeight:"100vh"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=swap');
        :root{--p:#1B3A4B;--g:#C8A951;}
        .bcard{background:white;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08);transition:all .3s;cursor:pointer;}
        .bcard:hover{transform:translateY(-6px);box-shadow:0 16px 32px rgba(27,58,75,.15);}
        .cat-btn{border:2px solid #E5E7EB;background:white;border-radius:20px;padding:6px 16px;cursor:pointer;font-size:.85rem;transition:all .3s;font-family:Tajawal,sans-serif;}
        .cat-btn.active{background:var(--p);color:white;border-color:var(--p);}
        .search-input{width:100%;padding:12px 16px;border:2px solid #E5E7EB;border-radius:12px;font-size:.9rem;font-family:Tajawal,sans-serif;outline:none;box-sizing:border-box;}
        .search-input:focus{border-color:var(--g);}
        .btn-read{background:var(--p);color:white;border:none;border-radius:8px;padding:8px 16px;font-size:.8rem;cursor:pointer;font-family:Tajawal,sans-serif;text-decoration:none;display:inline-block;}
        .btn-dl{background:var(--g);color:#0F2530;border:none;border-radius:8px;padding:8px 16px;font-size:.8rem;cursor:pointer;font-family:Tajawal,sans-serif;text-decoration:none;display:inline-block;font-weight:bold;}
      `}</style>

      <Navbar lang={lang} setLang={setLang} />

      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#0F2530,#1B3A4B,#2C5F7C)",padding:"50px 20px",textAlign:"center"}}>
        <h1 style={{color:"var(--g)",fontSize:"clamp(1.6rem,4vw,2.4rem)",fontWeight:900,marginBottom:8}}>{ui.title}</h1>
        <p style={{color:"rgba(255,255,255,.7)",fontSize:"1rem",marginBottom:24}}>{ui.desc}</p>
        <input className="search-input" value={search} onChange={e=>setSearch(e.target.value)}
          placeholder={dir==="rtl"?"🔍 ابحث عن كتاب...":"🔍 Search a book..."}
          style={{maxWidth:400,direction:dir,textAlign:dir==="rtl"?"right":"left"}} />
      </div>

      <div style={{maxWidth:1200,margin:"0 auto",padding:"30px 20px"}}>

        {/* Categories */}
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:28}}>
          <button className={`cat-btn ${activeCat===-1?"active":""}`} onClick={()=>setActiveCat(-1)}>{ui.all}</button>
          {ui.cats.map((c,i)=>(
            <button key={i} className={`cat-btn ${activeCat===i?"active":""}`} onClick={()=>setActiveCat(i)}>{c}</button>
          ))}
        </div>

        {/* Books Grid */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:20}}>
          {filtered.map((b,i)=>(
            <div key={i} className="bcard">
              {/* Cover */}
              <div style={{height:200,background:COLORS[i%COLORS.length],display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden"}}>
                <img src={b.cover} alt={b.title}
                  style={{width:"100%",height:"100%",objectFit:"cover",opacity:.7}}
                  onError={e=>{e.target.style.display="none"}} />
                <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:12,textAlign:"center"}}>
                  <div style={{fontSize:"2.5rem",marginBottom:6}}>📖</div>
                  <div style={{color:"white",fontWeight:"bold",fontSize:".85rem",lineHeight:1.4,textShadow:"0 1px 4px rgba(0,0,0,.5)"}}>{b.title}</div>
                </div>
                <div style={{position:"absolute",top:8,left:8,background:"rgba(200,169,81,.95)",color:"#0F2530",fontSize:".7rem",fontWeight:"bold",padding:"2px 8px",borderRadius:8}}>
                  {ui.cats[b.cat]}
                </div>
              </div>

              {/* Info */}
              <div style={{padding:"14px"}}>
                <h3 style={{color:"var(--p)",fontWeight:"bold",fontSize:".88rem",margin:"0 0 4px"}}>{b.title}</h3>
                <p style={{color:"#6B7280",fontSize:".78rem",margin:"0 0 4px"}}>{b.author}</p>
                <p style={{color:"#9CA3AF",fontSize:".72rem",margin:"0 0 10px"}}>{b.pages} {ui.pages}</p>
                <p style={{color:"#4B5563",fontSize:".78rem",margin:"0 0 12px",lineHeight:1.5}}>{b.desc}</p>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  <a href={b.pdf} target="_blank" rel="noopener noreferrer" className="btn-read">{ui.read}</a>
                  <a href={b.pdf} download target="_blank" rel="noopener noreferrer" className="btn-dl">⬇ {ui.download}</a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{textAlign:"center",padding:"60px 0",color:"#9CA3AF"}}>
            <div style={{fontSize:"3rem",marginBottom:12}}>📚</div>
            <p>لا توجد نتائج</p>
          </div>
        )}
      </div>
    </div>
  );
}
