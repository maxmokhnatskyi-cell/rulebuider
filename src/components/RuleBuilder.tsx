import React, { useState } from 'react'
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react'

interface Rule {
  id: string
  name: string
  description: string
  conditions: string[]
  actions: string[]
  isActive: boolean
}

const RuleBuilder: React.FC = () => {
  const [rules, setRules] = useState<Rule[]>([
    {
      id: '1',
      name: 'Sample Rule',
      description: 'This is a sample rule to get you started',
      conditions: ['User age > 18', 'User has verified email'],
      actions: ['Send welcome email', 'Enable premium features'],
      isActive: true
    }
  ])
  
  const [editingRule, setEditingRule] = useState<Rule | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const handleAddRule = () => {
    setShowAddForm(true)
  }

  const handleEditRule = (rule: Rule) => {
    setEditingRule(rule)
  }

  const handleDeleteRule = (ruleId: string) => {
    setRules(rules.filter(rule => rule.id !== ruleId))
  }

  const handleSaveRule = (rule: Rule) => {
    if (editingRule) {
      setRules(rules.map(r => r.id === rule.id ? rule : r))
      setEditingRule(null)
    } else {
      setRules([...rules, { ...rule, id: Date.now().toString() }])
      setShowAddForm(false)
    }
  }

  const toggleRuleStatus = (ruleId: string) => {
    setRules(rules.map(rule => 
      rule.id === ruleId ? { ...rule, isActive: !rule.isActive } : rule
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Rules</h2>
        <button
          onClick={handleAddRule}
          className="btn btn-primary px-4 py-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Rule
        </button>
      </div>

      {/* Rules List */}
      <div className="grid gap-4">
        {rules.map((rule) => (
          <div key={rule.id} className="card p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{rule.name}</h3>
                <p className="text-gray-600 mt-1">{rule.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleRuleStatus(rule.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    rule.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {rule.isActive ? 'Active' : 'Inactive'}
                </button>
                <button
                  onClick={() => handleEditRule(rule)}
                  className="btn btn-outline p-2"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteRule(rule.id)}
                  className="btn btn-outline p-2 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Conditions</h4>
                <ul className="space-y-1">
                  {rule.conditions.map((condition, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      {condition}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Actions</h4>
                <ul className="space-y-1">
                  {rule.actions.map((action, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      {action}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Rule Form */}
      {(showAddForm || editingRule) && (
        <RuleForm
          rule={editingRule}
          onSave={handleSaveRule}
          onCancel={() => {
            setShowAddForm(false)
            setEditingRule(null)
          }}
        />
      )}
    </div>
  )
}

interface RuleFormProps {
  rule?: Rule | null
  onSave: (rule: Rule) => void
  onCancel: () => void
}

const RuleForm: React.FC<RuleFormProps> = ({ rule, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: rule?.name || '',
    description: rule?.description || '',
    conditions: rule?.conditions || [''],
    actions: rule?.actions || [''],
    isActive: rule?.isActive ?? true
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newRule: Rule = {
      id: rule?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      conditions: formData.conditions.filter(c => c.trim() !== ''),
      actions: formData.actions.filter(a => a.trim() !== ''),
      isActive: formData.isActive
    }
    onSave(newRule)
  }

  const addCondition = () => {
    setFormData({
      ...formData,
      conditions: [...formData.conditions, '']
    })
  }

  const addAction = () => {
    setFormData({
      ...formData,
      actions: [...formData.actions, '']
    })
  }

  const updateCondition = (index: number, value: string) => {
    const newConditions = [...formData.conditions]
    newConditions[index] = value
    setFormData({ ...formData, conditions: newConditions })
  }

  const updateAction = (index: number, value: string) => {
    const newActions = [...formData.actions]
    newActions[index] = value
    setFormData({ ...formData, actions: newActions })
  }

  return (
    <div className="card p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        {rule ? 'Edit Rule' : 'Add New Rule'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rule Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="input"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input min-h-[80px]"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Conditions
          </label>
          {formData.conditions.map((condition, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={condition}
                onChange={(e) => updateCondition(index, e.target.value)}
                className="input flex-1"
                placeholder="Enter condition..."
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addCondition}
            className="btn btn-outline text-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Condition
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Actions
          </label>
          {formData.actions.map((action, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={action}
                onChange={(e) => updateAction(index, e.target.value)}
                className="input flex-1"
                placeholder="Enter action..."
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addAction}
            className="btn btn-outline text-sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Action
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Active</span>
          </label>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-outline px-4 py-2"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary px-4 py-2"
          >
            <Save className="w-4 h-4 mr-2" />
            {rule ? 'Update Rule' : 'Create Rule'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default RuleBuilder
