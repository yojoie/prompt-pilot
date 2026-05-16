// 工具卡片墙
import { mockTools } from '../data/mockTools'
import { ToolCard } from './ToolCard'

export function ToolGrid() {
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
        {mockTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  )
}