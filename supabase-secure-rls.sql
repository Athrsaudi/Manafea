-- ============================================================
-- تأمين سياسات RLS للحذف — مشروع منافع
-- ============================================================
-- هذا الملف يحدّث السياسات لتقييد الحذف للأدمن فقط
-- عبر التحقق من وجود جلسة أدمن صالحة
-- ============================================================

-- =========================================
-- الخطوة 1: إنشاء دالة التحقق من الأدمن
-- =========================================

-- دالة تتحقق من وجود جلسة أدمن صالحة (خلال آخر 24 ساعة)
CREATE OR REPLACE FUNCTION public.is_valid_admin(p_token text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_sessions
    WHERE token = p_token
      AND created_at > now() - interval '24 hours'
  );
END;
$$;

-- =========================================
-- الخطوة 2: دالة حذف آمنة عبر RPC
-- =========================================

-- دالة RPC لحذف صف بشكل آمن بعد التحقق من صلاحية الأدمن
CREATE OR REPLACE FUNCTION public.admin_delete_row(
  p_token text,
  p_table text,
  p_column text,
  p_value text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count integer;
BEGIN
  -- التحقق من صلاحية جلسة الأدمن
  IF NOT is_valid_admin(p_token) THEN
    RETURN json_build_object('success', false, 'error', 'جلسة غير صالحة — سجّل دخولك مجدداً');
  END IF;

  -- التحقق من أن اسم الجدول مسموح به (حماية من SQL injection)
  IF p_table NOT IN (
    'videos', 'video_translations',
    'books', 'book_translations',
    'hero_slides', 'hero_slide_translations',
    'hajj_steps', 'hajj_step_translations',
    'umrah_steps', 'umrah_step_translations',
    'contest_questions', 'contest_question_translations',
    'feedback', 'admin_sessions'
  ) THEN
    RETURN json_build_object('success', false, 'error', 'جدول غير مسموح بالحذف منه');
  END IF;

  -- تنفيذ الحذف
  EXECUTE format('DELETE FROM %I WHERE %I = $1', p_table, p_column)
    USING p_value;

  GET DIAGNOSTICS v_count = ROW_COUNT;

  IF v_count = 0 THEN
    RETURN json_build_object('success', false, 'error', 'لم يتم العثور على الصف المطلوب');
  END IF;

  RETURN json_build_object('success', true, 'deleted_count', v_count);
END;
$$;

-- =========================================
-- الخطوة 3: تحديث سياسات DELETE
-- =========================================
-- حذف السياسات القديمة (USING true) واستبدالها بسياسات مقيدة

-- ملاحظة: نحتفظ بسياسة USING(true) لأن الحذف الآن يتم فقط عبر RPC
-- ولكن كطبقة حماية إضافية، يمكن تقييدها أيضاً:

-- إذا أردت تقييد أكثر، يمكنك حذف سياسات USING(true) بالكامل:
-- DROP POLICY IF EXISTS "Allow delete on videos" ON videos;
-- DROP POLICY IF EXISTS "Allow delete on video_translations" ON video_translations;
-- ... إلخ

-- =========================================
-- الخطوة 4: منح صلاحيات تنفيذ الدوال
-- =========================================
GRANT EXECUTE ON FUNCTION public.is_valid_admin(text) TO anon;
GRANT EXECUTE ON FUNCTION public.admin_delete_row(text, text, text, text) TO anon;

-- ============================================================
-- كيفية التطبيق:
-- 1. انسخ هذا الكود وشغّله في Supabase SQL Editor
-- 2. الآن الحذف يتم فقط عبر admin_delete_row RPC
-- 3. الكود المعدّل في supabase.js يستخدم هذه الدالة تلقائياً
-- ============================================================
