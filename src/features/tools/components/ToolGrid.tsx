// 工具卡片墙
import type { Tool } from '../data/mockTools'
import { ToolCard } from './ToolCard'

interface ToolGridProps {
  tools: Tool[]
  onToolSelect: (toolId: string) => void
  onFavoriteToggle: (toolId: string) => void
  onOpenTool: (toolId: string) => void
}

export function ToolGrid({
  tools,
  onToolSelect,
  onFavoriteToggle,
  onOpenTool,
}: ToolGridProps) {
  return (
    <section className="tool-section">
      <div className="section-header">
        <div>
          <h2>AI 工具卡片墙</h2>
          <p>集中管理常用 AI 工具，快速找到适合当前任务的工具。</p>
        </div>

        <button className="primary-button">+ 添加工具</button>
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
          <strong>暂无工具</strong>
          <span>可以从“添加工具”开始维护你的 AI 工具库。</span>
        </div>
      )}
    </section>
  )
}
