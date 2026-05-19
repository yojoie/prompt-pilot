// 工具卡片墙
import type { Tool } from '../data/mockTools'
import { ToolCard } from './ToolCard'

interface ToolGridProps {
  title: string
  selectedTags: string[]
  searchQuery: string
  tools: Tool[]
  onToolSelect: (toolId: string) => void
  onFavoriteToggle: (toolId: string) => void
  onOpenTool: (toolId: string) => void
  onAddTool: () => void
}

export function ToolGrid({
  title,
  selectedTags,
  searchQuery,
  tools,
  onToolSelect,
  onFavoriteToggle,
  onOpenTool,
  onAddTool,
}: ToolGridProps) {
  return (
    <section className="tool-section">
      <div className="section-header">
        <div>
          <h2>{title}</h2>
          <p>
            {searchQuery.trim()
              ? `搜索“${searchQuery.trim()}”，找到 ${tools.length} 个匹配工具。`
              : selectedTags.length > 0
              ? `已按 ${selectedTags.join('、')} 筛出 ${tools.length} 个匹配工具。`
              : '按功能筛选 AI 工具，快速找到适合当前任务的入口。'}
          </p>
        </div>

        <button className="primary-button" onClick={onAddTool}>
          + 添加工具
        </button>
      </div>

      <div className="tool-grid">
        {tools.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            onSelect={onToolSelect}
            onFavoriteToggle={onFavoriteToggle}
            onOpenTool={onOpenTool}
          />
        ))}
      </div>

      {tools.length === 0 && (
        <div className="empty-state">
          <strong>没有找到匹配工具</strong>
          <span>换一个关键词，或减少已选择的标签再试试。</span>
        </div>
      )}
    </section>
  )
}
