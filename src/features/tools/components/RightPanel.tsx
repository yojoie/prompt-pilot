// 右侧面板
import { mockTools } from '../data/mockTools'

export function RightPanel() {
  const favoriteTools = mockTools.filter((tool) => tool.isFavorite)
  const recentTools = mockTools.slice(0, 3)

  return (
    <aside className="right-panel">
      <section className="side-card">
        <h2 className="section-title">我的收藏</h2>

        <div className="mini-list">
          {favoriteTools.map((tool) => (
            <div key={tool.id} className="mini-item">
              <span>{tool.name}</span>
              <small>{tool.category}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="side-card">
        <h2 className="section-title">最近使用</h2>

        <div className="mini-list">
          {recentTools.map((tool) => (
            <div key={tool.id} className="mini-item">
              <span>{tool.name}</span>
              <small>{tool.badge}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="side-card">
        <h2 className="section-title">数据统计</h2>

        <div className="stats-grid">
          <div className="stat-item">
            <strong>6</strong>
            <span>工具总数</span>
          </div>

          <div className="stat-item">
            <strong>3</strong>
            <span>收藏工具</span>
          </div>

          <div className="stat-item">
            <strong>7</strong>
            <span>分类数量</span>
          </div>

          <div className="stat-item">
            <strong>12</strong>
            <span>Prompt 模板</span>
          </div>
        </div>
      </section>
    </aside>
  )
}