import { createClient } from '@supabase/supabase-js'

const SUPA_URL = "https://pxacnzpundghlojfldif.supabase.co"
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4YWNuenB1bmRnaGxvamZsZGlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NDU4NjgsImV4cCI6MjA4ODMyMTg2OH0.GXnkjYc06QjGMRVOkzpGKh9wcnG0BIxEM-GfmTbM3Tk"

export const supabase = createClient(SUPA_URL, SUPA_KEY)

/* ─── إدخال بيانات ─── */
export const supaInsert = async (table, data) => {
  try {
    const { error } = await supabase.from(table).insert(data)
    if (error) {
      console.error(`خطأ في إدخال بيانات إلى ${table}:`, error.message)
      return false
    }
    return true
  } catch (e) {
    console.error('خطأ غير متوقع في supaInsert:', e.message)
    return false
  }
}

/* ─── حذف آمن عبر RPC (يتحقق من جلسة الأدمن) ─── */
export const supaDelete = async (table, column, value) => {
  try {
    const token = sessionStorage.getItem("admin_token")
    if (!token) {
      return { success: false, error: "لا توجد جلسة أدمن — سجّل دخولك أولاً" }
    }

    // محاولة الحذف عبر RPC الآمن أولاً
    const { data, error } = await supabase.rpc("admin_delete_row", {
      p_token: token,
      p_table: table,
      p_column: column,
      p_value: String(value),
    })

    if (error) {
      // إذا لم تكن دالة RPC موجودة، نرجع للطريقة المباشرة (fallback)
      if (error.message?.includes("function") || error.code === "42883") {
        console.warn("دالة admin_delete_row غير موجودة — استخدام الحذف المباشر")
        return supaDeleteDirect(table, column, value)
      }
      console.error(`خطأ في حذف من ${table}:`, error.message)
      return { success: false, error: error.message }
    }

    // التحقق من نتيجة RPC
    if (data?.success === false) {
      console.warn(`فشل الحذف من ${table}:`, data.error)
      return { success: false, error: data.error }
    }

    return { success: true, error: null }
  } catch (e) {
    console.error(`خطأ غير متوقع في حذف من ${table}:`, e.message)
    return { success: false, error: e.message }
  }
}

/* ─── حذف مباشر (fallback إذا لم تكن دالة RPC موجودة) ─── */
const supaDeleteDirect = async (table, column, value) => {
  try {
    const { data, error, count } = await supabase
      .from(table)
      .delete({ count: 'exact' })
      .eq(column, value)
      .select()

    if (error) {
      console.error(`خطأ في حذف من ${table}:`, error.message)
      return { success: false, error: error.message }
    }

    const deletedCount = data?.length ?? count ?? 0
    if (deletedCount === 0) {
      console.warn(`لم يتم حذف أي صف من ${table} (RLS قد يمنع الحذف)`)
      return {
        success: false,
        error: "لم يتم الحذف — تأكد من صلاحيات قاعدة البيانات (RLS)"
      }
    }

    return { success: true, error: null }
  } catch (e) {
    console.error(`خطأ غير متوقع في حذف من ${table}:`, e.message)
    return { success: false, error: e.message }
  }
}

/* ─── جلب بيانات ─── */
export const supaFetch = async (table, filters = {}) => {
  try {
    let query = supabase.from(table).select('*')
    Object.entries(filters).forEach(([k, v]) => { query = query.eq(k, v) })
    const { data, error } = await query
    if (error) {
      console.error(`خطأ في جلب بيانات من ${table}:`, error.message)
      return []
    }
    return data || []
  } catch (e) {
    console.error('خطأ غير متوقع في supaFetch:', e.message)
    return []
  }
}
