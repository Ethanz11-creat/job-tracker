import { useState, useEffect } from 'react'
import { supabase, getAnonymousUserId } from '../lib/supabase'

export function useSupabase() {
  const [userId, setUserId] = useState<string>('')
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const id = getAnonymousUserId()
    setUserId(id)
    setIsReady(true)
  }, [])

  return { supabase, userId, isReady }
}
