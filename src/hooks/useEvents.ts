import { useState, useEffect, useCallback } from 'react'
import { supabase, getAnonymousUserId } from '../lib/supabase'
import type { Event } from '../types'

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const userId = getAnonymousUserId()

  const fetchEvents = useCallback(async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('user_id', userId)
      .order('event_date', { ascending: true })

    if (error) {
      console.error('Error fetching events:', error)
      return
    }

    setEvents(data || [])
    setLoading(false)
  }, [userId])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  const addEvent = useCallback(async (event: Omit<Event, 'id' | 'created_at' | 'user_id'>) => {
    const { data, error } = await supabase
      .from('events')
      .insert({ ...event, user_id: userId })
      .select()
      .single()

    if (error) {
      console.error('Error adding event:', error)
      return null
    }

    setEvents(prev => [...prev, data])
    return data as Event
  }, [userId])

  const updateEvent = useCallback(async (id: string, updates: Partial<Event>) => {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating event:', error)
      return null
    }

    setEvents(prev => prev.map(e => e.id === id ? data : e))
    return data as Event
  }, [userId])

  const deleteEvent = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting event:', error)
      return false
    }

    setEvents(prev => prev.filter(e => e.id !== id))
    return true
  }, [userId])

  return { events, loading, addEvent, updateEvent, deleteEvent, refresh: fetchEvents }
}
