export interface AIProviderConfig {
  baseUrl: string
  model: string
  apiKey: string
}

export interface AIProvider {
  name: string
  generateSuggestions(context: unknown[]): Promise<string[]>
  generateTasks(context: unknown[]): Promise<string[]>
  generateSummary(context: unknown): Promise<string>
}

export interface AICapabilities {
  prioritySuggestions: boolean
  taskBreakdown: boolean
  summary: boolean
  experienceReuse: boolean
}
