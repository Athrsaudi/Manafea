-- ============================================================
-- سياسات RLS للحذف — مشروع منافع
-- ============================================================
-- هذه السياسات تسمح بعمليات DELETE باستخدام مفتاح anon
-- نفّذ هذه الأوامر في Supabase SQL Editor:
-- https://supabase.com/dashboard → SQL Editor → New query
-- ============================================================

-- 1) الفيديوهات وترجماتها
CREATE POLICY "Allow delete on videos" ON videos
  FOR DELETE USING (true);

CREATE POLICY "Allow delete on video_translations" ON video_translations
  FOR DELETE USING (true);

-- 2) الكتب وترجماتها
CREATE POLICY "Allow delete on books" ON books
  FOR DELETE USING (true);

CREATE POLICY "Allow delete on book_translations" ON book_translations
  FOR DELETE USING (true);

-- 3) شرائح الصفحة الرئيسية
CREATE POLICY "Allow delete on hero_slides" ON hero_slides
  FOR DELETE USING (true);

CREATE POLICY "Allow delete on hero_slide_translations" ON hero_slide_translations
  FOR DELETE USING (true);

-- 4) خطوات الحج
CREATE POLICY "Allow delete on hajj_steps" ON hajj_steps
  FOR DELETE USING (true);

CREATE POLICY "Allow delete on hajj_step_translations" ON hajj_step_translations
  FOR DELETE USING (true);

-- 5) خطوات العمرة
CREATE POLICY "Allow delete on umrah_steps" ON umrah_steps
  FOR DELETE USING (true);

CREATE POLICY "Allow delete on umrah_step_translations" ON umrah_step_translations
  FOR DELETE USING (true);

-- 6) أسئلة المسابقة
CREATE POLICY "Allow delete on contest_questions" ON contest_questions
  FOR DELETE USING (true);

CREATE POLICY "Allow delete on contest_question_translations" ON contest_question_translations
  FOR DELETE USING (true);

-- 7) التقييمات
CREATE POLICY "Allow delete on feedback" ON feedback
  FOR DELETE USING (true);

-- 8) جلسات الأدمن (لتسجيل الخروج)
CREATE POLICY "Allow delete on admin_sessions" ON admin_sessions
  FOR DELETE USING (true);

-- ============================================================
-- ملاحظة: هذه السياسات تسمح لأي شخص بالحذف (USING true).
-- إذا أردت تقييد الحذف للأدمن فقط، يمكنك تعديلها لاحقاً
-- لتتحقق من وجود جلسة أدمن صالحة.
-- ============================================================
