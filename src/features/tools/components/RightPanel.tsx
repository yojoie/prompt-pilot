// 右侧面板
import type { Tool } from '../data/mockTools'

interface RightPanelProps {
  tools: Tool[]
  onToolSelect: (toolId: string) => void
}

export function RightPanel({ tools, onToolSelect }: RightPanelProps) {
  const favoriteTools = tools.filter((tool) => tool.isFavorite)
  const recentTools = tools
    .filter((tool) => tool.lastUsedAt)
    .sort(
      (firstTool, secondTool) =>
        new Date(secondTool.lastUsedAt ?? 0).getTime() -
        new Date(firstTool.lastUsedAt ?? 0).getTime(),
    )
    .slice(0, 3)
  const promptCount = tools.reduce(
    (total, tool) => total + tool.promptTemplates.length,
    0,
  )
  const totalUseCount = tools.reduce((total, tool) => total + tool.useCount, 0)

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
              <small>{tool.category}</small>
            </button>
          ))}
          {favoriteTools.length === 0 && (
            <div className="mini-empty">还没有收藏工具</div>
          )}
        </div>
      </section>

      <section className="side-card">
        <h2 className="section-title">最近使用</h2>

        <div className="mini-list">
          {recentTools.map((tool) => (
            <button
              key={tool.id}
              className="mini-item"
              onClick={() => onToolSelect(tool.id)}
            >
              <span>{tool.name}</span>
              <small>使用 {tool.useCount} 次</small>
            </button>
          ))}
          {recentTools.length === 0 && (
            <div className="mini-empty">复制 Prompt 或打开官网后会记录在这里</div>
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
            <strong>{favoriteTools.length}</strong>
            <span>收藏工具</span>
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
