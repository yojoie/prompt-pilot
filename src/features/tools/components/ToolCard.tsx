// 工具卡片组件
import type { KeyboardEvent, MouseEvent } from 'react'
import type { Tool } from '../data/mockTools'

interface ToolCardProps {
  tool: Tool
  onSelect: (toolId: string) => void
  onFavoriteToggle: (toolId: string) => void
  onOpenTool: (toolId: string) => void
}

export function ToolCard({
  tool,
  onSelect,
  onFavoriteToggle,
  onOpenTool,
}: ToolCardProps) {
  const openDetail = () => {
    onSelect(tool.id)
  }

  const handleFavoriteClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    onFavoriteToggle(tool.id)
  }

  const handleDetailClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    openDetail()
  }

  const handleOpenToolClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    onOpenTool(tool.id)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openDetail()
    }
  }

  return (
    <article
      className="tool-card"
      role="button"
      tabIndex={0}
      onClick={openDetail}
      onKeyDown={handleKeyDown}
    >
      <div className="tool-card-header">
        <div className="tool-title-row">
          <div className="tool-logo-shell">
            <span>{tool.name.slice(0, 1)}</span>
            <img
              src={tool.logoUrl}
              alt={`${tool.name} logo`}
              onError={(event) => {
                event.currentTarget.style.display = 'none'
              }}
            />
          </div>
          <div>
            <h3>{tool.name}</h3>
            <span className="tool-category">{tool.category}</span>
          </div>
        </div>

        <button
          className={tool.isFavorite ? 'favorite active' : 'favorite'}
          onClick={handleFavoriteClick}
          aria-label={tool.isFavorite ? '取消收藏' : '收藏'}
        >
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
        <span>{tool.useCount} 次使用</span>
        <div className="tool-card-actions">
          <button onClick={handleOpenToolClick}>打开官网</button>
          <button onClick={handleDetailClick}>查看详情</button>
        </div>
      </div>
    </article>
  )
}
