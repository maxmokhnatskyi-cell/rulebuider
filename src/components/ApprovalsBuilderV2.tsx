import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send, Loader2 } from 'lucide-react'
import { aiService, AIResponse } from '../services/aiService'


const ApprovalsBuilderV2: React.FC = () => {
  const navigate = useNavigate()
  const [userInput, setUserInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null)
  const handleGenerateRules = async () => {
    if (!userInput.trim()) return

    console.log('Starting rule generation for:', userInput)
    setIsGenerating(true)
    setAiResponse(null)

    try {
      const response = await aiService.generateRules(userInput)
      console.log('AI Response received:', response)
      setAiResponse(response)
    } catch (error) {
      console.error('Error generating rules:', error)
      setAiResponse({
        success: false,
        error: 'Failed to generate rules. Please try again.'
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="bg-white relative size-full" data-name="ApprovalsBuilder V2" data-node-id="9:1071">
      {/* Main Content Container */}
      <div className="absolute bg-[#fdfdfd] bottom-px box-border content-stretch flex flex-col gap-[16px] items-center left-0 overflow-visible px-0 py-[32px] right-0 top-[64px]" data-name="builderContainer" data-node-id="9:1072">
        
        {/* AI Rule Container */}
        <div className="basis-0 box-border content-stretch flex flex-col grow items-center max-w-[800px] min-h-[500px] min-w-px overflow-clip px-0 py-[8px] relative shrink-0 w-full" data-name="containerAIRule" data-node-id="9:2628">
          {/* AI Response Section */}
          {aiResponse && aiResponse.success && (
            <div className="space-y-4 w-full max-w-[600px]">
              {aiResponse.data?.map((container) => (
                <div key={container.id} className="space-y-4">
                  {/* Condition Card */}
                  <div className="bg-white max-w-[600px] relative rounded-[16px] shrink-0 w-full" data-name="childCondition" data-node-id="9:2658">
                    <div className="box-border content-center flex flex-wrap font-['Inter:Regular',_sans-serif] font-normal gap-[8px] items-center leading-[0] max-w-inherit not-italic overflow-clip pl-[12px] pr-[36px] py-[12px] relative text-[14px] text-[rgba(18,18,28,0.73)] text-nowrap w-full whitespace-pre">
                      {container.conditions.map((condition: any, condIndex: number) => (
                        <p key={condition.id} className="leading-[21px] relative shrink-0" data-node-id="9:2659">
                          <span>{condIndex === 0 ? 'If ' : 'and '}</span>
                          <span className="text-[#1447e6]">{condition.type}</span>
                          <span> is </span>
                          <span className="not-italic">{condition.operator}</span>
                          <span> </span>
                          <span className="text-[#1447e6]">{condition.amount}</span>
                          {condition.team && (
                            <>
                              <span> and </span>
                              <span className="text-[#1447e6]">{condition.team}</span>
                            </>
                          )}
                        </p>
                      ))}
                    </div>
                    <div aria-hidden="true" className="absolute border border-[#e9e9ec] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_10px_-2px_rgba(9,9,11,0.08),0px_2px_5px_-2px_rgba(9,9,11,0.04)]" />
                  </div>

                  {/* Connector Line */}
                  <div className="h-[16px] relative shrink-0 w-0" data-node-id="9:2746">
                    <div className="absolute bottom-0 left-[-1px] right-[-1px] top-0" style={{ "--stroke-0": "rgba(233, 233, 236, 1)" } as React.CSSProperties}>
                      <svg className="w-full h-full" viewBox="0 0 1 16" fill="none">
                        <path d="M0.5 0L0.5 16" stroke="rgba(233, 233, 236, 1)" strokeWidth="1"/>
                      </svg>
                    </div>
                  </div>

                  {/* Action Card */}
                  <div className="bg-white max-w-[600px] relative rounded-[16px] shrink-0 w-full" data-name="childCondition" data-node-id="9:2740">
                    <div className="box-border content-center flex flex-wrap gap-[8px] items-center max-w-inherit overflow-clip pl-[12px] pr-[36px] py-[12px] relative w-full">
                      {container.approveExpenses.length > 0 ? (
                        <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#007a55] text-[14px] text-nowrap whitespace-pre" data-node-id="9:2741">
                          Auto-approve transaction
                        </p>
                      ) : (
                        <p className="font-['Inter:Regular',_sans-serif] font-normal leading-[21px] not-italic relative shrink-0 text-[#1447e6] text-[14px] text-nowrap whitespace-pre" data-node-id="9:2741">
                          Require approval from {container.approvals[0]?.approvers[0]?.replace('-', ' ') || 'manager'}
                        </p>
                      )}
                    </div>
                    <div aria-hidden="true" className="absolute border border-[#e9e9ec] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_10px_-2px_rgba(9,9,11,0.08),0px_2px_5px_-2px_rgba(9,9,11,0.04)]" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {aiResponse && !aiResponse.success && (
            <div className="bg-white max-w-[600px] relative rounded-[16px] shrink-0 w-full" data-name="childCondition" data-node-id="9:2658">
              <div className="box-border content-center flex flex-wrap font-['Inter:Regular',_sans-serif] font-normal gap-[8px] items-center leading-[0] max-w-inherit not-italic overflow-clip pl-[12px] pr-[36px] py-[12px] relative text-[14px] text-red-600 text-nowrap w-full whitespace-pre">
                <p className="leading-[21px] relative shrink-0">{aiResponse.error}</p>
              </div>
              <div aria-hidden="true" className="absolute border border-red-200 border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_10px_-2px_rgba(9,9,11,0.08),0px_2px_5px_-2px_rgba(9,9,11,0.04)]" />
            </div>
          )}

          {/* Loading State */}
          {isGenerating && (
            <div className="bg-white max-w-[600px] relative rounded-[16px] shrink-0 w-full" data-name="childCondition" data-node-id="9:2658">
              <div className="box-border content-center flex flex-wrap font-['Inter:Regular',_sans-serif] font-normal gap-[8px] items-center leading-[0] max-w-inherit not-italic overflow-clip pl-[12px] pr-[36px] py-[12px] relative text-[14px] text-gray-600 text-nowrap w-full whitespace-pre">
                <p className="leading-[21px] relative shrink-0">Generating rules...</p>
              </div>
              <div aria-hidden="true" className="absolute border border-[#e9e9ec] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_10px_-2px_rgba(9,9,11,0.08),0px_2px_5px_-2px_rgba(9,9,11,0.04)]" />
            </div>
          )}

          {/* Debug State - Show when no response yet */}
          {!aiResponse && !isGenerating && (
            <div className="bg-gray-100 max-w-[600px] relative rounded-[16px] shrink-0 w-full" data-name="childCondition" data-node-id="9:2658">
              <div className="box-border content-center flex flex-wrap font-['Inter:Regular',_sans-serif] font-normal gap-[8px] items-center leading-[0] max-w-inherit not-italic overflow-clip pl-[12px] pr-[36px] py-[12px] relative text-[14px] text-gray-500 text-nowrap w-full whitespace-pre">
                <p className="leading-[21px] relative shrink-0">No AI response yet. Try typing a rule or click "Test AI" button.</p>
              </div>
              <div aria-hidden="true" className="absolute border border-gray-300 border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_10px_-2px_rgba(9,9,11,0.08),0px_2px_5px_-2px_rgba(9,9,11,0.04)]" />
            </div>
          )}
        </div>
        
        {/* AI Examples Container */}
        <div className="box-border content-stretch flex flex-wrap gap-[8px] items-center max-w-[800px] overflow-visible p-[8px] relative shrink-0 w-full" data-name="containerAiExamples" data-node-id="9:2830">
          <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black text-nowrap" data-node-id="9:2831">
            <p className="leading-[21px] whitespace-pre">Try this:</p>
          </div>
          <button 
            onClick={() => setUserInput("Require manager approval for expenses over $500")}
            className="bg-[#f7f7f7] box-border content-stretch flex gap-[8px] items-center justify-center p-[8px] relative rounded-[16px] shrink-0 hover:bg-[#f0f0f0] transition-colors cursor-pointer whitespace-nowrap" 
            data-name="containerAiExamples" data-node-id="9:2833"
          >
            <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black text-nowrap" data-node-id="9:2832">
              <p className="leading-[21px] whitespace-pre">Require manager approval for expenses over $500</p>
            </div>
          </button>
          <button 
            onClick={() => setUserInput("Skip approval for expenses under $200 for marketing")}
            className="bg-[#f7f7f7] box-border content-stretch flex gap-[8px] items-center justify-center p-[8px] relative rounded-[16px] shrink-0 hover:bg-[#f0f0f0] transition-colors cursor-pointer whitespace-nowrap" 
            data-name="containerAiExamples" data-node-id="9:2836"
          >
            <div className="flex flex-col font-['Inter:Regular',_sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black text-nowrap" data-node-id="9:2837">
              <p className="leading-[21px] whitespace-pre">Skip approval for expenses under $200 for marketing</p>
            </div>
          </button>
        </div>
        
        {/* Chat AI Container */}
        <div className="bg-white max-w-[800px] relative rounded-[16px] shrink-0 w-full" data-name="containerChatAI" data-node-id="9:2629">
          <div className="box-border content-stretch flex flex-col gap-[8px] items-start max-w-inherit overflow-clip p-[8px] relative w-full">
            {/* Input Field */}
            <div className="box-border content-stretch flex gap-[8px] items-center px-[8px] py-[12px] relative shrink-0 w-full" data-name="inputChatAi" data-node-id="9:2630">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Describe approval rule"
                className="flex-1 bg-transparent border-none outline-none text-[14px] text-[#171717] placeholder:text-[rgba(33,33,51,0.43)] font-['Inter:Regular',_sans-serif] font-normal leading-[21px]"
                data-node-id="9:2631"
              />
            </div>
            
            {/* Send Button */}
            <div className="box-border content-stretch flex gap-[8px] items-center justify-end px-[8px] py-0 relative shrink-0 w-full" data-name="inputChatAi" data-node-id="9:2632">
              <button
                onClick={handleGenerateRules}
                disabled={!userInput.trim() || isGenerating}
                className="bg-[rgba(0,120,111,0.35)] box-border content-stretch flex gap-[8px] h-[32px] items-center justify-center px-[8px] py-0 relative rounded-[999px] shadow-[0px_10px_15px_-5px_rgba(0,138,127,0.03),0px_5px_5px_-2px_rgba(0,138,127,0.13)] shrink-0 hover:bg-[rgba(0,120,111,0.45)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                data-name="Button" data-node-id="9:2633"
              >
                <div className="h-[20px] overflow-clip relative shrink-0 w-[16px]" data-name="iconOnly" data-node-id="I9:2633;1144:6941">
                  <div className="absolute left-1/2 overflow-clip size-[16px] top-1/2 translate-x-[-50%] translate-y-[-50%]" data-name="iconSlot" data-node-id="I9:2633;1144:6942">
                    {isGenerating ? (
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
              </button>
            </div>
          </div>
          <div aria-hidden="true" className="absolute border border-[#e9e9ec] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_5.8px_0px_rgba(180,31,194,0.04),0px_5px_11.7px_2px_rgba(182,197,255,0.25)]" />
        </div>
      </div>
      
      {/* Header Toolbar */}
      <div className="absolute bg-white h-[64px] left-0 right-0 top-0" data-name="builderToolbar" data-node-id="9:1097">
        <div className="box-border content-stretch flex items-center justify-between overflow-clip px-[24px] py-[2px] relative size-full">
          <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-name="Container" data-node-id="9:1098">
            <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-neutral-900 text-nowrap" data-node-id="9:1100">
              <p className="leading-[20px] whitespace-pre">Approval v2</p>
            </div>
          </div>
          <div className="content-stretch flex gap-[8px] items-start relative shrink-0" data-name="actions" data-node-id="9:1103">
            <button 
              onClick={() => navigate('/')}
              className="bg-gradient-to-b box-border content-stretch flex from-[#ffffff] gap-[8px] h-[32px] items-center justify-center px-[12px] py-0 relative rounded-[8px] shrink-0 to-[#fafafa] hover:bg-[#f0f0f0] transition-colors"
              data-name="Button" data-node-id="9:1104"
            >
              <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-nowrap text-zinc-900" data-node-id="9:2751">
                <p className="leading-[20px] whitespace-pre">Discard</p>
              </div>
            </button>
            <button 
              onClick={() => navigate('/')}
              className="bg-gradient-to-b box-border content-stretch flex from-[#009689] gap-[8px] h-[32px] items-center justify-center px-[12px] py-0 relative rounded-[8px] shrink-0 to-[#008a7f] hover:from-[#008a7f] hover:to-[#007d73] transition-colors"
              data-name="Button" data-node-id="9:1105"
            >
              <div className="flex flex-col font-['Inter:Medium',_sans-serif] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-nowrap text-white" data-node-id="1:2319">
                <p className="leading-[20px] whitespace-pre">Save workflow</p>
              </div>
            </button>
          </div>
        </div>
        <div aria-hidden="true" className="absolute border-[#e9e9ec] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      </div>
    </div>
  )
}

export default ApprovalsBuilderV2