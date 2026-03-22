import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { supaInsert as supaIns } from "../lib/supabase";
import { useState, useEffect } from "react";
import { useLang } from "../lib/LangContext";

const L=[{c:"ar",n:"العربية",d:"rtl"},{c:"en",n:"English",d:"ltr"},{c:"tr",n:"Türkçe",d:"ltr"},{c:"ur",n:"اردو",d:"rtl"},{c:"ms",n:"Melayu",d:"ltr"},{c:"fr",n:"Français",d:"ltr"},{c:"fa",n:"فارسی",d:"rtl"},{c:"bn",n:"বাংলা",d:"ltr"},{c:"hi",n:"हिन्दी",d:"ltr"}];

// ─── UI Translations (9 Languages) ───
const T={
ar:{bismillah:"بسم الله الرحمن الرحيم",site_name:"مشروع منافع",site_desc:"لدعوة الحجاج والمعتمرين",n_home:"الرئيسية",n_vid:"الفيديوهات",n_quran:"القرآن الكريم",n_lib:"المكتبة",n_hajj:"الحج",n_umrah:"العمرة",n_contest:"المسابقة",login:"تسجيل الدخول",hero_title:"الحجُّ ركن الإسلام",hero_desc:"يحجّ المسلمون إلى بيت الله الحرام امتثالًا لأمر الله وطلبًا لمغفرته ورضاه، وأداءً للركن الخامس من أركان الإسلام",journey_title:"رحلة الحاج",journey_desc:"رحلتك خطوة بخطوة من الإحرام حتى طواف الوداع",start_journey:"ابدأ الرحلة",about_title:"معلومات عن الحج",virtues_title:"فضائل الحج",sunnah_title:"سنن ومستحبات الحج",pillars_title:"أركان الحج",pillars_desc:"أركان الحج أربعة لا يصح الحج إلا بها",miqaat_title:"المواقيت وأنواع النسك",miqaat_desc:"المواقيت المكانية والزمانية وأنواع النسك الثلاثة",remember_title:"أمور يجب أن تتذكرها",step:"الخطوة",of:"من",dua:"الدعاء",prev:"السابق",next:"التالي",back_map:"العودة للخريطة",no_content:"لا يوجد محتوى بهذه اللغة حالياً — سيتم إضافته قريباً",ft_copy:"مشروع منافع — جميع الحقوق محفوظة",ft_langs:"اللغات المدعومة",
  virtues:["الحج المبرور ليس له جزاء إلا الجنة — والحج المبرور أن يكون من مال حلال مع اجتناب الفسق والجدال","من حجّ فلم يرفث ولم يفسق رجع كيوم ولدته أمه — أي يرجع مغفوراً له ذنوبه","تابعوا بين الحج والعمرة فإنهما ينفيان الفقر والذنوب كما ينفي الكير خبث الحديد","الحاج في ضمان الله — ثلاثة في ضمان الله: رجل خرج إلى المسجد، ورجل خرج غازياً، ورجل خرج حاجاً"],
  sunnahs:["الاغتسال والتطيب قبل الإحرام","التلبية بصوت مرتفع للرجال والإكثار منها","الاضطباع والرمل في الأشواط الثلاثة الأولى من طواف القدوم","استلام الحجر الأسود وتقبيله إن تيسر","الإكثار من الدعاء في يوم عرفة خاصة بعد العصر","المبيت بمنى ليلة عرفة","الإسراع بين العلامتين الخضراوين في السعي"],
  pillars:[{t:"الإحرام",d:"نية الدخول في النسك — وهو ركن بإجماع العلماء"},{t:"الوقوف بعرفة",d:"أعظم أركان الحج — قال ﷺ: الحج عرفة. من فاته عرفة فقد فاته الحج"},{t:"طواف الإفاضة",d:"الطواف بالبيت بعد الوقوف بعرفة — قال تعالى: وليطوفوا بالبيت العتيق"},{t:"السعي بين الصفا والمروة",d:"سبعة أشواط بين الصفا والمروة — قال تعالى: إن الصفا والمروة من شعائر الله"}],
  miqaat_types:[{t:"حج التمتع",d:"أن يُحرم بالعمرة في أشهر الحج ويتحلل منها ثم يُحرم بالحج — وهو أفضل الأنساك"},{t:"حج القران",d:"أن يُحرم بالعمرة والحج معاً أو يُدخل الحج على العمرة قبل الشروع في طوافها"},{t:"حج الإفراد",d:"أن يُحرم بالحج فقط من الميقات — ولا هدي على المفرد"}],
  miqaat_places:["ذو الحليفة (أبيار علي) — ميقات أهل المدينة","الجحفة (رابغ) — ميقات أهل الشام ومصر والمغرب","قرن المنازل (السيل الكبير) — ميقات أهل نجد","يلملم (السعدية) — ميقات أهل اليمن","ذات عرق — ميقات أهل العراق"],
  remember:["تعلّم أحكام الحج قبل السفر واستشر أهل العلم","تأكد من صحة وثائقك وتطعيماتك الصحية","احمل أدوية كافية وواقي شمس وملابس مريحة","حافظ على الهدوء والسكينة في الزحام","لا تنسَ الإكثار من الدعاء والذكر في جميع المناسك","احفظ رقم حملتك ومكان سكنك","اشرب الماء باستمرار وتجنب الإرهاق"],
},
en:{bismillah:"In the Name of Allah, the Most Gracious, the Most Merciful",site_name:"Manafea Project",site_desc:"For Hajj & Umrah Dawah",n_home:"Home",n_vid:"Videos",n_quran:"Holy Quran",n_lib:"Library",n_hajj:"Hajj",n_umrah:"Umrah",n_contest:"Contest",login:"Login",hero_title:"Hajj: The Pillar of Islam",hero_desc:"Muslims perform Hajj to the Sacred House in obedience to Allah, seeking His forgiveness and pleasure, fulfilling the fifth pillar of Islam",journey_title:"The Pilgrim's Journey",journey_desc:"Your step-by-step guide from Ihram to the Farewell Tawaf",start_journey:"Start the Journey",about_title:"About Hajj",virtues_title:"Virtues of Hajj",sunnah_title:"Sunnahs of Hajj",pillars_title:"Pillars of Hajj",pillars_desc:"Four pillars without which Hajj is invalid",miqaat_title:"Miqaat & Types of Rituals",miqaat_desc:"Spatial and temporal boundaries and three types of Hajj rituals",remember_title:"Things to Remember",step:"Step",of:"of",dua:"Supplication",prev:"Previous",next:"Next",back_map:"Back to Map",no_content:"No content available in this language yet — coming soon",ft_copy:"Manafea Project — All Rights Reserved",ft_langs:"Supported Languages",
  virtues:["An accepted Hajj has no reward except Paradise — performed with lawful wealth, avoiding sin and argument","Whoever performs Hajj without committing sin returns like a newborn — all sins forgiven","Alternate between Hajj and Umrah, for they remove poverty and sins as the bellows remove impurities from iron","The pilgrim is under Allah's protection — three are guaranteed by Allah: one who goes to the mosque, one who goes for jihad, and one who goes for Hajj"],
  sunnahs:["Bathing and applying fragrance before entering Ihram","Reciting Talbiyah aloud (for men) and frequently","Idtiba and Raml in the first three circuits of Tawaf Al-Qudum","Touching and kissing the Black Stone if possible","Abundant supplication on the Day of Arafah especially after Asr","Spending the night at Mina before Arafah","Walking briskly between the green markers during Sa'i"],
  pillars:[{t:"Ihram",d:"The intention to enter the sacred state — agreed upon by all scholars"},{t:"Standing at Arafah",d:"The greatest pillar — the Prophet ﷺ said: Hajj is Arafah. Missing Arafah means missing Hajj"},{t:"Tawaf Al-Ifadah",d:"Circling the Ka'bah after Arafah — Allah says: Let them circumambulate the Ancient House"},{t:"Sa'i between Safa and Marwah",d:"Seven circuits between Safa and Marwah — Allah says: Safa and Marwah are among the symbols of Allah"}],
  miqaat_types:[{t:"Hajj Tamattu",d:"Performing Umrah in Hajj months, then Hajj separately — the best type of Hajj"},{t:"Hajj Qiran",d:"Combining Umrah and Hajj in one Ihram, or adding Hajj to Umrah before starting Tawaf"},{t:"Hajj Ifrad",d:"Entering Ihram for Hajj only — no sacrifice required for Ifrad"}],
  miqaat_places:["Dhul-Hulayfah (Abyar Ali) — Miqat for people of Madinah","Al-Juhfah (Rabigh) — Miqat for people of Sham, Egypt, and North Africa","Qarn Al-Manazil (As-Sayl) — Miqat for people of Najd","Yalamlam (As-Sadiyah) — Miqat for people of Yemen","Dhat Irq — Miqat for people of Iraq"],
  remember:["Learn Hajj rulings before traveling and consult scholars","Verify your documents and health vaccinations","Carry sufficient medicine, sunscreen, and comfortable clothing","Maintain calm and tranquility in crowds","Remember to make abundant dua and dhikr during all rituals","Memorize your camp number and accommodation location","Stay hydrated and avoid exhaustion"],
},
tr:{bismillah:"Rahman ve Rahim olan Allah'ın adıyla",site_name:"Menafi Projesi",site_desc:"Hacılar İçin",n_home:"Ana Sayfa",n_vid:"Videolar",n_quran:"Kur'an",n_lib:"Kütüphane",n_hajj:"Hac",n_umrah:"Umre",n_contest:"Yarışma",login:"Giriş",hero_title:"Hac: İslam'ın Şartı",hero_desc:"Müslümanlar Allah'ın emrine uyarak Beytullah'a hac yaparlar",journey_title:"Hacının Yolculuğu",journey_desc:"İhramdan Veda Tavafına adım adım rehber",start_journey:"Yolculuğa Başla",about_title:"Hac Hakkında",virtues_title:"Haccın Faziletleri",sunnah_title:"Haccın Sünnetleri",pillars_title:"Haccın Rükünleri",pillars_desc:"Hac ancak bu dört rükünle geçerlidir",miqaat_title:"Mikatlar ve Nüsük Çeşitleri",miqaat_desc:"Mekansal ve zamansal mikatlar ile üç nüsük çeşidi",remember_title:"Hatırlanması Gerekenler",step:"Adım",of:"/",dua:"Dua",prev:"Önceki",next:"Sonraki",back_map:"Haritaya Dön",no_content:"Bu dilde henüz içerik yok — yakında eklenecek",ft_copy:"Menafi — Tüm Hakları Saklıdır",ft_langs:"Diller",
  virtues:["Makbul haccın karşılığı ancak cennettir","Günah işlemeden hac yapan, annesinin doğurduğu günkü gibi döner","Hac ve umreyi peş peşe yapın, çünkü onlar fakirliği ve günahları giderir","Hacı Allah'ın güvencesindedir"],
  sunnahs:["İhramdan önce yıkanmak ve güzel koku sürmek","Erkeklerin telbiyeyi yüksek sesle söylemesi","Kudüm tavafının ilk üç şavtında remel yapmak","Hacer-i Esved'i selamlamak","Arefe günü bol bol dua etmek","Arefe gecesi Mina'da gecelemek","Sa'y sırasında yeşil işaretler arasında hızlı yürümek"],
  pillars:[{t:"İhram",d:"Nüsüke niyet etmek — tüm alimlerin ittifakıyla rükündür"},{t:"Arafat'ta Vakfe",d:"Haccın en büyük rüknü — Hz. Peygamber ﷺ: Hac Arafat'tır buyurmuştur"},{t:"İfade Tavafı",d:"Arafat'tan sonra Kâbe'yi tavaf etmek"},{t:"Safa ile Merve Arası Sa'y",d:"Safa ile Merve arasında yedi şavt"}],
  miqaat_types:[{t:"Temettu Haccı",d:"Hac aylarında önce umre yapıp sonra hacca niyet etmek — en faziletli nüsük"},{t:"Kıran Haccı",d:"Umre ve hacca birlikte niyet etmek"},{t:"İfrad Haccı",d:"Sadece hacca niyet etmek — kurban gerekmez"}],
  miqaat_places:["Zülhuleyfe — Medine halkının mikatı","Cuhfe (Rabığ) — Şam ve Mısır halkının mikatı","Karnülmenazil — Necid halkının mikatı","Yelemlem — Yemen halkının mikatı","Zatüırk — Irak halkının mikatı"],
  remember:["Seyahat öncesi hac hükümlerini öğrenin","Belgelerinizi ve aşılarınızı kontrol edin","Yeterli ilaç ve güneş kremi taşıyın","Kalabalıkta sakin olun","Tüm menasiklerde bol bol dua edin","Kamp numaranızı ve konaklama yerinizi ezberleyin","Sürekli su için ve yorulmaktan kaçının"],
},
ur:{bismillah:"اللہ کے نام سے",site_name:"منافع",site_desc:"حاجیوں کی دعوت",n_home:"ہوم",n_vid:"ویڈیوز",n_quran:"قرآن",n_lib:"لائبریری",n_hajj:"حج",n_umrah:"عمرہ",n_contest:"مقابلہ",login:"لاگ ان",hero_title:"حج: اسلام کا رکن",hero_desc:"مسلمان اللہ کے حکم کی تعمیل میں بیت اللہ کا حج کرتے ہیں",journey_title:"حاجی کا سفر",journey_desc:"احرام سے طواف الوداع تک مرحلہ وار رہنما",start_journey:"سفر شروع کریں",about_title:"حج کے بارے میں",virtues_title:"حج کے فضائل",sunnah_title:"حج کی سنتیں",pillars_title:"حج کے ارکان",pillars_desc:"چار ارکان جن کے بغیر حج صحیح نہیں",miqaat_title:"میقات اور انواع نسک",miqaat_desc:"مکانی اور زمانی میقات اور نسک کی تین قسمیں",remember_title:"یاد رکھنے کی باتیں",step:"مرحلہ",of:"میں سے",dua:"دعا",prev:"پچھلا",next:"اگلا",back_map:"نقشے پر واپس",no_content:"اس زبان میں ابھی مواد نہیں",ft_copy:"منافع — حقوق محفوظ",ft_langs:"زبانیں",
  virtues:["حج مبرور کی جزا جنت ہے","جو حج کرے اور فسق نہ کرے وہ ایسے لوٹتا ہے جیسے ماں نے جنم دیا","حج اور عمرہ پے در پے کرو کیونکہ یہ فقر اور گناہ دور کرتے ہیں","حاجی اللہ کی ضمانت میں ہے"],
  sunnahs:["احرام سے پہلے غسل اور خوشبو","مردوں کا بلند آواز سے تلبیہ پڑھنا","طواف قدوم میں اضطباع اور رمل","حجر اسود کو بوسہ دینا","یوم عرفہ میں کثرت سے دعا","عرفہ سے پہلے منیٰ میں رات گزارنا","سعی میں سبز نشانیوں کے درمیان تیز چلنا"],
  pillars:[{t:"احرام",d:"نسک میں داخل ہونے کی نیت"},{t:"وقوف عرفہ",d:"حج کا سب سے بڑا رکن"},{t:"طواف افاضہ",d:"عرفہ کے بعد کعبے کا طواف"},{t:"صفا اور مروہ کے درمیان سعی",d:"سات چکر"}],
  miqaat_types:[{t:"حج تمتع",d:"حج کے مہینوں میں پہلے عمرہ پھر حج"},{t:"حج قران",d:"عمرہ اور حج دونوں کا ایک ساتھ احرام"},{t:"حج افراد",d:"صرف حج کا احرام"}],
  miqaat_places:["ذوالحلیفہ — مدینہ والوں کا میقات","جحفہ — شام و مصر والوں کا میقات","قرن المنازل — نجد والوں کا میقات","یلملم — یمن والوں کا میقات","ذات عرق — عراق والوں کا میقات"],
  remember:["سفر سے پہلے حج کے احکام سیکھیں","اپنی دستاویزات اور ویکسین چیک کریں","کافی دوائیں اور آرام دہ لباس رکھیں","ہجوم میں پرسکون رہیں","تمام مناسک میں کثرت سے دعا کریں","اپنے کیمپ کا نمبر یاد رکھیں","مسلسل پانی پیتے رہیں"],
},
ms:{bismillah:"Dengan nama Allah",site_name:"Projek Manafea",site_desc:"Dakwah Haji",n_home:"Utama",n_vid:"Video",n_quran:"Al-Quran",n_lib:"Perpustakaan",n_hajj:"Haji",n_umrah:"Umrah",n_contest:"Pertandingan",login:"Log Masuk",hero_title:"Haji: Rukun Islam",hero_desc:"Umat Islam menunaikan haji ke Baitullah",journey_title:"Perjalanan Haji",journey_desc:"Panduan langkah demi langkah",start_journey:"Mulakan",about_title:"Tentang Haji",virtues_title:"Keutamaan Haji",sunnah_title:"Sunat-sunat Haji",pillars_title:"Rukun Haji",pillars_desc:"Empat rukun yang wajib",miqaat_title:"Miqat & Jenis Nusuk",miqaat_desc:"Miqat dan tiga jenis ibadah haji",remember_title:"Perkara Perlu Diingat",step:"Langkah",of:"daripada",dua:"Doa",prev:"Sebelum",next:"Seterusnya",back_map:"Kembali",no_content:"Tiada kandungan dalam bahasa ini",ft_copy:"Manafea — Hak Cipta",ft_langs:"Bahasa",
  virtues:["Haji mabrur ganjarannya syurga","Sesiapa yang menunaikan haji tanpa berbuat dosa kembali seperti bayi baru lahir","Tunaikan haji dan umrah berturut-turut kerana ia menghilangkan kemiskinan dan dosa","Orang yang menunaikan haji dalam jaminan Allah"],
  sunnahs:["Mandi dan memakai wangian sebelum ihram","Membaca talbiah dengan suara lantang bagi lelaki","Idtiba dan raml dalam tiga pusingan pertama tawaf","Mencium Hajar Aswad jika boleh","Berdoa banyak pada hari Arafah","Bermalam di Mina sebelum Arafah","Berjalan pantas antara tanda hijau semasa saie"],
  pillars:[{t:"Ihram",d:"Niat memasuki ibadah haji"},{t:"Wukuf di Arafah",d:"Rukun terbesar"},{t:"Tawaf Ifadah",d:"Tawaf selepas Arafah"},{t:"Saie Safa dan Marwah",d:"Tujuh pusingan"}],
  miqaat_types:[{t:"Haji Tamattu",d:"Umrah dulu kemudian haji"},{t:"Haji Qiran",d:"Umrah dan haji serentak"},{t:"Haji Ifrad",d:"Haji sahaja"}],
  miqaat_places:["Zulhulaifah — Miqat Madinah","Juhfah — Miqat Syam","Qarnul Manazil — Miqat Najd","Yalamlam — Miqat Yaman","Zat Irq — Miqat Iraq"],
  remember:["Pelajari hukum haji sebelum pergi","Semak dokumen dan vaksinasi","Bawa ubat dan pakaian selesa","Kekal tenang dalam kesesakan","Banyak berdoa dan berzikir","Ingat nombor khemah anda","Minum air dengan kerap"],
},
fr:{bismillah:"Au nom d'Allah",site_name:"Projet Manafea",site_desc:"Dawah du Hajj",n_home:"Accueil",n_vid:"Vidéos",n_quran:"Coran",n_lib:"Bibliothèque",n_hajj:"Hajj",n_umrah:"Omra",n_contest:"Concours",login:"Connexion",hero_title:"Le Hajj: Pilier de l'Islam",hero_desc:"Les musulmans accomplissent le pèlerinage par obéissance à Allah",journey_title:"Le Voyage du Pèlerin",journey_desc:"Guide étape par étape de l'Ihram au Tawaf d'Adieu",start_journey:"Commencer",about_title:"À Propos du Hajj",virtues_title:"Mérites du Hajj",sunnah_title:"Sunnas du Hajj",pillars_title:"Piliers du Hajj",pillars_desc:"Quatre piliers obligatoires",miqaat_title:"Miqat et Types de Rites",miqaat_desc:"Les limites spatiales et les trois types de rites",remember_title:"À Retenir",step:"Étape",of:"sur",dua:"Invocation",prev:"Précédent",next:"Suivant",back_map:"Retour",no_content:"Pas encore de contenu",ft_copy:"Manafea — Droits Réservés",ft_langs:"Langues",
  virtues:["Le Hajj agréé n'a d'autre récompense que le Paradis","Celui qui accomplit le Hajj sans péché revient comme un nouveau-né","Alternez Hajj et Omra car ils éliminent pauvreté et péchés","Le pèlerin est sous la protection d'Allah"],
  sunnahs:["Se laver et se parfumer avant l'Ihram","Réciter la Talbiyah à voix haute pour les hommes","Idtiba et Raml dans les trois premiers tours du Tawaf","Toucher la Pierre Noire si possible","Multiplier les invocations le jour d'Arafah","Passer la nuit à Mina avant Arafah","Marcher rapidement entre les repères verts du Sa'i"],
  pillars:[{t:"Ihram",d:"L'intention d'entrer en état sacré"},{t:"Station à Arafah",d:"Le plus grand pilier du Hajj"},{t:"Tawaf Al-Ifadah",d:"Circumambulation après Arafah"},{t:"Sa'i Safa-Marwah",d:"Sept tours entre Safa et Marwah"}],
  miqaat_types:[{t:"Hajj Tamattu",d:"Omra puis Hajj séparément"},{t:"Hajj Qiran",d:"Omra et Hajj combinés"},{t:"Hajj Ifrad",d:"Hajj seul"}],
  miqaat_places:["Dhul-Hulayfah — Miqat de Médine","Al-Juhfah — Miqat du Levant","Qarn Al-Manazil — Miqat du Najd","Yalamlam — Miqat du Yémen","Dhat Irq — Miqat de l'Irak"],
  remember:["Apprenez les règles du Hajj avant le voyage","Vérifiez vos documents et vaccinations","Emportez médicaments et vêtements confortables","Restez calme dans la foule","Multipliez les invocations","Mémorisez votre numéro de camp","Hydratez-vous régulièrement"],
},
fa:{bismillah:"به نام خداوند",site_name:"پروژه منافع",site_desc:"دعوت حاجیان",n_home:"خانه",n_vid:"ویدیوها",n_quran:"قرآن",n_lib:"کتابخانه",n_hajj:"حج",n_umrah:"عمره",n_contest:"مسابقه",login:"ورود",hero_title:"حج: رکن اسلام",hero_desc:"مسلمانان به فرمان خداوند به زیارت خانه خدا می‌روند",journey_title:"سفر حاجی",journey_desc:"راهنمای گام به گام از احرام تا طواف وداع",start_journey:"شروع سفر",about_title:"درباره حج",virtues_title:"فضائل حج",sunnah_title:"سنت‌های حج",pillars_title:"ارکان حج",pillars_desc:"چهار رکن که حج بدون آنها صحیح نیست",miqaat_title:"میقات و انواع نسک",miqaat_desc:"میقات‌ها و سه نوع نسک",remember_title:"نکات مهم",step:"مرحله",of:"از",dua:"دعا",prev:"قبلی",next:"بعدی",back_map:"بازگشت",no_content:"محتوایی نیست",ft_copy:"منافع — حقوق محفوظ",ft_langs:"زبان‌ها",
  virtues:["حج مقبول جزایی جز بهشت ندارد","کسی که حج کند و گناه نکند مانند روزی که متولد شده برمی‌گردد","حج و عمره را پشت سر هم انجام دهید زیرا فقر و گناه را می‌زدایند","حاجی در ضمانت خداوند است"],
  sunnahs:["غسل و عطر زدن قبل از احرام","بلند خواندن تلبیه برای مردان","اضطباع و رمل در سه دور اول طواف","بوسیدن حجرالاسود","دعای فراوان در روز عرفه","شب ماندن در منا قبل از عرفه","تند رفتن بین نشانه‌های سبز در سعی"],
  pillars:[{t:"احرام",d:"نیت ورود به نسک"},{t:"وقوف عرفه",d:"بزرگترین رکن حج"},{t:"طواف افاضه",d:"طواف پس از عرفه"},{t:"سعی صفا و مروه",d:"هفت دور بین صفا و مروه"}],
  miqaat_types:[{t:"حج تمتع",d:"ابتدا عمره سپس حج"},{t:"حج قران",d:"عمره و حج با هم"},{t:"حج افراد",d:"فقط حج"}],
  miqaat_places:["ذوالحلیفه — میقات مدینه","جحفه — میقات شام","قرن المنازل — میقات نجد","یلملم — میقات یمن","ذات عرق — میقات عراق"],
  remember:["قبل از سفر احکام حج را بیاموزید","مدارک و واکسن‌ها را بررسی کنید","دارو و لباس راحت ببرید","در شلوغی آرام باشید","در تمام مناسک دعا کنید","شماره چادر خود را حفظ کنید","مرتب آب بنوشید"],
},
bn:{bismillah:"আল্লাহর নামে",site_name:"মানাফেয়া",site_desc:"হজ্জ দাওয়াহ",n_home:"হোম",n_vid:"ভিডিও",n_quran:"কুরআন",n_lib:"লাইব্রেরি",n_hajj:"হজ্জ",n_umrah:"উমরাহ",n_contest:"প্রতিযোগিতা",login:"লগইন",hero_title:"হজ্জ: ইসলামের স্তম্ভ",hero_desc:"মুসলিমরা আল্লাহর আদেশ পালনে হজ্জ পালন করেন",journey_title:"হাজীর যাত্রা",journey_desc:"ইহরাম থেকে বিদায় তাওয়াফ পর্যন্ত গাইড",start_journey:"যাত্রা শুরু",about_title:"হজ্জ সম্পর্কে",virtues_title:"হজ্জের ফযীলত",sunnah_title:"হজ্জের সুন্নাহ",pillars_title:"হজ্জের রুকন",pillars_desc:"চারটি রুকন যা ছাড়া হজ্জ সহীহ নয়",miqaat_title:"মীকাত ও নুসুকের প্রকার",miqaat_desc:"স্থানিক মীকাত ও তিন ধরনের নুসুক",remember_title:"মনে রাখার বিষয়",step:"ধাপ",of:"এর মধ্যে",dua:"দোয়া",prev:"আগের",next:"পরের",back_map:"ফিরুন",no_content:"এই ভাষায় বিষয়বস্তু নেই",ft_copy:"মানাফেয়া — সংরক্ষিত",ft_langs:"ভাষা",
  virtues:["মাবরুর হজ্জের প্রতিদান জান্নাত","যে হজ্জ করে গুনাহ না করে সে নবজাতকের মতো ফিরে আসে","হজ্জ ও উমরাহ পরপর করো কারণ এগুলো দারিদ্র্য ও গুনাহ দূর করে","হাজী আল্লাহর জিম্মায়"],
  sunnahs:["ইহরামের আগে গোসল ও সুগন্ধি","পুরুষদের উচ্চস্বরে তালবিয়া","তাওয়াফে ইদতিবা ও রমল","হাজারে আসওয়াদে চুম্বন","আরাফার দিনে অধিক দোয়া","আরাফার আগে মিনায় রাত্রি যাপন","সাঈতে সবুজ চিহ্নের মধ্যে দ্রুত হাঁটা"],
  pillars:[{t:"ইহরাম",d:"নুসুকে প্রবেশের নিয়্যত"},{t:"আরাফায় অবস্থান",d:"হজ্জের সবচেয়ে বড় রুকন"},{t:"তাওয়াফ আল-ইফাদা",d:"আরাফার পর কা'বা তাওয়াফ"},{t:"সাফা-মারওয়া সাঈ",d:"সাত পাক"}],
  miqaat_types:[{t:"তামাত্তু হজ্জ",d:"প্রথমে উমরাহ তারপর হজ্জ"},{t:"কিরান হজ্জ",d:"উমরাহ ও হজ্জ একসাথে"},{t:"ইফরাদ হজ্জ",d:"শুধু হজ্জ"}],
  miqaat_places:["যুলহুলাইফা — মদীনাবাসীর মীকাত","জুহফা — সিরিয়াবাসীর মীকাত","কারনুল মানাযিল — নজদবাসীর মীকাত","ইয়ালামলাম — ইয়ামানবাসীর মীকাত","যাতু ইরক — ইরাকবাসীর মীকাত"],
  remember:["সফরের আগে হজ্জের বিধান শিখুন","নথিপত্র ও টিকা যাচাই করুন","পর্যাপ্ত ওষুধ ও আরামদায়ক পোশাক নিন","ভিড়ে শান্ত থাকুন","সব মানাসিকে বেশি বেশি দোয়া করুন","ক্যাম্প নম্বর মুখস্থ রাখুন","নিয়মিত পানি পান করুন"],
},
hi:{bismillah:"अल्लाह के नाम से",site_name:"मनाफ़ेआ",site_desc:"हज दावत",n_home:"होम",n_vid:"वीडियो",n_quran:"कुरान",n_lib:"पुस्तकालय",n_hajj:"हज",n_umrah:"उमरा",n_contest:"प्रतियोगिता",login:"लॉगिन",hero_title:"हज: इस्लाम का स्तंभ",hero_desc:"मुसलमान अल्लाह की आज्ञा पालन में हज करते हैं",journey_title:"हाजी की यात्रा",journey_desc:"इहराम से विदाई तवाफ तक गाइड",start_journey:"यात्रा शुरू",about_title:"हज के बारे में",virtues_title:"हज की फ़ज़ीलत",sunnah_title:"हज की सुन्नतें",pillars_title:"हज के अरकान",pillars_desc:"चार रुकन जिनके बिना हज सही नहीं",miqaat_title:"मीक़ात और नुसुक",miqaat_desc:"स्थानिक मीक़ात और तीन प्रकार के नुसुक",remember_title:"याद रखने की बातें",step:"चरण",of:"में से",dua:"दुआ",prev:"पिछला",next:"अगला",back_map:"वापस",no_content:"इस भाषा में सामग्री नहीं",ft_copy:"मनाफ़ेआ — अधिकार सुरक्षित",ft_langs:"भाषाएं",
  virtues:["मबरूर हज का बदला जन्नत है","जो हज करे और गुनाह न करे वो ऐसे लौटता है जैसे माँ ने जन्म दिया","हज और उमरा बार-बार करो क्योंकि ये ग़रीबी और गुनाह दूर करते हैं","हाजी अल्लाह की ज़िम्मेदारी में है"],
  sunnahs:["इहराम से पहले ग़ुस्ल और ख़ुशबू","मर्दों का ऊँची आवाज़ से तल्बिया","तवाफ में इज़्तिबाअ और रमल","हजर-ए-असवद को चूमना","अरफ़ा के दिन ज़्यादा दुआ","अरफ़ा से पहले मिना में रात","सई में हरी निशानियों के बीच तेज़ चलना"],
  pillars:[{t:"इहराम",d:"नुसुक में दाख़िल होने की नीयत"},{t:"अरफ़ा में वुक़ूफ़",d:"हज का सबसे बड़ा रुकन"},{t:"तवाफ़ अल-इफ़ाज़ा",d:"अरफ़ा के बाद काबा का तवाफ़"},{t:"सफ़ा-मरवा सई",d:"सात चक्कर"}],
  miqaat_types:[{t:"हज तमत्तु",d:"पहले उमरा फिर हज"},{t:"हज क़िरान",d:"उमरा और हज साथ"},{t:"हज इफ़राद",d:"सिर्फ़ हज"}],
  miqaat_places:["ज़ुलहुलैफ़ा — मदीना वालों का मीक़ात","जुहफ़ा — शाम वालों का मीक़ात","क़रनुल मनाज़िल — नज्द वालों का मीक़ात","यलमलम — यमन वालों का मीक़ात","ज़ात इर्क़ — इराक़ वालों का मीक़ात"],
  remember:["सफ़र से पहले हज के अहकाम सीखें","दस्तावेज़ और वैक्सीन चेक करें","पर्याप्त दवाई और आरामदायक कपड़े रखें","भीड़ में शांत रहें","सभी मनासिक में ज़्यादा दुआ करें","कैंप नंबर याद रखें","लगातार पानी पिएं"],
},
};

