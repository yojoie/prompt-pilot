import type { Tool } from '../data/mockTools'

export interface SearchFilters {
  categoryId: string
  favoriteOnly: boolean
  query: string
  selectedTags: string[]
}

const searchAliases: Record<string, string[]> = {
  代码: ['编程', '开发', '组件', 'React', 'IDE', '重构', 'Copilot'],
  编程: ['代码', '开发', '组件', 'React', 'IDE', 'Copilot'],
  ppt: ['PPT', '幻灯片', '演示', '展示'],
  简历: ['求职', '润色', '写作'],
  论文: ['学术', '研究', '引用', '证据'],
  文档: ['PDF', '资料', '总结', '文件分析'],
}

function normalizeText(value: string) {
  return value.trim().toLowerCase()
}

function splitQuery(query: string) {
  return normalizeText(query)
    .split(/[\s,，、。；;：:/.]+/)
    .filter(Boolean)
}

function expandTerm(term: string) {
  const aliases = searchAliases[term] ?? searchAliases[term.toLowerCase()] ?? []
  return [term, ...aliases.map(normalizeText)]
}

function fuzzyScore(value: string, term: string) {
  const normalizedValue = normalizeText(value)
  const normalizedTerm = normalizeText(term)

  if (!normalizedTerm) {
    return 0
  }

  const exactIndex = normalizedValue.indexOf(normalizedTerm)

  if (exactIndex >= 0) {
    return 80 - Math.min(exactIndex, 40)
  }

  let termIndex = 0
  let streak = 0
  let score = 0

  for (const character of normalizedValue) {
    if (character === normalizedTerm[termIndex]) {
      termIndex += 1
      streak += 1
      score += 8 + streak * 2

      if (termIndex === normalizedTerm.length) {
        return Math.max(16, score)
      }
    } else {
      streak = 0
    }
  }

  return 0
}

function getFieldScore(value: string | string[], term: string, weight: number) {
  const fieldValue = Array.isArray(value) ? value.join(' ') : value
  const scores = expandTerm(term).map((expandedTerm) =>
    fuzzyScore(fieldValue, expandedTerm),
  )

  return Math.max(...scores) * weight
}

function getTagMatchCount(tool: Tool, selectedTags: string[]) {
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

function matchesSelectedTags(tool: Tool, selectedTags: string[]) {
  if (selectedTags.length === 0) {
    return true
  }

  return getTagMatchCount(tool, selectedTags) > 0
}

function scoreTool(tool: Tool, query: string) {
  const terms = splitQuery(query)

  if (terms.length === 0) {
    return 0
  }

  const promptText = tool.promptTemplates
    .flatMap((template) => [
      template.title,
      template.description,
      template.content,
      ...template.variables.map((variable) => variable.label),
    ])
    .join(' ')

  const fieldScores = terms.map((term) => {
    const score =
      getFieldScore(tool.name, term, 9) +
      getFieldScore(tool.description, term, 5) +
      getFieldScore(tool.tags, term, 7) +
      getFieldScore(tool.useCases, term, 6) +
      getFieldScore(tool.capabilities, term, 5) +
      getFieldScore(tool.category, term, 4) +
      getFieldScore(tool.badge, term, 3) +
      getFieldScore(promptText, term, 4)

    return score
  })

  if (fieldScores.some((score) => score <= 0)) {
    return 0
  }

  return fieldScores.reduce((total, score) => total + score, 0)
}

export function searchTools(tools: Tool[], filters: SearchFilters) {
  const categoryFilteredTools =
    filters.categoryId === 'all'
      ? tools
      : tools.filter((tool) => tool.group === filters.categoryId)
  const filteredTools = categoryFilteredTools.filter(
    (tool) =>
      (!filters.favoriteOnly || tool.isFavorite) &&
      matchesSelectedTags(tool, filters.selectedTags),
  )

  if (!filters.query.trim()) {
    return [...filteredTools].sort(
      (firstTool, secondTool) =>
        getTagMatchCount(secondTool, filters.selectedTags) -
        getTagMatchCount(firstTool, filters.selectedTags),
    )
  }

  return filteredTools
    .map((tool) => ({
      tool,
      score: scoreTool(tool, filters.query),
      tagMatchCount: getTagMatchCount(tool, filters.selectedTags),
    }))
    .filter(({ score }) => score > 0)
    .sort(
      (firstTool, secondTool) =>
        secondTool.score - firstTool.score ||
        secondTool.tagMatchCount - firstTool.tagMatchCount ||
        secondTool.tool.useCount - firstTool.tool.useCount,
    )
    .map(({ tool }) => tool)
}
