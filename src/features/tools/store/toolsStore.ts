import { useSyncExternalStore } from 'react'
import { mockTools, type PromptTemplate, type Tool } from '../data/mockTools'

export type RecentItemType = 'tool-opened' | 'prompt-copied' | 'template-edited'

export interface RecentItem {
  id: string
  type: RecentItemType
  toolId: string
  toolName: string
  templateId?: string
  templateTitle?: string
  label: string
  detail: string
  timestamp: string
}

export interface FavoriteWorkflow {
  id: string
  title: string
  goal: string
  toolIds: string[]
  prompt: string
  steps: string[]
  createdAt: string
}

export interface ToolsState {
  tools: Tool[]
  favoritePromptIds: string[]
  favoriteWorkflows: FavoriteWorkflow[]
  recentItems: RecentItem[]
}

type PersistedToolsState = Partial<ToolsState> & {
  version?: number
}

const STORE_KEY = 'prompt-pilot.tools-store.v1'
const RECENT_LIMIT = 8

export const getPromptFavoriteId = (toolId: string, templateId: string) =>
  `${toolId}:${templateId}`

function canUseStorage() {
  return typeof window !== 'undefined' && Boolean(window.localStorage)
}

function readPersistedState(): PersistedToolsState | null {
  if (!canUseStorage()) {
    return null
  }

  try {
    const rawState = window.localStorage.getItem(STORE_KEY)
    return rawState ? JSON.parse(rawState) : null
  } catch {
    return null
  }
}

function mergeTools(savedTools: Tool[] | undefined) {
  if (!savedTools?.length) {
    return mockTools
  }

  const seedToolsById = new Map(mockTools.map((tool) => [tool.id, tool]))
  const savedToolIds = new Set(savedTools.map((tool) => tool.id))
  const restoredTools = savedTools.map((tool) => {
    const seedTool = seedToolsById.get(tool.id)
    return seedTool ? { ...seedTool, ...tool } : tool
  })
  const newSeedTools = mockTools.filter((tool) => !savedToolIds.has(tool.id))

  return [...restoredTools, ...newSeedTools]
}

function createInitialState(): ToolsState {
  const persistedState = readPersistedState()

  return {
    tools: mergeTools(persistedState?.tools),
    favoritePromptIds: persistedState?.favoritePromptIds ?? [],
    favoriteWorkflows: persistedState?.favoriteWorkflows ?? [],
    recentItems: persistedState?.recentItems ?? [],
  }
}

function persistState(nextState: ToolsState) {
  if (!canUseStorage()) {
    return
  }

  window.localStorage.setItem(
    STORE_KEY,
    JSON.stringify({
      version: 1,
      tools: nextState.tools,
      favoritePromptIds: nextState.favoritePromptIds,
      favoriteWorkflows: nextState.favoriteWorkflows,
      recentItems: nextState.recentItems,
    }),
  )
}

let state = createInitialState()
const listeners = new Set<() => void>()

function emitChange(nextState: ToolsState) {
  state = nextState
  persistState(state)
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return state
}

function updateTools(
  updater: (currentTools: Tool[], currentState: ToolsState) => Tool[],
) {
  emitChange({
    ...state,
    tools: updater(state.tools, state),
  })
}

function getTool(toolId: string, tools = state.tools) {
  return tools.find((tool) => tool.id === toolId)
}

function createRecentItem(
  type: RecentItemType,
  tool: Tool,
  template?: PromptTemplate,
): RecentItem {
  const timestamp = new Date().toISOString()

  if (type === 'prompt-copied' && template) {
    return {
      id: `prompt-copied:${tool.id}:${template.id}`,
      type,
      toolId: tool.id,
      toolName: tool.name,
      templateId: template.id,
      templateTitle: template.title,
      label: template.title,
      detail: `复制自 ${tool.name}`,
      timestamp,
    }
  }

  if (type === 'template-edited' && template) {
    return {
      id: `template-edited:${tool.id}:${template.id}`,
      type,
      toolId: tool.id,
      toolName: tool.name,
      templateId: template.id,
      templateTitle: template.title,
      label: template.title,
      detail: `编辑了 ${tool.name} 模板`,
      timestamp,
    }
  }

  return {
    id: `tool-opened:${tool.id}`,
    type: 'tool-opened',
    toolId: tool.id,
    toolName: tool.name,
    label: tool.name,
    detail: '最近打开的工具',
    timestamp,
  }
}