// ─── 13 Journey Stations (ar/en — others: admin adds) ───
const ST={
ar:[{id:1,t:"مطار بلد الحاج",s:"✈️",day:"قبل ٨ ذو الحجة",tp:"سنة",d:"يبدأ الحاج رحلته من بلده متوجهاً إلى مكة المكرمة. يُستحب تعلم أحكام الحج وتحديد نوع نسكه والتأكد من وثائقه وتوديع أهله.",du:"اللهم إني أسألك في سفري هذا البر والتقوى"},{id:2,t:"الوصول والإحرام",s:"🕋",day:"الميقات",tp:"ركن",d:"عند الميقات يغتسل ويتطيب ويلبس الإحرام وينوي النسك ويلبي. التلبية: لبيك اللهم حجاً (للمفرد) أو لبيك عمرة وحجاً (للقارن) أو لبيك عمرة (للمتمتع).",du:"لبيك اللهم لبيك، لبيك لا شريك لك لبيك، إن الحمد والنعمة لك والملك، لا شريك لك"},{id:3,t:"منى — يوم التروية",s:"⛺",day:"٨ ذو الحجة",tp:"سنة",d:"يتوجه إلى منى قبل الظهر. يصلي الصلوات مقصورة بلا جمع. يبيت بمنى ويكثر من الذكر والتلبية.",du:"اللهم إني أسألك العفو والعافية"},{id:4,t:"عرفات — يوم الحج الأكبر",s:"🏔️",day:"٩ ذو الحجة",tp:"ركن",d:"أعظم أركان الحج. يقف بعرفة من بعد الزوال حتى الغروب. يصلي الظهر والعصر جمعاً وقصراً. يكثر من الدعاء والبكاء والاستغفار. من فاته عرفة فاته الحج.",du:"لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير"},{id:5,t:"مزدلفة",s:"🌙",day:"ليلة ١٠",tp:"واجب",d:"يصلي المغرب والعشاء جمعاً وقصراً. يبيت بها ويجمع حصى الجمرات. يصلي الفجر في أول وقتها ثم يتوجه لمنى.",du:"اللهم إنك قلت ادعوني أستجب لكم"},{id:6,t:"رمي جمرة العقبة",s:"🎯",day:"١٠ ذو الحجة",tp:"واجب",d:"يرمي جمرة العقبة الكبرى فقط بسبع حصيات. يكبّر مع كل حصاة. يقطع التلبية.",du:"بسم الله، الله أكبر"},{id:7,t:"الأضحية",s:"🐑",day:"١٠ ذو الحجة",tp:"واجب",d:"يذبح الهدي (واجب على المتمتع والقارن). يأكل ويتصدق.",du:"بسم الله والله أكبر، اللهم تقبل مني"},{id:8,t:"الحلق أو التقصير",s:"✂️",day:"١٠ ذو الحجة",tp:"واجب",d:"يحلق أو يقصر (الحلق أفضل). المرأة تقصر قدر أنملة. يتحلل التحلل الأول.",du:"الحمد لله الذي قضى عنا نسكنا"},{id:9,t:"طواف الإفاضة والسعي",s:"🔄",day:"١٠ ذو الحجة",tp:"ركن",d:"يطوف بالكعبة سبعاً ويصلي ركعتين. يسعى سبعاً إن كان متمتعاً. يتحلل التحلل الثاني.",du:"ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة"},{id:10,t:"المبيت بمنى",s:"🏕️",day:"ليالي التشريق",tp:"واجب",d:"يبيت بمنى ليالي ١١ و١٢ (و١٣ لمن لم يتعجل).",du:"اللهم اجعلنا من عبادك المقبولين"},{id:11,t:"رمي الجمرات — ١١",s:"📅",day:"١١ ذو الحجة",tp:"واجب",d:"يرمي الثلاث بعد الزوال: الصغرى (٧) ويدعو، الوسطى (٧) ويدعو، الكبرى (٧) بلا دعاء.",du:"اللهم اجعله حجاً مبروراً"},{id:12,t:"رمي الجمرات — ١٢",s:"📅",day:"١٢ ذو الحجة",tp:"واجب",d:"يرمي الثلاث بنفس الطريقة. يجوز التعجل بعد الرمي قبل الغروب.",du:"ربنا تقبل منا إنك أنت السميع العليم"},{id:13,t:"طواف الوداع",s:"👋",day:"آخر يوم",tp:"واجب",d:"يطوف سبعاً كآخر عهده بالبيت. واجب على غير أهل مكة. يُسقط عن الحائض.",du:"اللهم لا تجعل هذا آخر عهدي ببيتك"}],
en:[{id:1,t:"Pilgrim's Home Country",s:"✈️",day:"Before 8th",tp:"Sunnah",d:"The journey begins from home. Learn Hajj rulings, choose your type of Hajj, verify documents, and bid farewell to family.",du:"O Allah, I ask You for righteousness in this journey"},{id:2,t:"Arrival & Ihram",s:"🕋",day:"At Miqat",tp:"Pillar",d:"At the Miqat, bathe, apply fragrance, wear Ihram, and declare your intention. Recite the Talbiyah frequently.",du:"Labbayk Allahumma labbayk, labbayk la shareeka laka labbayk"},{id:3,t:"Mina — Day of Tarwiyah",s:"⛺",day:"8th Dhul-Hijjah",tp:"Sunnah",d:"Proceed to Mina before Dhuhr. Pray all prayers shortened but not combined. Spend the night increasing in dhikr.",du:"O Allah, I ask You for pardon and well-being"},{id:4,t:"Arafah — The Greatest Day",s:"🏔️",day:"9th Dhul-Hijjah",tp:"Pillar",d:"The greatest pillar. Stand at Arafah from after noon until sunset. Pray Dhuhr and Asr combined and shortened. Supplicate abundantly. Missing Arafah means missing Hajj.",du:"La ilaha illAllahu wahdahu la shareeka lah, lahul-mulku wa lahul-hamd"},{id:5,t:"Muzdalifah",s:"🌙",day:"Night of 10th",tp:"Obligatory",d:"Pray Maghrib and Isha combined and shortened. Spend the night. Collect pebbles. Pray Fajr early then proceed to Mina.",du:"O Allah, You said call upon Me and I will respond"},{id:6,t:"Stoning Jamrat Al-Aqabah",s:"🎯",day:"10th Dhul-Hijjah",tp:"Obligatory",d:"Stone only the largest pillar with 7 pebbles saying Allahu Akbar. Stop the Talbiyah.",du:"Bismillah, Allahu Akbar"},{id:7,t:"Animal Sacrifice",s:"🐑",day:"10th Dhul-Hijjah",tp:"Obligatory",d:"Slaughter the sacrifice (obligatory for Tamattu and Qiran). Eat and give charity.",du:"Bismillah, Allahu Akbar, O Allah accept from me"},{id:8,t:"Shaving or Trimming",s:"✂️",day:"10th Dhul-Hijjah",tp:"Obligatory",d:"Shave the head or trim (shaving preferred). Women trim a fingertip's length. First Tahallul achieved.",du:"Praise to Allah who fulfilled our rite"},{id:9,t:"Tawaf Al-Ifadah & Sa'i",s:"🔄",day:"10th Dhul-Hijjah",tp:"Pillar",d:"Perform Tawaf 7 circuits and pray 2 rak'ahs. Perform Sa'i 7 times if Tamattu. Second Tahallul achieved.",du:"Our Lord, give us good in this world and the Hereafter"},{id:10,t:"Overnight at Mina",s:"🏕️",day:"Tashreeq Nights",tp:"Obligatory",d:"Spend nights of 11th, 12th (and 13th if not hastening) at Mina.",du:"O Allah, make us among Your accepted servants"},{id:11,t:"Stoning — Day 11",s:"📅",day:"11th Dhul-Hijjah",tp:"Obligatory",d:"Stone all 3 pillars after zenith: small (7) + dua, middle (7) + dua, large (7) no dua after.",du:"O Allah, make it an accepted Hajj"},{id:12,t:"Stoning — Day 12",s:"📅",day:"12th Dhul-Hijjah",tp:"Obligatory",d:"Stone all 3 the same way. May hasten and leave before sunset.",du:"Our Lord, accept from us"},{id:13,t:"Farewell Tawaf",s:"👋",day:"Last Day",tp:"Obligatory",d:"Perform 7 circuits as the last act. Obligatory for non-Makkah residents. Waived for menstruating women.",du:"O Allah, do not make this my last visit to Your House"}],
};

