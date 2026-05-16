// 工具卡片组件
import type { Tool } from '../data/mockTools'

interface ToolCardProps {
  tool: Tool
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <article className="tool-card">
      <div className="tool-card-header">
        <div>
          <h3>{tool.name}</h3>
          <span className="tool-category">{tool.category}</span>
        </div>

        <button className={tool.isFavorite ? 'favorite active' : 'favorite'}>
          {tool.isFavorite ? '★' : '☆'}
        </button>
      </div>

      <p className="tool-description">{tool.description}</p>

      <div className="tool-tags">
        {tool.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>

      <div className="tool-card-footer">
        <span>{tool.badge}</span>
        <button>查看详情</button>
      </div>
    </article>
  )
}