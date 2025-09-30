import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

interface VersionItem {
  id: string
  version: string
  description: string
}

interface WorkflowSection {
  id: string
  title: string
  items: VersionItem[]
}

const HomeScreen: React.FC = () => {
  const navigate = useNavigate()
  
  const workflowSections: WorkflowSection[] = [
    {
      id: 'approvals',
      title: 'Approvals',
      items: [
        { id: 'approvals-v1', version: 'v1', description: 'Description' },
        { id: 'approvals-v2', version: 'v2', description: 'Description' }
      ]
    },
    {
      id: 'reimbursements',
      title: 'Reimbursements',
      items: [
        { id: 'reimbursements-v1', version: 'v1', description: 'Description' },
        { id: 'reimbursements-v2', version: 'v2', description: 'Description' }
      ]
    },
    {
      id: 'expense-submission',
      title: 'Expense submission',
      items: [
        { id: 'expense-v1', version: 'v1', description: 'Description' },
        { id: 'expense-v2', version: 'v2', description: 'Description' }
      ]
    }
  ]

  const handleItemClick = (sectionId: string, itemId: string) => {
    console.log(`Clicked ${sectionId} - ${itemId}`)
    
    // Navigate to specific workflow version
    if (sectionId === 'approvals' && itemId === 'approvals-v1') {
      navigate('/approvals/v1')
    }
    // Add more navigation cases as needed
  }

  return (
    <div className="bg-white relative min-h-screen" data-name="Homescreen">
      {/* Header Toolbar */}
      <div className="absolute bg-white h-16 left-0 right-0 top-0 border-b border-gray-200" data-name="homeToolbar">
        <div className="flex items-center justify-between px-6 py-2 h-full">
          <h1 className="font-semibold text-xl text-neutral-900">
            Workflow builder
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="absolute bottom-0 left-0 right-0 top-16 pt-8 pb-0 px-0 flex flex-col gap-8 items-center">
        {workflowSections.map((section) => (
          <div key={section.id} className="flex flex-col gap-2 items-start w-[800px]">
            {/* Section Title */}
            <h2 className="font-semibold text-xl text-neutral-900 leading-[30px]">
              {section.title}
            </h2>

            {/* Section Menu Container */}
            <div className="relative rounded-lg border border-gray-200 w-full">
              {section.items.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex h-16 items-center pl-4 pr-2 py-1 relative w-full cursor-pointer hover:bg-gray-50 ${
                    index < section.items.length - 1 ? 'border-b border-gray-200' : ''
                  }`}
                  onClick={() => handleItemClick(section.id, item.id)}
                >
                  {/* Content */}
                  <div className="flex flex-col grow items-start justify-center min-w-0">
                    <div className="font-semibold text-sm text-neutral-900 leading-[21px]">
                      {item.version}
                    </div>
                    <div className="font-normal text-sm text-gray-600 leading-[21px]">
                      {item.description}
                    </div>
                  </div>

                  {/* Chevron Icon */}
                  <div className="flex items-center justify-center w-6 h-6">
                    <ChevronRight className="w-4 h-4 text-neutral-900" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default HomeScreen
