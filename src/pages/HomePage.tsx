// 主页面
import { useState } from 'react'
import { CategorySidebar } from '../features/tools/components/CategorySidebar'
import { ToolGrid } from '../features/tools/components/ToolGrid'
import { RightPanel } from '../features/tools/components/RightPanel'

export function HomePage() {
  const [isDark, setIsDark] = useState(false)

  return (
    <div className={isDark ? 'app dark' : 'app'}>
      <header className="top-header">
        <div className="brand">
          <div className="brand-logo">P</div>
          <div>
            <h1>PromptPilot</h1>
            <p>AI 工具箱与 Prompt 工作台</p>
          </div>
        </div>

        <div className="search-box">
          <input placeholder="搜索 AI 工具、Prompt 模板、分类..." />
          <span>Ctrl K</span>
        </div>

        <button className="theme-toggle" onClick={() => setIsDark(!isDark)}>
          {isDark ? '☀️ 亮色模式' : '🌙 暗色模式'}
        </button>
      </header>

      <main className="workspace">
        <CategorySidebar />

        <ToolGrid />

        <RightPanel />
      </main>
    </div>
  )
}