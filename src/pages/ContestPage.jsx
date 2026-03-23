import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { supaInsert as supaIns } from "../lib/supabase";
import { useState, useEffect, useMemo } from "react";
import { useLang } from "../lib/LangContext";
import { trackPage } from "../lib/analytics";

/* ═══ Languages ═══ */
const LL=[{c:"ar",n:"العربية",d:"rtl"},{c:"en",n:"English",d:"ltr"},{c:"tr",n:"Türkçe",d:"ltr"},{c:"ur",n:"اردو",d:"rtl"},{c:"ms",n:"Melayu",d:"ltr"},{c:"fr",n:"Français",d:"ltr"},{c:"fa",n:"فارسی",d:"rtl"},{c:"bn",n:"বাংলা",d:"ltr"},{c:"hi",n:"हिन्दी",d:"ltr"}];

/* ═══ UI strings ═══ */
const UI = {
  ar: { bism:"بسم الله الرحمن الرحيم", sn:"مشروع منافع", sd:"لدعوة الحجاج والمعتمرين", title:"مسابقة منافع", desc:"أجب على الأسئلة التالية ثم سجّل بياناتك لمعرفة نتيجتك", q:"السؤال", of:"من", ok:"تحقق", yes:"صحيح!", no:"خطأ!", ca:"الإجابة الصحيحة:", nx:"التالي", reg:"سجّل بياناتك لمعرفة النتيجة", nm:"الاسم الكامل", co:"الدولة", ph:"رقم الجوال", sub:"إرسال ومعرفة النتيجة", res:"نتيجتك", ex:"ممتاز! ما شاء الله 🏆", gd:"جيد جداً! ⭐", av:"لا بأس — واصل التعلم 📚", wk:"حاول مرة أخرى 💪", nq:"مسابقة جديدة", req:"جميع الحقول مطلوبة", ok2:"تم الإرسال ✅", nc:"لا يوجد محتوى بهذه اللغة حالياً", ftc:"مشروع منافع — جميع الحقوق محفوظة", ftl:"اللغات المدعومة", nav:["الرئيسية","الفيديوهات","القرآن","المكتبة","الحج","العمرة","المسابقة"], lg:"تسجيل الدخول" },
  en: { bism:"In the Name of Allah", sn:"Manafea Project", sd:"For Hajj & Umrah Dawah", title:"Manafea Contest", desc:"Answer the questions below then register to see your result", q:"Question", of:"of", ok:"Check", yes:"Correct!", no:"Wrong!", ca:"Correct answer:", nx:"Next", reg:"Register to see your result", nm:"Full Name", co:"Country", ph:"Phone Number", sub:"Submit & See Result", res:"Your Result", ex:"Excellent! 🏆", gd:"Very Good! ⭐", av:"Not Bad — Keep Learning 📚", wk:"Try Again 💪", nq:"New Quiz", req:"All fields are required", ok2:"Submitted ✅", nc:"No content in this language yet", ftc:"Manafea Project — All Rights Reserved", ftl:"Supported Languages", nav:["Home","Videos","Quran","Library","Hajj","Umrah","Contest"], lg:"Login" },
  tr: { bism:"Rahman ve Rahim olan Allah'ın adıyla", sn:"Menafi", sd:"Hacılar İçin", title:"Menafi Yarışma", desc:"Soruları cevaplayın ve bilgilerinizi girin", q:"Soru", of:"/", ok:"Kontrol", yes:"Doğru!", no:"Yanlış!", ca:"Doğru cevap:", nx:"Sonraki", reg:"Sonucu görmek için kaydolun", nm:"Ad Soyad", co:"Ülke", ph:"Telefon", sub:"Gönder", res:"Sonucunuz", ex:"Mükemmel! 🏆", gd:"Çok İyi! ⭐", av:"Fena Değil 📚", wk:"Tekrar Deneyin 💪", nq:"Yeni Yarışma", req:"Tüm alanlar gerekli", ok2:"Gönderildi ✅", nc:"İçerik yok", ftc:"Menafi — Hakları Saklıdır", ftl:"Diller", nav:["Ana Sayfa","Videolar","Kur'an","Kütüphane","Hac","Umre","Yarışma"], lg:"Giriş" },
  ur: { bism:"اللہ کے نام سے", sn:"منافع", sd:"حاجیوں کی دعوت", title:"منافع مقابلہ", desc:"سوالات کے جواب دیں اور معلومات درج کریں", q:"سوال", of:"میں سے", ok:"چیک", yes:"صحیح!", no:"غلط!", ca:"صحیح جواب:", nx:"اگلا", reg:"نتیجہ دیکھنے کے لیے رجسٹر کریں", nm:"پورا نام", co:"ملک", ph:"فون نمبر", sub:"بھیجیں", res:"نتیجہ", ex:"بہترین! 🏆", gd:"بہت اچھا! ⭐", av:"ٹھیک ہے 📚", wk:"دوبارہ کوشش 💪", nq:"نیا مقابلہ", req:"تمام خانے پُر کریں", ok2:"بھیج دیا ✅", nc:"مواد نہیں", ftc:"منافع — حقوق محفوظ", ftl:"زبانیں", nav:["ہوم","ویڈیوز","قرآن","لائبریری","حج","عمرہ","مقابلہ"], lg:"لاگ ان" },
  ms: { bism:"Dengan nama Allah", sn:"Manafea", sd:"Dakwah", title:"Pertandingan Manafea", desc:"Jawab soalan dan daftar", q:"Soalan", of:"daripada", ok:"Semak", yes:"Betul!", no:"Salah!", ca:"Jawapan betul:", nx:"Seterusnya", reg:"Daftar untuk keputusan", nm:"Nama", co:"Negara", ph:"Telefon", sub:"Hantar", res:"Keputusan", ex:"Cemerlang! 🏆", gd:"Bagus! ⭐", av:"Boleh Tahan 📚", wk:"Cuba Lagi 💪", nq:"Kuiz Baru", req:"Semua medan diperlukan", ok2:"Dihantar ✅", nc:"Tiada kandungan", ftc:"Manafea — Hak Cipta", ftl:"Bahasa", nav:["Utama","Video","Quran","Perpustakaan","Haji","Umrah","Pertandingan"], lg:"Log Masuk" },
  fr: { bism:"Au nom d'Allah", sn:"Manafea", sd:"Dawah", title:"Concours Manafea", desc:"Répondez et inscrivez-vous", q:"Question", of:"sur", ok:"Vérifier", yes:"Correct!", no:"Faux!", ca:"Bonne réponse:", nx:"Suivant", reg:"Inscrivez-vous pour le résultat", nm:"Nom", co:"Pays", ph:"Téléphone", sub:"Envoyer", res:"Résultat", ex:"Excellent! 🏆", gd:"Très Bien! ⭐", av:"Pas Mal 📚", wk:"Réessayez 💪", nq:"Nouveau Quiz", req:"Champs requis", ok2:"Envoyé ✅", nc:"Pas de contenu", ftc:"Manafea — Droits Réservés", ftl:"Langues", nav:["Accueil","Vidéos","Coran","Bibliothèque","Hajj","Omra","Concours"], lg:"Connexion" },
  fa: { bism:"به نام خداوند", sn:"منافع", sd:"دعوت", title:"مسابقه منافع", desc:"پاسخ دهید و ثبت‌نام کنید", q:"سؤال", of:"از", ok:"بررسی", yes:"صحیح!", no:"اشتباه!", ca:"پاسخ صحیح:", nx:"بعدی", reg:"برای نتیجه ثبت‌نام کنید", nm:"نام", co:"کشور", ph:"تلفن", sub:"ارسال", res:"نتیجه", ex:"عالی! 🏆", gd:"خوب! ⭐", av:"بد نیست 📚", wk:"دوباره 💪", nq:"مسابقه جدید", req:"همه فیلدها لازم", ok2:"ارسال شد ✅", nc:"محتوایی نیست", ftc:"منافع — حقوق محفوظ", ftl:"زبان‌ها", nav:["خانه","ویدیوها","قرآن","کتابخانه","حج","عمره","مسابقه"], lg:"ورود" },
  bn: { bism:"আল্লাহর নামে", sn:"মানাফেয়া", sd:"দাওয়াহ", title:"প্রতিযোগিতা", desc:"উত্তর দিন এবং নিবন্ধন করুন", q:"প্রশ্ন", of:"এর মধ্যে", ok:"যাচাই", yes:"সঠিক!", no:"ভুল!", ca:"সঠিক উত্তর:", nx:"পরের", reg:"ফলাফলের জন্য নিবন্ধন", nm:"নাম", co:"দেশ", ph:"ফোন", sub:"জমা দিন", res:"ফলাফল", ex:"চমৎকার! 🏆", gd:"ভালো! ⭐", av:"মোটামুটি 📚", wk:"আবার 💪", nq:"নতুন কুইজ", req:"সব তথ্য আবশ্যক", ok2:"পাঠানো হয়েছে ✅", nc:"নেই", ftc:"মানাফেয়া", ftl:"ভাষা", nav:["হোম","ভিডিও","কুরআন","লাইব্রেরি","হজ্জ","উমরাহ","প্রতিযোগিতা"], lg:"লগইন" },
  hi: { bism:"अल्लाह के नाम से", sn:"मनाफ़ेआ", sd:"दावत", title:"प्रतियोगिता", desc:"जवाब दें और जानकारी दर्ज करें", q:"प्रश्न", of:"में से", ok:"जाँचें", yes:"सही!", no:"ग़लत!", ca:"सही उत्तर:", nx:"अगला", reg:"परिणाम के लिए पंजीकरण", nm:"नाम", co:"देश", ph:"फ़ोन", sub:"भेजें", res:"परिणाम", ex:"बहुत बढ़िया! 🏆", gd:"अच्छा! ⭐", av:"ठीक है 📚", wk:"फिर से 💪", nq:"नया क्विज़", req:"सब ज़रूरी", ok2:"भेजा गया ✅", nc:"सामग्री नहीं", ftc:"मनाफ़ेआ", ftl:"भाषाएं", nav:["होम","वीडियो","कुरान","पुस्तकालय","हज","उमरा","प्रतियोगिता"], lg:"लॉगिन" },
};

