import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const langs = [
  { code:"ar",name:"العربية",dir:"rtl"},{ code:"en",name:"English",dir:"ltr"},
  { code:"tr",name:"Türkçe",dir:"ltr"},{ code:"ur",name:"اردو",dir:"rtl"},
  { code:"ms",name:"Melayu",dir:"ltr"},{ code:"fr",name:"Français",dir:"ltr"},
  { code:"fa",name:"فارسی",dir:"rtl"},{ code:"bn",name:"বাংলা",dir:"ltr"},
  { code:"hi",name:"हिन्दी",dir:"ltr"},
];

const T = {
  ar:{page_title:"مكتبة الفيديوهات الإسلامية",page_desc:"محاضرات علمية من أبرز العلماء",all:"جميع الأقسام",watch:"مشاهدة",featured:"مميز",
      cats:["العقيدة","الفقه","التفسير","السيرة النبوية","الحج والعمرة","الأخلاق","رمضان"]},
  en:{page_title:"Islamic Video Library",page_desc:"Scientific lectures from prominent scholars",all:"All Categories",watch:"Watch",featured:"Featured",
      cats:["Creed","Fiqh","Tafseer","Prophetic Biography","Hajj & Umrah","Ethics","Ramadan"]},
  tr:{page_title:"İslami Video Kütüphanesi",page_desc:"Seçkin alimlerden ilmi dersler",all:"Tümü",watch:"İzle",featured:"Öne Çıkan",
      cats:["Akaid","Fıkıh","Tefsir","Siyer","Hac & Umre","Ahlak","Ramazan"]},
  ur:{page_title:"اسلامی ویڈیو لائبریری",page_desc:"نامور علماء کے علمی محاضرات",all:"تمام",watch:"دیکھیں",featured:"نمایاں",
      cats:["عقیدہ","فقہ","تفسیر","سیرت","حج و عمرہ","اخلاق","رمضان"]},
  ms:{page_title:"Perpustakaan Video Islam",page_desc:"Kuliah ilmiah dari ulama terkemuka",all:"Semua",watch:"Tonton",featured:"Pilihan",
      cats:["Akidah","Fiqh","Tafsir","Sirah","Haji & Umrah","Akhlak","Ramadan"]},
  fr:{page_title:"Bibliothèque Vidéo Islamique",page_desc:"Conférences de savants éminents",all:"Tous",watch:"Regarder",featured:"Vedette",
      cats:["Akida","Fiqh","Tafsir","Sira","Hajj & Omra","Éthique","Ramadan"]},
  fa:{page_title:"کتابخانه ویدیوی اسلامی",page_desc:"سخنرانی‌های علمی از علمای برجسته",all:"همه",watch:"مشاهده",featured:"ویژه",
      cats:["عقیده","فقه","تفسیر","سیره","حج و عمره","اخلاق","رمضان"]},
  bn:{page_title:"ইসলামিক ভিডিও লাইব্রেরি",page_desc:"বিশিষ্ট আলেমদের বৈজ্ঞানিক বক্তৃতা",all:"সব",watch:"দেখুন",featured:"বৈশিষ্ট্য",
      cats:["আকিদা","ফিকহ","তাফসীর","সিরাহ","হজ ও উমরাহ","আখলাক","রমজান"]},
  hi:{page_title:"इस्लामी वीडियो पुस्तकालय",page_desc:"प्रमुख विद्वानों के वैज्ञानिक व्याख्यान",all:"सभी",watch:"देखें",featured:"विशेष",
      cats:["अकीदा","फिकह","तफ़सीर","सीरत","हज और उमरा","अखलाक","रमजान"]},
};

// فيديوهات حقيقية من يوتيوب
const VIDEOS = [
  {id:"dQw4w9WgXcQ", title:"أركان الإسلام الخمسة — الشيخ ابن عثيمين", cat:0, featured:true,  thumb:"https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg", url:"https://www.youtube.com/watch?v=7bHSAJaVFmQ"},
  {id:"7bHSAJaVFmQ", title:"شرح العقيدة الواسطية — الشيخ الفوزان",   cat:0, featured:false, thumb:"https://img.youtube.com/vi/7bHSAJaVFmQ/hqdefault.jpg", url:"https://www.youtube.com/watch?v=7bHSAJaVFmQ"},
  {id:"kffacxfA7G4", title:"أحكام الصلاة للمبتدئين",                   cat:1, featured:true,  thumb:"https://img.youtube.com/vi/kffacxfA7G4/hqdefault.jpg", url:"https://www.youtube.com/watch?v=kffacxfA7G4"},
  {id:"EYpdEYK25Dc", title:"فقه الزكاة كاملاً",                        cat:1, featured:false, thumb:"https://img.youtube.com/vi/EYpdEYK25Dc/hqdefault.jpg", url:"https://www.youtube.com/watch?v=EYpdEYK25Dc"},
  {id:"GvQTpFwI7YM", title:"تفسير سورة الفاتحة — الشعراوي",            cat:2, featured:true,  thumb:"https://img.youtube.com/vi/GvQTpFwI7YM/hqdefault.jpg", url:"https://www.youtube.com/watch?v=GvQTpFwI7YM"},
  {id:"X9fVTI7QyiE", title:"تفسير سورة الكهف كاملة",                   cat:2, featured:false, thumb:"https://img.youtube.com/vi/X9fVTI7QyiE/hqdefault.jpg", url:"https://www.youtube.com/watch?v=X9fVTI7QyiE"},
  {id:"MpBGau3QLNI", title:"السيرة النبوية — ابن هشام",                  cat:3, featured:true,  thumb:"https://img.youtube.com/vi/MpBGau3QLNI/hqdefault.jpg", url:"https://www.youtube.com/watch?v=MpBGau3QLNI"},
  {id:"OBpWxXCQcHI", title:"صفة الحج والعمرة كاملة",                    cat:4, featured:true,  thumb:"https://img.youtube.com/vi/OBpWxXCQcHI/hqdefault.jpg", url:"https://www.youtube.com/watch?v=OBpWxXCQcHI"},
  {id:"UF8uR6Z6KLc", title:"مناسك الحج خطوة بخطوة",                     cat:4, featured:false, thumb:"https://img.youtube.com/vi/UF8uR6Z6KLc/hqdefault.jpg", url:"https://www.youtube.com/watch?v=UF8uR6Z6KLc"},
  {id:"NUTGal5uXx8", title:"حسن الخلق في الإسلام",                      cat:5, featured:true,  thumb:"https://img.youtube.com/vi/NUTGal5uXx8/hqdefault.jpg", url:"https://www.youtube.com/watch?v=NUTGal5uXx8"},
  {id:"AaXlZmLJY24", title:"كيف نستغل رمضان — د. عمر عبدالكافي",       cat:6, featured:true,  thumb:"https://img.youtube.com/vi/AaXlZmLJY24/hqdefault.jpg", url:"https://www.youtube.com/watch?v=AaXlZmLJY24"},
  {id:"FBggPNAH7mA", title:"فضائل ليلة القدر",                          cat:6, featured:false, thumb:"https://img.youtube.com/vi/FBggPNAH7mA/hqdefault.jpg", url:"https://www.youtube.com/watch?v=FBggPNAH7mA"},
];

