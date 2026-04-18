import { useState, useEffect, useCallback } from 'react'
import { supabase, getAnonymousUserId } from '../lib/supabase'
import type { Company } from '../types'

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const userId = getAnonymousUserId()

  const fetchCompanies = useCallback(async () => {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('user_id', userId)
      .order('name')

    if (error) {
      console.error('Error fetching companies:', error)
      return
    }

    setCompanies(data || [])
    setLoading(false)
  }, [userId])

  useEffect(() => {
    fetchCompanies()
  }, [fetchCompanies])

  const addCompany = useCallback(async (company: Omit<Company, 'id' | 'created_at' | 'user_id'>) => {
    const { data, error } = await supabase
      .from('companies')
      .insert({ ...company, user_id: userId })
      .select()
      .single()

    if (error) {
      console.error('Error adding company:', error)
      return null
    }

    setCompanies(prev => [...prev, data])
    return data as Company
  }, [userId])

  const updateCompany = useCallback(async (id: string, updates: Partial<Company>) => {
    const { data, error } = await supabase
      .from('companies')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating company:', error)
      return null
    }

    setCompanies(prev => prev.map(c => c.id === id ? data : c))
    return data as Company
  }, [userId])

  const deleteCompany = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting company:', error)
      return false
    }

    setCompanies(prev => prev.filter(c => c.id !== id))
    return true
  }, [userId])

  return { companies, loading, addCompany, updateCompany, deleteCompany, refresh: fetchCompanies }
}