/* ═══ Questions: [question, opt1, opt2, opt3, correctIndex(0-2), category] ═══ */
const QAR = [
["كم عدد أركان الإسلام؟","ثلاثة","خمسة","سبعة",1,"عقيدة"],["ما أول أركان الإسلام؟","الصلاة","الشهادتان","الزكاة",1,"عقيدة"],["كم عدد أركان الإيمان؟","خمسة","ستة","سبعة",1,"عقيدة"],["ما أكبر الذنوب؟","الشرك بالله","العقوق","الكذب",0,"عقيدة"],["ما التوحيد؟","إفراد الله بالعبادة","الصلاة","الصيام",0,"عقيدة"],["ما أعظم آية في القرآن؟","آية الكرسي","آية الدين","أول البقرة",0,"عقيدة"],["من خاتم الأنبياء؟","عيسى","محمد ﷺ","إبراهيم",1,"عقيدة"],["كم الأنبياء في القرآن؟","عشرون","خمسة وعشرون","ثلاثون",1,"عقيدة"],["ما الإحسان؟","أن تعبد الله كأنك تراه","أداء الفرائض","النوافل",0,"عقيدة"],["هل يعلم الغيب أحد غير الله؟","نعم","لا الله وحده","الملائكة",1,"عقيدة"],
["ما حكم السحر؟","مباح","مكروه","حرام وكفر",2,"عقيدة"],["ما حكم الحلف بغير الله؟","جائز","مكروه","شرك أصغر",2,"عقيدة"],["ما أقسام الشرك؟","قسم واحد","أكبر وأصغر","ثلاثة",1,"عقيدة"],["ما الطاغوت؟","كل ما عُبد من دون الله","الحاكم فقط","الشيطان فقط",0,"عقيدة"],["هل الإيمان يزيد وينقص؟","لا","نعم","يزيد فقط",1,"عقيدة"],["ما أول ما يُسأل عنه في القبر؟","ماله","ربه ودينه ونبيه","صلاته",1,"عقيدة"],["كم شرط لا إله إلا الله؟","خمسة","سبعة","ثمانية",2,"عقيدة"],["ما حكم الذبح لغير الله؟","مباح","مكروه","شرك أكبر",2,"عقيدة"],["ما نواقض الإسلام؟","خمسة","عشرة","سبعة",1,"عقيدة"],["كم أنواع التوحيد؟","نوعان","ثلاثة","أربعة",1,"عقيدة"],
["كم الصلوات المفروضة؟","ثلاث","خمس","سبع",1,"فقه"],["كم ركعة الفجر؟","أربع","ثلاث","ركعتان",2,"فقه"],["كم ركعة الظهر؟","ركعتان","ثلاث","أربع",2,"فقه"],["كم ركعة المغرب؟","ركعتان","ثلاث","أربع",1,"فقه"],["ما ينقض الوضوء؟","الخارج من السبيلين","شرب الماء","الكلام",0,"فقه"],["ما حكم صلاة الجماعة؟","سنة","واجبة","مستحبة",1,"فقه"],["متى فُرض الصيام؟","الأولى","الثانية للهجرة","الثالثة",1,"فقه"],["ما نصاب زكاة الذهب؟","٥٠ غ","٨٥ غ","١٠٠ غ",1,"فقه"],["كم مرة يجب الحج؟","كل سنة","مرة في العمر","مرتين",1,"فقه"],["ما حكم الفاتحة في الصلاة؟","سنة","ركن","مستحبة",1,"فقه"],
["ما مقدار زكاة الفطر؟","صاع من قوت البلد","نصف صاع","ربع",0,"فقه"],["ما حكم صيام عرفة لغير الحاج؟","مكروه","سنة يكفر سنتين","واجب",1,"فقه"],["ما مبطلات الصيام؟","الأكل والشرب والجماع عمداً","النوم","التفكير",0,"فقه"],["ما الاعتكاف؟","لزوم المسجد للعبادة","الصيام فقط","السفر",0,"فقه"],["ما حكم التراويح؟","فرض","سنة مؤكدة","واجب",1,"فقه"],["ما مقدار زكاة المال؟","٥٪","٢.٥٪","١٠٪",1,"فقه"],["ما حكم الأضحية؟","سنة مؤكدة","فرض","واجب",0,"فقه"],["ما حكم بر الوالدين؟","مستحب","فرض واجب","سنة",1,"فقه"],["ما حكم الغيبة؟","مباحة","حرام","مكروهة",1,"فقه"],["ما حكم الربا؟","مكروه","حرام","مباح",1,"فقه"],
["كم سور القرآن؟","١١٠","١١٤","١٢٠",1,"قرآن"],["ما أول سورة؟","البقرة","الفاتحة","الناس",1,"قرآن"],["ما آخر سورة؟","الفلق","الإخلاص","الناس",2,"قرآن"],["كم جزء في القرآن؟","٢٠","٣٠","٤٠",1,"قرآن"],["ما أطول سورة؟","آل عمران","البقرة","النساء",1,"قرآن"],["ما أقصر سورة؟","الكوثر","الإخلاص","الفلق",0,"قرآن"],["أي سورة بلا بسملة؟","الفاتحة","البقرة","التوبة",2,"قرآن"],["أين آية الكرسي؟","آل عمران","البقرة","المائدة",1,"قرآن"],["كم آية في الفاتحة؟","خمس","ست","سبع",2,"قرآن"],["ما قلب القرآن؟","البقرة","يس","الرحمن",1,"قرآن"],
["كم سنة نزل القرآن؟","عشر","ثلاث عشرة","ثلاث وعشرون",2,"قرآن"],["ما أول آية نزلت؟","البسملة","اقرأ باسم ربك","الحمد لله",1,"قرآن"],["كم سجدة في القرآن؟","١٠","١٥","٢٠",1,"قرآن"],["أي سورة تعدل ثلث القرآن؟","الفاتحة","الإخلاص","البقرة",1,"قرآن"],["ما جزء عم؟","الأول","الخامس عشر","الثلاثون",2,"قرآن"],["أي سورة سُميت باسم امرأة؟","البقرة","مريم","النساء",1,"قرآن"],["ما السورة المنجية؟","البقرة","الملك","يس",1,"قرآن"],["أي سورة فيها سجدتان؟","الحج","السجدة","الرعد",0,"قرآن"],["كم حزب في القرآن؟","٣٠","٦٠","١٢٠",1,"قرآن"],["كم مرة ذُكر محمد في القرآن؟","مرة","أربع","عشر",1,"قرآن"],
["متى وُلد ﷺ؟","عام الحزن","عام الفيل","عام الهجرة",1,"سيرة"],["أين وُلد ﷺ؟","المدينة","مكة","الطائف",1,"سيرة"],["ما اسم أمه ﷺ؟","خديجة","آمنة بنت وهب","فاطمة",1,"سيرة"],["في أي سن بُعث ﷺ؟","٢٥","٣٥","٤٠",2,"سيرة"],["من أول من أسلم من الرجال؟","عمر","أبو بكر","علي",1,"سيرة"],["من أول من أسلمت؟","عائشة","خديجة","فاطمة",1,"سيرة"],["متى كانت الهجرة؟","العاشرة","الثالثة عشرة من البعثة","الخامسة",1,"سيرة"],["من رافقه ﷺ في الهجرة؟","عمر","أبو بكر","علي",1,"سيرة"],["أين اختبأ ﷺ؟","غار حراء","غار ثور","جبل أحد",1,"سيرة"],["ما أول مسجد بناه ﷺ؟","النبوي","قباء","الحرام",1,"سيرة"],
["متى كانت بدر؟","الأولى","الثانية للهجرة","الثالثة",1,"سيرة"],["كم المسلمين في بدر؟","٥٠٠","حوالي ٣١٣","١٠٠٠",1,"سيرة"],["متى فُتحت مكة؟","السادسة","الثامنة للهجرة","العاشرة",1,"سيرة"],["كم عمره ﷺ عند الوفاة؟","٦٠","٦٣","٦٥",1,"سيرة"],["من جمع القرآن؟","أبو بكر","عمر","عثمان",2,"سيرة"],["ما الإسراء والمعراج؟","رحلة ﷺ للأقصى ثم السماء","الهجرة","بدر",0,"سيرة"],["أين فُرضت الصلوات الخمس؟","مكة","المدينة","السماء ليلة المعراج",2,"سيرة"],["ما أول هجرة؟","المدينة","الحبشة","الطائف",1,"سيرة"],["كم غزوة غزاها ﷺ؟","عشر","حوالي ٢٩","خمسون",1,"سيرة"],["متى حجة الوداع؟","الثامنة","العاشرة للهجرة","الحادية عشرة",1,"سيرة"],
["ما أعظم أركان الحج؟","الطواف","الوقوف بعرفة","السعي",1,"حج"],["كم أركان الحج؟","ثلاثة","أربعة","خمسة",1,"حج"],["ما أركان العمرة؟","الإحرام والطواف والسعي","الطواف فقط","الإحرام فقط",0,"حج"],["كم أشواط الطواف؟","خمسة","سبعة","تسعة",1,"حج"],["كم أشواط السعي؟","خمسة","سبعة","تسعة",1,"حج"],["ما يوم التروية؟","٧","٨ ذو الحجة","٩",1,"حج"],["ما يوم عرفة؟","٨","٩ ذو الحجة","١٠",1,"حج"],["ما أيام التشريق؟","٨-١٠","١١-١٢-١٣","١٠-١٢",1,"حج"],["ما التلبية؟","لبيك اللهم لبيك","سبحان الله","الله أكبر",0,"حج"],["كم حصاة لجمرة العقبة؟","خمس","سبع","تسع",1,"حج"],
["أين يبدأ السعي؟","المروة","الصفا","الكعبة",1,"حج"],["ما أنواع النسك؟","نوعان","تمتع وقران وإفراد","أربعة",1,"حج"],["أيها أفضل؟","الإفراد","التمتع","القران",1,"حج"],["ما حكم المبيت بمزدلفة؟","سنة","واجب","ركن",1,"حج"],["ما حكم طواف الوداع على الحائض؟","يسقط عنها","واجب","تطوف",0,"حج"],["ما التحلل الأول؟","يحل كل شيء إلا النساء","كل شيء","لا شيء",0,"حج"],["ما زمزم؟","نهر","بئر مبارك في الحرم","عين بالمدينة",1,"حج"],["متى شُرع الحج؟","عهد آدم","عهد إبراهيم","عهد موسى",1,"حج"],["ما حكم من ترك واجباً؟","يبطل حجه","عليه دم","لا شيء",1,"حج"],["على من يجب الهدي؟","المفرد","المتمتع والقارن","الجميع",1,"حج"],
["ما أول مسجد في الأرض؟","الأقصى","المسجد الحرام","النبوي",1,"عام"],["كم أبواب الجنة؟","سبعة","ثمانية","عشرة",1,"عام"],["كم أبواب النار؟","خمسة","سبعة","تسعة",1,"عام"],["ما الكوثر؟","نهر في الجنة للنبي ﷺ","سورة فقط","بركة",0,"عام"],["ما أفضل ليلة؟","ليلة القدر","ليلة العيد","النصف من شعبان",0,"عام"],["ما أفضل يوم؟","الجمعة","يوم عرفة","العيد",1,"عام"],["ما أول ما يُحاسب عليه العبد؟","الزكاة","الصلاة","الصيام",1,"عام"],["ما الأشهر الحرم؟","رمضان وشوال والقعدة والحجة","القعدة والحجة ومحرم ورجب","محرم وصفر",1,"عام"],["من الملك الموكل بالوحي؟","ميكائيل","جبريل","إسرافيل",1,"عام"],["ما خير ما يخلفه الإنسان؟","المال","ولد صالح وعلم نافع وصدقة جارية","البيوت",1,"عام"],
];
const QEN = [
["How many pillars of Islam?","Three","Five","Seven",1,"Aqeedah"],["First pillar of Islam?","Prayer","Two testimonies","Charity",1,"Aqeedah"],["How many pillars of Iman?","Five","Six","Seven",1,"Aqeedah"],["Greatest sin?","Shirk","Lying","Theft",0,"Aqeedah"],["What is Tawheed?","Singling out Allah in worship","Praying","Fasting",0,"Aqeedah"],["Greatest Quran verse?","Ayat Al-Kursi","Verse of debt","First of Baqarah",0,"Aqeedah"],["Seal of prophets?","Isa","Muhammad ﷺ","Ibrahim",1,"Aqeedah"],["What is Ihsan?","Worship as if you see Him","Obligations only","Charity",0,"Aqeedah"],["Anyone know unseen besides Allah?","Yes","No only Allah","Angels",1,"Aqeedah"],["Types of Tawheed?","Two","Three","Four",1,"Aqeedah"],
["How many daily prayers?","Three","Five","Seven",1,"Fiqh"],["Rak'ahs in Fajr?","Four","Three","Two",2,"Fiqh"],["Rak'ahs in Dhuhr?","Two","Three","Four",2,"Fiqh"],["What invalidates wudu?","Discharge","Drinking","Talking",0,"Fiqh"],["Congregational prayer for men?","Sunnah","Obligatory","Recommended",1,"Fiqh"],["Nisab of gold?","50g","85g","100g",1,"Fiqh"],["How often Hajj?","Every year","Once in lifetime","Twice",1,"Fiqh"],["Zakat percentage?","5%","2.5%","10%",1,"Fiqh"],["Fasting Arafah ruling?","Disliked","Sunnah expiates 2 years","Obligatory",1,"Fiqh"],["Ruling on Riba?","Disliked","Haram","Permissible",1,"Fiqh"],
["How many Surahs?","110","114","120",1,"Quran"],["First Surah?","Baqarah","Fatiha","Nas",1,"Quran"],["Last Surah?","Falaq","Ikhlas","Nas",2,"Quran"],["How many Juz?","20","30","40",1,"Quran"],["Longest Surah?","Aal-Imran","Baqarah","Nisa",1,"Quran"],["Shortest Surah?","Kawthar","Ikhlas","Falaq",0,"Quran"],["No Bismillah Surah?","Fatiha","Baqarah","Tawbah",2,"Quran"],["Heart of Quran?","Baqarah","Ya-Sin","Rahman",1,"Quran"],["Years to reveal Quran?","10","13","23",2,"Quran"],["First verse revealed?","Bismillah","Iqra bismi Rabbik","Alhamdulillah",1,"Quran"],
["Prophet ﷺ born?","Year of Sorrow","Year of Elephant","Year of Hijrah",1,"Seerah"],["Where born?","Madinah","Makkah","Taif",1,"Seerah"],["Age when sent?","25","35","40",2,"Seerah"],["First man Muslim?","Umar","Abu Bakr","Ali",1,"Seerah"],["First woman Muslim?","Aisha","Khadijah","Fatimah",1,"Seerah"],["Hijrah when?","10th year","13th year","5th year",1,"Seerah"],["Battle of Badr when?","1st AH","2nd AH","3rd AH",1,"Seerah"],["Muslims at Badr?","500","About 313","1000",1,"Seerah"],["Prophet age at death?","60","63","65",1,"Seerah"],["Quran compiled under?","Abu Bakr","Umar","Uthman",2,"Seerah"],
["Greatest pillar of Hajj?","Tawaf","Arafah","Sa'i",1,"Hajj"],["Pillars of Hajj?","Three","Four","Five",1,"Hajj"],["Pillars of Umrah?","Ihram Tawaf Sa'i","Tawaf only","Ihram only",0,"Hajj"],["Tawaf circuits?","Five","Seven","Nine",1,"Hajj"],["Sa'i circuits?","Five","Seven","Nine",1,"Hajj"],["Day of Tarwiyah?","7th","8th Dhul-Hijjah","9th",1,"Hajj"],["Day of Arafah?","8th","9th Dhul-Hijjah","10th",1,"Hajj"],["What is Talbiyah?","Labbayk Allahumma","SubhanAllah","Allahu Akbar",0,"Hajj"],["Best type Hajj?","Ifrad","Tamattu","Qiran",1,"Hajj"],["What is Zamzam?","River","Blessed well","Spring",1,"Hajj"],
["First mosque on earth?","Al-Aqsa","Al-Haram","An-Nabawi",1,"General"],["Gates of Paradise?","Seven","Eight","Ten",1,"General"],["Gates of Hellfire?","Five","Seven","Nine",1,"General"],["Best night?","Laylat Al-Qadr","Eid night","Mid-Shaban",0,"General"],["Best day?","Friday","Day of Arafah","Eid",1,"General"],["First thing judged?","Zakat","Prayer","Fasting",1,"General"],["What is Kawthar?","River in Paradise","Just a Surah","Pond",0,"General"],["Sacred months?","Dhul-Qidah Dhul-Hijjah Muharram Rajab","Ramadan Shawwal","Muharram Safar",0,"General"],["What continues after death?","Wealth","Child knowledge charity","Houses",1,"General"],["Angel of revelation?","Mikael","Jibreel","Israfeel",1,"General"],
];

