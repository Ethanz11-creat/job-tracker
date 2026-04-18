import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env')
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
)

export function getAnonymousUserId(): string {
  const key = 'job_tracker_user_id'
  let userId = localStorage.getItem(key)
  if (!userId) {
    userId = crypto.randomUUID()
    localStorage.setItem(key, userId)
  }
  return userId
}
