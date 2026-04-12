import { createClient } from '@supabase/supabase-js'

const SUPA_URL = "https://pxacnzpundghlojfldif.supabase.co"
const SUPA_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4YWNuenB1bmRnaGxvamZsZGlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NDU4NjgsImV4cCI6MjA4ODMyMTg2OH0.GXnkjYc06QjGMRVOkzpGKh9wcnG0BIxEM-GfmTbM3Tk"

export const supabase = createClient(SUPA_URL, SUPA_KEY)

export const supaInsert = async (table, data) => {
  try {
    const { error } = await supabase.from(table).insert(data)
    if (error) console.warn('Supabase insert warning:', error.message)
    return !error
  } catch (e) {
    console.warn('Supabase error:', e)
    return false
  }
}

/**
 * حذف صف من جدول مع التحقق من نجاح الحذف فعلياً
 * يُعيد { success, error }
 */
export const supaDelete = async (table, column, value) => {
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

    // التحقق من أن الحذف تم فعلياً (عدد الصفوف المحذوفة > 0)
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
    console.error(`خطأ غير متوقع في حذف من ${table}:`, e)
    return { success: false, error: e.message }
  }
}

export const supaFetch = async (table, filters = {}) => {
  try {
    let query = supabase.from(table).select('*')
    Object.entries(filters).forEach(([k, v]) => { query = query.eq(k, v) })
    const { data, error } = await query
    if (error) console.warn('Supabase fetch warning:', error.message)
    return data || []
  } catch (e) {
    console.warn('Supabase error:', e)
    return []
  }
}
