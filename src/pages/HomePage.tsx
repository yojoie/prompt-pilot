// 主页面
import { useState } from 'react'
import { CategorySidebar } from '../features/tools/components/CategorySidebar'
import { ToolGrid } from '../features/tools/components/ToolGrid'
import { RightPanel } from '../features/tools/components/RightPanel'
import { ToolDetail } from '../features/tools/components/ToolDetail'
import {
  AddToolModal,
  type AddToolPayload,
} from '../features/tools/components/AddToolModal'
import { categoryOptions } from '../features/tools/data/categoryOptions'
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
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isAddToolOpen, setIsAddToolOpen] = useState(false)

  const selectedTool = tools.find((tool) => tool.id === selectedToolId)
  const activeCategoryLabel =
    categoryOptions.find((category) => category.id === activeCategory)?.label ??
    '全部'
  const searchTerms = searchQuery
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
  const categoryFilteredTools =
    activeCategory === 'all'
      ? tools
      : tools.filter((tool) => tool.group === activeCategory)
  const getTagMatchCount = (tool: Tool) => {
    const searchableTags = [
      ...tool.tags,
      ...tool.capabilities,
      tool.category,
      tool.badge,
    ]

    return selectedTags.filter((tag) =>
      searchableTags.some((searchableTag) => searchableTag.includes(tag)),
    ).length
  }
  const matchesSearch = (tool: Tool) => {
    if (searchTerms.length === 0) {
      return true
    }

    const searchableText = [
      tool.name,
      tool.logoText,
      tool.category,
      tool.description,
      tool.badge,
      ...tool.tags,
      ...tool.capabilities,
      ...tool.useCases,
      ...tool.promptTemplates.flatMap((template) => [
        template.title,
        template.description,
        ...template.variables.map((variable) => variable.label),
      ]),
    ]
      .join(' ')
      .toLowerCase()

    return searchTerms.every((term) => searchableText.includes(term))
  }
  const tagFilteredTools =
    selectedTags.length === 0
      ? categoryFilteredTools
      : categoryFilteredTools
        .map((tool) => ({
          tool,
          matchCount: getTagMatchCount(tool),
        }))
        .filter(({ matchCount }) => matchCount > 0)
        .sort((firstTool, secondTool) => secondTool.matchCount - firstTool.matchCount)
        .map(({ tool }) => tool)
  const filteredTools = tagFilteredTools.filter(matchesSearch)

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

  const changeCategory = (categoryId: string) => {
    setActiveCategory(categoryId)
    setSelectedToolId(null)
  }

  const toggleTag = (tag: string) => {
    setSelectedTags((currentTags) =>
      currentTags.includes(tag)
        ? currentTags.filter((currentTag) => currentTag !== tag)
        : [...currentTags, tag],
    )
    setSelectedToolId(null)
  }

  const changeSearchQuery = (value: string) => {
    setSearchQuery(value)
    setSelectedToolId(null)
  }

  const createToolId = (name: string) => {
    const baseId = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    const safeBaseId = baseId || `custom-${Date.now()}`
    const existingIds = new Set(tools.map((tool) => tool.id))
    let nextId = safeBaseId
    let index = 2

    while (existingIds.has(nextId)) {
      nextId = `${safeBaseId}-${index}`
      index += 1
    }

    return nextId
  }

  const createLogoText = (name: string) => {
    const trimmedName = name.trim()
    const englishParts = trimmedName.match(/[a-z0-9]+/gi)

    if (englishParts) {
      return englishParts
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase()
    }

    return trimmedName.slice(0, 2)
  }

  const getLogoTone = (group: string) => {
    const tones: Record<string, string> = {
      common: '#6574cd',
      writing: '#b7799b',
      document: '#4f9f9a',
      search: '#4b97b8',
      study: '#6d9f71',
      academic: '#9270c8',
      slides: '#b78352',
      media: '#c47b63',
      dev: '#667085',
    }

    return tones[group] ?? '#64748b'
  }

  const normalizeUrl = (url: string) => {
    if (/^https?:\/\//i.test(url)) {
      return url
    }

    return `https://${url}`
  }

  const createLogoUrl = (url: string) => {
    try {
      const parsedUrl = new URL(normalizeUrl(url))
      return `${parsedUrl.origin}/favicon.ico`
    } catch {
      return ''
    }
  }

  const addTool = (payload: AddToolPayload) => {
    const normalizedUrl = normalizeUrl(payload.officialUrl)
    const groupOption = categoryOptions.find(
      (category) => category.id === payload.group,
    )
    const newTool: Tool = {
      id: createToolId(payload.name),
      name: payload.name,
      category: groupOption?.label ?? '常用',
      group: payload.group,
      description: payload.description,
      tags: payload.tags.length > 0 ? payload.tags : [groupOption?.label ?? '工具'],
      badge: payload.badge,
      isFavorite: false,
      logoUrl: createLogoUrl(normalizedUrl),
      logoText: createLogoText(payload.name),
      logoTone: getLogoTone(payload.group),
      officialUrl: normalizedUrl,
      pricing: payload.pricing,
      useCount: 0,
      capabilities:
        payload.capabilities.length > 0 ? payload.capabilities : ['文本'],
      useCases: [
        `用于${groupOption?.label ?? 'AI'}相关任务的快速处理和资料整理`,
        '沉淀常用 Prompt，并在需要时快速打开官网使用',
      ],
      pros: ['可按自己的工作流维护', '已接入收藏、最近使用和 Prompt 模板'],
      cons: ['详情内容为初始版本，建议后续按真实体验继续补充'],
      promptTemplates: [
        {
          id: `${createToolId(payload.name)}-starter`,
          title: '通用任务 Prompt',
          description: `为 ${payload.name} 准备一段可直接使用的任务指令。`,
          content:
            '请使用{{tool_name}}帮我完成以下任务：{{task_goal}}。\n\n背景资料：\n{{context}}\n\n输出要求：\n{{output_requirements}}',
          variables: [
            {
              id: 'tool_name',
              label: '工具名称',
              placeholder: payload.name,
              defaultValue: payload.name,
            },
            {
              id: 'task_goal',
              label: '任务目标',
              placeholder: '例如：总结文档、润色简历、生成 PPT 大纲',
              multiline: true,
            },
            {
              id: 'context',
              label: '背景资料',
              placeholder: '补充要处理的文本、链接或说明',
              multiline: true,
            },
            {
              id: 'output_requirements',
              label: '输出要求',
              placeholder: '例如：分点输出、控制字数、包含表格',
              multiline: true,
            },
          ],
        },
      ],
    }

    setTools((currentTools) => [newTool, ...currentTools])
    setActiveCategory(payload.group)
    setSearchQuery('')
    setSelectedTags([])
    setSelectedToolId(newTool.id)
    setIsAddToolOpen(false)
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
          <input
            value={searchQuery}
            placeholder="搜索 AI 工具、Prompt 模板、分类..."
            onChange={(event) => changeSearchQuery(event.target.value)}
          />
          {searchQuery ? (
            <button onClick={() => changeSearchQuery('')}>清空</button>
          ) : (
            <span>Ctrl K</span>
          )}
        </div>

        <button className="theme-toggle" onClick={() => setIsDark(!isDark)}>
          {isDark ? '☀️ 亮色模式' : '🌙 暗色模式'}
        </button>
      </header>

      <main className="workspace">
        <CategorySidebar
          activeCategory={activeCategory}
          selectedTags={selectedTags}
          onCategoryChange={changeCategory}
          onTagToggle={toggleTag}
          onClearTags={() => setSelectedTags([])}
        />

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
            title={`${activeCategoryLabel}工具`}
            selectedTags={selectedTags}
            searchQuery={searchQuery}
            tools={filteredTools}
            onToolSelect={setSelectedToolId}
            onFavoriteToggle={toggleFavorite}
            onOpenTool={openToolWebsite}
            onAddTool={() => setIsAddToolOpen(true)}
          />
        )}

        <RightPanel tools={tools} onToolSelect={setSelectedToolId} />
      </main>

      {isAddToolOpen && (
        <AddToolModal
          initialGroup={activeCategory}
          onClose={() => setIsAddToolOpen(false)}
          onCreate={addTool}
        />
      )}
    </div>
  )
}
