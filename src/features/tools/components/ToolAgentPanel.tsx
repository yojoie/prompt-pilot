import { useMemo, useState } from 'react'
import type { Tool } from '../data/mockTools'
import type { FavoriteWorkflow } from '../store/toolsStore'
import { searchTools } from '../utils/searchTools'

interface ToolAgentPanelProps {
  tools: Tool[]
  favoriteWorkflows: FavoriteWorkflow[]
  onToolSelect: (toolId: string) => void
  onWorkflowSave: (workflow: FavoriteWorkflow) => void
}

function hashValue(value: string) {
  let hash = 0

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index)
    hash |= 0
  }

  return Math.abs(hash).toString(36)
}

function createWorkflow(goal: string, tools: Tool[]): FavoriteWorkflow | null {
  const trimmedGoal = goal.trim()

  if (!trimmedGoal) {
    return null
  }

  const recommendedTools = searchTools(tools, {
    categoryId: 'all',
    favoriteOnly: false,
    query: trimmedGoal,
    selectedTags: [],
  }).slice(0, 3)
  const toolChain = recommendedTools.length > 0 ? recommendedTools : tools.slice(0, 3)
  const toolNames = toolChain.map((tool) => tool.name)

  return {
    id: `agent-${hashValue(`${trimmedGoal}:${toolNames.join('|')}`)}`,
    title: `${trimmedGoal.slice(0, 18)}工具链`,
    goal: trimmedGoal,
    toolIds: toolChain.map((tool) => tool.id),
    prompt: `我的目标是：${trimmedGoal}\n\n请基于这个目标拆解任务，推荐最合适的 AI 工具链、每一步要输入的 Prompt、需要人工检查的风险点，并给出最终交付物格式。`,
    steps: toolChain.map((tool, index) => {
      if (index === 0) {
        return `先用 ${tool.name} 明确任务边界，生成结构化计划和第一版 Prompt。`
      }

      if (index === toolChain.length - 1) {
        return `最后用 ${tool.name} 做结果完善、校对和交付格式整理。`
      }

      return `再用 ${tool.name} 处理核心内容，补充 ${tool.tags.slice(0, 2).join('、')} 能力。`
    }),
    createdAt: new Date().toISOString(),
  }
}

export function ToolAgentPanel({
  tools,
  favoriteWorkflows,
  onToolSelect,
  onWorkflowSave,
}: ToolAgentPanelProps) {
  const [goal, setGoal] = useState('')
  const [submittedGoal, setSubmittedGoal] = useState('')
  const workflow = useMemo(
    () => createWorkflow(submittedGoal, tools),
    [submittedGoal, tools],
  )
  const isWorkflowSaved = workflow
    ? favoriteWorkflows.some((currentWorkflow) => currentWorkflow.id === workflow.id)
    : false

  const generateWorkflow = () => {
    setSubmittedGoal(goal)
  }

  return (
    <section className="tool-agent-panel">
      <div className="agent-input-area">
        <div>
          <span className="agent-eyebrow">AI Tool Agent</span>
          <h2>输入目标，生成工具链</h2>
        </div>

        <div className="agent-compose">
          <textarea
            value={goal}
            placeholder="例如：做一个 React 组件，生成代码、测试用例和提交说明"
            onChange={(event) => setGoal(event.target.value)}
          />
          <button
            className="primary-button"
            onClick={generateWorkflow}
            disabled={!goal.trim()}
          >
            生成工具链
          </button>
        </div>
      </div>

      {workflow && (
        <div className="agent-result">
          <div className="agent-result-header">
            <div>
              <h3>{workflow.title}</h3>
              <span>{workflow.toolIds.length} 个工具 · Prompt · 执行步骤</span>
            </div>
            <button
              className={isWorkflowSaved ? 'ghost-button success-button' : 'ghost-button'}
              onClick={() => onWorkflowSave(workflow)}
            >
              {isWorkflowSaved ? '已收藏工作流' : '收藏工作流'}
            </button>
          </div>

          <div className="agent-tool-chain">
            {workflow.toolIds.map((toolId, index) => {
              const tool = tools.find((currentTool) => currentTool.id === toolId)

              if (!tool) {
                return null
              }

              return (
                <button
                  key={tool.id}
                  className="agent-tool-pill"
                  onClick={() => onToolSelect(tool.id)}
                >
                  <span>{index + 1}</span>
                  {tool.name}
                </button>
              )
            })}
          </div>

          <pre className="agent-prompt">{workflow.prompt}</pre>

          <ol className="agent-step-list">
            {workflow.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </section>
  )
}
