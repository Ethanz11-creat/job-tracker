import { useState, useEffect, useCallback } from 'react'
import { supabase, getAnonymousUserId } from '../lib/supabase'
import type { Task } from '../types'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const userId = getAnonymousUserId()

  const fetchTasks = useCallback(async () => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', userId)
      .order('due_date', { ascending: true })

    if (error) {
      console.error('Error fetching tasks:', error)
      return
    }

    setTasks(data || [])
    setLoading(false)
  }, [userId])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const addTask = useCallback(async (task: Omit<Task, 'id' | 'created_at' | 'user_id'>) => {
    const { data, error } = await supabase
      .from('tasks')
      .insert({ ...task, user_id: userId })
      .select()
      .single()

    if (error) {
      console.error('Error adding task:', error)
      return null
    }

    setTasks(prev => [...prev, data])
    return data as Task
  }, [userId])

  const updateTask = useCallback(async (id: string, updates: Partial<Task>) => {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating task:', error)
      return null
    }

    setTasks(prev => prev.map(t => t.id === id ? data : t))
    return data as Task
  }, [userId])

  const deleteTask = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting task:', error)
      return false
    }

    setTasks(prev => prev.filter(t => t.id !== id))
    return true
  }, [userId])

  return { tasks, loading, addTask, updateTask, deleteTask, refresh: fetchTasks }
}
