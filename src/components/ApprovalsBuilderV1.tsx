import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPortal } from 'react-dom'
import { ChevronDown, Plus, CheckCircle, ArrowDown, CornerDownRight, User, Bell, Trash2, AlertTriangle } from 'lucide-react'

interface DropdownOption {
  value: string
  label: string
}

interface ConditionData {
  id: string
  type: string
  operator: string
  amount: string
  team?: string
  cardUser?: string
  card?: string
}

interface ApprovalData {
  id: string
  approvers: string[]
}

interface NotifyData {
  id: string
  approvers: string[]
}

interface ApproveExpenseData {
  id: string
}

interface ContainerData {
  id: string
  type: 'condition' | 'exclusion'
  conditions: ConditionData[]
  approvals: ApprovalData[]
  notifications: NotifyData[]
  approveExpenses: ApproveExpenseData[]
}

// PortalDropdown component for rendering dropdowns at document body level
const PortalDropdown: React.FC<{
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
  triggerRef?: React.RefObject<HTMLButtonElement>
}> = ({ isOpen, onClose, children, className = '', triggerRef }) => {
  const [position, setPosition] = useState({ top: 0, left: 0 })

  useEffect(() => {
    if (isOpen && triggerRef?.current) {
      const rect = triggerRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + window.scrollY + 4, // 4px gap
        left: rect.left + window.scrollX
      })
    }
  }, [isOpen, triggerRef])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && triggerRef?.current) {
        const target = event.target as Node
        
        // Don't close if clicking on the trigger button
        if (triggerRef.current.contains(target)) {
          return
        }
        
        // Don't close if clicking inside any portal dropdown
        const portalElements = document.querySelectorAll('[data-portal-dropdown]')
        for (const portalElement of portalElements) {
          if (portalElement.contains(target)) {
            return
          }
        }
        
        // Close the dropdown
        onClose()
      }
    }

    if (isOpen) {
      // Use a small delay to prevent immediate closing when opening
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside)
      }, 50)
      
      return () => {
        clearTimeout(timeoutId)
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isOpen, onClose, triggerRef])

  if (!isOpen) return null

  return createPortal(
    <div
      data-portal-dropdown
      className={`fixed bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] ${className}`}
      style={{
        top: position.top,
        left: position.left
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>,
    document.body
  )
}

const ApprovalsBuilderV1: React.FC = () => {
  const navigate = useNavigate()
  const [showAddConditionMenu, setShowAddConditionMenu] = useState(false)
  const [activeDropdowns, setActiveDropdowns] = useState<{[key: string]: boolean}>({})
  const [dropdownRefs, setDropdownRefs] = useState<{[key: string]: React.RefObject<HTMLButtonElement>}>({})
  const [containers, setContainers] = useState<ContainerData[]>([
    {
      id: '1',
      type: 'condition',
      conditions: [
        {
          id: '1-1',
          type: 'Transaction',
          operator: 'equal',
          amount: '$0.00'
        }
      ],
      approvals: [],
      notifications: [],
      approveExpenses: []
    }
  ])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('[data-dropdown]')) {
        setActiveDropdowns({})
        setShowAddConditionMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const typeOptions: DropdownOption[] = [
    { value: 'Transaction', label: 'Transaction' },
    { value: 'Card user', label: 'Card user' },
    { value: 'Card', label: 'Card' },
    { value: 'Team', label: 'Team' }
  ]

  const operatorOptions: DropdownOption[] = [
    { value: 'equal', label: 'Equal' },
    { value: 'greater', label: 'Greater than' },
    { value: 'less', label: 'Less than' },
    { value: 'greater-equal', label: 'Greater than or equal to' },
    { value: 'less-equal', label: 'Less than or equal to' }
  ]

  const teamOptions: DropdownOption[] = [
    { value: 'engineering', label: 'Engineering' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'hr', label: 'HR' }
  ]

  const cardUserOptions: DropdownOption[] = [
    { value: 'john-doe', label: 'John Doe' },
    { value: 'jane-smith', label: 'Jane Smith' },
    { value: 'bob-wilson', label: 'Bob Wilson' }
  ]

  const cardOptions: DropdownOption[] = [
    { value: 'corporate-card', label: 'Corporate Card' },
    { value: 'travel-card', label: 'Travel Card' },
    { value: 'expense-card', label: 'Expense Card' }
  ]

  const approverOptions: DropdownOption[] = [
    { value: 'any-manager', label: 'Any manager' },
    { value: 'any-admin', label: 'Any admin' },
    { value: 'john-smith', label: 'John Smith' },
    { value: 'john-fox', label: 'John Fox' },
    { value: 'jenny-fox', label: 'Jenny Fox' },
    { value: 'jane-doe', label: 'Jane Doe' },
    { value: 'bob-wilson', label: 'Bob Wilson' },
    { value: 'sarah-jones', label: 'Sarah Jones' },
    { value: 'mike-johnson', label: 'Mike Johnson' },
    { value: 'emma-davis', label: 'Emma Davis' },
    { value: 'alex-brown', label: 'Alex Brown' },
    { value: 'lisa-wilson', label: 'Lisa Wilson' }
  ]


  const conditionActionOptions = [
    { value: 'condition', label: 'Condition', icon: CornerDownRight },
    { value: 'approval', label: 'Approval', icon: User },
    { value: 'notify', label: 'Notify', icon: Bell },
    { value: 'approve-expense', label: 'Approve expense', icon: CheckCircle }
  ]

  const addConditionOptions = [
    { value: 'condition', label: 'Add condition', icon: CornerDownRight },
    { value: 'exclusion', label: 'Add exclusion', icon: AlertTriangle }
  ]

  // Helper functions for dropdown state management
  const getDropdownKey = (containerId: string, conditionId: string, dropdownType: string) => {
    return `${containerId}-${conditionId}-${dropdownType}`
  }

  const isDropdownOpen = (containerId: string, conditionId: string, dropdownType: string) => {
    return activeDropdowns[getDropdownKey(containerId, conditionId, dropdownType)] || false
  }

  const toggleDropdown = (containerId: string, conditionId: string, dropdownType: string) => {
    const key = getDropdownKey(containerId, conditionId, dropdownType)
    setActiveDropdowns(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const closeDropdown = (containerId: string, conditionId: string, dropdownType: string) => {
    const key = getDropdownKey(containerId, conditionId, dropdownType)
    setActiveDropdowns(prev => ({
      ...prev,
      [key]: false
    }))
  }

  // Helper functions for "Add" button dropdowns
  const isAddMenuOpen = (containerId: string) => {
    return activeDropdowns[`${containerId}-addMenu`] || false
  }

  const toggleAddMenu = (containerId: string) => {
    const key = `${containerId}-addMenu`
    setActiveDropdowns(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const closeAddMenu = (containerId: string) => {
    const key = `${containerId}-addMenu`
    setActiveDropdowns(prev => ({
      ...prev,
      [key]: false
    }))
  }

  const getDropdownRef = (key: string) => {
    if (!dropdownRefs[key]) {
      setDropdownRefs(prev => ({
        ...prev,
        [key]: React.createRef<HTMLButtonElement>()
      }))
      return React.createRef<HTMLButtonElement>()
    }
    return dropdownRefs[key]
  }

  // Helper function to get display text for approvers
  const getApproversDisplayText = (approvers: string[]) => {
    if (approvers.length === 0) return 'Any manager'
    if (approvers.length === 1) {
      return approverOptions.find(opt => opt.value === approvers[0])?.label || approvers[0]
    }
    const firstApprover = approverOptions.find(opt => opt.value === approvers[0])?.label || approvers[0]
    return `${firstApprover} +${approvers.length - 1}`
  }

  // Helper function to get role for approver (for display in dropdown)
  const getApproverRole = (approverValue: string) => {
    if (approverValue === 'any-manager' || approverValue === 'any-admin') return null
    // For individual users, show their role (Admin, Manager, etc.)
    const adminUsers = ['john-smith', 'john-fox', 'jenny-fox']
    return adminUsers.includes(approverValue) ? 'Admin' : 'Manager'
  }

  // Helper function to sort approver options (selected first)
  const getSortedApproverOptions = (selectedApprovers: string[]) => {
    const selected = approverOptions.filter(opt => selectedApprovers.includes(opt.value))
    const unselected = approverOptions.filter(opt => !selectedApprovers.includes(opt.value))
    return [...selected, ...unselected]
  }

  const handleTypeChange = (containerId: string, conditionId: string, type: string) => {
    setContainers(prev => prev.map(container => 
      container.id === containerId 
        ? {
            ...container,
            conditions: container.conditions.map(condition => 
              condition.id === conditionId 
                ? { ...condition, type, team: undefined, cardUser: undefined, card: undefined }
                : condition
            )
          }
        : container
    ))
  }

  const handleOperatorChange = (containerId: string, conditionId: string, operator: string) => {
    setContainers(prev => prev.map(container => 
      container.id === containerId 
        ? {
            ...container,
            conditions: container.conditions.map(condition => 
              condition.id === conditionId ? { ...condition, operator } : condition
            )
          }
        : container
    ))
  }


  const handleTeamChange = (containerId: string, conditionId: string, team: string) => {
    setContainers(prev => prev.map(container => 
      container.id === containerId 
        ? {
            ...container,
            conditions: container.conditions.map(condition => 
              condition.id === conditionId ? { ...condition, team } : condition
            )
          }
        : container
    ))
  }

  const handleCardUserChange = (containerId: string, conditionId: string, cardUser: string) => {
    setContainers(prev => prev.map(container => 
      container.id === containerId 
        ? {
            ...container,
            conditions: container.conditions.map(condition => 
              condition.id === conditionId ? { ...condition, cardUser } : condition
            )
          }
        : container
    ))
  }

  const handleCardChange = (containerId: string, conditionId: string, card: string) => {
    setContainers(prev => prev.map(container => 
      container.id === containerId 
        ? {
            ...container,
            conditions: container.conditions.map(condition => 
              condition.id === conditionId ? { ...condition, card } : condition
            )
          }
        : container
    ))
  }

  const addCondition = (containerId: string) => {
    const newCondition: ConditionData = {
      id: `${containerId}-${Date.now()}`,
      type: 'Transaction',
      operator: 'equal',
      amount: '$0.00'
    }
    setContainers(prev => prev.map(container => 
      container.id === containerId 
        ? { ...container, conditions: [...container.conditions, newCondition] }
        : container
    ))
  }

  const removeCondition = (containerId: string, conditionId: string) => {
    setContainers(prev => prev.map(container => 
      container.id === containerId 
        ? {
            ...container,
            conditions: container.conditions.filter(condition => condition.id !== conditionId)
          }
        : container
    ))
  }

  const addApproval = (containerId: string) => {
    const newApproval: ApprovalData = {
      id: `${containerId}-approval-${Date.now()}`,
      approvers: []
    }
    setContainers(prev => prev.map(container => 
      container.id === containerId 
        ? { ...container, approvals: [...container.approvals, newApproval] }
        : container
    ))
  }

  const addNotification = (containerId: string) => {
    const newNotification: NotifyData = {
      id: `${containerId}-notify-${Date.now()}`,
      approvers: []
    }
    setContainers(prev => prev.map(container => 
      container.id === containerId 
        ? { ...container, notifications: [...container.notifications, newNotification] }
        : container
    ))
  }

  const addApproveExpense = (containerId: string) => {
    const newApproveExpense: ApproveExpenseData = {
      id: `${containerId}-approve-expense-${Date.now()}`
    }
    setContainers(prev => prev.map(container => 
      container.id === containerId 
        ? { ...container, approveExpenses: [...container.approveExpenses, newApproveExpense] }
        : container
    ))
  }

  const removeApproval = (containerId: string, approvalId: string) => {
    setContainers(prev => prev.map(container => 
      container.id === containerId 
        ? {
            ...container,
            approvals: container.approvals.filter(approval => approval.id !== approvalId)
          }
        : container
    ))
  }

  const removeNotification = (containerId: string, notificationId: string) => {
    setContainers(prev => prev.map(container => 
      container.id === containerId 
        ? {
            ...container,
            notifications: container.notifications.filter(notification => notification.id !== notificationId)
          }
        : container
    ))
  }

  const removeApproveExpense = (containerId: string, approveExpenseId: string) => {
    setContainers(prev => prev.map(container => 
      container.id === containerId 
        ? {
            ...container,
            approveExpenses: container.approveExpenses.filter(approveExpense => approveExpense.id !== approveExpenseId)
          }
        : container
    ))
  }

  const toggleApprover = (containerId: string, approvalId: string, approver: string) => {
    setContainers(prev => prev.map(container => 
      container.id === containerId 
        ? {
            ...container,
            approvals: container.approvals.map(approval => 
              approval.id === approvalId 
                ? {
                    ...approval,
                    approvers: approval.approvers.includes(approver)
                      ? approval.approvers.filter(a => a !== approver)
                      : [...approval.approvers, approver]
                  }
                : approval
            )
          }
        : container
    ))
  }

  const toggleNotificationApprover = (containerId: string, notificationId: string, approver: string) => {
    setContainers(prev => prev.map(container => 
      container.id === containerId 
        ? {
            ...container,
            notifications: container.notifications.map(notification => 
              notification.id === notificationId 
                ? {
                    ...notification,
                    approvers: notification.approvers.includes(approver)
                      ? notification.approvers.filter(a => a !== approver)
                      : [...notification.approvers, approver]
                  }
                : notification
            )
          }
        : container
    ))
  }


  const addContainer = (type: 'condition' | 'exclusion') => {
    const newContainer: ContainerData = {
      id: Date.now().toString(),
      type,
      conditions: [
        {
          id: `${Date.now()}-1`,
          type: 'Transaction',
          operator: 'equal',
          amount: '$0.00'
        }
      ],
      approvals: [],
      notifications: [],
      approveExpenses: []
    }
    setContainers(prev => [...prev, newContainer])
  }

  const removeContainer = (containerId: string) => {
    setContainers(prev => prev.filter(container => container.id !== containerId))
  }

  const formatAmount = (value: string) => {
    // Remove non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, '')
    if (numericValue === '') return '$0.00'
    
    // Format as currency
    const number = parseFloat(numericValue)
    if (isNaN(number)) return '$0.00'
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(number)
  }

  const handleAmountInput = (containerId: string, conditionId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatAmount(e.target.value)
    setContainers(prev => prev.map(container => 
      container.id === containerId 
        ? {
            ...container,
            conditions: container.conditions.map(condition => 
              condition.id === conditionId ? { ...condition, amount: formatted } : condition
            )
          }
        : container
    ))
  }

  const renderConditionalInput = (containerId: string, condition: ConditionData) => {
    switch (condition.type) {
      case 'Team':
        return (
          <div className="relative" data-dropdown>
            <button
              ref={getDropdownRef(`${containerId}-${condition.id}-team`)}
              onClick={() => toggleDropdown(containerId, condition.id, 'team')}
              onMouseDown={(e) => e.stopPropagation()}
              className="bg-gray-100 flex gap-1 h-8 items-center min-w-[100px] px-2 py-0 rounded-lg relative"
            >
              <div className="absolute border border-gray-200 inset-0 pointer-events-none rounded-lg" />
              <div className="flex-1 text-sm text-gray-900 text-left">
                {condition.team ? teamOptions.find(opt => opt.value === condition.team)?.label : 'Select team'}
              </div>
              <ChevronDown className="w-3 h-3 text-gray-900" />
            </button>

            <PortalDropdown
              isOpen={isDropdownOpen(containerId, condition.id, 'team')}
              onClose={() => closeDropdown(containerId, condition.id, 'team')}
              className="min-w-[120px]"
              triggerRef={getDropdownRef(`${containerId}-${condition.id}-team`)}
            >
              {teamOptions.map((option) => (
                <button
                  key={option.value}
                  className="w-full px-3 py-2 text-left text-sm text-gray-900 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => {
                    handleTeamChange(containerId, condition.id, option.value)
                    closeDropdown(containerId, condition.id, 'team')
                  }}
                >
                  {option.label}
                </button>
              ))}
            </PortalDropdown>
          </div>
        )
      case 'Card user':
        return (
          <div className="relative" data-dropdown>
            <button
              ref={getDropdownRef(`${containerId}-${condition.id}-cardUser`)}
              onClick={() => toggleDropdown(containerId, condition.id, 'cardUser')}
              onMouseDown={(e) => e.stopPropagation()}
              className="bg-gray-100 flex gap-1 h-8 items-center min-w-[100px] px-2 py-0 rounded-lg relative"
            >
              <div className="absolute border border-gray-200 inset-0 pointer-events-none rounded-lg" />
              <div className="flex-1 text-sm text-gray-900 text-left">
                {condition.cardUser ? cardUserOptions.find(opt => opt.value === condition.cardUser)?.label : 'Select user'}
              </div>
              <ChevronDown className="w-3 h-3 text-gray-900" />
            </button>

            <PortalDropdown
              isOpen={isDropdownOpen(containerId, condition.id, 'cardUser')}
              onClose={() => closeDropdown(containerId, condition.id, 'cardUser')}
              className="min-w-[120px]"
              triggerRef={getDropdownRef(`${containerId}-${condition.id}-cardUser`)}
            >
              {cardUserOptions.map((option) => (
                <button
                  key={option.value}
                  className="w-full px-3 py-2 text-left text-sm text-gray-900 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => {
                    handleCardUserChange(containerId, condition.id, option.value)
                    closeDropdown(containerId, condition.id, 'cardUser')
                  }}
                >
                  {option.label}
                </button>
              ))}
            </PortalDropdown>
          </div>
        )
      case 'Card':
        return (
          <div className="relative" data-dropdown>
            <button
              ref={getDropdownRef(`${containerId}-${condition.id}-card`)}
              onClick={() => toggleDropdown(containerId, condition.id, 'card')}
              onMouseDown={(e) => e.stopPropagation()}
              className="bg-gray-100 flex gap-1 h-8 items-center min-w-[100px] px-2 py-0 rounded-lg relative"
            >
              <div className="absolute border border-gray-200 inset-0 pointer-events-none rounded-lg" />
              <div className="flex-1 text-sm text-gray-900 text-left">
                {condition.card ? cardOptions.find(opt => opt.value === condition.card)?.label : 'Select card'}
              </div>
              <ChevronDown className="w-3 h-3 text-gray-900" />
            </button>

            <PortalDropdown
              isOpen={isDropdownOpen(containerId, condition.id, 'card')}
              onClose={() => closeDropdown(containerId, condition.id, 'card')}
              className="min-w-[120px]"
              triggerRef={getDropdownRef(`${containerId}-${condition.id}-card`)}
            >
              {cardOptions.map((option) => (
                <button
                  key={option.value}
                  className="w-full px-3 py-2 text-left text-sm text-gray-900 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={() => {
                    handleCardChange(containerId, condition.id, option.value)
                    closeDropdown(containerId, condition.id, 'card')
                  }}
                >
                  {option.label}
                </button>
              ))}
            </PortalDropdown>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="bg-white relative min-h-screen" data-name="ApprovalsBuilder V1">
      {/* Header Toolbar */}
      <div className="absolute bg-white h-16 left-0 right-0 top-0 border-b border-gray-200" data-name="builderToolbar">
        <div className="flex items-center justify-between px-6 py-2 h-full">
          {/* Page Title */}
          <div className="flex items-center">
            <h1 className="text-lg font-semibold text-gray-900">Approval v1</h1>
          </div>

          {/* Actions */}
          <div className="flex gap-2 items-center">
            <button 
              onClick={() => navigate('/')}
              className="bg-gradient-to-b from-white to-gray-50 border border-gray-200 h-8 px-3 py-0 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-100 transition-colors"
            >
              Discard
            </button>
            <button 
              onClick={() => navigate('/')}
              className="bg-gradient-to-b from-teal-600 to-teal-700 border border-teal-700 h-8 px-3 py-0 rounded-lg text-sm font-medium text-white hover:from-teal-700 hover:to-teal-800 transition-colors"
            >
              Save workflow
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="absolute bottom-0 left-0 right-0 top-16 pt-8 pb-0 px-0 flex flex-col gap-1 items-center bg-gray-50 overflow-visible">
        {/* Render all containers */}
        {containers.map((container) => (
          <div key={container.id} className="flex flex-col items-start relative shrink-0 z-10 overflow-visible" data-name={`${container.type}Wrapper`}>
            {/* Type Indicator */}
            <div className="flex flex-col gap-2 items-start pl-5 pr-0 py-0 relative shrink-0" data-name="typeindicator">
              <div className={`box-border flex gap-2 items-center justify-center px-2 py-1 relative rounded-tl-xl rounded-tr-xl shrink-0 ${
                container.type === 'condition' ? 'bg-blue-600' : 'bg-yellow-500'
              }`} data-name="cardTypeTag">
                <div className="font-semibold text-sm text-white" data-node-id="3:1146">
                  {container.type === 'condition' ? 'Condition' : 'Exclusion'}
                </div>
                {/* Show trash icon for exclusions OR for conditions when there are multiple containers (but not the first condition) */}
                {(container.type === 'exclusion' || (container.type === 'condition' && containers.length > 1 && container.id !== containers[0].id)) && (
                  <button
                    onClick={() => removeContainer(container.id)}
                    className="w-4 h-4 flex items-center justify-center"
                    data-name="LuTrash"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            </div>

            {/* Container Card */}
            <div className="bg-white flex flex-col items-start relative rounded-2xl shadow-sm border border-gray-200 w-[600px] overflow-visible" data-name={`card${container.type === 'condition' ? 'Condition' : 'Exclusion'}`}>
              {/* Render all conditions in this container */}
              {container.conditions.map((condition, conditionIndex) => (
                <div key={condition.id} className="relative w-[600px] border-b border-gray-200" data-name="childCondition">
                  <div className="flex flex-wrap gap-3 items-center p-6 pr-14 w-[600px] relative">
                    <div className="text-sm text-gray-600">
                      {conditionIndex === 0 ? (container.type === 'condition' ? 'If' : 'Skip if') : 'And'}
                    </div>
                    
                    {/* Type Input */}
                    <div className="relative" data-dropdown>
                      <button
                        ref={getDropdownRef(`${container.id}-${condition.id}-type`)}
                        onClick={() => toggleDropdown(container.id, condition.id, 'type')}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="bg-gray-100 flex gap-1 h-8 items-center min-w-[100px] px-2 py-0 rounded-lg relative"
                      >
                        <div className="absolute border border-gray-200 inset-0 pointer-events-none rounded-lg" />
                        <div className="flex-1 text-sm text-gray-900 text-left">
                          {condition.type}
                        </div>
                        <ChevronDown className="w-3 h-3 text-gray-900" />
                      </button>

                      <PortalDropdown
                        isOpen={isDropdownOpen(container.id, condition.id, 'type')}
                        onClose={() => closeDropdown(container.id, condition.id, 'type')}
                        className="min-w-[120px]"
                        triggerRef={getDropdownRef(`${container.id}-${condition.id}-type`)}
                      >
                        {typeOptions.map((option) => (
                          <button
                            key={option.value}
                            className="w-full px-3 py-2 text-left text-sm text-gray-900 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={() => {
                              handleTypeChange(container.id, condition.id, option.value)
                              closeDropdown(container.id, condition.id, 'type')
                            }}
                          >
                            {option.label}
                          </button>
                        ))}
                      </PortalDropdown>
                    </div>

                    <div className="text-sm text-gray-600">is</div>

                    {/* Conditional Inputs based on type */}
                    {condition.type === 'Transaction' ? (
                      <>
                        {/* Operator Input */}
                        <div className="relative" data-dropdown>
                          <button
                            ref={getDropdownRef(`${container.id}-${condition.id}-operator`)}
                            onClick={() => toggleDropdown(container.id, condition.id, 'operator')}
                            onMouseDown={(e) => e.stopPropagation()}
                            className="bg-gray-100 flex gap-1 h-8 items-center min-w-[100px] px-2 py-0 rounded-lg relative"
                          >
                            <div className="absolute border border-gray-200 inset-0 pointer-events-none rounded-lg" />
                            <div className="flex-1 text-sm text-gray-900 text-left">
                              {operatorOptions.find(opt => opt.value === condition.operator)?.label}
                            </div>
                            <ChevronDown className="w-3 h-3 text-gray-900" />
                          </button>

                          <PortalDropdown
                            isOpen={isDropdownOpen(container.id, condition.id, 'operator')}
                            onClose={() => closeDropdown(container.id, condition.id, 'operator')}
                            className="min-w-[200px]"
                            triggerRef={getDropdownRef(`${container.id}-${condition.id}-operator`)}
                          >
                            {operatorOptions.map((option) => (
                              <button
                                key={option.value}
                                className="w-full px-3 py-2 text-left text-sm text-gray-900 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={() => {
                                  handleOperatorChange(container.id, condition.id, option.value)
                                  closeDropdown(container.id, condition.id, 'operator')
                                }}
                              >
                                {option.label}
                              </button>
                            ))}
                          </PortalDropdown>
                        </div>

                        {/* Amount Input */}
                        <input
                          type="text"
                          value={condition.amount}
                          onChange={(e) => handleAmountInput(container.id, condition.id, e)}
                          className="bg-gray-100 flex gap-1 h-8 items-center min-w-[100px] px-2 py-0 rounded-lg border border-gray-200 text-sm text-gray-900 text-left"
                          placeholder="$0.00"
                        />
                      </>
                    ) : (
                      /* For Team, Card user, Card - show only the selection dropdown */
                      renderConditionalInput(container.id, condition)
                    )}

                    {/* Delete button for additional conditions (not the first one) */}
                    {conditionIndex > 0 && (
                      <button
                        onClick={() => removeCondition(container.id, condition.id)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg"
                        data-name="hitArea <action=delete>"
                      >
                        <Trash2 className="w-4 h-4 text-gray-600" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {/* Render all approvals in this container */}
              {container.approvals.map((approval) => (
                <div key={approval.id} className="relative w-[600px] border-b border-gray-200" data-name="approvalStep">
                  <div className="flex flex-wrap gap-3 items-center p-6 pr-14 w-[600px] relative">
                    <div className="text-sm text-gray-600">require approval from</div>

                    {/* Approver Selection Input - Multi-select */}
                    <div className="relative" data-dropdown>
                      <button
                        ref={getDropdownRef(`${container.id}-${approval.id}-approver`)}
                        onClick={() => toggleDropdown(container.id, approval.id, 'approver')}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="bg-gray-100 flex gap-1 h-8 items-center min-w-[200px] px-2 py-0 rounded-lg relative"
                      >
                        <div className="absolute border border-gray-200 inset-0 pointer-events-none rounded-lg" />
                        <div className="flex-1 text-sm text-gray-900 text-left">
                          {getApproversDisplayText(approval.approvers)}
                        </div>
                        <ChevronDown className="w-3 h-3 text-gray-900" />
                      </button>

                      <PortalDropdown
                        isOpen={isDropdownOpen(container.id, approval.id, 'approver')}
                        onClose={() => closeDropdown(container.id, approval.id, 'approver')}
                        className="min-w-[300px] max-h-60 overflow-y-auto"
                        triggerRef={getDropdownRef(`${container.id}-${approval.id}-approver`)}
                      >
                        {getSortedApproverOptions(approval.approvers).map((option) => {
                          const isSelected = approval.approvers.includes(option.value)
                          const role = getApproverRole(option.value)
                          return (
                            <button
                              key={option.value}
                              className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg relative ${
                                isSelected ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                              }`}
                              onMouseDown={(e) => e.stopPropagation()}
                              onClick={() => {
                                toggleApprover(container.id, approval.id, option.value)
                              }}
                            >
                              <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                                isSelected
                                  ? 'border-blue-600 bg-blue-600'
                                  : 'border-gray-300'
                              }`}>
                                {isSelected && (
                                  <span className="text-white text-xs">✓</span>
                                )}
                              </div>
                              <span className="flex-1">{option.label}</span>
                              {role && (
                                <span className="text-xs text-gray-500 absolute right-4">
                                  {role}
                                </span>
                              )}
                            </button>
                          )
                        })}
                      </PortalDropdown>
                    </div>

                    {/* Delete button for approvals */}
                    <button
                      onClick={() => removeApproval(container.id, approval.id)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg"
                      data-name="hitArea <action=delete>"
                    >
                      <Trash2 className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Render all notifications in this container */}
              {container.notifications.map((notification) => (
                <div key={notification.id} className="relative w-[600px] border-b border-gray-200" data-name="notifyStep">
                  <div className="flex flex-wrap gap-3 items-center p-6 pr-14 w-[600px] relative">
                    <div className="text-sm text-gray-600">Notify</div>

                    {/* Notification Approver Selection Input - Multi-select */}
                    <div className="relative" data-dropdown>
                      <button
                        ref={getDropdownRef(`${container.id}-${notification.id}-notifyApprover`)}
                        onClick={() => toggleDropdown(container.id, notification.id, 'notifyApprover')}
                        onMouseDown={(e) => e.stopPropagation()}
                        className="bg-gray-100 flex gap-1 h-8 items-center min-w-[200px] px-2 py-0 rounded-lg relative"
                      >
                        <div className="absolute border border-gray-200 inset-0 pointer-events-none rounded-lg" />
                        <div className="flex-1 text-sm text-gray-900 text-left">
                          {getApproversDisplayText(notification.approvers)}
                        </div>
                        <ChevronDown className="w-3 h-3 text-gray-900" />
                      </button>

                      <PortalDropdown
                        isOpen={isDropdownOpen(container.id, notification.id, 'notifyApprover')}
                        onClose={() => closeDropdown(container.id, notification.id, 'notifyApprover')}
                        className="min-w-[300px] max-h-60 overflow-y-auto"
                        triggerRef={getDropdownRef(`${container.id}-${notification.id}-notifyApprover`)}
                      >
                        {getSortedApproverOptions(notification.approvers).map((option) => {
                          const isSelected = notification.approvers.includes(option.value)
                          const role = getApproverRole(option.value)
                          return (
                            <button
                              key={option.value}
                              className={`w-full px-4 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg relative ${
                                isSelected ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                              }`}
                              onMouseDown={(e) => e.stopPropagation()}
                              onClick={() => {
                                toggleNotificationApprover(container.id, notification.id, option.value)
                              }}
                            >
                              <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                                isSelected
                                  ? 'border-blue-600 bg-blue-600'
                                  : 'border-gray-300'
                              }`}>
                                {isSelected && (
                                  <span className="text-white text-xs">✓</span>
                                )}
                              </div>
                              <span className="flex-1">{option.label}</span>
                              {role && (
                                <span className="text-xs text-gray-500 absolute right-4">
                                  {role}
                                </span>
                              )}
                            </button>
                          )
                        })}
                      </PortalDropdown>
                    </div>

                    {/* Delete button for notifications */}
                    <button
                      onClick={() => removeNotification(container.id, notification.id)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg"
                      data-name="hitArea <action=delete>"
                    >
                      <Trash2 className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Render all approve expenses in this container */}
              {container.approveExpenses.map((approveExpense) => (
                <div key={approveExpense.id} className="relative w-[600px] border-b border-gray-200" data-name="approveExpenseStep">
                  <div className="flex flex-wrap gap-3 items-center p-6 pr-14 w-[600px] relative">
                    <div className="flex gap-3 h-8 items-center">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      <div className="text-sm text-green-600 font-medium">Approve expence</div>
                    </div>

                    {/* Delete button for approve expenses */}
                    <button
                      onClick={() => removeApproveExpense(container.id, approveExpense.id)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg"
                      data-name="hitArea <action=delete>"
                    >
                      <Trash2 className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Container Actions */}
              <div className="flex gap-3 items-center pl-4 pr-6 py-6 w-[600px] overflow-visible" data-name="conditionActions">
                {container.type === 'exclusion' ? (
                  // For exclusion containers, only show "Add condition" button
                  <button
                    onClick={() => addCondition(container.id)}
                    className="flex gap-2 h-6 items-center justify-center px-2 py-0 rounded-lg relative cursor-pointer transition-colors hover:bg-gray-100"
                    data-name="addCondition"
                  >
                    <Plus className="w-4 h-4 text-gray-900" />
                    <span className="text-sm font-medium text-gray-900">Add condition</span>
                  </button>
                ) : (
                  // For condition containers, show full "Add" menu
                  <div className="relative" data-dropdown>
                    <button
                      ref={getDropdownRef(`${container.id}-addMenu`)}
                      onClick={() => toggleAddMenu(container.id)}
                      onMouseDown={(e) => e.stopPropagation()}
                      className={`flex gap-2 h-6 items-center justify-center px-2 py-0 rounded-lg relative cursor-pointer transition-colors ${
                        isAddMenuOpen(container.id)
                          ? 'bg-gray-200'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <Plus className="w-4 h-4 text-gray-900" />
                      <span className="text-sm font-medium text-gray-900">Add</span>
                    </button>

                    <PortalDropdown
                      isOpen={isAddMenuOpen(container.id)}
                      onClose={() => closeAddMenu(container.id)}
                      className="w-[200px] p-1 rounded-2xl"
                      triggerRef={getDropdownRef(`${container.id}-addMenu`)}
                    >
                      {conditionActionOptions.map((option) => {
                        const IconComponent = option.icon
                        const isApprovalDisabled = option.value === 'approval' && (container.approvals.length > 0 || container.approveExpenses.length > 0)
                        const isNotifyDisabled = option.value === 'notify' && container.notifications.length > 0
                        const isApproveExpenseDisabled = option.value === 'approve-expense' && (container.approveExpenses.length > 0 || container.approvals.length > 0)
                        return (
                          <button
                            key={option.value}
                            className={`w-full flex gap-2 h-10 items-center px-3 py-2 rounded-xl text-sm transition-colors ${
                              isApprovalDisabled || isNotifyDisabled || isApproveExpenseDisabled
                                ? 'text-gray-400 opacity-20 cursor-not-allowed' 
                                : 'text-gray-900 hover:bg-gray-100'
                            }`}
                            onMouseDown={(e) => e.stopPropagation()}
                            onClick={() => {
                              if (isApprovalDisabled || isNotifyDisabled || isApproveExpenseDisabled) return
                              
                              if (option.value === 'condition') {
                                addCondition(container.id)
                              } else if (option.value === 'approval') {
                                addApproval(container.id)
                              } else if (option.value === 'notify') {
                                addNotification(container.id)
                              } else if (option.value === 'approve-expense') {
                                addApproveExpense(container.id)
                              }
                              console.log(`Selected condition action: ${option.label}`)
                              closeAddMenu(container.id)
                            }}
                            disabled={isApprovalDisabled || isNotifyDisabled || isApproveExpenseDisabled}
                          >
                            <div className="w-4 h-6 flex items-center justify-center">
                              <IconComponent className={`w-4 h-4 ${isApprovalDisabled || isNotifyDisabled || isApproveExpenseDisabled ? 'text-gray-400' : 'text-gray-900'}`} />
                            </div>
                            <span className="flex-1 text-left">{option.label}</span>
                          </button>
                        )
                      })}
                    </PortalDropdown>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Arrow Down */}
        <div className="flex justify-center w-6 h-6 relative z-5" data-name="TbArrowDown">
          <ArrowDown className="w-6 h-6 text-gray-700" />
        </div>

        {/* Add Condition Button */}
        <div className="relative" data-dropdown>
          <button
            onClick={() => setShowAddConditionMenu(!showAddConditionMenu)}
            className="bg-gradient-to-b from-white to-gray-50 border border-gray-200 h-8 px-3 py-0 rounded-lg flex gap-2 items-center"
            data-name="add condition"
          >
            <span className="text-sm font-medium text-gray-900">Add step</span>
            <ChevronDown className="w-4 h-4 text-gray-900" />
          </button>

          {/* Add Condition Menu */}
          {showAddConditionMenu && (
            <div className="absolute bg-white left-0 top-8 w-[200px] p-1 rounded-2xl border border-gray-200 shadow-lg z-[9999]" data-name="addStepMenu">
              {addConditionOptions.map((option) => {
                const IconComponent = option.icon
                return (
                  <button
                    key={option.value}
                    className="w-full flex gap-2 h-10 items-center px-3 py-2 rounded-xl text-sm text-gray-900 hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      if (option.value === 'condition') {
                        addContainer('condition')
                      } else if (option.value === 'exclusion') {
                        addContainer('exclusion')
                      }
                      console.log(`Selected: ${option.label}`)
                      setShowAddConditionMenu(false)
                    }}
                  >
                    <div className="w-4 h-6 flex items-center justify-center">
                      <IconComponent className="w-4 h-4 text-gray-900" />
                    </div>
                    <span className="flex-1 text-left">{option.label}</span>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Arrow Down */}
        <div className="flex justify-center w-6 h-6 relative z-5" data-name="TbArrowDown">
          <ArrowDown className="w-6 h-6 text-gray-700" />
        </div>

        {/* Card Outcome */}
        <div className="bg-gray-100 relative rounded-2xl border border-gray-200 w-[600px]" data-name="cardOutcome">
          <div className="flex flex-col items-start overflow-hidden relative">
            <div className="h-16 relative w-[600px] border-b border-gray-200" data-name="fallbackTitle">
              <div className="flex flex-wrap gap-3 h-16 items-center p-6 w-[600px]">
                <div className="text-sm text-gray-600">If no condition are met</div>
              </div>
            </div>
            <div className="flex gap-3 h-16 items-center pl-4 pr-6 py-6 w-[600px]" data-name="fallbackActions">
              <div className="flex gap-3 h-8 items-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div className="text-sm text-green-600">Auto-approve expense</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ApprovalsBuilderV1
