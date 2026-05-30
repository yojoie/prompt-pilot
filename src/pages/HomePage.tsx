// 主页面
import { useMemo, useState } from 'react'
import { CategorySidebar } from '../features/tools/components/CategorySidebar'
import { ToolGrid } from '../features/tools/components/ToolGrid'
import { RightPanel } from '../features/tools/components/RightPanel'
import { ToolDetail } from '../features/tools/components/ToolDetail'
import { ToolAgentPanel } from '../features/tools/components/ToolAgentPanel'
import {
  AddToolModal,
  type AddToolPayload,
} from '../features/tools/components/AddToolModal'
import { categoryOptions } from '../features/tools/data/categoryOptions'
import type { Tool } from '../features/tools/data/mockTools'
import { useDebouncedValue } from '../features/tools/hooks/useDebouncedValue'
import {
  toolsStoreActions,
  useToolsStore,
} from '../features/tools/store/toolsStore'
import { searchTools } from '../features/tools/utils/searchTools'
import logo from '../assets/jellyfish0.png'

type EditableToolFields = Pick<
  Tool,
  'name' | 'category' | 'description' | 'officialUrl' | 'pricing'
>

export function HomePage() {
  const [isDark, setIsDark] = useState(false)
  const { favoritePromptIds, favoriteWorkflows, recentItems, tools } =
    useToolsStore((currentState) => currentState)
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [favoriteOnly, setFavoriteOnly] = useState(false)
  const [isAddToolOpen, setIsAddToolOpen] = useState(false)
  const debouncedSearchQuery = useDebouncedValue(searchQuery)

  const selectedTool = tools.find((tool) => tool.id === selectedToolId)
  const activeCategoryLabel =
    categoryOptions.find((category) => category.id === activeCategory)?.label ??
    '全部'
  const filteredTools = useMemo(
    () =>
      searchTools(tools, {
        categoryId: activeCategory,
        favoriteOnly,
        query: debouncedSearchQuery,
        selectedTags,
      }),
    [activeCategory, debouncedSearchQuery, favoriteOnly, selectedTags, tools],
  )

  const selectTool = (toolId: string) => {
    toolsStoreActions.recordToolOpened(toolId)
    setSelectedToolId(toolId)
  }

  const toggleFavorite = (toolId: string) => {
    toolsStoreActions.toggleFavorite(toolId)
  }

  const deleteTool = (toolId: string) => {
    toolsStoreActions.deleteTool(toolId)
    setSelectedToolId(null)
  }

  const updateTool = (toolId: string, updates: EditableToolFields) => {
    toolsStoreActions.updateTool(toolId, updates)
  }

  const openToolWebsite = (toolId: string) => {
    const tool = tools.find((currentTool) => currentTool.id === toolId)

    if (!tool) {
      return
    }

    toolsStoreActions.recordToolOpened(toolId, true)
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

  const clearFilters = () => {
    setActiveCategory('all')
    setFavoriteOnly(false)
    setSearchQuery('')
    setSelectedTags([])
    setSelectedToolId(null)
  }

  const openWorkflow = (toolIds: string[]) => {
    const firstToolId = toolIds.find((toolId) =>
      tools.some((tool) => tool.id === toolId),
    )

    if (firstToolId) {
      selectTool(firstToolId)
    }
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
    const newToolId = createToolId(payload.name)
    const newTool: Tool = {
      id: newToolId,
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
          id: `${newToolId}-starter`,
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

    toolsStoreActions.addTool(newTool)
    setActiveCategory(payload.group)
    setSearchQuery('')
    setSelectedTags([])
    setFavoriteOnly(false)
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
            placeholder="搜索名称、描述、标签、使用场景、Prompt..."
            onChange={(event) => changeSearchQuery(event.target.value)}
          />
          {searchQuery ? (
            <button onClick={() => changeSearchQuery('')}>清空</button>
          ) : (
            <span>Ctrl K</span>
          )}
        </div>

        <button className="theme-toggle" onClick={() => setIsDark(!isDark)}>
          {isDark ? '亮色模式' : '暗色模式'}
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

        <div className="center-column">
          {selectedTool ? (
            <ToolDetail
              key={selectedTool.id}
              favoritePromptIds={favoritePromptIds}
              tool={selectedTool}
              onBack={() => setSelectedToolId(null)}
              onToggleFavorite={toggleFavorite}
              onTogglePromptFavorite={toolsStoreActions.togglePromptFavorite}
              onDelete={deleteTool}
              onUpdate={updateTool}
              onPromptCopied={toolsStoreActions.recordPromptCopied}
              onTemplateEdited={toolsStoreActions.recordTemplateEdited}
              onOpenTool={openToolWebsite}
            />
          ) : (
            <>
              <ToolAgentPanel
                favoriteWorkflows={favoriteWorkflows}
                tools={tools}
                onToolSelect={selectTool}
                onWorkflowSave={toolsStoreActions.saveWorkflow}
              />
              <ToolGrid
                title={`${activeCategoryLabel}工具`}
                favoriteOnly={favoriteOnly}
                selectedTags={selectedTags}
                searchQuery={debouncedSearchQuery}
                tools={filteredTools}
                onToolSelect={selectTool}
                onFavoriteOnlyChange={setFavoriteOnly}
                onFavoriteToggle={toggleFavorite}
                onOpenTool={openToolWebsite}
                onAddTool={() => setIsAddToolOpen(true)}
                onClearFilters={clearFilters}
              />
            </>
          )}
        </div>

        <RightPanel
          favoritePromptIds={favoritePromptIds}
          favoriteWorkflows={favoriteWorkflows}
          recentItems={recentItems}
          tools={tools}
          onToolSelect={selectTool}
          onWorkflowSelect={openWorkflow}
        />
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
