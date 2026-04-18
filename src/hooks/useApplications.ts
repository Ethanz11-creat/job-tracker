import { useState, useEffect, useCallback } from 'react'
import { supabase, getAnonymousUserId } from '../lib/supabase'
import type { Application } from '../types'

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const userId = getAnonymousUserId()

  const fetchApplications = useCallback(async () => {
    const { data, error } = await supabase
      .from('applications')
      .select('*, company:companies(*), stages(*)')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching applications:', error)
      return
    }

    setApplications(data || [])
    setLoading(false)
  }, [userId])

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  const addApplication = useCallback(async (application: Omit<Application, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    const { data, error } = await supabase
      .from('applications')
      .insert({ ...application, user_id: userId })
      .select('*, company:companies(*)')
      .single()

    if (error) {
      console.error('Error adding application:', error)
      return null
    }

    setApplications(prev => [data, ...prev])
    return data as Application
  }, [userId])

  const updateApplication = useCallback(async (id: string, updates: Partial<Application>) => {
    const { data, error } = await supabase
      .from('applications')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', userId)
      .select('*, company:companies(*)')
      .single()

    if (error) {
      console.error('Error updating application:', error)
      return null
    }

    setApplications(prev => prev.map(a => a.id === id ? data : a))
    return data as Application
  }, [userId])

  const deleteApplication = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('applications')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting application:', error)
      return false
    }

    setApplications(prev => prev.filter(a => a.id !== id))
    return true
  }, [userId])

  return { applications, loading, addApplication, updateApplication, deleteApplication, refresh: fetchApplications }
}
