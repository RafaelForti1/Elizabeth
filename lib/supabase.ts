import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Photo = {
  id: string
  storage_path: string
  url: string
  caption?: string
  uploaded_at: string
}

export type Message = {
  id: string
  author_name: string
  content: string
  created_at: string
}