const IP=()=><svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="igh" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M40 0L80 40L40 80L0 40Z" fill="none" stroke="currentColor" strokeWidth="0.5"/><circle cx="40" cy="40" r="15" fill="none" stroke="currentColor" strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#igh)"/></svg>;

// ─── Section Component ───
const Section=({title,children,id})=><section id={id} className="py-14 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6"><div className="flex items-center justify-center gap-4 mb-10"><div className="h-px flex-1 max-w-24" style={{background:'var(--gold)'}}></div><h2 className="text-2xl sm:text-3xl font-black text-center quran-font" style={{color:'var(--primary)'}}>{title}</h2><div className="h-px flex-1 max-w-24" style={{background:'var(--gold)'}}></div></div>{children}</section>;

// ─── Circle Map ───
const CircleMap=({stations,onSelect,t})=>{
  const n=stations.length;const R=38;
  return(
    <div className="relative mx-auto" style={{width:'min(520px,90vw)',height:'min(520px,90vw)'}}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(200,169,81,0.25)" strokeWidth="0.5" strokeDasharray="2 1"/>
        {stations.map((s,i)=>{const a=(i/n)*2*Math.PI-Math.PI/2;const cx=50+R*Math.cos(a);const cy=50+R*Math.sin(a);const lx=50+(R+8)*Math.cos(a);const ly=50+(R+8)*Math.sin(a);const isR=lx>50;
          return <g key={i} style={{cursor:'pointer'}} onClick={()=>onSelect(i)}>
            <circle cx={cx} cy={cy} r="3.5" fill="#E5E7EB" stroke="white" strokeWidth="0.8"/>
            <text x={cx} y={cy+0.5} textAnchor="middle" dominantBaseline="middle" fontSize="2.2" fill="#1B3A4B">{s.s}</text>
            <text x={lx} y={ly} textAnchor={isR?"start":"end"} dominantBaseline="middle" fontSize="1.6" fill="#6B7280" fontWeight="600" fontFamily="Tajawal">{s.t.length>14?s.t.slice(0,14)+'…':s.t}</text>
          </g>;
        })}
      </svg>
      <div className="absolute rounded-full flex flex-col items-center justify-center" style={{top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'38%',height:'38%',background:'var(--primary)',boxShadow:'0 0 40px rgba(27,58,75,0.3)'}}>
        <h3 className="text-sm sm:text-lg font-black text-white text-center quran-font px-2">{t("journey_title")}</h3>
        <button onClick={()=>onSelect(0)} className="mt-2 px-3 sm:px-5 py-1.5 rounded-lg text-xs font-bold text-white transition-all hover:scale-105" style={{background:'var(--gold)',fontSize:'10px'}}>{t("start_journey")}</button>
      </div>
    </div>
  );
};

