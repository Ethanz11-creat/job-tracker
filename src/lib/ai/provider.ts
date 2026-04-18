import type { AIProvider, AIProviderConfig } from './types'

class OpenAICompatibleProvider implements AIProvider {
  name = 'OpenAI Compatible'
  private config: AIProviderConfig

  constructor(config: AIProviderConfig) {
    this.config = config
  }

  async generateSuggestions(_context: unknown[]): Promise<string[]> {
    if (!this.config.apiKey) {
      throw new Error('AI API key not configured')
    }
    // Placeholder for actual API call
    return []
  }

  async generateTasks(_context: unknown[]): Promise<string[]> {
    if (!this.config.apiKey) {
      throw new Error('AI API key not configured')
    }
    return []
  }

  async generateSummary(_context: unknown): Promise<string> {
    if (!this.config.apiKey) {
      throw new Error('AI API key not configured')
    }
    return ''
  }
}

let currentProvider: AIProvider | null = null

export function createAIProvider(config: AIProviderConfig): AIProvider {
  currentProvider = new OpenAICompatibleProvider(config)
  return currentProvider
}

export function getAIProvider(): AIProvider | null {
  return currentProvider
}

export function initAIProviderFromEnv(): AIProvider | null {
  const baseUrl = import.meta.env.VITE_AI_BASE_URL
  const model = import.meta.env.VITE_AI_MODEL
  const apiKey = import.meta.env.VITE_AI_API_KEY

  if (baseUrl && model && apiKey) {
    return createAIProvider({ baseUrl, model, apiKey })
  }
  return null
}
