# تقرير التحسينات — مشروع منافع

**التاريخ:** 12 أبريل 2026  
**PR:** [#4](https://github.com/Athrsaudi/Manafea/pull/4)  
**الفرع:** `improvements/security-errors-bundle`

---

## 1. 🔒 تحسين أمان RLS

### المشكلة
سياسات DELETE كانت تستخدم `USING (true)` مما يسمح لأي شخص يعرف مفتاح `anon` بحذف أي بيانات من الجداول.

### الحل
- **دالة `is_valid_admin(token)`:** تتحقق من وجود جلسة أدمن صالحة في جدول `admin_sessions` (صالحة لمدة 24 ساعة)
- **دالة `admin_delete_row(token, table, column, value)`:** دالة RPC آمنة تنفذ الحذف بعد التحقق من:
  1. صلاحية جلسة الأدمن
  2. أن الجدول ضمن القائمة البيضاء المسموح بها (14 جدول)
  3. تستخدم `format()` لمنع SQL Injection
- **تحديث `supaDelete`:** يستخدم RPC الآمن أولاً مع fallback للطريقة المباشرة (إذا لم تُنفَّذ الدوال بعد)

### الملفات المعدلة
| الملف | التغيير |
|---|---|
| `supabase-secure-rls.sql` | ملف SQL جديد بالدوال الآمنة |
| `src/lib/supabase.js` | تحديث `supaDelete` لاستخدام RPC |

### خطوة مطلوبة
⚠️ يجب تنفيذ `supabase-secure-rls.sql` في **Supabase SQL Editor** لتفعيل الحذف الآمن.

---

## 2. ⚠️ تحسين معالجة الأخطاء

### المشكلة
عدة استعلامات Supabase تستخدم `.then()` بدون `.catch()`، مما قد يسبب `unhandled promise rejections`.

### الحل

| الملف | التحسين |
|---|---|
| `src/pages/HomePage.jsx` | إضافة `.catch()` لـ 3 استعلامات (فيديوهات، كتب، إحصائيات) + فحص `error` في `.then()` |
| `src/pages/AdminPage.jsx` | تغليف دالة `submit` (Login) بـ `try/catch` مع رسائل خطأ مفصلة لكل مرحلة |
| `src/pages/AdminPage.jsx` | إضافة `.catch()` لعملية `logout` |
| `src/pages/ContestPage.jsx` | استبدال `fetch()` المباشر بـ `supaInsert()` (أنظف وأكثر اتساقاً) |
| `src/lib/supabase.js` | ترقية `console.warn` إلى `console.error` + رسائل أوضح |

---

## 3. 📦 تحسين حجم Bundle

### المشكلة
AdminPage فقط كان مُقسَّماً (lazy loaded)، بينما باقي الصفحات تُحمَّل مع الحزمة الرئيسية.

### الحل
تطبيق `React.lazy()` على **جميع** الصفحات ما عدا `HomePage` (الصفحة الرئيسية يجب أن تُحمَّل فوراً):

```
الحزمة الرئيسية (index): 411 KB (React + Router + مكتبات مشتركة)
├── AdminPage:   415 KB (lazy)
├── HajjPage:     61 KB (lazy)
├── UmrahPage:    52 KB (lazy)
├── ContestPage:  43 KB (lazy)
├── VideosPage:   35 KB (lazy)
├── QuranPage:    33 KB (lazy)
└── LibraryPage:  25 KB (lazy)
```

- إضافة `Suspense` مشترك مع شاشة تحميل أنيقة (رمز 🕋 مع "جارٍ التحميل...")
- **الفائدة:** المستخدم يحمّل فقط كود الصفحة التي يزورها

---

## 4. 🔧 إصلاحات إضافية

| المشكلة | الحل |
|---|---|
| روابط `target="_blank"` بدون `rel="noopener noreferrer"` | إضافة `rel="noopener noreferrer"` (AdminPage: رابط PDF + رابط Umami) |
| `ContestPage` يستخدم `fetch()` مباشر مع API key مكرر | استبدال بـ `supaInsert()` الموجود |
| رسائل الأخطاء عامة وغير مفيدة | تحسين رسائل الخطأ لتكون وصفية (باللغة العربية) |

---

## ملخص الملفات المعدلة

| الملف | نوع التعديل |
|---|---|
| `src/App.jsx` | تقسيم Bundle (lazy loading لجميع الصفحات) |
| `src/lib/supabase.js` | أمان RLS + معالجة أخطاء محسّنة |
| `src/pages/HomePage.jsx` | معالجة أخطاء (.catch) |
| `src/pages/AdminPage.jsx` | معالجة أخطاء + أمان (rel noopener) |
| `src/pages/ContestPage.jsx` | استبدال fetch بـ supaInsert |
| `supabase-secure-rls.sql` | ملف جديد — دوال الحذف الآمن |

---

## التحقق
✅ البناء (build) ناجح بدون أخطاء  
✅ جميع الصفحات مقسمة إلى chunks مستقلة  
✅ معالجة أخطاء شاملة لجميع استعلامات Supabase  
✅ PR مرفوع: [#4](https://github.com/Athrsaudi/Manafea/pull/4)