// ─── Step Detail ───
const StepView=({stations,cur,setCur,t,dir,onBack})=>{
  const s=stations[cur];const total=stations.length;const prog=((cur+1)/total)*100;
  const go=(i)=>{setCur(i);window.scrollTo({top:0,behavior:'smooth'})};
  return(<div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
    <button onClick={onBack} className="flex items-center gap-2 mb-6 text-sm font-medium px-4 py-2 rounded-xl hover:bg-gray-100 transition-all" style={{color:'var(--primary)'}}><span>{dir==="rtl"?"→":"←"}</span>{t("back_map")}</button>
    <div className="mb-6"><div className="flex justify-between text-xs mb-1.5" style={{color:'#6B7280'}}><span>{t("step")} {cur+1} {t("of")} {total}</span><span>{Math.round(prog)}%</span></div><div className="w-full h-2 rounded-full bg-gray-100"><div className="h-full rounded-full transition-all duration-500" style={{width:`${prog}%`,background:'linear-gradient(90deg,#9E832E,#C8A951)'}}></div></div></div>
    <div className="flex gap-1.5 overflow-x-auto pb-3 mb-6" style={{scrollbarWidth:'none'}}>{stations.map((_,i)=><button key={i} onClick={()=>go(i)} className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all" style={{background:i===cur?'#C8A951':i<cur?'#1B3A4B':'#E5E7EB',color:i<=cur?'white':'#6B7280',transform:i===cur?'scale(1.2)':'scale(1)'}}>{i+1}</button>)}</div>
    <div key={cur} style={{animation:'fu .5s ease-out'}}>
      <div className="rounded-3xl overflow-hidden shadow-xl mb-6" style={{border:'1px solid rgba(200,169,81,0.2)'}}>
        <div className="p-8 sm:p-12 text-center relative" style={{background:'linear-gradient(135deg,#0F2530,#1B3A4B)'}}><IP/><div className="relative z-10">
          <span className="text-5xl block mb-3">{s.s}</span>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3" style={{background:'rgba(200,169,81,0.15)',border:'1px solid rgba(200,169,81,0.3)'}}><span className="text-xs font-bold" style={{color:'#C8A951'}}>{t("step")} {cur+1}</span><span className="text-white/20">|</span><span className="text-xs" style={{color:'#E8D48B'}}>{s.day}</span><span className="text-white/20">|</span><span className="text-xs px-2 py-0.5 rounded-full" style={{background:s.tp==="ركن"||s.tp==="Pillar"?'rgba(239,68,68,0.2)':'rgba(200,169,81,0.2)',color:s.tp==="ركن"||s.tp==="Pillar"?'#fca5a5':'#E8D48B'}}>{s.tp}</span></div>
          <h2 className="text-2xl sm:text-4xl font-black text-white quran-font">{s.t}</h2>
        </div></div>
      </div>
      <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-10 mb-6" style={{border:'1px solid rgba(200,169,81,0.1)'}}><p className="text-base sm:text-lg leading-[2] quran-font" style={{color:'#1a1a2e'}}>{s.d}</p></div>
      {s.du&&<div className="rounded-3xl p-6 sm:p-8 mb-8" style={{background:'rgba(200,169,81,0.06)',border:'1px solid rgba(200,169,81,0.2)'}}><div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:'rgba(200,169,81,0.15)'}}><span>🤲</span></div><h3 className="text-sm font-bold" style={{color:'#9E832E'}}>{t("dua")}</h3></div><p className="text-lg sm:text-xl leading-[2] quran-font text-center" style={{color:'#1B3A4B',direction:'rtl'}}>{s.du}</p></div>}
      <div className="flex gap-3"><button disabled={cur===0} onClick={()=>go(cur-1)} className="flex-1 py-4 rounded-xl font-bold text-sm" style={{background:cur===0?'#E5E7EB':'#1B3A4B',color:cur===0?'#9CA3AF':'white',opacity:cur===0?.5:1}}>{dir==="rtl"?"→":"←"} {t("prev")}</button><button disabled={cur===total-1} onClick={()=>go(cur+1)} className="flex-1 py-4 rounded-xl font-bold text-sm text-white" style={{background:'linear-gradient(135deg,#9E832E,#C8A951)'}}>{cur===total-1?"✓":t("next")} {cur<total-1?(dir==="rtl"?"←":"→"):""}</button></div>
      <div className="flex justify-center gap-2 mt-6">{stations.map((_,i)=><button key={i} onClick={()=>go(i)} className="h-2 rounded-full transition-all" style={{width:i===cur?'24px':'8px',background:i===cur?'#C8A951':i<cur?'#1B3A4B':'#D1D5DB'}}/>)}</div>
    </div>
  </div>);
};

