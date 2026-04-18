import { useMemo } from 'react'
import { generatePrioritySuggestions } from '../lib/ai/ruleEngine'
import type { Application, Stage, Task, PrioritySuggestion } from '../types'

export function usePriorityAI(
  applications: Application[],
  stages: Stage[],
  tasks: Task[]
): PrioritySuggestion[] {
  return useMemo(() => {
    return generatePrioritySuggestions({ applications, stages, tasks })
  }, [applications, stages, tasks])
}
