import { useState, useEffect, useCallback } from 'react'
import { supabase, getAnonymousUserId } from '../lib/supabase'
import type { Stage } from '../types'

export function useStages(applicationId?: string) {
  const [stages, setStages] = useState<Stage[]>([])
  const [loading, setLoading] = useState(true)
  const userId = getAnonymousUserId()

  const fetchStages = useCallback(async () => {
    let query = supabase
      .from('stages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    if (applicationId) {
      query = query.eq('application_id', applicationId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching stages:', error)
      return
    }

    setStages(data || [])
    setLoading(false)
  }, [userId, applicationId])

  useEffect(() => {
    fetchStages()
  }, [fetchStages])

  const addStage = useCallback(async (stage: Omit<Stage, 'id' | 'created_at' | 'user_id'>) => {
    const { data, error } = await supabase
      .from('stages')
      .insert({ ...stage, user_id: userId })
      .select()
      .single()

    if (error) {
      console.error('Error adding stage:', error)
      return null
    }

    setStages(prev => [...prev, data])
    return data as Stage
  }, [userId])

  const updateStage = useCallback(async (id: string, updates: Partial<Stage>) => {
    const { data, error } = await supabase
      .from('stages')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating stage:', error)
      return null
    }

    setStages(prev => prev.map(s => s.id === id ? data : s))
    return data as Stage
  }, [userId])

  const deleteStage = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('stages')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting stage:', error)
      return false
    }

    setStages(prev => prev.filter(s => s.id !== id))
    return true
  }, [userId])

  return { stages, loading, addStage, updateStage, deleteStage, refresh: fetchStages }
}