// ═══════════════════════════════════════
export default function ManafaaHajjPage(){
  const {lang,setLang}=useLang();const[showLM,setShowLM]=useState(false);const[scrolled,setScrolled]=useState(false);const[mob,setMob]=useState(false);const[activeStep,setActiveStep]=useState(null);
  const lo=L.find(l=>l.c===lang)||L[0];const dir=lo.d;const ui=T[lang]||T.ar;const t=k=>ui[k]||T.ar[k]||k;
  const stations=ST[lang]||null;const has=stations&&stations.length>0;

  useEffect(()=>{const h=()=>setScrolled(window.scrollY>50);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h)},[]);
  useEffect(()=>{setActiveStep(null)},[lang]);
  const nav=[{k:"n_home",href:"/"},{k:"n_vid",href:"/videos"},{k:"n_quran",href:"/quran"},{k:"n_lib",href:"/library"},{k:"n_hajj",href:"/hajj"},{k:"n_umrah",href:"/umrah"},{k:"n_contest",href:"/contest"}];

  return(<div dir={dir} className="min-h-screen bg-[#FAFBFC]" style={{fontFamily:"'Tajawal','Segoe UI',sans-serif"}}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&family=Amiri:wght@400;700&display=swap');*{box-sizing:border-box;margin:0;padding:0}:root{--primary:#1B3A4B;--primary-dark:#0F2530;--gold:#C8A951;--gold-dark:#9E832E;--text:#1a1a2e}@keyframes fu{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}@keyframes sd{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}@keyframes sh{0%{background-position:-200% 0}100%{background-position:200% 0}}.afu{animation:fu .8s ease-out forwards}.gn{background:rgba(27,58,75,.95);backdrop-filter:blur(20px)}.hg{background:linear-gradient(135deg,#0F2530 0%,#1B3A4B 30%,#2C5F7C 70%,#1B3A4B 100%)}.gs{background:linear-gradient(90deg,#9E832E,#C8A951,#E8D48B,#C8A951,#9E832E);background-size:200% 100%;animation:sh 4s linear infinite;-webkit-background-clip:text;-webkit-text-fill-color:transparent}.ni{position:relative;transition:all .3s}.ni::after{content:'';position:absolute;bottom:-4px;${dir==="rtl"?"right":"left"}:0;width:0;height:2px;background:#C8A951;transition:width .3s}.ni:hover::after{width:100%}.quran-font{font-family:'Amiri',serif}.ch{transition:all .4s cubic-bezier(.4,0,.2,1)}.ch:hover{transform:translateY(-6px);box-shadow:0 20px 40px -12px rgba(27,58,75,.12)}`}</style>

    <Navbar />

    {activeStep!==null && has ? (
      <StepView stations={stations} cur={activeStep} setCur={setActiveStep} t={t} dir={dir} onBack={()=>{setActiveStep(null);window.scrollTo({top:0,behavior:'smooth'})}}/>
    ) : (
    <>
      {/* Hero */}
      <section className="hg relative overflow-hidden py-16 sm:py-24"><IP/><div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center afu">
        <span className="text-5xl sm:text-6xl block mb-4">🕋</span>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black gs mb-4 quran-font">{t("hero_title")}</h1>
        <p className="text-sm sm:text-base text-white/60 max-w-2xl mx-auto mb-8">{t("hero_desc")}</p>
      </div></section>

      {/* ═══ Virtues ═══ */}
      <Section title={t("virtues_title")} id="virtues">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">{(ui.virtues||[]).map((v,i)=>(
          <div key={i} className="ch bg-white rounded-2xl shadow-md p-6 flex gap-4" style={{border:'1px solid rgba(200,169,81,0.1)'}}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{background:'rgba(200,169,81,0.1)'}}><span style={{color:'#9E832E',fontWeight:'bold'}}>✓</span></div>
            <p className="text-sm leading-relaxed" style={{color:'#1a1a2e'}}>{v}</p>
          </div>
        ))}</div>
      </Section>

      <div className="max-w-xs mx-auto" style={{height:'1px',background:'linear-gradient(90deg,transparent,#C8A951,transparent)'}}></div>

      {/* ═══ Sunnahs ═══ */}
      <Section title={t("sunnah_title")} id="sunnahs">
        <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-10" style={{border:'1px solid rgba(200,169,81,0.1)'}}>
          <div className="space-y-4">{(ui.sunnahs||[]).map((s,i)=>(
            <div key={i} className="flex items-start gap-3"><div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{background:'#1B3A4B'}}><span className="text-white text-xs font-bold">{i+1}</span></div><p className="text-sm leading-relaxed" style={{color:'#1a1a2e'}}>{s}</p></div>
          ))}</div>
        </div>
      </Section>

      <div className="max-w-xs mx-auto" style={{height:'1px',background:'linear-gradient(90deg,transparent,#C8A951,transparent)'}}></div>

      {/* ═══ Pillars ═══ */}
      <Section title={t("pillars_title")} id="pillars">
        <p className="text-center text-sm mb-8" style={{color:'#6B7280'}}>{t("pillars_desc")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">{(ui.pillars||[]).map((p,i)=>(
          <div key={i} className="ch bg-white rounded-2xl shadow-md overflow-hidden" style={{border:'1px solid rgba(200,169,81,0.1)'}}>
            <div className="p-4 text-center" style={{background:'linear-gradient(135deg,#0F2530,#1B3A4B)'}}><span className="text-white font-black text-lg quran-font">{p.t}</span></div>
            <div className="p-5"><p className="text-sm leading-relaxed" style={{color:'#1a1a2e'}}>{p.d}</p></div>
          </div>
        ))}</div>
      </Section>

      <div className="max-w-xs mx-auto" style={{height:'1px',background:'linear-gradient(90deg,transparent,#C8A951,transparent)'}}></div>

      {/* ═══ Journey Map ═══ */}
      {has && <Section title={t("journey_title")} id="journey">
        <p className="text-center text-sm mb-8" style={{color:'#6B7280'}}>{t("journey_desc")}</p>
        <CircleMap stations={stations} onSelect={(i)=>{setActiveStep(i);window.scrollTo({top:0,behavior:'smooth'})}} t={t}/>
        {/* Quick grid below */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3 mt-12">{stations.map((s,i)=>(
          <button key={i} onClick={()=>{setActiveStep(i);window.scrollTo({top:0,behavior:'smooth'})}} className="ch bg-white rounded-xl shadow-sm p-3 text-center" style={{border:'1px solid rgba(200,169,81,0.08)'}}>
            <span className="text-2xl block mb-1">{s.s}</span>
            <p className="text-xs font-bold truncate" style={{color:'#1B3A4B'}}>{s.t.length>12?s.t.slice(0,12)+'…':s.t}</p>
            <p className="text-xs mt-0.5" style={{color:'#6B7280'}}>{s.day}</p>
          </button>
        ))}</div>
      </Section>}

      <div className="max-w-xs mx-auto" style={{height:'1px',background:'linear-gradient(90deg,transparent,#C8A951,transparent)'}}></div>

      {/* ═══ Miqaat ═══ */}
      <Section title={t("miqaat_title")} id="miqaat">
        <p className="text-center text-sm mb-8" style={{color:'#6B7280'}}>{t("miqaat_desc")}</p>
        <h3 className="font-bold text-lg mb-4 quran-font" style={{color:'#1B3A4B'}}>{lang==="ar"?"أنواع النسك":"Types of Hajj Rituals"}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">{(ui.miqaat_types||[]).map((m,i)=>(
          <div key={i} className="ch bg-white rounded-2xl shadow-md p-6" style={{border:'1px solid rgba(200,169,81,0.1)'}}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{background:'rgba(200,169,81,0.1)'}}><span className="text-xl">{["🔸","🔹","🔶"][i]}</span></div>
            <h4 className="font-bold text-sm mb-2" style={{color:'#1B3A4B'}}>{m.t}</h4>
            <p className="text-xs leading-relaxed" style={{color:'#6B7280'}}>{m.d}</p>
          </div>
        ))}</div>
        <h3 className="font-bold text-lg mb-4 quran-font" style={{color:'#1B3A4B'}}>{lang==="ar"?"المواقيت المكانية":"Spatial Miqats"}</h3>
        <div className="bg-white rounded-2xl shadow-md p-6" style={{border:'1px solid rgba(200,169,81,0.1)'}}>
          <div className="space-y-3">{(ui.miqaat_places||[]).map((p,i)=>(
            <div key={i} className="flex items-center gap-3"><div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{background:'#1B3A4B'}}><span className="text-white text-xs font-bold">{i+1}</span></div><p className="text-sm" style={{color:'#1a1a2e'}}>{p}</p></div>
          ))}</div>
        </div>
      </Section>

      <div className="max-w-xs mx-auto" style={{height:'1px',background:'linear-gradient(90deg,transparent,#C8A951,transparent)'}}></div>

      {/* ═══ Remember ═══ */}
      <Section title={t("remember_title")} id="remember">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{(ui.remember||[]).map((r,i)=>(
          <div key={i} className="flex items-start gap-3 bg-white rounded-xl shadow-sm p-5" style={{border:'1px solid rgba(200,169,81,0.08)'}}>
            <span className="text-lg">⚠️</span><p className="text-sm leading-relaxed" style={{color:'#1a1a2e'}}>{r}</p>
          </div>
        ))}</div>
      </Section>
    </>)}

    {/* Footer */}
    <footer style={{background:'#0F2530'}}><div className="max-w-7xl mx-auto px-4 sm:px-6 py-16"><div className="grid grid-cols-1 md:grid-cols-2 gap-10"><div><div className="flex items-center gap-3 mb-4"><div className="w-10 h-10 rounded-full flex items-center justify-center" style={{background:'#C8A951',color:'#0F2530'}}><span className="font-bold quran-font">م</span></div><div><h3 className="text-white font-bold">{t("site_name")}</h3><p className="text-xs" style={{color:'#C8A951'}}>{t("site_desc")}</p></div></div></div><div><h4 className="text-white font-bold mb-4">{t("ft_langs")}</h4><div className="flex flex-wrap gap-2">{L.map(l=><button key={l.c} onClick={()=>setLang(l.c)} className="text-xs px-3 py-1.5 rounded-full transition-all" style={{background:lang===l.c?'#C8A951':'rgba(255,255,255,.05)',color:lang===l.c?'#0F2530':'rgba(255,255,255,.6)',fontWeight:lang===l.c?'bold':'normal'}}>{l.n}</button>)}</div></div></div><div className="mt-12 pt-8 text-center" style={{borderTop:'1px solid rgba(255,255,255,.05)'}}><p className="text-white/30 text-sm">© {new Date().getFullYear()} {t("ft_copy")}</p></div></div></footer>

    {(showLM||mob)&&<div className="fixed inset-0 z-40" onClick={()=>{setShowLM(false);setMob(false)}}/>}
  </div>);
}