const QTR = [
["İslam'ın şartları kaç tanedir?","Üç","Beş","Yedi",1,"Akaid"],["İslam'ın ilk şartı nedir?","Namaz","Kelime-i Şehadet","Zekat",1,"Akaid"],["İman'ın şartları kaç tanedir?","Beş","Altı","Yedi",1,"Akaid"],["En büyük günah nedir?","Şirk","Anne babaya karşı gelmek","Yalan",0,"Akaid"],["Tevhid nedir?","Allah'ı ibadette birlemek","Günde beş vakit namaz","Oruç",0,"Akaid"],["Kur'an'ın en büyük ayeti?","Ayetel Kürsi","Borç ayeti","Bakara'nın ilk ayeti",0,"Akaid"],["Son peygamber kimdir?","İsa","Hz. Muhammed ﷺ","İbrahim",1,"Akaid"],["Kur'an'da kaç peygamber var?","Yirmi","Yirmi beş","Otuz",1,"Akaid"],["İhsan nedir?","Allah'ı görüyormuş gibi ibadet","Farzları yapmak","Nafileler",0,"Akaid"],["Gaybı Allah'tan başka bilen var mı?","Evet","Hayır sadece Allah","Melekler",1,"Akaid"],
["Günlük farz namaz kaç tanedir?","Üç","Beş","Yedi",1,"Fıkıh"],["Sabah namazı kaç rekattır?","Dört","Üç","İki",2,"Fıkıh"],["Öğle namazı kaç rekattır?","İki","Üç","Dört",2,"Fıkıh"],["Abdesti ne bozar?","İki yoldan çıkan","Su içmek","Konuşmak",0,"Fıkıh"],["Cemaatle namaz hükmü?","Sünnet","Vacip","Müstehap",1,"Fıkıh"],["Altın zekat nisabı?","50g","85g","100g",1,"Fıkıh"],["Hac kaç kez farzdır?","Her yıl","Ömürde bir","İki kez",1,"Fıkıh"],["Zekat oranı?","5%","2.5%","10%",1,"Fıkıh"],["Arefe orucu hükmü?","Mekruh","Sünnet 2 yıl kefaret","Farz",1,"Fıkıh"],["Faiz hükmü?","Mekruh","Haram","Mübah",1,"Fıkıh"],
["Kur'an'da kaç sure var?","110","114","120",1,"Kur'an"],["İlk sure?","Bakara","Fatiha","Nas",1,"Kur'an"],["Son sure?","Felak","İhlas","Nas",2,"Kur'an"],["Kur'an kaç cüzdür?","20","30","40",1,"Kur'an"],["En uzun sure?","Al-i İmran","Bakara","Nisa",1,"Kur'an"],["En kısa sure?","Kevser","İhlas","Felak",0,"Kur'an"],["Besmele olmayan sure?","Fatiha","Bakara","Tevbe",2,"Kur'an"],["Kur'an'ın kalbi?","Bakara","Yasin","Rahman",1,"Kur'an"],["Kur'an kaç yılda indi?","10","13","23",2,"Kur'an"],["İlk inen ayet?","Besmele","İkra bismi Rabbik","Elhamdülillah",1,"Kur'an"],
["Hz. Peygamber ﷺ ne zaman doğdu?","Hüzün yılı","Fil yılı","Hicret yılı",1,"Siyer"],["Nerede doğdu?","Medine","Mekke","Taif",1,"Siyer"],["Kaç yaşında peygamber oldu?","25","35","40",2,"Siyer"],["İlk Müslüman erkek?","Ömer","Ebu Bekir","Ali",1,"Siyer"],["İlk Müslüman kadın?","Aişe","Hatice","Fatıma",1,"Siyer"],["Hicret ne zaman?","10. yıl","13. yıl","5. yıl",1,"Siyer"],["Bedir Savaşı?","1. H.","2. H.","3. H.",1,"Siyer"],["Bedir'de kaç Müslüman?","500","313 civarı","1000",1,"Siyer"],["Vefat yaşı?","60","63","65",1,"Siyer"],["Kur'an kimin döneminde toplandı?","Ebu Bekir","Ömer","Osman",2,"Siyer"],
["Haccın en büyük rüknü?","Tavaf","Arafat'ta vakfe","Sa'y",1,"Hac"],["Haccın rükünleri kaç?","Üç","Dört","Beş",1,"Hac"],["Umrenin rükünleri?","İhram Tavaf Sa'y","Sadece tavaf","Sadece ihram",0,"Hac"],["Tavaf kaç şavt?","Beş","Yedi","Dokuz",1,"Hac"],["Sa'y kaç şavt?","Beş","Yedi","Dokuz",1,"Hac"],["Terviye günü?","7","8 Zilhicce","9",1,"Hac"],["Arefe günü?","8","9 Zilhicce","10",1,"Hac"],["Telbiye nedir?","Lebbeyk Allahümme","Sübhanallah","Allahu Ekber",0,"Hac"],["En faziletli hac?","İfrad","Temettu","Kıran",1,"Hac"],["Zemzem nedir?","Nehir","Mübarek kuyu","Pınar",1,"Hac"],
];
const QUR = [
["اسلام کے ارکان کتنے ہیں؟","تین","پانچ","سات",1,"عقیدہ"],["اسلام کا پہلا رکن؟","نماز","شہادتین","زکوٰة",1,"عقیدہ"],["ایمان کے ارکان کتنے ہیں؟","پانچ","چھ","سات",1,"عقیدہ"],["سب سے بڑا گناہ؟","شرک","والدین کی نافرمانی","جھوٹ",0,"عقیدہ"],["توحید کیا ہے؟","اللہ کو عبادت میں اکیلا ماننا","پانچ نمازیں","روزہ",0,"عقیدہ"],["قرآن کی سب سے بڑی آیت؟","آیت الکرسی","آیت الدین","البقرة کی پہلی",0,"عقیدہ"],["خاتم الانبیاء؟","عیسیٰ","محمد ﷺ","ابراہیم",1,"عقیدہ"],["احسان کیا ہے؟","اللہ کی عبادت ایسے کرو جیسے دیکھ رہے ہو","فرائض","نوافل",0,"عقیدہ"],["غیب اللہ کے سوا کوئی جانتا ہے؟","ہاں","نہیں صرف اللہ","فرشتے",1,"عقیدہ"],["توحید کی کتنی قسمیں؟","دو","تین","چار",1,"عقیدہ"],
["فرض نمازیں کتنی ہیں؟","تین","پانچ","سات",1,"فقہ"],["فجر کتنی رکعت؟","چار","تین","دو",2,"فقہ"],["ظہر کتنی رکعت؟","دو","تین","چار",2,"فقہ"],["وضو کیا توڑتا ہے؟","دونوں راستوں سے نکلنا","پانی پینا","بولنا",0,"فقہ"],["باجماعت نماز کا حکم؟","سنت","واجب","مستحب",1,"فقہ"],["سونے کا زکوٰة نصاب؟","٥٠ گرام","٨٥ گرام","١٠٠",1,"فقہ"],["حج کتنی بار فرض؟","ہر سال","عمر میں ایک بار","دو بار",1,"فقہ"],["زکوٰة کی شرح؟","٥٪","٢.٥٪","١٠٪",1,"فقہ"],["عرفہ کا روزہ غیر حاجی کے لیے؟","مکروہ","سنت دو سال کفارہ","فرض",1,"فقہ"],["سود کا حکم؟","مکروہ","حرام","مباح",1,"فقہ"],
["قرآن میں کتنی سورتیں؟","١١٠","١١٤","١٢٠",1,"قرآن"],["پہلی سورة؟","البقرة","الفاتحہ","الناس",1,"قرآن"],["آخری سورة؟","الفلق","الاخلاص","الناس",2,"قرآن"],["قرآن کتنے پارے؟","٢٠","٣٠","٤٠",1,"قرآن"],["سب سے لمبی سورة؟","آل عمران","البقرة","النساء",1,"قرآن"],["سب سے چھوٹی سورة؟","الکوثر","الاخلاص","الفلق",0,"قرآن"],["بسملہ کے بغیر سورة؟","الفاتحہ","البقرة","التوبہ",2,"قرآن"],["قرآن کا دل؟","البقرة","یٰسین","الرحمٰن",1,"قرآن"],["قرآن کتنے سال میں نازل ہوا؟","دس","تیرہ","تیئس",2,"قرآن"],["پہلی آیت؟","بسملہ","اقرأ باسم ربک","الحمد لله",1,"قرآن"],
["نبی ﷺ کب پیدا ہوئے؟","غم کا سال","ہاتھی کا سال","ہجرت کا سال",1,"سیرت"],["کہاں پیدا ہوئے؟","مدینہ","مکہ","طائف",1,"سیرت"],["کتنے سال میں نبوت ملی؟","٢٥","٣٥","٤٠",2,"سیرت"],["پہلے مسلمان مرد؟","عمر","ابوبکر","علی",1,"سیرت"],["پہلی مسلمان خاتون؟","عائشہ","خدیجہ","فاطمہ",1,"سیرت"],["حج کا سب سے بڑا رکن؟","طواف","وقوف عرفہ","سعی",1,"حج"],["حج کے ارکان کتنے؟","تین","چار","پانچ",1,"حج"],["طواف کتنے چکر؟","پانچ","سات","نو",1,"حج"],["سعی کتنے چکر؟","پانچ","سات","نو",1,"حج"],["تلبیہ کیا ہے؟","لبیک اللہم لبیک","سبحان اللہ","اللہ اکبر",0,"حج"],
];
const QMS = [
["Berapa rukun Islam?","Tiga","Lima","Tujuh",1,"Akidah"],["Rukun Islam pertama?","Solat","Dua Kalimah Syahadah","Zakat",1,"Akidah"],["Berapa rukun Iman?","Lima","Enam","Tujuh",1,"Akidah"],["Dosa paling besar?","Syirik","Derhaka ibu bapa","Bohong",0,"Akidah"],["Apa itu Tauhid?","Mengesakan Allah dalam ibadah","Solat lima waktu","Puasa",0,"Akidah"],["Ayat terbesar Quran?","Ayatul Kursi","Ayat hutang","Ayat pertama Baqarah",0,"Akidah"],["Nabi terakhir?","Isa","Muhammad ﷺ","Ibrahim",1,"Akidah"],["Apa itu Ihsan?","Beribadah seakan melihat Allah","Fardhu sahaja","Sunat",0,"Akidah"],["Ada yang tahu ghaib selain Allah?","Ya","Tidak hanya Allah","Malaikat",1,"Akidah"],["Jenis Tauhid?","Dua","Tiga","Empat",1,"Akidah"],
["Berapa solat fardhu?","Tiga","Lima","Tujuh",1,"Fiqh"],["Rakaat Subuh?","Empat","Tiga","Dua",2,"Fiqh"],["Rakaat Zohor?","Dua","Tiga","Empat",2,"Fiqh"],["Apa membatalkan wuduk?","Keluar dari dua jalan","Minum air","Bercakap",0,"Fiqh"],["Hukum solat jemaah lelaki?","Sunat","Wajib","Sunat muakkad",1,"Fiqh"],["Nisab emas zakat?","50g","85g","100g",1,"Fiqh"],["Berapa kali haji wajib?","Setiap tahun","Sekali seumur hidup","Dua kali",1,"Fiqh"],["Kadar zakat?","5%","2.5%","10%",1,"Fiqh"],["Hukum puasa Arafah?","Makruh","Sunat hapus 2 tahun","Wajib",1,"Fiqh"],["Hukum riba?","Makruh","Haram","Harus",1,"Fiqh"],
["Berapa surah Quran?","110","114","120",1,"Quran"],["Surah pertama?","Baqarah","Fatihah","Nas",1,"Quran"],["Surah terakhir?","Falaq","Ikhlas","Nas",2,"Quran"],["Berapa juzuk?","20","30","40",1,"Quran"],["Surah terpanjang?","Ali Imran","Baqarah","Nisa",1,"Quran"],["Surah terpendek?","Kautsar","Ikhlas","Falaq",0,"Quran"],["Surah tanpa Bismillah?","Fatihah","Baqarah","Taubah",2,"Quran"],["Hati Quran?","Baqarah","Yasin","Rahman",1,"Quran"],["Quran turun berapa tahun?","10","13","23",2,"Quran"],["Ayat pertama turun?","Bismillah","Iqra bismi Rabbik","Alhamdulillah",1,"Quran"],
["Nabi ﷺ lahir?","Tahun kesedihan","Tahun Gajah","Tahun Hijrah",1,"Sirah"],["Lahir di mana?","Madinah","Makkah","Taif",1,"Sirah"],["Umur diutuskan?","25","35","40",2,"Sirah"],["Lelaki pertama Islam?","Umar","Abu Bakar","Ali",1,"Sirah"],["Wanita pertama Islam?","Aisyah","Khadijah","Fatimah",1,"Sirah"],["Rukun terbesar haji?","Tawaf","Wukuf Arafah","Saie",1,"Haji"],["Berapa rukun haji?","Tiga","Empat","Lima",1,"Haji"],["Pusingan tawaf?","Lima","Tujuh","Sembilan",1,"Haji"],["Pusingan saie?","Lima","Tujuh","Sembilan",1,"Haji"],["Apa Talbiah?","Labbayk Allahumma","SubhanAllah","Allahu Akbar",0,"Haji"],
];
const QFR = [
["Combien de piliers de l'Islam?","Trois","Cinq","Sept",1,"Aqida"],["Premier pilier?","Prière","Deux attestations","Aumône",1,"Aqida"],["Combien de piliers de la foi?","Cinq","Six","Sept",1,"Aqida"],["Plus grand péché?","Shirk","Désobéissance","Mensonge",0,"Aqida"],["Qu'est-ce que le Tawhid?","Unicité d'Allah dans l'adoration","Prier","Jeûner",0,"Aqida"],["Plus grand verset?","Ayat Al-Kursi","Verset de la dette","Premier de Baqara",0,"Aqida"],["Dernier prophète?","Issa","Muhammad ﷺ","Ibrahim",1,"Aqida"],["Qu'est-ce que l'Ihsan?","Adorer comme si on voit Allah","Obligations","Surérogatoires",0,"Aqida"],["Quelqu'un connaît l'invisible?","Oui","Non Allah seul","Anges",1,"Aqida"],["Types de Tawhid?","Deux","Trois","Quatre",1,"Aqida"],
["Combien de prières obligatoires?","Trois","Cinq","Sept",1,"Fiqh"],["Rak'ahs du Fajr?","Quatre","Trois","Deux",2,"Fiqh"],["Rak'ahs du Dhuhr?","Deux","Trois","Quatre",2,"Fiqh"],["Qu'annule les ablutions?","Ce qui sort des voies","Boire","Parler",0,"Fiqh"],["Prière en groupe hommes?","Sunna","Obligatoire","Recommandée",1,"Fiqh"],["Nisab or zakat?","50g","85g","100g",1,"Fiqh"],["Hajj combien de fois?","Chaque année","Une fois","Deux fois",1,"Fiqh"],["Taux de zakat?","5%","2.5%","10%",1,"Fiqh"],["Jeûne d'Arafah?","Détesté","Sunna expie 2 ans","Obligatoire",1,"Fiqh"],["Verdict sur l'usure?","Détesté","Haram","Permis",1,"Fiqh"],
["Combien de sourates?","110","114","120",1,"Coran"],["Première sourate?","Baqara","Fatiha","Nas",1,"Coran"],["Dernière sourate?","Falaq","Ikhlas","Nas",2,"Coran"],["Combien de Juz?","20","30","40",1,"Coran"],["Plus longue sourate?","Al Imran","Baqara","Nisa",1,"Coran"],["Plus courte sourate?","Kawthar","Ikhlas","Falaq",0,"Coran"],["Sourate sans Bismillah?","Fatiha","Baqara","Tawba",2,"Coran"],["Cœur du Coran?","Baqara","Ya-Sin","Rahman",1,"Coran"],["Combien d'années révélation?","10","13","23",2,"Coran"],["Premier verset?","Bismillah","Iqra bismi Rabbik","Alhamdulillah",1,"Coran"],
["Naissance du Prophète ﷺ?","Année du chagrin","Année de l'Éléphant","Année de l'Hégire",1,"Sira"],["Où est-il né?","Médine","La Mecque","Taïf",1,"Sira"],["Âge de la prophétie?","25","35","40",2,"Sira"],["Premier homme musulman?","Omar","Abu Bakr","Ali",1,"Sira"],["Première femme musulmane?","Aïcha","Khadija","Fatima",1,"Sira"],["Plus grand pilier du Hajj?","Tawaf","Station Arafah","Sa'i",1,"Hajj"],["Piliers du Hajj?","Trois","Quatre","Cinq",1,"Hajj"],["Tours du Tawaf?","Cinq","Sept","Neuf",1,"Hajj"],["Tours du Sa'i?","Cinq","Sept","Neuf",1,"Hajj"],["Qu'est-ce que la Talbiyah?","Labbayk Allahumma","SubhanAllah","Allahu Akbar",0,"Hajj"],
];
const QFA = [
["ارکان اسلام چندتاست؟","سه","پنج","هفت",1,"عقیده"],["اولین رکن اسلام؟","نماز","شهادتین","زکات",1,"عقیده"],["ارکان ایمان چندتاست؟","پنج","شش","هفت",1,"عقیده"],["بزرگترین گناه؟","شرک","نافرمانی والدین","دروغ",0,"عقیده"],["توحید چیست؟","یکتاپرستی خدا در عبادت","نماز","روزه",0,"عقیده"],["بزرگترین آیه قرآن؟","آیت الکرسی","آیه دین","اول بقره",0,"عقیده"],["آخرین پیامبر؟","عیسی","محمد ﷺ","ابراهیم",1,"عقیده"],["احسان چیست؟","عبادت مثل اینکه خدا را می‌بینی","فرائض","نوافل",0,"عقیده"],["غیب را کسی غیر خدا می‌داند؟","بله","نه فقط خدا","فرشتگان",1,"عقیده"],["انواع توحید؟","دو","سه","چهار",1,"عقیده"],
["نمازهای واجب؟","سه","پنج","هفت",1,"فقه"],["رکعت نماز صبح؟","چهار","سه","دو",2,"فقه"],["رکعت نماز ظهر؟","دو","سه","چهار",2,"فقه"],["چه چیز وضو را باطل می‌کند؟","خروج از دو راه","نوشیدن آب","صحبت",0,"فقه"],["حکم نماز جماعت؟","سنت","واجب","مستحب",1,"فقه"],["نصاب طلا برای زکات؟","۵۰ گرم","۸۵ گرم","۱۰۰",1,"فقه"],["حج چند بار واجب؟","هر سال","یکبار در عمر","دوبار",1,"فقه"],["نرخ زکات؟","۵٪","۲.۵٪","۱۰٪",1,"فقه"],["حکم روزه عرفه؟","مکروه","سنت کفاره ۲ سال","واجب",1,"فقه"],["حکم ربا؟","مکروه","حرام","مباح",1,"فقه"],
["تعداد سوره‌ها؟","۱۱۰","۱۱۴","۱۲۰",1,"قرآن"],["اولین سوره؟","بقره","فاتحه","ناس",1,"قرآن"],["آخرین سوره؟","فلق","اخلاص","ناس",2,"قرآن"],["تعداد جزء؟","۲۰","۳۰","۴۰",1,"قرآن"],["بلندترین سوره؟","آل عمران","بقره","نساء",1,"قرآن"],["کوتاهترین سوره؟","کوثر","اخلاص","فلق",0,"قرآن"],["سوره بدون بسمله؟","فاتحه","بقره","توبه",2,"قرآن"],["قلب قرآن؟","بقره","یس","الرحمن",1,"قرآن"],["قرآن در چند سال نازل شد؟","۱۰","۱۳","۲۳",2,"قرآن"],["اولین آیه؟","بسمله","اقرأ باسم ربک","الحمدلله",1,"قرآن"],
["تولد پیامبر ﷺ؟","سال غم","سال فیل","سال هجرت",1,"سیره"],["کجا متولد شد؟","مدینه","مکه","طائف",1,"سیره"],["سن بعثت؟","۲۵","۳۵","۴۰",2,"سیره"],["اولین مرد مسلمان؟","عمر","ابوبکر","علی",1,"سیره"],["اولین زن مسلمان؟","عایشه","خدیجه","فاطمه",1,"سیره"],["بزرگترین رکن حج؟","طواف","وقوف عرفه","سعی",1,"حج"],["ارکان حج؟","سه","چهار","پنج",1,"حج"],["دور طواف؟","پنج","هفت","نه",1,"حج"],["دور سعی؟","پنج","هفت","نه",1,"حج"],["تلبیه چیست؟","لبیک اللهم","سبحان الله","الله اکبر",0,"حج"],
];
const QBN = [
["ইসলামের স্তম্ভ কয়টি?","তিন","পাঁচ","সাত",1,"আকীদা"],["ইসলামের প্রথম স্তম্ভ?","নামাজ","শাহাদাত","যাকাত",1,"আকীদা"],["ঈমানের স্তম্ভ কয়টি?","পাঁচ","ছয়","সাত",1,"আকীদা"],["সবচেয়ে বড় গুনাহ?","শিরক","অবাধ্যতা","মিথ্যা",0,"আকীদা"],["তাওহীদ কী?","আল্লাহকে ইবাদতে একক করা","নামাজ","রোজা",0,"আকীদা"],["কুরআনের সবচেয়ে বড় আয়াত?","আয়াতুল কুরসী","ঋণের আয়াত","বাকারার প্রথম",0,"আকীদা"],["শেষ নবী?","ঈসা","মুহাম্মাদ ﷺ","ইবরাহীম",1,"আকীদা"],["ইহসান কী?","আল্লাহকে দেখছেন মনে করে ইবাদত","ফরজ","নফল",0,"আকীদা"],["গায়েব কি আল্লাহ ছাড়া কেউ জানে?","হ্যাঁ","না শুধু আল্লাহ","ফেরেশতা",1,"আকীদা"],["তাওহীদের প্রকার?","দুই","তিন","চার",1,"আকীদা"],
["ফরজ নামাজ কয়টি?","তিন","পাঁচ","সাত",1,"ফিকহ"],["ফজরের রাকাত?","চার","তিন","দুই",2,"ফিকহ"],["যোহরের রাকাত?","দুই","তিন","চার",2,"ফিকহ"],["ওযু কী ভাঙে?","দুই পথ থেকে বের হওয়া","পানি পান","কথা",0,"ফিকহ"],["জামাতে নামাজের হুকুম?","সুন্নত","ওয়াজিব","মুস্তাহাব",1,"ফিকহ"],["স্বর্ণের যাকাত নিসাব?","৫০গ্রাম","৮৫গ্রাম","১০০",1,"ফিকহ"],["হজ কতবার ফরজ?","প্রতি বছর","জীবনে একবার","দুইবার",1,"ফিকহ"],["যাকাতের হার?","৫%","২.৫%","১০%",1,"ফিকহ"],["আরাফার রোজা?","মাকরূহ","সুন্নত ২ বছর কাফফারা","ফরজ",1,"ফিকহ"],["সুদের হুকুম?","মাকরূহ","হারাম","মুবাহ",1,"ফিকহ"],
["কুরআনে কয়টি সূরা?","১১০","১১৪","১২০",1,"কুরআন"],["প্রথম সূরা?","বাকারা","ফাতিহা","নাস",1,"কুরআন"],["শেষ সূরা?","ফালাক","ইখলাস","নাস",2,"কুরআন"],["কয়টি জুয?","২০","৩০","৪০",1,"কুরআন"],["দীর্ঘতম সূরা?","আলে ইমরান","বাকারা","নিসা",1,"কুরআন"],["সবচেয়ে ছোট সূরা?","কাওসার","ইখলাস","ফালাক",0,"কুরআন"],["বিসমিল্লাহ নেই কোন সূরায়?","ফাতিহা","বাকারা","তাওবা",2,"কুরআন"],["কুরআনের হৃদয়?","বাকারা","ইয়াসীন","রাহমান",1,"কুরআন"],["কুরআন কত বছরে নাযিল?","১০","১৩","২৩",2,"কুরআন"],["প্রথম আয়াত?","বিসমিল্লাহ","ইকরা বিসমি রাব্বিক","আলহামদু",1,"কুরআন"],
["নবী ﷺ কবে জন্মান?","দুঃখের বছর","হাতির বছর","হিজরতের বছর",1,"সীরাহ"],["কোথায় জন্মান?","মদীনা","মক্কা","তায়েফ",1,"সীরাহ"],["কত বছরে নবুওয়াত?","২৫","৩৫","৪০",2,"সীরাহ"],["প্রথম পুরুষ মুসলিম?","উমর","আবু বকর","আলী",1,"সীরাহ"],["প্রথম নারী মুসলিম?","আয়েশা","খাদীজা","ফাতিমা",1,"সীরাহ"],["হজের সবচেয়ে বড় রুকন?","তাওয়াফ","আরাফায় অবস্থান","সাঈ",1,"হজ"],["হজের রুকন কয়টি?","তিন","চার","পাঁচ",1,"হজ"],["তাওয়াফ কত চক্কর?","পাঁচ","সাত","নয়",1,"হজ"],["সাঈ কত চক্কর?","পাঁচ","সাত","নয়",1,"হজ"],["তালবিয়া কী?","লাব্বাইক আল্লাহুম্মা","সুবহানাল্লাহ","আল্লাহু আকবার",0,"হজ"],
];
const QHI = [
["इस्लाम के अरकान कितने हैं?","तीन","पाँच","सात",1,"अक़ीदा"],["इस्लाम का पहला रुकन?","नमाज़","शहादतैन","ज़कात",1,"अक़ीदा"],["ईमान के अरकान कितने?","पाँच","छह","सात",1,"अक़ीदा"],["सबसे बड़ा गुनाह?","शिर्क","नाफ़रमानी","झूठ",0,"अक़ीदा"],["तौहीद क्या है?","अल्लाह को इबादत में अकेला मानना","नमाज़","रोज़ा",0,"अक़ीदा"],["क़ुरान की सबसे बड़ी आयत?","आयतुल कुर्सी","क़र्ज़ की आयत","बक़रा की पहली",0,"अक़ीदा"],["आख़िरी नबी?","ईसा","मुहम्मद ﷺ","इब्राहीम",1,"अक़ीदा"],["इहसान क्या है?","अल्लाह को देखते हुए इबादत","फ़र्ज़","नफ़ल",0,"अक़ीदा"],["ग़ैब अल्लाह के सिवा कोई जानता है?","हाँ","नहीं सिर्फ़ अल्लाह","फ़रिश्ते",1,"अक़ीदा"],["तौहीद की कितनी क़िस्में?","दो","तीन","चार",1,"अक़ीदा"],
["फ़र्ज़ नमाज़ें कितनी?","तीन","पाँच","सात",1,"फ़िक़्ह"],["फ़ज्र कितनी रकअत?","चार","तीन","दो",2,"फ़िक़्ह"],["ज़ुहर कितनी रकअत?","दो","तीन","चार",2,"फ़िक़्ह"],["वुज़ू क्या तोड़ता है?","दोनों रास्तों से निकलना","पानी पीना","बात करना",0,"फ़िक़्ह"],["जमाअत से नमाज़?","सुन्नत","वाजिब","मुस्तहब",1,"फ़िक़्ह"],["सोने का ज़कात निसाब?","50 ग्राम","85 ग्राम","100",1,"फ़िक़्ह"],["हज कितनी बार फ़र्ज़?","हर साल","उम्र में एक बार","दो बार",1,"फ़िक़्ह"],["ज़कात दर?","5%","2.5%","10%",1,"फ़िक़्ह"],["अरफ़ा का रोज़ा?","मकरूह","सुन्नत 2 साल कफ़्फ़ारा","फ़र्ज़",1,"फ़िक़्ह"],["सूद का हुक्म?","मकरूह","हराम","मुबाह",1,"फ़िक़्ह"],
["क़ुरान में कितनी सूरतें?","110","114","120",1,"क़ुरान"],["पहली सूरत?","बक़रा","फ़ातिहा","नास",1,"क़ुरान"],["आख़िरी सूरत?","फ़लक़","इख़लास","नास",2,"क़ुरान"],["कितने जुज़?","20","30","40",1,"क़ुरान"],["सबसे लंबी सूरत?","आले इमरान","बक़रा","निसा",1,"क़ुरान"],["सबसे छोटी सूरत?","कौसर","इख़लास","फ़लक़",0,"क़ुरान"],["बिस्मिल्लाह के बिना सूरत?","फ़ातिहा","बक़रा","तौबा",2,"क़ुरान"],["क़ुरान का दिल?","बक़रा","यासीन","रहमान",1,"क़ुरान"],["क़ुरान कितने साल में?","10","13","23",2,"क़ुरान"],["पहली आयत?","बिस्मिल्लाह","इक़रा बिस्मि रब्बिक","अलहम्दु",1,"क़ुरान"],
["नबी ﷺ कब पैदा हुए?","ग़म का साल","हाथी का साल","हिजरत का साल",1,"सीरत"],["कहाँ पैदा हुए?","मदीना","मक्का","ताइफ़",1,"सीरत"],["कितने साल में नबुव्वत?","25","35","40",2,"सीरत"],["पहले मुसलमान मर्द?","उमर","अबू बक्र","अली",1,"सीरत"],["पहली मुसलमान औरत?","आइशा","ख़दीजा","फ़ातिमा",1,"सीरत"],["हज का सबसे बड़ा रुकन?","तवाफ़","वुक़ूफ़-ए-अरफ़ा","सई",1,"हज"],["हज के अरकान?","तीन","चार","पाँच",1,"हज"],["तवाफ़ के चक्कर?","पाँच","सात","नौ",1,"हज"],["सई के चक्कर?","पाँच","सात","नौ",1,"हज"],["तल्बिया क्या है?","लब्बैक अल्लाहुम्मा","सुब्हानल्लाह","अल्लाहु अकबर",0,"हज"],
];

