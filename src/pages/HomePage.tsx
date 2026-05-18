// 主页面
import { useState } from 'react'
import { CategorySidebar } from '../features/tools/components/CategorySidebar'
import { ToolGrid } from '../features/tools/components/ToolGrid'
import { RightPanel } from '../features/tools/components/RightPanel'
import { ToolDetail } from '../features/tools/components/ToolDetail'
import { mockTools, type Tool } from '../features/tools/data/mockTools'
import logo from '../assets/jellyfish0.png'

type EditableToolFields = Pick<
  Tool,
  'name' | 'category' | 'description' | 'officialUrl' | 'pricing'
>

export function HomePage() {
  const [isDark, setIsDark] = useState(false)
  const [tools, setTools] = useState<Tool[]>(mockTools)
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null)

  const selectedTool = tools.find((tool) => tool.id === selectedToolId)

  const toggleFavorite = (toolId: string) => {
    setTools((currentTools) =>
      currentTools.map((tool) =>
        tool.id === toolId
          ? {
            ...tool,
            isFavorite: !tool.isFavorite,
          }
          : tool,
      ),
    )
  }

  const deleteTool = (toolId: string) => {
    setTools((currentTools) => currentTools.filter((tool) => tool.id !== toolId))
    setSelectedToolId(null)
  }

  const updateTool = (toolId: string, updates: EditableToolFields) => {
    setTools((currentTools) =>
      currentTools.map((tool) =>
        tool.id === toolId
          ? {
            ...tool,
            ...updates,
          }
          : tool,
      ),
    )
  }

  const recordToolUse = (toolId: string) => {
    setTools((currentTools) =>
      currentTools.map((tool) =>
        tool.id === toolId
          ? {
            ...tool,
            useCount: tool.useCount + 1,
            lastUsedAt: new Date().toISOString(),
          }
          : tool,
      ),
    )
  }

  const openToolWebsite = (toolId: string) => {
    const tool = tools.find((currentTool) => currentTool.id === toolId)

    if (!tool) {
      return
    }

    recordToolUse(toolId)
    window.open(tool.officialUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className={isDark ? 'app dark' : 'app'}>
      <header className="top-header">
        <div className="brand">
          <div className="brand-logo-wrap">
            <img className="brand-logo-img" src={logo} alt="PromptPilot Logo" />
          </div>
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

        {selectedTool ? (
          <ToolDetail
            key={selectedTool.id}
            tool={selectedTool}
            onBack={() => setSelectedToolId(null)}
            onToggleFavorite={toggleFavorite}
            onDelete={deleteTool}
            onUpdate={updateTool}
            onUseTool={recordToolUse}
            onOpenTool={openToolWebsite}
          />
        ) : (
          <ToolGrid
            tools={tools}
            onToolSelect={setSelectedToolId}
            onFavoriteToggle={toggleFavorite}
            onOpenTool={openToolWebsite}
          />
        )}

        <RightPanel tools={tools} onToolSelect={setSelectedToolId} />
      </main>
    </div>
  )
}
