import { useState, useEffect } from "react";
import { supabase as sb, supaDelete } from "../lib/supabase";
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();


const LANGS = [
  {code:"ar",name:"العربية"},
  {code:"en",name:"English"},
  {code:"tr",name:"Türkçe"},
  {code:"ur",name:"اردو"},
  {code:"ms",name:"Melayu"},
  {code:"fr",name:"Français"},
  {code:"fa",name:"فارسی"},
  {code:"bn",name:"বাংলা"},
  {code:"hi",name:"हिन्दी"},
];

const SECTIONS = [
  {id:"analytics", icon:"📊", label:"الإحصائيات"},
  {id:"videos",   icon:"🎬", label:"الفيديوهات"},
  {id:"books",    icon:"📚", label:"المكتبة"},
  {id:"hero",     icon:"🏠", label:"الصفحة الرئيسية"},
  {id:"hajj",     icon:"🕋", label:"خطوات الحج"},
  {id:"umrah",    icon:"🕌", label:"خطوات العمرة"},
  {id:"contest",  icon:"❓", label:"المسابقة"},
  {id:"feedback", icon:"💬", label:"التقييمات"},
];

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Tajawal',sans-serif}
  :root{--p:#1B3A4B;--pd:#0F2530;--pl:#2C5F7C;--g:#C8A951;--gd:#9E832E;--tx:#1a1a2e;--tl:#6B7280;--bg:#F1F5F9;--white:#fff;--border:#E2E8F0;--red:#ef4444;--green:#22c55e}
  .admin-wrap{display:flex;min-height:100vh;background:var(--bg);direction:rtl}
  .sidebar{width:240px;background:var(--pd);flex-shrink:0;display:flex;flex-direction:column;position:sticky;top:0;height:100vh;overflow-y:auto}
  .sidebar-logo{padding:24px 20px;border-bottom:1px solid rgba(255,255,255,.08)}
  .sidebar-logo h1{color:var(--g);font-size:1.2rem;font-weight:900}
  .sidebar-logo p{color:rgba(255,255,255,.4);font-size:.75rem;margin-top:2px}
  .sidebar-nav{padding:12px 10px;flex:1}
  .nav-btn{width:100%;padding:10px 14px;border:none;border-radius:10px;cursor:pointer;display:flex;align-items:center;gap:10px;font-family:'Tajawal',sans-serif;font-size:.9rem;margin-bottom:4px;transition:all .2s;text-align:right;background:transparent;color:rgba(255,255,255,.6)}
  .nav-btn:hover{background:rgba(255,255,255,.07);color:white}
  .nav-btn.active{background:rgba(200,169,81,.15);color:var(--g);font-weight:700}
  .nav-btn span:first-child{font-size:1.1rem}
  .main{flex:1;padding:28px;overflow-y:auto}
  .page-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px}
  .page-title{font-size:1.5rem;font-weight:900;color:var(--p)}
  .lang-tabs{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:20px}
  .lang-tab{padding:6px 14px;border-radius:20px;border:2px solid var(--border);background:white;cursor:pointer;font-family:'Tajawal',sans-serif;font-size:.82rem;transition:all .2s}
  .lang-tab.active{background:var(--p);color:white;border-color:var(--p);font-weight:700}
  .card{background:white;border-radius:16px;border:1px solid var(--border);overflow:hidden;margin-bottom:16px}
  .card-header{padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
  .card-title{font-weight:700;color:var(--p);font-size:.95rem}
  .card-body{padding:20px}
  .table{width:100%;border-collapse:collapse}
  .table th{text-align:right;padding:10px 14px;background:#F8FAFC;color:var(--tl);font-size:.8rem;font-weight:700;border-bottom:1px solid var(--border)}
  .table td{padding:12px 14px;border-bottom:1px solid var(--border);font-size:.85rem;color:var(--tx);vertical-align:middle}
  .table tr:last-child td{border-bottom:none}
  .table tr:hover td{background:#FAFBFC}
  .btn{padding:8px 16px;border:none;border-radius:8px;cursor:pointer;font-family:'Tajawal',sans-serif;font-size:.85rem;font-weight:700;transition:all .2s;display:inline-flex;align-items:center;gap:6px}
  .btn-primary{background:var(--p);color:white}.btn-primary:hover{background:var(--pl)}
  .btn-gold{background:linear-gradient(135deg,var(--gd),var(--g));color:var(--pd)}.btn-gold:hover{opacity:.9}
  .btn-danger{background:#FEF2F2;color:var(--red);border:1px solid #FECACA}.btn-danger:hover{background:var(--red);color:white}
  .btn-sm{padding:5px 10px;font-size:.78rem}
  .badge{display:inline-flex;align-items:center;padding:3px 10px;border-radius:20px;font-size:.72rem;font-weight:700}
  .badge-gold{background:rgba(200,169,81,.12);color:var(--gd)}
  .badge-green{background:#F0FDF4;color:#15803d}
  .badge-gray{background:#F1F5F9;color:var(--tl)}
  .form-group{margin-bottom:16px}
  .form-label{display:block;font-size:.82rem;font-weight:700;color:var(--p);margin-bottom:6px}
  .form-input{width:100%;padding:10px 14px;border:2px solid var(--border);border-radius:10px;font-family:'Tajawal',sans-serif;font-size:.88rem;outline:none;transition:border-color .2s}
  .form-input:focus{border-color:var(--g)}
  .form-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .form-row-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px}
  .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px)}
  .modal{background:white;border-radius:20px;max-width:600px;width:100%;max-height:90vh;overflow-y:auto;box-shadow:0 25px 60px rgba(0,0,0,.2)}
  .modal-header{padding:20px 24px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:white;z-index:1}
  .modal-title{font-size:1.1rem;font-weight:900;color:var(--p)}
  .modal-close{background:#F1F5F9;border:none;border-radius:8px;width:32px;height:32px;cursor:pointer;font-size:1.1rem;display:flex;align-items:center;justify-content:center}
  .modal-body{padding:24px}
  .modal-footer{padding:16px 24px;border-top:1px solid var(--border);display:flex;gap:10px;justify-content:flex-end}
  .empty-state{text-align:center;padding:60px 20px;color:var(--tl)}
  .empty-state .icon{font-size:3rem;margin-bottom:12px}
  .thumb{width:56px;height:40px;border-radius:6px;object-fit:cover;background:var(--p);display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0}
  .login-wrap{min-height:100vh;background:var(--pd);display:flex;align-items:center;justify-content:center;direction:rtl}
  .login-card{background:white;border-radius:20px;padding:40px;max-width:400px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,.3)}
  .login-logo{text-align:center;margin-bottom:28px}
  .login-logo h1{color:var(--p);font-size:1.8rem;font-weight:900}
  .login-logo p{color:var(--tl);font-size:.85rem;margin-top:4px}
  .alert{padding:10px 14px;border-radius:8px;font-size:.85rem;margin-bottom:14px}
  .alert-error{background:#FEF2F2;color:var(--red);border:1px solid #FECACA}
  .alert-success{background:#F0FDF4;color:#15803d;border:1px solid #BBF7D0}
  .switch{position:relative;display:inline-block;width:44px;height:24px}
  .switch input{opacity:0;width:0;height:0}
  .slider{position:absolute;inset:0;background:#CBD5E1;border-radius:24px;cursor:pointer;transition:.3s}
  .slider:before{position:absolute;content:"";height:18px;width:18px;right:3px;bottom:3px;background:white;border-radius:50%;transition:.3s}
  input:checked + .slider{background:var(--g)}
  input:checked + .slider:before{transform:translateX(-20px)}
  .stat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:14px;margin-bottom:24px}
  .stat-card{background:white;border-radius:14px;border:1px solid var(--border);padding:18px;text-align:center}
  .stat-num{font-size:1.8rem;font-weight:900;color:var(--p)}
  .stat-label{font-size:.78rem;color:var(--tl);margin-top:4px}
  .loading{text-align:center;padding:40px;color:var(--tl);font-size:.9rem}
  .yt-preview{width:80px;height:45px;border-radius:6px;object-fit:cover;background:var(--pd);flex-shrink:0}
`;

// ── LOGIN ──
function Login({ onLogin }) {
  const [user, setUser] = useState("admin");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true); setErr("");
    // Simple check against admins table
    const { data: verified } = await sb.rpc("verify_admin", { p_username: user, p_password: pass });
    if (verified === true) {
      // Create admin session token
      const token = crypto.randomUUID();
      const { data: admin } = await sb.from("admins").select("id").eq("username", user).single();
      await sb.from("admin_sessions").insert({ token, admin_id: admin.id });
      sessionStorage.setItem("admin_ok", "1");
      sessionStorage.setItem("admin_token", token);
      onLogin();
    } else if (verified === false) {
      setErr("كلمة المرور غير صحيحة");
    } else {
      setErr("المستخدم غير موجود");
    }
    setLoading(false);
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-logo">
          <div style={{fontSize:"2.5rem",marginBottom:8}}>🕋</div>
          <h1>لوحة التحكم</h1>
          <p>مشروع منافع</p>
        </div>
        {err && <div className="alert alert-error">{err}</div>}
        <div className="form-group">
          <label className="form-label">اسم المستخدم</label>
          <input className="form-input" value={user} onChange={e=>setUser(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">كلمة المرور</label>
          <input className="form-input" type="password" value={pass} onChange={e=>setPass(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&submit()} />
        </div>
        <button className="btn btn-gold" style={{width:"100%",padding:"12px",justifyContent:"center",fontSize:"1rem"}} onClick={submit} disabled={loading}>
          {loading ? "جارٍ الدخول..." : "دخول ←"}
        </button>
      </div>
    </div>
  );
}

// ── VIDEOS SECTION ──
function VideosSection({ lang }) {
  const [cats, setCats] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadData(); }, [lang]);

  const loadData = async () => {
    setLoading(true);
    const [cRes, vRes] = await Promise.all([
      sb.from("video_categories").select("id,slug,video_category_translations(lang,name)").order("sort_order"),
      sb.from("videos").select("id,video_url,is_featured,sort_order,lang,category_id,video_translations(lang,title,description),video_categories(slug)").eq("lang", lang).order("sort_order"),
    ]);
    setCats(cRes.data || []);
    setVideos(vRes.data || []);
    setLoading(false);
  };

  const catName = (catId) => {
    const c = cats.find(x=>x.id===catId);
    if (!c) return "";
    const t = c.video_category_translations?.find(t=>t.lang==="ar") || c.video_category_translations?.[0];
    return t?.name || c.slug;
  };

  const videoTitle = (v) => {
    const t = v.video_translations?.find(t=>t.lang===lang) || v.video_translations?.[0];
    return t?.title || "—";
  };

  const videoDesc = (v) => {
    const t = v.video_translations?.find(t=>t.lang===lang) || v.video_translations?.[0];
    return t?.description || "";
  };

  const ytId = (url) => {
    if (!url) return url;
    // Handle double-URL case: youtube.com/watch?v=https://youtu.be/ID
    const watchMatch = url.match(/[?&]v=([^&]+)/);
    if (watchMatch) {
      const val = decodeURIComponent(watchMatch[1]);
      // Check if the v= value is itself a URL (double-URL)
      const innerShort = val.match(/youtu\.be\/([^?&]+)/);
      if (innerShort) return innerShort[1];
      const innerWatch = val.match(/[?&]v=([^&]+)/);
      if (innerWatch) return innerWatch[1];
      // Plain video ID
      if (/^[A-Za-z0-9_-]{8,15}$/.test(val)) return val;
      // Fallback: extract 11-char ID pattern
      const idMatch = val.match(/([A-Za-z0-9_-]{11})/);
      if (idMatch) return idMatch[1];
      return val;
    }
    // Short URL: https://youtu.be/VIDEO_ID
    const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
    if (shortMatch) return shortMatch[1];
    // Embed URL: https://www.youtube.com/embed/VIDEO_ID
    const embedMatch = url.match(/youtube\.com\/embed\/([^?&]+)/);
    if (embedMatch) return embedMatch[1];
    // Already an ID (no slashes)
    if (/^[A-Za-z0-9_-]{8,15}$/.test(url)) return url;
    return url;
  };

  const openAdd = () => {
    setForm({ video_url:"", is_featured:false, category_id: cats[0]?.id||"", title:"", description:"", sort_order: videos.length+1 });
    setModal("add");
  };

  const openEdit = (v) => {
    setForm({
      id: v.id,
      video_url: v.video_url,
      is_featured: v.is_featured,
      category_id: v.category_id,
      title: videoTitle(v),
      description: videoDesc(v),
      sort_order: v.sort_order,
      trans_id: v.video_translations?.find(t=>t.lang===lang)?.id,
    });
    setModal("edit");
  };

  const save = async () => {
    setSaving(true);
    try {
      if (modal === "add") {
        const { data: vid } = await sb.from("videos").insert({
          video_url: form.video_url, is_featured: form.is_featured,
          category_id: form.category_id, sort_order: form.sort_order,
          lang, video_type: "youtube",
        }).select().single();
        await sb.from("video_translations").insert({ video_id: vid.id, lang, title: form.title, description: form.description });
      } else {
        await sb.from("videos").update({ video_url: form.video_url, is_featured: form.is_featured, category_id: form.category_id, sort_order: form.sort_order }).eq("id", form.id);
        if (form.trans_id) {
          await sb.from("video_translations").update({ title: form.title, description: form.description }).eq("id", form.trans_id);
        } else {
          await sb.from("video_translations").insert({ video_id: form.id, lang, title: form.title, description: form.description });
        }
      }
      setModal(null); loadData();
    } catch(e) { alert("خطأ: " + e.message); }
    setSaving(false);
  };

  const del = async (id) => {
    if (!confirm("هل تريد حذف هذا الفيديو؟")) return;
    await supaDelete("video_translations", "video_id", id);
    const { success, error } = await supaDelete("videos", "id", id);
    if (!success) { alert("⚠️ فشل الحذف: " + error); return; }
    loadData();
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">🎬 الفيديوهات — {LANGS.find(l=>l.code===lang)?.name}</h2>
        <button className="btn btn-gold" onClick={openAdd}>+ إضافة فيديو</button>
      </div>

      <div className="card">
        {loading ? <div className="loading">جارٍ التحميل...</div> :
          videos.length === 0 ? (
            <div className="empty-state"><div className="icon">🎬</div><p>لا توجد فيديوهات بهذه اللغة</p></div>
          ) : (
            <table className="table">
              <thead><tr>
                <th>الفيديو</th><th>العنوان</th><th>القسم</th><th>مميز</th><th>الترتيب</th><th>إجراءات</th>
              </tr></thead>
              <tbody>
                {videos.map(v => (
                  <tr key={v.id}>
                    <td>
                      <img src={`https://img.youtube.com/vi/${ytId(v.video_url)}/mqdefault.jpg`}
                        className="yt-preview" alt="" onError={e=>e.target.style.display='none'} />
                    </td>
                    <td><strong>{videoTitle(v)}</strong><br/><span style={{color:"var(--tl)",fontSize:".75rem"}}>{ytId(v.video_url)}</span></td>
                    <td><span className="badge badge-gold">{catName(v.category_id)}</span></td>
                    <td>{v.is_featured ? <span className="badge badge-gold">⭐ مميز</span> : <span className="badge badge-gray">عادي</span>}</td>
                    <td>{v.sort_order}</td>
                    <td style={{display:"flex",gap:6}}>
                      <button className="btn btn-primary btn-sm" onClick={()=>openEdit(v)}>تعديل</button>
                      <button className="btn btn-danger btn-sm" onClick={()=>del(v.id)}>حذف</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        }
      </div>

      {modal && (
        <div className="modal-overlay" onClick={()=>setModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{modal==="add"?"إضافة فيديو جديد":"تعديل الفيديو"}</span>
              <button className="modal-close" onClick={()=>setModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">معرف يوتيوب (YouTube ID) أو رابط الفيديو</label>
                <input className="form-input" dir="ltr" placeholder="مثال: https://www.youtube.com/watch?v=JLEnhiqiOqo أو VIDEO_ID" value={form.video_url||""} onChange={e=>{const val=e.target.value.trim();const id=ytId(val);setForm({...form,video_url:id?`https://www.youtube.com/watch?v=${id}`:val});}} />
                {form.video_url && <img src={`https://img.youtube.com/vi/${ytId(form.video_url)}/mqdefault.jpg`} style={{marginTop:8,borderRadius:8,width:"100%",maxHeight:160,objectFit:"cover"}} />}
              </div>
              <div className="form-group">
                <label className="form-label">العنوان ({LANGS.find(l=>l.code===lang)?.name})</label>
                <input className="form-input" value={form.title||""} onChange={e=>setForm({...form,title:e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">الوصف</label>
                <input className="form-input" value={form.description||""} onChange={e=>setForm({...form,description:e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">القسم</label>
                  <select className="form-input" value={form.category_id||""} onChange={e=>setForm({...form,category_id:e.target.value})}>
                    {cats.map(c=><option key={c.id} value={c.id}>{catName(c.id)} — {c.slug}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">الترتيب</label>
                  <input className="form-input" type="number" value={form.sort_order||1} onChange={e=>setForm({...form,sort_order:+e.target.value})} />
                </div>
              </div>
              <div className="form-group" style={{display:"flex",alignItems:"center",gap:10}}>
                <label className="switch"><input type="checkbox" checked={form.is_featured||false} onChange={e=>setForm({...form,is_featured:e.target.checked})}/><span className="slider"></span></label>
                <span className="form-label" style={{margin:0}}>مميز ⭐</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" style={{opacity:1}} onClick={save} disabled={saving}>{saving?"جارٍ الحفظ...":"حفظ"}</button>
              <button className="btn" style={{background:"#F1F5F9"}} onClick={()=>setModal(null)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── BOOKS SECTION ──
function BooksSection({ lang }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadData(); }, [lang]);

  const loadData = async () => {
    setLoading(true);
    const { data } = await sb.from("books").select("id,pdf_url,cover_url,pages,sort_order,lang,book_translations(id,lang,title,author,description)").eq("lang",lang).order("sort_order");
    setBooks(data||[]);
    setLoading(false);
  };

  const getT = (b) => b.book_translations?.find(t=>t.lang===lang)||b.book_translations?.[0]||{};

  const openAdd = () => {
    setForm({pdf_url:"",cover_url:"",pages:0,title:"",author:"",description:"",sort_order:books.length+1});
    setModal("add");
  };

  const openEdit = (b) => {
    const t = getT(b);
    setForm({id:b.id,pdf_url:b.pdf_url,cover_url:b.cover_url||"",pages:b.pages||0,title:t.title||"",author:t.author||"",description:t.description||"",sort_order:b.sort_order,trans_id:t.id});
    setModal("edit");
  };

  const save = async () => {
    setSaving(true);
    try {
      // رفع غلاف الكتاب إن وجد
      let coverUrl = form.cover_url || "";
      if (form.coverFile) {
        const covName = `${Date.now()}_${form.coverFile.name.replace(/[^a-zA-Z0-9._-]/g,'_')}`;
        const { error: covErr } = await sb.storage.from("covers").upload(`books/${lang}/${covName}`, form.coverFile, {upsert:true});
        if (!covErr) {
          const { data: { publicUrl } } = sb.storage.from("covers").getPublicUrl(`books/${lang}/${covName}`);
          coverUrl = publicUrl;
        }
      }

      // رفع ملف PDF إن وجد
      let pdfUrl = form.pdf_url || "";
      if (form.pdfFile) {
        const fileName = `${Date.now()}_${form.pdfFile.name.replace(/[^a-zA-Z0-9._-]/g,'_')}`;
        const { data: uploaded, error: upErr } = await sb.storage
          .from("books")
          .upload(`pdfs/${lang}/${fileName}`, form.pdfFile, { upsert: true });
        if (upErr) throw new Error("فشل رفع الملف: " + upErr.message);
        const { data: { publicUrl } } = sb.storage.from("books").getPublicUrl(`pdfs/${lang}/${fileName}`);
        pdfUrl = publicUrl;
      }
      if (!pdfUrl) { alert("يجب إضافة ملف PDF أو رابط"); setSaving(false); return; }

      if (modal==="add") {
        const {data:bk} = await sb.from("books").insert({pdf_url:pdfUrl,cover_url:coverUrl||null,pages:form.pages||0,sort_order:form.sort_order,lang}).select().single();
        await sb.from("book_translations").insert({book_id:bk.id,lang,title:form.title,author:form.author,description:form.description});
      } else {
        await sb.from("books").update({pdf_url:pdfUrl,cover_url:coverUrl||null,pages:form.pages||0,sort_order:form.sort_order}).eq("id",form.id);
        if(form.trans_id) await sb.from("book_translations").update({title:form.title,author:form.author,description:form.description}).eq("id",form.trans_id);
        else await sb.from("book_translations").insert({book_id:form.id,lang,title:form.title,author:form.author,description:form.description});
      }
      setModal(null); loadData();
    } catch(e) { alert("خطأ: "+e.message); }
    setSaving(false);
  };

  const del = async (id) => {
    if(!confirm("هل تريد حذف هذا الكتاب؟")) return;
    await supaDelete("book_translations", "book_id", id);
    const { success, error } = await supaDelete("books", "id", id);
    if (!success) { alert("⚠️ فشل الحذف: " + error); return; }
    loadData();
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">📚 المكتبة — {LANGS.find(l=>l.code===lang)?.name}</h2>
        <button className="btn btn-gold" onClick={openAdd}>+ إضافة كتاب</button>
      </div>
      <div className="card">
        {loading ? <div className="loading">جارٍ التحميل...</div> :
          books.length===0 ? <div className="empty-state"><div className="icon">📚</div><p>لا توجد كتب بهذه اللغة</p></div> : (
            <table className="table">
              <thead><tr><th>الكتاب</th><th>العنوان</th><th>المؤلف</th><th>الصفحات</th><th>رابط PDF</th><th>الترتيب</th><th>إجراءات</th></tr></thead>
              <tbody>
                {books.map(b=>{const t=getT(b); return (
                  <tr key={b.id}>
                    <td><div className="thumb">📖</div></td>
                    <td><strong>{t.title||"—"}</strong></td>
                    <td style={{color:"var(--tl)"}}>{t.author||"—"}</td>
                    <td>{b.pages||0} صفحة</td>
                    <td><a href={b.pdf_url} target="_blank" style={{color:"var(--g)",fontSize:".78rem"}}>فتح PDF ↗</a></td>
                    <td>{b.sort_order}</td>
                    <td style={{display:"flex",gap:6}}>
                      <button className="btn btn-primary btn-sm" onClick={()=>openEdit(b)}>تعديل</button>
                      <button className="btn btn-danger btn-sm" onClick={()=>del(b.id)}>حذف</button>
                    </td>
                  </tr>
                );})}
              </tbody>
            </table>
          )
        }
      </div>

      {modal && (
        <div className="modal-overlay" onClick={()=>setModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{modal==="add"?"إضافة كتاب":"تعديل الكتاب"}</span>
              <button className="modal-close" onClick={()=>setModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              {modal==="add" && <div className="alert alert-success" style={{marginBottom:14,fontSize:".82rem"}}>
                📝 <strong>الخطوات:</strong> ١- اكتب عنوان الكتاب ← ٢- اكتب المؤلف ← ٣- ارفع ملف PDF ← ٤- احفظ
              </div>}
              <div className="form-group">
                <label className="form-label">عنوان الكتاب ({LANGS.find(l=>l.code===lang)?.name})</label>
                <input className="form-input" placeholder="مثال: رياض الصالحين" value={form.title||""}
                  onChange={e=>setForm({...form,title:e.target.value})}
                  onBlur={async e=>{
                    const title = e.target.value.trim();
                    if(!title || form.coverFile || form.cover_url || form.coverPreview) return;
                    // بحث تلقائي عن غلاف الكتاب
                    try {
                      const q = encodeURIComponent(title);
                      const res = await fetch(`https://openlibrary.org/search.json?title=${q}&limit=1&fields=key,cover_i`);
                      const json = await res.json();
                      const coverId = json?.docs?.[0]?.cover_i;
                      if(coverId) {
                        const coverUrl = `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
                        setForm(f=>({...f, coverPreview:coverUrl, cover_url:coverUrl}));
                      }
                    } catch(err) { /* فشل البحث بصمت */ }
                  }} />
                {form.coverPreview && (
                  <div style={{marginTop:8,display:'flex',alignItems:'center',gap:8}}>
                    <img src={form.coverPreview} style={{width:60,height:80,objectFit:'cover',borderRadius:6,border:'2px solid var(--g)'}} />
                    <div>
                      <p style={{fontSize:'.72rem',color:'var(--g)',fontWeight:'bold'}}>✅ غلاف وُجد تلقائياً</p>
                      <button type="button" onClick={()=>setForm(f=>({...f,coverPreview:'',cover_url:'',coverFile:null}))}
                        style={{fontSize:'.7rem',color:'var(--red)',background:'none',border:'none',cursor:'pointer',padding:0,marginTop:2}}>
                        × احذف واضف غلافاً مخصصاً
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="form-group"><label className="form-label">المؤلف</label><input className="form-input" value={form.author||""} onChange={e=>setForm({...form,author:e.target.value})} /></div>
              <div className="form-group"><label className="form-label">الوصف</label><input className="form-input" value={form.description||""} onChange={e=>setForm({...form,description:e.target.value})} /></div>
              {/* ── PDF ── */}
              <div className="form-group">
                <label className="form-label">📄 ملف PDF — ارفع من جهازك</label>
                <input type="file" accept="application/pdf" className="form-input" style={{padding:"8px"}}
                  onChange={async e=>{
                    const file = e.target.files[0];
                    if(!file) return;
                    setForm(prev=>({...prev, pdfFile:file, pdfName:file.name, coverLoading:true}));
                    // استخراج الغلاف من الصفحة الأولى
                    try {
                      const arrayBuffer = await file.arrayBuffer();
                      const pdf = await pdfjsLib.getDocument({data:arrayBuffer}).promise;
                      const page = await pdf.getPage(1);
                      const viewport = page.getViewport({scale:2});
                      const canvas = document.createElement("canvas");
                      canvas.width = viewport.width;
                      canvas.height = viewport.height;
                      await page.render({canvasContext:canvas.getContext("2d"), viewport}).promise;
                      canvas.toBlob(blob => {
                        const coverFile = new File([blob], "cover.jpg", {type:"image/jpeg"});
                        const coverPreview = URL.createObjectURL(blob);
                        setForm(prev=>({...prev, coverFile, coverPreview, cover_url:"", coverLoading:false}));
                      }, "image/jpeg", 0.85);
                    } catch(err) {
                      console.warn("PDF cover failed:", err);
                      setForm(prev=>({...prev, coverLoading:false}));
                    }
                  }} />
                {form.pdfName && <p style={{fontSize:".75rem",color:"var(--g)",marginTop:4}}>📄 {form.pdfName}</p>}
                {form.coverLoading && <p style={{fontSize:".75rem",color:"var(--tl)",marginTop:4}}>⏳ جارٍ استخراج الغلاف...</p>}
              </div>
              <div className="form-group">
                <label className="form-label">أو رابط PDF مباشر</label>
                <input className="form-input" placeholder="https://..." value={form.pdf_url||""} onChange={e=>setForm({...form,pdf_url:e.target.value})} />
              </div>

              {/* ── غلاف الكتاب ── */}
              {form.coverPreview && (
                <div className="form-group">
                  <label className="form-label">🖼️ الغلاف</label>
                  <div style={{display:"flex",alignItems:"flex-start",gap:12}}>
                    <img src={form.coverPreview} style={{width:80,height:110,objectFit:"cover",borderRadius:8,border:"2px solid var(--g)",flexShrink:0}} />
                    <div>
                      <p style={{fontSize:".78rem",color:"var(--g)",fontWeight:"bold",marginBottom:6}}>✅ مُستخرج تلقائياً من PDF</p>
                      <label className="form-label" style={{marginBottom:4}}>استبدله بصورة مخصصة:</label>
                      <input type="file" accept="image/*" className="form-input" style={{padding:"6px",fontSize:".78rem"}}
                        onChange={e=>{
                          const f=e.target.files[0];
                          if(f) setForm(prev=>({...prev,coverFile:f,coverPreview:URL.createObjectURL(f)}));
                        }} />
                    </div>
                  </div>
                </div>
              )}
              {!form.coverPreview && (
                <div className="form-group">
                  <label className="form-label">🖼️ غلاف مخصص (اختياري — يُستخرج تلقائياً من PDF)</label>
                  <input type="file" accept="image/*" className="form-input" style={{padding:"8px"}}
                    onChange={e=>{
                      const f=e.target.files[0];
                      if(f) setForm(prev=>({...prev,coverFile:f,coverPreview:URL.createObjectURL(f)}));
                    }} />
                  <div className="form-group" style={{marginTop:8,marginBottom:0}}>
                    <input className="form-input" placeholder="أو رابط صورة الغلاف https://..." value={form.cover_url||""}
                      onChange={e=>setForm({...form,cover_url:e.target.value,coverPreview:e.target.value})} />
                  </div>
                </div>
              )}

              <div className="form-row">
                <div className="form-group"><label className="form-label">عدد الصفحات</label><input className="form-input" type="number" min="0" placeholder="0" value={form.pages||""} onChange={e=>setForm({...form,pages:+e.target.value})} /></div>
                <div className="form-group"><label className="form-label">الترتيب</label><input className="form-input" type="number" value={form.sort_order||1} onChange={e=>setForm({...form,sort_order:+e.target.value})} /></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={save} disabled={saving}>{saving?"جارٍ الحفظ...":"حفظ"}</button>
              <button className="btn" style={{background:"#F1F5F9"}} onClick={()=>setModal(null)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── HERO SECTION ──
function HeroSection({ lang }) {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadData(); }, [lang]);

  const loadData = async () => {
    setLoading(true);
    const { data } = await sb.from("hero_slides").select("id,sort_order,is_active,hero_slide_translations(id,lang,ayah_text,surah_name)").order("sort_order");
    setSlides(data||[]);
    setLoading(false);
  };

  const getT = (s) => s.hero_slide_translations?.find(t=>t.lang===lang)||{};

  const openAdd = () => {
    setForm({ayah_text:"",surah_name:"",sort_order:slides.length+1,is_active:true});
    setModal("add");
  };

  const openEdit = (s) => {
    const t = getT(s);
    setForm({id:s.id,ayah_text:t.ayah_text||"",surah_name:t.surah_name||"",sort_order:s.sort_order,is_active:s.is_active,trans_id:t.id});
    setModal("edit");
  };

  const save = async () => {
    setSaving(true);
    try {
      if(modal==="add"){
        const {data:sl} = await sb.from("hero_slides").insert({sort_order:form.sort_order,is_active:form.is_active}).select().single();
        await sb.from("hero_slide_translations").insert({slide_id:sl.id,lang,ayah_text:form.ayah_text,surah_name:form.surah_name});
      } else {
        await sb.from("hero_slides").update({sort_order:form.sort_order,is_active:form.is_active}).eq("id",form.id);
        if(form.trans_id) await sb.from("hero_slide_translations").update({ayah_text:form.ayah_text,surah_name:form.surah_name}).eq("id",form.trans_id);
        else await sb.from("hero_slide_translations").insert({slide_id:form.id,lang,ayah_text:form.ayah_text,surah_name:form.surah_name});
      }
      setModal(null); loadData();
    } catch(e){ alert("خطأ: "+e.message); }
    setSaving(false);
  };

  const del = async (id) => {
    if(!confirm("حذف هذه الشريحة؟")) return;
    await supaDelete("hero_slide_translations", "slide_id", id);
    const { success, error } = await supaDelete("hero_slides", "id", id);
    if (!success) { alert("⚠️ فشل الحذف: " + error); return; }
    loadData();
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">🏠 الصفحة الرئيسية — {LANGS.find(l=>l.code===lang)?.name}</h2>
        <button className="btn btn-gold" onClick={openAdd}>+ إضافة آية</button>
      </div>
      <div className="card">
        {loading ? <div className="loading">جارٍ التحميل...</div> :
          slides.length===0 ? <div className="empty-state"><div className="icon">📖</div><p>لا توجد آيات بهذه اللغة</p></div> : (
            <table className="table">
              <thead><tr><th>نص الآية</th><th>المصدر</th><th>الترتيب</th><th>مفعل</th><th>إجراءات</th></tr></thead>
              <tbody>
                {slides.map(s=>{const t=getT(s); return (
                  <tr key={s.id}>
                    <td style={{maxWidth:300,fontFamily:"'Amiri',serif",fontSize:"1rem"}}>{t.ayah_text||<span style={{color:"var(--tl)"}}>لا ترجمة لهذه اللغة</span>}</td>
                    <td style={{color:"var(--tl)"}}>{t.surah_name||"—"}</td>
                    <td>{s.sort_order}</td>
                    <td>{s.is_active?<span className="badge badge-green">✓ مفعل</span>:<span className="badge badge-gray">معطل</span>}</td>
                    <td style={{display:"flex",gap:6}}>
                      <button className="btn btn-primary btn-sm" onClick={()=>openEdit(s)}>تعديل</button>
                      <button className="btn btn-danger btn-sm" onClick={()=>del(s.id)}>حذف</button>
                    </td>
                  </tr>
                );})}
              </tbody>
            </table>
          )
        }
      </div>

      {modal && (
        <div className="modal-overlay" onClick={()=>setModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{modal==="add"?"إضافة آية":"تعديل الآية"}</span>
              <button className="modal-close" onClick={()=>setModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group"><label className="form-label">نص الآية ({LANGS.find(l=>l.code===lang)?.name})</label><textarea className="form-input" rows={3} style={{resize:"vertical"}} value={form.ayah_text||""} onChange={e=>setForm({...form,ayah_text:e.target.value})} /></div>
              <div className="form-group"><label className="form-label">المصدر (مثال: سورة الحج 28)</label><input className="form-input" value={form.surah_name||""} onChange={e=>setForm({...form,surah_name:e.target.value})} /></div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">الترتيب</label><input className="form-input" type="number" value={form.sort_order||1} onChange={e=>setForm({...form,sort_order:+e.target.value})} /></div>
                <div className="form-group" style={{display:"flex",alignItems:"center",gap:10,marginTop:24}}>
                  <label className="switch"><input type="checkbox" checked={form.is_active||false} onChange={e=>setForm({...form,is_active:e.target.checked})}/><span className="slider"></span></label>
                  <span>مفعل</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={save} disabled={saving}>{saving?"جارٍ الحفظ...":"حفظ"}</button>
              <button className="btn" style={{background:"#F1F5F9"}} onClick={()=>setModal(null)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── STEPS SECTION (Hajj & Umrah) ──
function StepsSection({ lang, type }) {
  const table = type==="hajj" ? "hajj_steps" : "umrah_steps";
  const transTable = type==="hajj" ? "hajj_step_translations" : "umrah_step_translations";
  const label = type==="hajj" ? "🕋 خطوات الحج" : "🕌 خطوات العمرة";

  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadData(); }, [lang, type]);

  const loadData = async () => {
    setLoading(true);
    const { data } = await sb.from(table).select(`id,sort_order,icon_url,${transTable}(id,lang,title,description,dua)`).order("sort_order");
    setSteps(data||[]);
    setLoading(false);
  };

  const getT = (s) => s[transTable]?.find(t=>t.lang===lang)||{};

  const openAdd = () => setForm({title:"",description:"",dua:"",icon_url:"",sort_order:steps.length+1}) || setModal("add");
  const openEdit = (s) => {
    const t=getT(s);
    setForm({id:s.id,title:t.title||"",description:t.description||"",dua:t.dua||"",icon_url:s.icon_url||"",sort_order:s.sort_order,trans_id:t.id});
    setModal("edit");
  };

  const save = async () => {
    setSaving(true);
    try {
      if(modal==="add"){
        const {data:st} = await sb.from(table).insert({sort_order:form.sort_order,icon_url:form.icon_url||null}).select().single();
        await sb.from(transTable).insert({step_id:st.id,lang,title:form.title,description:form.description,dua:form.dua});
      } else {
        await sb.from(table).update({sort_order:form.sort_order,icon_url:form.icon_url||null}).eq("id",form.id);
        if(form.trans_id) await sb.from(transTable).update({title:form.title,description:form.description,dua:form.dua}).eq("id",form.trans_id);
        else await sb.from(transTable).insert({step_id:form.id,lang,title:form.title,description:form.description,dua:form.dua});
      }
      setModal(null); loadData();
    } catch(e){ alert("خطأ: "+e.message); }
    setSaving(false);
  };

  const del = async (id) => {
    if(!confirm("حذف هذه الخطوة؟")) return;
    await supaDelete(transTable, "step_id", id);
    const { success, error } = await supaDelete(table, "id", id);
    if (!success) { alert("⚠️ فشل الحذف: " + error); return; }
    loadData();
  };

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">{label} — {LANGS.find(l=>l.code===lang)?.name}</h2>
        <button className="btn btn-gold" onClick={openAdd}>+ إضافة خطوة</button>
      </div>
      <div className="card">
        {loading ? <div className="loading">جارٍ التحميل...</div> :
          steps.length===0 ? <div className="empty-state"><div className="icon">{type==="hajj"?"🕋":"🕌"}</div><p>لا توجد خطوات بهذه اللغة</p></div> : (
            <table className="table">
              <thead><tr><th>#</th><th>العنوان</th><th>الوصف</th><th>الدعاء</th><th>إجراءات</th></tr></thead>
              <tbody>
                {steps.map(s=>{const t=getT(s); return (
                  <tr key={s.id}>
                    <td><strong>{s.sort_order}</strong></td>
                    <td><strong>{t.title||<span style={{color:"var(--tl)"}}>لا ترجمة</span>}</strong></td>
                    <td style={{color:"var(--tl)",maxWidth:200,fontSize:".78rem"}}>{t.description?.slice(0,80)||"—"}</td>
                    <td style={{color:"var(--tl)",fontSize:".75rem"}}>{t.dua?.slice(0,50)||"—"}</td>
                    <td style={{display:"flex",gap:6}}>
                      <button className="btn btn-primary btn-sm" onClick={()=>openEdit(s)}>تعديل</button>
                      <button className="btn btn-danger btn-sm" onClick={()=>del(s.id)}>حذف</button>
                    </td>
                  </tr>
                );})}
              </tbody>
            </table>
          )
        }
      </div>

      {modal && (
        <div className="modal-overlay" onClick={()=>setModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{modal==="add"?"إضافة خطوة":"تعديل الخطوة"}</span>
              <button className="modal-close" onClick={()=>setModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <div className="form-group"><label className="form-label">العنوان ({LANGS.find(l=>l.code===lang)?.name})</label><input className="form-input" value={form.title||""} onChange={e=>setForm({...form,title:e.target.value})} /></div>
                <div className="form-group"><label className="form-label">الترتيب</label><input className="form-input" type="number" value={form.sort_order||1} onChange={e=>setForm({...form,sort_order:+e.target.value})} /></div>
              </div>
              <div className="form-group"><label className="form-label">الوصف</label><textarea className="form-input" rows={3} style={{resize:"vertical"}} value={form.description||""} onChange={e=>setForm({...form,description:e.target.value})} /></div>
              <div className="form-group"><label className="form-label">الدعاء</label><textarea className="form-input" rows={3} style={{resize:"vertical",fontFamily:"'Amiri',serif"}} value={form.dua||""} onChange={e=>setForm({...form,dua:e.target.value})} /></div>
              <div className="form-group"><label className="form-label">رابط الأيقونة (اختياري)</label><input className="form-input" placeholder="https://..." value={form.icon_url||""} onChange={e=>setForm({...form,icon_url:e.target.value})} /></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={save} disabled={saving}>{saving?"جارٍ الحفظ...":"حفظ"}</button>
              <button className="btn" style={{background:"#F1F5F9"}} onClick={()=>setModal(null)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── CONTEST SECTION ──
function ContestSection({ lang }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadData(); }, [lang]);

  const loadData = async () => {
    setLoading(true);
    const { data } = await sb.from("contest_questions").select("id,is_active,lang,contest_question_translations(id,lang,question_text,option_a,option_b,option_c,option_d,correct_option)").eq("lang",lang).order("created_at",{ascending:false});
    setQuestions(data||[]);
    setLoading(false);
  };

  const getT = (q) => q.contest_question_translations?.find(t=>t.lang===lang)||{};

  const openAdd = () => { setForm({question_text:"",option_a:"",option_b:"",option_c:"",option_d:"",correct_option:"a",is_active:true}); setModal("add"); };
  const openEdit = (q) => {
    const t=getT(q);
    setForm({id:q.id,question_text:t.question_text||"",option_a:t.option_a||"",option_b:t.option_b||"",option_c:t.option_c||"",option_d:t.option_d||"",correct_option:t.correct_option||"a",is_active:q.is_active,trans_id:t.id});
    setModal("edit");
  };

  const save = async () => {
    setSaving(true);
    try {
      const trans = {lang,question_text:form.question_text,option_a:form.option_a,option_b:form.option_b,option_c:form.option_c,option_d:form.option_d,correct_option:form.correct_option};
      if(modal==="add"){
        const {data:q} = await sb.from("contest_questions").insert({lang,is_active:form.is_active}).select().single();
        await sb.from("contest_question_translations").insert({...trans,question_id:q.id});
      } else {
        await sb.from("contest_questions").update({is_active:form.is_active}).eq("id",form.id);
        if(form.trans_id) await sb.from("contest_question_translations").update(trans).eq("id",form.trans_id);
        else await sb.from("contest_question_translations").insert({...trans,question_id:form.id});
      }
      setModal(null); loadData();
    } catch(e){ alert("خطأ: "+e.message); }
    setSaving(false);
  };

  const del = async (id) => {
    if(!confirm("حذف هذا السؤال؟")) return;
    await supaDelete("contest_question_translations", "question_id", id);
    const { success, error } = await supaDelete("contest_questions", "id", id);
    if (!success) { alert("⚠️ فشل الحذف: " + error); return; }
    loadData();
  };

  const opts = ["a","b","c","d"];

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">❓ المسابقة — {LANGS.find(l=>l.code===lang)?.name}</h2>
        <button className="btn btn-gold" onClick={openAdd}>+ إضافة سؤال</button>
      </div>
      <div className="card">
        {loading ? <div className="loading">جارٍ التحميل...</div> :
          questions.length===0 ? <div className="empty-state"><div className="icon">❓</div><p>لا توجد أسئلة بهذه اللغة</p></div> : (
            <table className="table">
              <thead><tr><th>السؤال</th><th>الإجابة الصحيحة</th><th>مفعل</th><th>إجراءات</th></tr></thead>
              <tbody>
                {questions.map(q=>{const t=getT(q); return (
                  <tr key={q.id}>
                    <td style={{maxWidth:300}}><strong>{t.question_text||<span style={{color:"var(--tl)"}}>لا ترجمة</span>}</strong></td>
                    <td><span className="badge badge-gold">{t.correct_option?.toUpperCase()} — {t[`option_${t.correct_option}`]||"—"}</span></td>
                    <td>{q.is_active?<span className="badge badge-green">✓ مفعل</span>:<span className="badge badge-gray">معطل</span>}</td>
                    <td style={{display:"flex",gap:6}}>
                      <button className="btn btn-primary btn-sm" onClick={()=>openEdit(q)}>تعديل</button>
                      <button className="btn btn-danger btn-sm" onClick={()=>del(q.id)}>حذف</button>
                    </td>
                  </tr>
                );})}
              </tbody>
            </table>
          )
        }
      </div>

      {modal && (
        <div className="modal-overlay" onClick={()=>setModal(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">{modal==="add"?"إضافة سؤال":"تعديل السؤال"}</span>
              <button className="modal-close" onClick={()=>setModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group"><label className="form-label">نص السؤال ({LANGS.find(l=>l.code===lang)?.name})</label><textarea className="form-input" rows={2} value={form.question_text||""} onChange={e=>setForm({...form,question_text:e.target.value})} /></div>
              <div className="form-row">
                {opts.map(o=>(
                  <div className="form-group" key={o}>
                    <label className="form-label">الخيار {o.toUpperCase()}</label>
                    <input className="form-input" value={form[`option_${o}`]||""} onChange={e=>setForm({...form,[`option_${o}`]:e.target.value})} />
                  </div>
                ))}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">الإجابة الصحيحة</label>
                  <select className="form-input" value={form.correct_option||"a"} onChange={e=>setForm({...form,correct_option:e.target.value})}>
                    {opts.map(o=><option key={o} value={o}>{o.toUpperCase()} — {form[`option_${o}`]||""}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{display:"flex",alignItems:"center",gap:10,marginTop:24}}>
                  <label className="switch"><input type="checkbox" checked={form.is_active||false} onChange={e=>setForm({...form,is_active:e.target.checked})}/><span className="slider"></span></label>
                  <span>مفعل</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={save} disabled={saving}>{saving?"جارٍ الحفظ...":"حفظ"}</button>
              <button className="btn" style={{background:"#F1F5F9"}} onClick={()=>setModal(null)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── FEEDBACK SECTION ──
function FeedbackSection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const { data } = await sb.from("feedback").select("*").order("created_at",{ascending:false}).limit(100);
    setItems(data||[]);
    setLoading(false);
  };

  const del = async (id) => {
    if(!confirm("حذف هذا التقييم؟")) return;
    const { success, error } = await supaDelete("feedback", "id", id);
    if (!success) { alert("⚠️ فشل الحذف: " + error); return; }
    loadData();
  };

  const avgRating = items.length ? (items.reduce((s,i)=>s+(i.rating||0),0)/items.length).toFixed(1) : "—";

  return (
    <div>
      <div className="page-header">
        <h2 className="page-title">💬 التقييمات</h2>
      </div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-num">{items.length}</div><div className="stat-label">إجمالي التقييمات</div></div>
        <div className="stat-card"><div className="stat-num">⭐ {avgRating}</div><div className="stat-label">متوسط التقييم</div></div>
        <div className="stat-card"><div className="stat-num">{items.filter(i=>i.rating>=4).length}</div><div className="stat-label">تقييمات ممتازة (4-5)</div></div>
      </div>
      <div className="card">
        {loading ? <div className="loading">جارٍ التحميل...</div> :
          items.length===0 ? <div className="empty-state"><div className="icon">💬</div><p>لا توجد تقييمات بعد</p></div> : (
            <table className="table">
              <thead><tr><th>التقييم</th><th>التعليق</th><th>اللغة</th><th>التاريخ</th><th>حذف</th></tr></thead>
              <tbody>
                {items.map(i=>(
                  <tr key={i.id}>
                    <td>{"⭐".repeat(i.rating||0)}</td>
                    <td style={{maxWidth:300,color:"var(--tl)",fontSize:".85rem"}}>{i.comment||"—"}</td>
                    <td><span className="badge badge-gold">{i.lang||"—"}</span></td>
                    <td style={{color:"var(--tl)",fontSize:".78rem"}}>{new Date(i.created_at).toLocaleDateString("ar")}</td>
                    <td><button className="btn btn-danger btn-sm" onClick={()=>del(i.id)}>حذف</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        }
      </div>
    </div>
  );
}


// ── ANALYTICS SECTION ──
function AnalyticsSection() {
  const [data, setData] = useState(null);
  const [days, setDays] = useState(30);
  const [loading, setLoading] = useState(true);

  const load = async (d) => {
    setLoading(true);
    const { data: res } = await sb.rpc("get_analytics_summary", { days_back: d });
    setData(res);
    setLoading(false);
  };

  useEffect(() => { load(days); }, [days]);

  const PAGE_NAMES = {
    "/":"الرئيسية","/videos":"الفيديوهات","/library":"المكتبة",
    "/quran":"القرآن","/hajj":"الحج","/umrah":"العمرة","/contest":"المسابقة"
  };

  const LANG_NAMES = {
    ar:"العربية",en:"English",tr:"Türkçe",ur:"اردو",
    ms:"Melayu",fr:"Français",fa:"فارسی",bn:"বাংলা",hi:"हिन्दी"
  };

  if (loading) return <div style={{textAlign:"center",padding:"60px",color:"var(--g)"}}>⏳ جارٍ تحميل الإحصائيات...</div>;
  if (!data) return <div style={{textAlign:"center",padding:"60px"}}>لا توجد بيانات بعد</div>;

  const statBox = (num, label, icon) => (
    <div style={{background:"var(--bg2)",borderRadius:12,padding:"20px 16px",textAlign:"center",flex:1,minWidth:120}}>
      <div style={{fontSize:"2rem",fontWeight:900,color:"var(--g)"}}>{icon} {(num||0).toLocaleString()}</div>
      <div style={{fontSize:"0.8rem",color:"#888",marginTop:4}}>{label}</div>
    </div>
  );

  const barChart = (items, labelKey, valueKey, nameMap) => (
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      {(items||[]).slice(0,8).map((item,i) => {
        const max = items[0]?.[valueKey] || 1;
        const pct = Math.round((item[valueKey]/max)*100);
        return (
          <div key={i} style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{minWidth:100,fontSize:"0.8rem",textAlign:"right",color:"var(--tx)"}}>{nameMap?.[item[labelKey]]||item[labelKey]}</div>
            <div style={{flex:1,background:"rgba(200,169,81,0.1)",borderRadius:4,height:20,position:"relative"}}>
              <div style={{width:pct+"%",background:"linear-gradient(90deg,#C8A951,#B8942E)",height:"100%",borderRadius:4,transition:"width 0.5s"}}/>
            </div>
            <div style={{minWidth:36,fontSize:"0.8rem",fontWeight:"bold",color:"var(--g)"}}>{item[valueKey]}</div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h2 style={{fontSize:"1.1rem",fontWeight:"bold",color:"var(--p)"}}>📊 إحصائيات الموقع</h2>
        <div style={{display:"flex",gap:8}}>
          {[7,30,90].map(d => (
            <button key={d} onClick={()=>{setDays(d);load(d);}}
              style={{padding:"6px 14px",borderRadius:20,border:"1px solid var(--g)",background:days===d?"var(--g)":"transparent",color:days===d?"#0F2530":"var(--g)",cursor:"pointer",fontSize:"0.8rem",fontWeight:"bold"}}>
              {d} يوم
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:24}}>
        {statBox(data.total_views,    "إجمالي المشاهدات",    "👁️")}
        {statBox(data.unique_sessions,"زوار فريدون",          "👥")}
        {statBox((data.by_country||[]).length, "دولة مختلفة", "🌍")}
        {statBox((data.by_lang||[]).length,    "لغة نشطة",    "🌐")}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        {/* Pages */}
        <div style={{background:"var(--bg2)",borderRadius:12,padding:16}}>
          <h3 style={{fontSize:"0.85rem",fontWeight:"bold",marginBottom:12,color:"var(--p)"}}>📄 أكثر الصفحات زيارة</h3>
          {barChart(data.by_page, "page", "views", PAGE_NAMES)}
        </div>
        {/* Languages */}
        <div style={{background:"var(--bg2)",borderRadius:12,padding:16}}>
          <h3 style={{fontSize:"0.85rem",fontWeight:"bold",marginBottom:12,color:"var(--p)"}}>🌐 اللغات</h3>
          {barChart(data.by_lang, "lang", "views", LANG_NAMES)}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        {/* Countries */}
        <div style={{background:"var(--bg2)",borderRadius:12,padding:16}}>
          <h3 style={{fontSize:"0.85rem",fontWeight:"bold",marginBottom:12,color:"var(--p)"}}>🌍 الدول</h3>
          {barChart(data.by_country, "country", "views", null)}
        </div>
        {/* Devices */}
        <div style={{background:"var(--bg2)",borderRadius:12,padding:16}}>
          <h3 style={{fontSize:"0.85rem",fontWeight:"bold",marginBottom:12,color:"var(--p)"}}>📱 الأجهزة</h3>
          {barChart(data.by_device, "device", "views", {mobile:"موبايل",desktop:"كمبيوتر",tablet:"تابلت"})}
        </div>
      </div>

      {/* Daily chart */}
      <div style={{background:"var(--bg2)",borderRadius:12,padding:16}}>
        <h3 style={{fontSize:"0.85rem",fontWeight:"bold",marginBottom:12,color:"var(--p)"}}>📅 المشاهدات اليومية</h3>
        <div style={{display:"flex",alignItems:"flex-end",gap:4,height:80,overflowX:"auto"}}>
          {(data.by_day||[]).slice().reverse().map((d,i) => {
            const max = Math.max(...(data.by_day||[]).map(x=>x.views)) || 1;
            const h = Math.max(4, Math.round((d.views/max)*72));
            return (
              <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2,flex:"0 0 auto"}}>
                <div title={`${d.day}: ${d.views} مشاهدة`}
                  style={{width:20,height:h,background:"linear-gradient(to top,#C8A951,#E8D48B)",borderRadius:"3px 3px 0 0",cursor:"pointer"}}/>
                <div style={{fontSize:"9px",color:"#888",transform:"rotate(-45deg)",transformOrigin:"top left",whiteSpace:"nowrap",marginTop:8}}>
                  {d.day?.slice(5)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Umami note */}
      <div style={{marginTop:16,padding:"12px 16px",background:"rgba(200,169,81,0.08)",borderRadius:10,border:"1px solid rgba(200,169,81,0.2)",fontSize:"0.8rem",color:"#888"}}>
        💡 لإحصائيات أعمق مع خرائط جغرافية وتتبع حركة الزوار، أضف{" "}
        <a href="https://umami.is" target="_blank" style={{color:"var(--g)"}}>Umami Analytics</a> (مجاني)
      </div>
    </div>
  );
}

// ── MAIN ADMIN ──

function extractYoutubeId(input){
  if(!input)return '';
  const t=input.trim();
  if(/^[a-zA-Z0-9_-]{11}$/.test(t))return t;
  const m=t.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/);
  return m?m[1]:t;
}
export default function AdminPage() {
  const [authed, setAuthed] = useState(!!sessionStorage.getItem("admin_ok"));
  const [section, setSection] = useState("videos");
  const [lang, setLang] = useState("ar");

  if (!authed) return <><style>{CSS}</style><Login onLogin={()=>setAuthed(true)} /></>;

  const logout = () => {
    const token = sessionStorage.getItem("admin_token");
    if (token) sb.from("admin_sessions").delete().eq("token", token).then(() => {});
    sessionStorage.removeItem("admin_ok");
    sessionStorage.removeItem("admin_token");
    setAuthed(false);
  };

  const needsLang = ["videos","books","hero","hajj","umrah","contest"].includes(section);

  return (
    <>
      <style>{CSS}</style>
      <div className="admin-wrap">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-logo">
            <h1>🕋 منافع</h1>
            <p>لوحة التحكم</p>
          </div>
          <div className="sidebar-nav">
            {SECTIONS.map(s=>(
              <button key={s.id} className={`nav-btn ${section===s.id?"active":""}`} onClick={()=>setSection(s.id)}>
                <span>{s.icon}</span><span>{s.label}</span>
              </button>
            ))}
          </div>
          <div style={{padding:"16px 10px",borderTop:"1px solid rgba(255,255,255,.08)"}}>
            <button className="nav-btn" style={{color:"#f87171"}} onClick={logout}>
              <span>🚪</span><span>تسجيل الخروج</span>
            </button>
          </div>
        </div>

        {/* Main */}
        <div className="main">
          {/* Language Tabs */}
          {needsLang && (
            <div className="lang-tabs">
              {LANGS.map(l=>(
                <button key={l.code} className={`lang-tab ${lang===l.code?"active":""}`} onClick={()=>setLang(l.code)}>
                  {l.name}
                </button>
              ))}
            </div>
          )}

          {section==="videos"  && <VideosSection lang={lang} />}
          {section==="books"   && <BooksSection lang={lang} />}
          {section==="hero"    && <HeroSection lang={lang} />}
          {section==="hajj"    && <StepsSection lang={lang} type="hajj" />}
          {section==="umrah"   && <StepsSection lang={lang} type="umrah" />}
          {section==="contest" && <ContestSection lang={lang} />}
          {section==="analytics"&& <AnalyticsSection />}
          {section==="feedback"&& <FeedbackSection />}
        </div>
      </div>
    </>
  );
}