const QBY = { ar: QAR, en: QEN, tr: QTR, ur: QUR, ms: QMS, fr: QFR, fa: QFA, bn: QBN, hi: QHI };
const QCOUNT = 10;

function shuffleArr(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* ═══ Main Component ═══ */
export default function ManafaaContestPage() {
  const { lang, setLang } = useLang();

  useEffect(() => { trackPage("/contest", lang); }, [lang]);
  const [showLM, setShowLM] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mob, setMob] = useState(false);

  const lo = LL.find(l => l.c === lang) || LL[0];
  const dir = lo.d;
  const u = UI[lang] || UI.ar;

  // Quiz
  const allQ = QBY[lang] || null;
  const hasQ = allQ && allQ.length > 0;

  const [quiz, setQuiz] = useState([]);
  const [idx, setIdx] = useState(0);
  const [pick, setPick] = useState(-1);
  const [done, setDone] = useState(false);
  const [score, setScore] = useState(0);

  // Form
  const [step, setStep] = useState("quiz"); // quiz | form | result
  const [nm, setNm] = useState("");
  const [co, setCo] = useState("");
  const [ph, setPh] = useState("");
  const [err, setErr] = useState(false);

  // Init quiz
  const buildQuiz = () => {
    if (!allQ) return;
    setQuiz(shuffleArr(allQ).slice(0, QCOUNT));
    setIdx(0);
    setPick(-1);
    setDone(false);
    setScore(0);
    setStep("quiz");
    setNm("");
    setCo("");
    setPh("");
    setErr(false);
  };

  useEffect(() => { buildQuiz(); }, [lang]);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const checkAnswer = () => {
    if (pick === quiz[idx][4]) setScore(s => s + 1);
    setDone(true);
  };

  const nextQ = () => {
    if (idx < quiz.length - 1) {
      setIdx(idx + 1);
      setPick(-1);
      setDone(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setStep("form");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const submitForm = () => {
    if (!nm.trim() || !co.trim() || !ph.trim()) { setErr(true); return; }
    setErr(false);
    // Save to Supabase
    try {
      fetch("https://pxacnzpundghlojfldif.supabase.co/rest/v1/contest_submissions", {
        method: "POST",
        headers: {
          apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4YWNuenB1bmRnaGxvamZsZGlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NDU4NjgsImV4cCI6MjA4ODMyMTg2OH0.GXnkjYc06QjGMRVOkzpGKh9wcnG0BIxEM-GfmTbM3Tk",
          Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4YWNuenB1bmRnaGxvamZsZGlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NDU4NjgsImV4cCI6MjA4ODMyMTg2OH0.GXnkjYc06QjGMRVOkzpGKh9wcnG0BIxEM-GfmTbM3Tk",
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify({ full_name: nm, country: co, phone: ph, score, total_questions: quiz.length, lang })
      });
    } catch (e) {}
    setStep("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pct = quiz.length > 0 ? Math.round((score / quiz.length) * 100) : 0;
  const grade = pct >= 90 ? { e: "🏆", t: u.ex, c: "#22c55e" } : pct >= 70 ? { e: "⭐", t: u.gd, c: "#C8A951" } : pct >= 50 ? { e: "📚", t: u.av, c: "#f59e0b" } : { e: "💪", t: u.wk, c: "#ef4444" };

  const navKeys = [
    {k:"n_home", href:"/"},
    {k:"n_vid", href:"/videos"},
    {k:"n_quran", href:"/quran"},
    {k:"n_lib", href:"/library"},
    {k:"n_hajj", href:"/hajj"},
    {k:"n_umrah", href:"/umrah"},
    {k:"n_contest", href:"/contest"},
  ];

  return (
    <div dir={dir} style={{ fontFamily: "'Tajawal','Segoe UI',sans-serif", minHeight: "100vh", background: "#FAFBFC" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&family=Amiri:wght@400;700&display=swap');*{box-sizing:border-box;margin:0;padding:0}@keyframes fu{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes sh{0%{background-position:-200% 0}100%{background-position:200% 0}}`}</style>

      
      <Navbar />



      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#0F2530,#1B3A4B,#2C5F7C,#1B3A4B)", padding: "48px 16px", textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>🏆</div>
        <h1 style={{ fontFamily: "Amiri,serif", fontSize: "clamp(24px,5vw,40px)", fontWeight: 900, background: "linear-gradient(90deg,#9E832E,#C8A951,#E8D48B,#C8A951,#9E832E)", backgroundSize: "200% 100%", animation: "sh 4s linear infinite", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: "8px" }}>{u.title}</h1>
        <p style={{ color: "rgba(255,255,255,.6)", fontSize: "14px", maxWidth: "500px", margin: "0 auto" }}>{u.desc}</p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "24px 16px" }}>

        {!hasQ ? (
          <div style={{ background: "white", borderRadius: "24px", padding: "48px", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,.06)" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏆</div>
            <h3 style={{ color: "#1B3A4B", fontWeight: 900 }}>{u.nc}</h3>
          </div>
        ) : step === "quiz" && quiz.length > 0 ? (() => {
          const q = quiz[idx];
          const prog = ((idx + 1) / quiz.length) * 100;
          return (
            <div key={idx} style={{ animation: "fu .4s ease-out" }}>
              {/* Progress */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#6B7280", marginBottom: "6px" }}>
                  <span>{u.q} {idx + 1} {u.of} {quiz.length}</span>
                  <span style={{ background: "rgba(200,169,81,.1)", color: "#9E832E", padding: "2px 10px", borderRadius: "20px" }}>{q[5]}</span>
                </div>
                <div style={{ width: "100%", height: "8px", borderRadius: "4px", background: "#E5E7EB" }}>
                  <div style={{ height: "100%", borderRadius: "4px", width: `${prog}%`, background: "linear-gradient(90deg,#9E832E,#C8A951)", transition: "width .5s" }}></div>
                </div>
              </div>

              {/* Question Card */}
              <div style={{ background: "white", borderRadius: "24px", padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,.06)", border: "1px solid rgba(200,169,81,.12)" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#1B3A4B", marginBottom: "20px", lineHeight: 1.8 }}>{q[0]}</h3>

                {/* Options */}
                {[q[1], q[2], q[3]].map((opt, i) => {
                  let bg = "white", bc = "#E5E7EB", cl = "#1a1a2e";
                  if (done && i === q[4]) { bg = "rgba(34,197,94,.08)"; bc = "#22c55e"; cl = "#15803d"; }
                  else if (done && i === pick && i !== q[4]) { bg = "rgba(239,68,68,.08)"; bc = "#ef4444"; cl = "#b91c1c"; }
                  else if (i === pick) { bg = "rgba(200,169,81,.05)"; bc = "#C8A951"; cl = "#9E832E"; }
                  return (
                    <button key={i} disabled={done} onClick={() => setPick(i)} style={{ display: "block", width: "100%", padding: "14px 18px", marginBottom: "10px", borderRadius: "12px", border: `2px solid ${bc}`, background: bg, color: cl, fontSize: "14px", fontWeight: 500, textAlign: dir === "rtl" ? "right" : "left", cursor: done ? "default" : "pointer", fontFamily: "Tajawal", transition: "all .2s" }}>{opt}</button>
                  );
                })}

                {/* Check / Next */}
                {!done ? (
                  <button disabled={pick === -1} onClick={checkAnswer} style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: pick === -1 ? "#D1D5DB" : "linear-gradient(135deg,#9E832E,#C8A951)", color: "white", fontWeight: "bold", fontSize: "14px", cursor: pick === -1 ? "default" : "pointer", fontFamily: "Tajawal", marginTop: "8px" }}>{u.ok}</button>
                ) : (
                  <div>
                    <p style={{ textAlign: "center", fontWeight: "bold", fontSize: "16px", color: pick === q[4] ? "#22c55e" : "#ef4444", marginBottom: "8px" }}>
                      {pick === q[4] ? `✅ ${u.yes}` : `❌ ${u.no}`}
                    </p>
                    {pick !== q[4] && <p style={{ textAlign: "center", fontSize: "13px", color: "#6B7280", marginBottom: "12px" }}>{u.ca} <strong style={{ color: "#1B3A4B" }}>{q[q[4] + 1]}</strong></p>}
                    <button onClick={nextQ} style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#9E832E,#C8A951)", color: "white", fontWeight: "bold", fontSize: "14px", cursor: "pointer", fontFamily: "Tajawal" }}>{idx < quiz.length - 1 ? u.nx : u.nx + " →"}</button>
                  </div>
                )}
              </div>
            </div>
          );
        })()

        : step === "form" ? (
          <div style={{ background: "white", borderRadius: "24px", padding: "32px", boxShadow: "0 4px 20px rgba(0,0,0,.06)", animation: "fu .4s ease-out" }}>
            <div style={{ textAlign: "center", marginBottom: "24px" }}>
              <div style={{ fontSize: "40px", marginBottom: "8px" }}>📝</div>
              <h2 style={{ fontWeight: 900, color: "#1B3A4B" }}>{u.reg}</h2>
            </div>
            {[
              [nm, setNm, u.nm, "text"],
              [co, setCo, u.co, "text"],
              [ph, setPh, u.ph, "tel"]
            ].map(([val, set, placeholder, type], i) => (
              <input key={i} value={val} onChange={e => set(e.target.value)} placeholder={placeholder} type={type}
                style={{ display: "block", width: "100%", padding: "14px 16px", marginBottom: "12px", borderRadius: "12px", border: `2px solid ${err && !val.trim() ? "#ef4444" : "#E5E7EB"}`, fontSize: "14px", fontFamily: "Tajawal", direction: type === "tel" ? "ltr" : dir, textAlign: type === "tel" ? "left" : dir === "rtl" ? "right" : "left", outline: "none" }} />
            ))}
            {err && <p style={{ textAlign: "center", color: "#ef4444", fontSize: "12px", marginBottom: "8px" }}>{u.req}</p>}
            <button onClick={submitForm} style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#9E832E,#C8A951)", color: "white", fontWeight: "bold", fontSize: "14px", cursor: "pointer", fontFamily: "Tajawal" }}>{u.sub}</button>
          </div>
        )

        : step === "result" ? (
          <div style={{ background: "white", borderRadius: "24px", padding: "40px", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,.06)", animation: "fu .4s ease-out" }}>
            <p style={{ background: "rgba(34,197,94,.08)", color: "#22c55e", padding: "6px 16px", borderRadius: "20px", display: "inline-block", fontSize: "13px", marginBottom: "16px" }}>{u.ok2}</p>
            <div style={{ fontSize: "56px", marginBottom: "8px" }}>{grade.e}</div>
            <h2 style={{ fontFamily: "Amiri,serif", fontWeight: 900, color: "#1B3A4B", marginBottom: "8px" }}>{u.res}</h2>
            <div style={{ fontSize: "48px", fontWeight: 900, color: grade.c, margin: "16px 0" }}>{score}/{quiz.length}</div>
            <div style={{ width: "100%", height: "10px", borderRadius: "5px", background: "#E5E7EB", marginBottom: "12px" }}>
              <div style={{ height: "100%", borderRadius: "5px", width: `${pct}%`, background: grade.c }}></div>
            </div>
            <p style={{ fontSize: "24px", fontWeight: "bold", color: grade.c }}>{pct}%</p>
            <p style={{ fontSize: "16px", color: "#6B7280", marginBottom: "24px" }}>{grade.t}</p>
            <button onClick={() => { buildQuiz(); window.scrollTo({ top: 0, behavior: "smooth" }); }} style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg,#9E832E,#C8A951)", color: "white", fontWeight: "bold", fontSize: "14px", cursor: "pointer", fontFamily: "Tajawal" }}>{u.nq}</button>
          </div>
        ) : null}
      </div>

      {/* Footer */}
      <footer style={{ background: "#0F2530", marginTop: "40px", padding: "48px 16px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "40px", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#C8A951", color: "#0F2530", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Amiri,serif", fontWeight: "bold" }}>م</div>
            <div><div style={{ color: "white", fontWeight: "bold" }}>{u.sn}</div><div style={{ color: "#C8A951", fontSize: "12px" }}>{u.sd}</div></div>
          </div>
          <div>
            <h4 style={{ color: "white", fontWeight: "bold", marginBottom: "12px" }}>{u.ftl}</h4>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {LL.map(l => <button key={l.c} onClick={() => setLang(l.c)} style={{ padding: "4px 12px", borderRadius: "20px", border: "none", background: lang === l.c ? "#C8A951" : "rgba(255,255,255,.05)", color: lang === l.c ? "#0F2530" : "rgba(255,255,255,.6)", fontSize: "12px", cursor: "pointer", fontWeight: lang === l.c ? "bold" : "normal" }}>{l.n}</button>)}
            </div>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: "32px", paddingTop: "24px", borderTop: "1px solid rgba(255,255,255,.05)" }}>
          <p style={{ color: "rgba(255,255,255,.3)", fontSize: "13px" }}>© {new Date().getFullYear()} {u.ftc}</p>
        </div>
      </footer>

      {showLM && <div style={{ position: "fixed", inset: 0, zIndex: 40 }} onClick={() => setShowLM(false)}></div>}
    </div>
  );
}