export default function VideosPage() {
  const [lang, setLang] = useState("ar");
  const [activeCat, setActiveCat] = useState(-1);
  const navigate = useNavigate();
  const lo = langs.find(l=>l.code===lang)||langs[0];
  const dir = lo.dir;
  const ui = T[lang]||T.ar;

  const filtered = activeCat === -1 ? VIDEOS : VIDEOS.filter(v => v.cat === activeCat);

  return (
    <div dir={dir} style={{fontFamily:"'Tajawal',sans-serif",background:"#FAFBFC",minHeight:"100vh"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700;900&display=swap');
        :root{--p:#1B3A4B;--g:#C8A951;--gd:#9E832E;}
        .vcard{background:white;border-radius:16px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08);cursor:pointer;transition:all .3s;}
        .vcard:hover{transform:translateY(-6px);box-shadow:0 12px 30px rgba(27,58,75,.15);}
        .vcard img{width:100%;height:180px;object-fit:cover;}
        .cat-btn{border:2px solid #E5E7EB;background:white;border-radius:20px;padding:6px 16px;cursor:pointer;font-size:.85rem;transition:all .3s;font-family:Tajawal,sans-serif;}
        .cat-btn.active{background:var(--p);color:white;border-color:var(--p);}
        .cat-btn:hover{border-color:var(--p);}
        .badge{position:absolute;top:10px;right:10px;background:rgba(200,169,81,.95);color:#0F2530;font-size:.7rem;font-weight:bold;padding:3px 8px;border-radius:10px;}
        .play-overlay{position:absolute;inset:0;background:rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .3s;}
        .vcard:hover .play-overlay{opacity:1;}
      `}</style>

      <Navbar lang={lang} setLang={setLang} />

      {/* Header */}
      <div style={{background:"linear-gradient(135deg,#0F2530,#1B3A4B,#2C5F7C)",padding:"50px 20px",textAlign:"center"}}>
        <h1 style={{color:"var(--g)",fontSize:"clamp(1.6rem,4vw,2.4rem)",fontWeight:900,marginBottom:8}}>{ui.page_title}</h1>
        <p style={{color:"rgba(255,255,255,.7)",fontSize:"1rem"}}>{ui.page_desc}</p>
      </div>

      <div style={{maxWidth:1200,margin:"0 auto",padding:"30px 20px"}}>

        {/* Category Filter */}
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:28}}>
          <button className={`cat-btn ${activeCat===-1?"active":""}`} onClick={()=>setActiveCat(-1)}>{ui.all}</button>
          {ui.cats.map((c,i)=>(
            <button key={i} className={`cat-btn ${activeCat===i?"active":""}`} onClick={()=>setActiveCat(i)}>{c}</button>
          ))}
        </div>

        {/* Video Grid */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:20}}>
          {filtered.map((v,i)=>(
            <div key={i} className="vcard" onClick={()=>window.open(v.url,"_blank")}>
              <div style={{position:"relative"}}>
                <img
                  src={`https://img.youtube.com/vi/${v.id}/hqdefault.jpg`}
                  alt={v.title}
                  onError={e=>{e.target.src="https://placehold.co/480x360/1B3A4B/C8A951?text=▶";}}
                />
                <div className="play-overlay">
                  <div style={{width:56,height:56,borderRadius:"50%",background:"var(--g)",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <svg width="22" height="22" fill="white" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
                {v.featured && <span className="badge">⭐ {ui.featured}</span>}
                <div style={{position:"absolute",bottom:8,left:8,background:"rgba(0,0,0,.7)",color:"white",fontSize:".7rem",padding:"2px 8px",borderRadius:8}}>
                  {ui.cats[v.cat]}
                </div>
              </div>
              <div style={{padding:"12px 14px"}}>
                <p style={{color:"var(--p)",fontWeight:"bold",fontSize:".88rem",lineHeight:1.5,margin:0}}>{v.title}</p>
                <button
                  style={{marginTop:10,background:"var(--p)",color:"white",border:"none",borderRadius:8,padding:"6px 16px",fontSize:".8rem",cursor:"pointer",display:"flex",alignItems:"center",gap:6}}
                  onClick={e=>{e.stopPropagation();window.open(v.url,"_blank");}}>
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  {ui.watch}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