function upsertRecentItem(
  recentItems: RecentItem[],
  nextItem: RecentItem,
) {
  return [
    nextItem,
    ...recentItems.filter((item) => item.id !== nextItem.id),
  ].slice(0, RECENT_LIMIT)
}

function removeToolReferences(currentState: ToolsState, toolId: string) {
  return {
    favoritePromptIds: currentState.favoritePromptIds.filter(
      (favoriteId) => !favoriteId.startsWith(`${toolId}:`),
    ),
    favoriteWorkflows: currentState.favoriteWorkflows.filter(
      (workflow) => !workflow.toolIds.includes(toolId),
    ),
    recentItems: currentState.recentItems.filter(
      (recentItem) => recentItem.toolId !== toolId,
    ),
  }
}

export const toolsStoreActions = {
  addTool(tool: Tool) {
    updateTools((currentTools) => [tool, ...currentTools])
  },

  deleteTool(toolId: string) {
    const references = removeToolReferences(state, toolId)

    emitChange({
      ...state,
      ...references,
      tools: state.tools.filter((tool) => tool.id !== toolId),
    })
  },

  updateTool(
    toolId: string,
    updates: Pick<
      Tool,
      'name' | 'category' | 'description' | 'officialUrl' | 'pricing'
    >,
  ) {
    updateTools((currentTools) =>
      currentTools.map((tool) =>
        tool.id === toolId
          ? {
              ...tool,
              ...updates,
            }
          : tool,
      ),
    )
  },

  toggleFavorite(toolId: string) {
    updateTools((currentTools) =>
      currentTools.map((tool) =>
        tool.id === toolId
          ? {
              ...tool,
              isFavorite: !tool.isFavorite,
            }
          : tool,
      ),
    )
  },

  togglePromptFavorite(toolId: string, template: PromptTemplate) {
    const favoriteId = getPromptFavoriteId(toolId, template.id)
    const favoritePromptIds = state.favoritePromptIds.includes(favoriteId)
      ? state.favoritePromptIds.filter((currentId) => currentId !== favoriteId)
      : [favoriteId, ...state.favoritePromptIds]

    emitChange({
      ...state,
      favoritePromptIds,
    })
  },

  saveWorkflow(workflow: FavoriteWorkflow) {
    emitChange({
      ...state,
      favoriteWorkflows: [
        workflow,
        ...state.favoriteWorkflows.filter(
          (currentWorkflow) => currentWorkflow.id !== workflow.id,
        ),
      ],
    })
  },

  removeWorkflow(workflowId: string) {
    emitChange({
      ...state,
      favoriteWorkflows: state.favoriteWorkflows.filter(
        (workflow) => workflow.id !== workflowId,
      ),
    })
  },

  recordToolOpened(toolId: string, shouldIncreaseUseCount = false) {
    const openedAt = new Date().toISOString()
    const tool = getTool(toolId)

    if (!tool) {
      return
    }

    emitChange({
      ...state,
      tools: state.tools.map((currentTool) =>
        currentTool.id === toolId
          ? {
              ...currentTool,
              useCount: shouldIncreaseUseCount
                ? currentTool.useCount + 1
                : currentTool.useCount,
              lastUsedAt: openedAt,
            }
          : currentTool,
      ),
      recentItems: upsertRecentItem(
        state.recentItems,
        createRecentItem('tool-opened', tool),
      ),
    })
  },

  recordPromptCopied(toolId: string, template: PromptTemplate) {
    const copiedAt = new Date().toISOString()
    const tool = getTool(toolId)

    if (!tool) {
      return
    }

    emitChange({
      ...state,
      tools: state.tools.map((currentTool) =>
        currentTool.id === toolId
          ? {
              ...currentTool,
              useCount: currentTool.useCount + 1,
              lastUsedAt: copiedAt,
            }
          : currentTool,
      ),
      recentItems: upsertRecentItem(
        state.recentItems,
        createRecentItem('prompt-copied', tool, template),
      ),
    })
  },

  recordTemplateEdited(toolId: string, template: PromptTemplate) {
    const tool = getTool(toolId)

    if (!tool) {
      return
    }

    emitChange({
      ...state,
      recentItems: upsertRecentItem(
        state.recentItems,
        createRecentItem('template-edited', tool, template),
      ),
    })
  },

  clearRecents() {
    emitChange({
      ...state,
      recentItems: [],
    })
  },
}

export function useToolsStore<T>(selector: (currentState: ToolsState) => T) {
  return useSyncExternalStore(
    subscribe,
    () => selector(getSnapshot()),
    () => selector(state),
  )
}
