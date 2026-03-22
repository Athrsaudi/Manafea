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
