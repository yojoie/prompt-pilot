// 工具卡片墙
import type { Tool } from '../data/mockTools'
import { ToolCard } from './ToolCard'

interface ToolGridProps {
  favoriteOnly: boolean
  selectedTags: string[]
  searchQuery: string
  title: string
  tools: Tool[]
  onToolSelect: (toolId: string) => void
  onFavoriteOnlyChange: (favoriteOnly: boolean) => void
  onFavoriteToggle: (toolId: string) => void
  onOpenTool: (toolId: string) => void
  onAddTool: () => void
  onClearFilters: () => void
}

export function ToolGrid({
  favoriteOnly,
  selectedTags,
  searchQuery,
  title,
  tools,
  onToolSelect,
  onFavoriteOnlyChange,
  onFavoriteToggle,
  onOpenTool,
  onAddTool,
  onClearFilters,
}: ToolGridProps) {
  const hasActiveFilters =
    favoriteOnly || selectedTags.length > 0 || searchQuery.trim().length > 0

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
                : favoriteOnly
                  ? `当前只展示 ${tools.length} 个收藏工具。`
                  : '按功能筛选 AI 工具，快速找到适合当前任务的入口。'}
          </p>
        </div>

        <button className="primary-button" onClick={onAddTool}>
          + 添加工具
        </button>
      </div>

      <div className="tool-filter-row">
        <div className="segmented-filter" aria-label="收藏筛选">
          <button
            className={!favoriteOnly ? 'active' : undefined}
            onClick={() => onFavoriteOnlyChange(false)}
          >
            全部
          </button>
          <button
            className={favoriteOnly ? 'active' : undefined}
            onClick={() => onFavoriteOnlyChange(true)}
          >
            收藏
          </button>
        </div>

        {hasActiveFilters && (
          <button className="clear-filter-button" onClick={onClearFilters}>
            清空筛选
          </button>
        )}
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
          <strong>{favoriteOnly ? '没有符合条件的收藏' : '没有找到匹配工具'}</strong>
          <span>换一个关键词，或清空分类、标签和收藏筛选后再试。</span>
          {hasActiveFilters && (
            <button className="ghost-button" onClick={onClearFilters}>
              清空筛选
            </button>
          )}
        </div>
      )}
    </section>
  )
}
