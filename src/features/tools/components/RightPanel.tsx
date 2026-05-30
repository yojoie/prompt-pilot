// 右侧面板
import type { Tool } from '../data/mockTools'
import {
  getPromptFavoriteId,
  type FavoriteWorkflow,
  type RecentItem,
} from '../store/toolsStore'

interface RightPanelProps {
  favoritePromptIds: string[]
  favoriteWorkflows: FavoriteWorkflow[]
  recentItems: RecentItem[]
  tools: Tool[]
  onToolSelect: (toolId: string) => void
  onWorkflowSelect: (toolIds: string[]) => void
}

function getRecentTypeLabel(type: RecentItem['type']) {
  if (type === 'prompt-copied') {
    return '复制 Prompt'
  }

  if (type === 'template-edited') {
    return '编辑模板'
  }

  return '打开工具'
}

export function RightPanel({
  favoritePromptIds,
  favoriteWorkflows,
  recentItems,
  tools,
  onToolSelect,
  onWorkflowSelect,
}: RightPanelProps) {
  const favoriteTools = tools.filter((tool) => tool.isFavorite)
  const favoritePrompts = tools.flatMap((tool) =>
    tool.promptTemplates
      .filter((template) =>
        favoritePromptIds.includes(getPromptFavoriteId(tool.id, template.id)),
      )
      .map((template) => ({
        id: getPromptFavoriteId(tool.id, template.id),
        template,
        tool,
      })),
  )
  const promptCount = tools.reduce(
    (total, tool) => total + tool.promptTemplates.length,
    0,
  )
  const totalUseCount = tools.reduce((total, tool) => total + tool.useCount, 0)
  const favoriteCount =
    favoriteTools.length + favoritePrompts.length + favoriteWorkflows.length

  return (
    <aside className="right-panel">
      <section className="side-card">
        <h2 className="section-title">我的收藏</h2>

        <div className="mini-list">
          {favoriteTools.map((tool) => (
            <button
              key={tool.id}
              className="mini-item"
              onClick={() => onToolSelect(tool.id)}
            >
              <span>{tool.name}</span>
              <small>AI 工具 · {tool.category}</small>
            </button>
          ))}
          {favoritePrompts.map(({ id, template, tool }) => (
            <button
              key={id}
              className="mini-item"
              onClick={() => onToolSelect(tool.id)}
            >
              <span>{template.title}</span>
              <small>Prompt 模板 · {tool.name}</small>
            </button>
          ))}
          {favoriteWorkflows.map((workflow) => (
            <button
              key={workflow.id}
              className="mini-item"
              onClick={() => onWorkflowSelect(workflow.toolIds)}
            >
              <span>{workflow.title}</span>
              <small>工作流 · {workflow.toolIds.length} 个工具</small>
            </button>
          ))}
          {favoriteCount === 0 && (
            <div className="mini-empty">还没有收藏工具、Prompt 模板或工作流</div>
          )}
        </div>
      </section>

      <section className="side-card">
        <h2 className="section-title">最近使用</h2>

        <div className="mini-list">
          {recentItems.map((item) => (
            <button
              key={item.id}
              className="mini-item"
              onClick={() => onToolSelect(item.toolId)}
            >
              <span>{item.label}</span>
              <small>
                {getRecentTypeLabel(item.type)} · {item.detail}
              </small>
            </button>
          ))}
          {recentItems.length === 0 && (
            <div className="mini-empty">
              打开工具、复制 Prompt 或编辑模板后会记录在这里
            </div>
          )}
        </div>
      </section>

      <section className="side-card">
        <h2 className="section-title">数据统计</h2>

        <div className="stats-grid">
          <div className="stat-item">
            <strong>{tools.length}</strong>
            <span>工具总数</span>
          </div>

          <div className="stat-item">
            <strong>{favoriteCount}</strong>
            <span>收藏内容</span>
          </div>

          <div className="stat-item">
            <strong>{totalUseCount}</strong>
            <span>使用次数</span>
          </div>

          <div className="stat-item">
            <strong>{promptCount}</strong>
            <span>Prompt 模板</span>
          </div>
        </div>
      </section>
    </aside>
  )
}
