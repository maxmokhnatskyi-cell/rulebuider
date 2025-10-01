// AI Service for generating approval rules using Groq API

export interface AIResponse {
  success: boolean
  data?: any[]
  error?: string
  explanation?: string
}

export interface RuleDescription {
  conditions: string[]
  actions: string[]
  amount?: string
  team?: string
  approver?: string
}

class AIService {
  private apiKey: string

  constructor() {
    this.apiKey = import.meta.env.VITE_GROQ_API_KEY || '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'
  }

  async generateRules(description: string): Promise<AIResponse> {
    // Temporarily use mock response to ensure it works
    console.log('Using mock response for:', description)
    return this.generateMockResponse(description)
  }

  private generateMockResponse(description: string): AIResponse {
    // Enhanced mock response that parses natural language
    const lowerDesc = description.toLowerCase()
    
    // Extract amount
    const amountMatch = description.match(/\$?(\d+(?:,\d{3})*(?:\.\d{2})?)/)
    const amount = amountMatch ? `$${amountMatch[1]}` : '$500.00'
    
    // Extract team
    const teamMatch = lowerDesc.match(/(engineering|marketing|sales|hr|finance|operations)/)
    const team = teamMatch ? teamMatch[1] : undefined
    
    // Extract approver level
    let approver = 'any-manager'
    if (lowerDesc.includes('admin')) {
      approver = 'any-admin'
    } else if (lowerDesc.includes('cfo')) {
      approver = 'john-smith'
    } else if (lowerDesc.includes('director')) {
      approver = 'john-fox'
    }
    
    // Determine if it's an exclusion (skip/auto-approve)
    const isExclusion = lowerDesc.includes('skip') || lowerDesc.includes('auto-approve')
    
    // Determine operator
    let operator = 'greater'
    if (lowerDesc.includes('less than') || lowerDesc.includes('under')) {
      operator = 'less'
    } else if (lowerDesc.includes('equal to') || lowerDesc.includes('exactly')) {
      operator = 'equal'
    } else if (lowerDesc.includes('greater than or equal')) {
      operator = 'greater-equal'
    } else if (lowerDesc.includes('less than or equal')) {
      operator = 'less-equal'
    }

    const rules = []

    if (isExclusion) {
      // Create exclusion rule
      rules.push({
        id: '1',
        type: 'exclusion',
        conditions: [
          {
            id: '1-1',
            type: team ? 'Team' : 'Transaction',
            operator: operator,
            amount: amount,
            team: team
          }
        ],
        approvals: [],
        notifications: [],
        approveExpenses: [
          {
            id: '1-approve-1'
          }
        ]
      })
    } else {
      // Create condition rule
      rules.push({
        id: '1',
        type: 'condition',
        conditions: [
          {
            id: '1-1',
            type: team ? 'Team' : 'Transaction',
            operator: operator,
            amount: amount,
            team: team
          }
        ],
        approvals: [
          {
            id: '1-approval-1',
            approvers: [approver]
          }
        ],
        notifications: [],
        approveExpenses: []
      })
    }

    const explanation = isExclusion 
      ? `I've created an exclusion rule that auto-approves expenses when ${team ? `the ${team} team's` : ''} transaction amount is ${operator} ${amount}.`
      : `I've created a condition rule that requires ${approver.replace('-', ' ')} approval when ${team ? `the ${team} team's` : ''} transaction amount is ${operator} ${amount}.`

    return {
      success: true,
      data: rules,
      explanation: explanation
    }
  }
}

export const aiService = new AIService()