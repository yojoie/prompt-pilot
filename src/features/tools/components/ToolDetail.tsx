// 工具详情页
import { useState } from 'react'
import type { PromptTemplate, Tool } from '../data/mockTools'

type EditableToolFields = Pick<
  Tool,
  'name' | 'category' | 'description' | 'officialUrl' | 'pricing'
>

type PromptValues = Record<string, Record<string, string>>
type CopyStatus = Record<string, 'copied' | 'failed'>

interface ToolDetailProps {
  tool: Tool
  onBack: () => void
  onToggleFavorite: (toolId: string) => void
  onDelete: (toolId: string) => void
  onUpdate: (toolId: string, updates: EditableToolFields) => void
  onUseTool: (toolId: string) => void
  onOpenTool: (toolId: string) => void
}

function createDraft(tool: Tool): EditableToolFields {
  return {
    name: tool.name,
    category: tool.category,
    description: tool.description,
    officialUrl: tool.officialUrl,
    pricing: tool.pricing,
  }
}

function createPromptValues(tool: Tool): PromptValues {
  return tool.promptTemplates.reduce<PromptValues>((templateValues, template) => {
    templateValues[template.id] = template.variables.reduce<Record<string, string>>(
      (values, variable) => {
        values[variable.id] = variable.defaultValue ?? ''
        return values
      },
      {},
    )

    return templateValues
  }, {})
}

function buildPrompt(template: PromptTemplate, values: Record<string, string>) {
  return template.content.replace(/\{\{(\w+)\}\}/g, (placeholder, variableId) => {
    const variable = template.variables.find(
      (currentVariable) => currentVariable.id === variableId,
    )
    const value = values[variableId]?.trim()

    return value || `【${variable?.label ?? placeholder}】`
  })
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.left = '-9999px'
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()
  const copied = document.execCommand('copy')
  document.body.removeChild(textarea)

  if (!copied) {
    throw new Error('Copy failed')
  }
}

function displayUrl(url: string) {
  return url.replace(/^https?:\/\//, '').replace(/\/$/, '')
}

export function ToolDetail({
  tool,
  onBack,
  onToggleFavorite,
  onDelete,
  onUpdate,
  onUseTool,
  onOpenTool,
}: ToolDetailProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState<EditableToolFields>(() =>
    createDraft(tool),
  )
  const [promptValues, setPromptValues] = useState<PromptValues>(() =>
    createPromptValues(tool),
  )
  const [generatedPrompts, setGeneratedPrompts] = useState<
    Record<string, string>
  >({})
  const [copyStatus, setCopyStatus] = useState<CopyStatus>({})

  const saveTool = () => {
    onUpdate(tool.id, draft)
    setIsEditing(false)
  }

  const deleteTool = () => {
    if (window.confirm(`确定删除 ${tool.name} 吗？`)) {
      onDelete(tool.id)
    }
  }

  const cancelEdit = () => {
    setDraft(createDraft(tool))
    setIsEditing(false)
  }

  const updatePromptValue = (
    templateId: string,
    variableId: string,
    value: string,
  ) => {
    setPromptValues((currentValues) => ({
      ...currentValues,
      [templateId]: {
        ...currentValues[templateId],
        [variableId]: value,
      },
    }))
  }

  const generatePrompt = (template: PromptTemplate) => {
    const finalPrompt = buildPrompt(template, promptValues[template.id] ?? {})

    setGeneratedPrompts((currentPrompts) => ({
      ...currentPrompts,
      [template.id]: finalPrompt,
    }))

    return finalPrompt
  }

  const setTemporaryCopyStatus = (
    templateId: string,
    status: CopyStatus[string],
  ) => {
    setCopyStatus((currentStatus) => ({
      ...currentStatus,
      [templateId]: status,
    }))

    window.setTimeout(() => {
      setCopyStatus((currentStatus) => {
        const nextStatus = { ...currentStatus }
        delete nextStatus[templateId]
        return nextStatus
      })
    }, 1600)
  }

  const copyPrompt = async (template: PromptTemplate) => {
    const finalPrompt = generatePrompt(template)

    try {
      await copyText(finalPrompt)
      onUseTool(tool.id)
      setTemporaryCopyStatus(template.id, 'copied')
    } catch {
      setTemporaryCopyStatus(template.id, 'failed')
    }
  }

  const openToolForTemplate = (template: PromptTemplate) => {
    generatePrompt(template)
    onOpenTool(tool.id)
  }

  return (
    <section className="tool-detail">
      <div className="detail-topbar">
        <button className="ghost-button" onClick={onBack}>
          ← 返回工具列表
        </button>

        <div className="detail-actions">
          <button
            className={tool.isFavorite ? 'favorite-action active' : 'favorite-action'}
            onClick={() => onToggleFavorite(tool.id)}
          >
            {tool.isFavorite ? '已收藏' : '收藏'}
          </button>
          <button className="ghost-button" onClick={() => setIsEditing(true)}>
            编辑
          </button>
          <button className="danger-button" onClick={deleteTool}>
            删除
          </button>
        </div>
      </div>

      <div className="detail-hero">
        <div className="tool-logo-shell detail-logo">
          <span>{tool.name.slice(0, 1)}</span>
          <img
            src={tool.logoUrl}
            alt={`${tool.name} logo`}
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
          />
        </div>

        {isEditing ? (
          <div className="detail-edit-form">
            <label>
              工具名称
              <input
                value={draft.name}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
              />
            </label>
            <label>
              工具分类
              <input
                value={draft.category}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    category: event.target.value,
                  }))
                }
              />
            </label>
            <label>
              官网链接
              <input
                value={draft.officialUrl}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    officialUrl: event.target.value,
                  }))
                }
              />
            </label>
            <label>
              定价信息
              <input
                value={draft.pricing}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    pricing: event.target.value,
                  }))
                }
              />
            </label>
            <label className="wide-field">
              工具描述
              <textarea
                value={draft.description}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
              />
            </label>

            <div className="edit-actions">
              <button className="primary-button" onClick={saveTool}>
                保存
              </button>
              <button className="ghost-button" onClick={cancelEdit}>
                取消
              </button>
            </div>
          </div>
        ) : (
          <div className="detail-heading">
            <span className="tool-category">{tool.category}</span>
            <h2>{tool.name}</h2>
            <p>{tool.description}</p>
          </div>
        )}
      </div>

      <div className="detail-meta-grid">
        <div className="detail-meta-card">
          <span>工具分类</span>
          <strong>{tool.category}</strong>
        </div>
        <button
          className="detail-meta-card link-card"
          onClick={() => onOpenTool(tool.id)}
        >
          <span>官网链接</span>
          <strong>{displayUrl(tool.officialUrl)}</strong>
        </button>
        <div className="detail-meta-card">
          <span>定价信息</span>
          <strong>{tool.pricing}</strong>
        </div>
        <div className="detail-meta-card">
          <span>使用次数</span>
          <strong>{tool.useCount} 次</strong>
        </div>
      </div>

      <div className="detail-content-grid">
        <section className="detail-block">
          <h3>支持能力</h3>
          <div className="capability-list">
            {tool.capabilities.map((capability) => (
              <span key={capability}>{capability}</span>
            ))}
          </div>
        </section>

        <section className="detail-block">
          <h3>适用场景</h3>
          <ul className="detail-list">
            {tool.useCases.map((useCase) => (
              <li key={useCase}>{useCase}</li>
            ))}
          </ul>
        </section>

        <section className="detail-block">
          <h3>优点</h3>
          <ul className="detail-list">
            {tool.pros.map((pro) => (
              <li key={pro}>{pro}</li>
            ))}
          </ul>
        </section>

        <section className="detail-block">
          <h3>缺点</h3>
          <ul className="detail-list">
            {tool.cons.map((con) => (
              <li key={con}>{con}</li>
            ))}
          </ul>
        </section>
      </div>

      <section className="detail-block prompt-block">
        <div className="prompt-block-header">
          <div>
            <h3>相关 Prompt 模板</h3>
            <p>{tool.name} 常用模板，可按变量生成最终 Prompt。</p>
          </div>
          <span>{tool.promptTemplates.length} 个模板</span>
        </div>

        <div className="prompt-template-list">
          {tool.promptTemplates.map((template) => {
            const generatedPrompt = generatedPrompts[template.id]
            const templateValues = promptValues[template.id] ?? {}
            const copyLabel =
              copyStatus[template.id] === 'copied'
                ? '已复制'
                : copyStatus[template.id] === 'failed'
                  ? '复制失败'
                  : '复制 Prompt'

            return (
              <article key={template.id} className="prompt-template-card">
                <div className="prompt-template-heading">
                  <div>
                    <h4>{template.title}</h4>
                    <p>{template.description}</p>
                  </div>
                  <button
                    className="ghost-button"
                    onClick={() => openToolForTemplate(template)}
                  >
                    打开 {tool.name}
                  </button>
                </div>

                <div className="prompt-variable-grid">
                  {template.variables.map((variable) => (
                    <label
                      key={variable.id}
                      className={variable.multiline ? 'wide-field' : undefined}
                    >
                      {variable.label}
                      {variable.multiline ? (
                        <textarea
                          value={templateValues[variable.id] ?? ''}
                          placeholder={variable.placeholder}
                          onChange={(event) =>
                            updatePromptValue(
                              template.id,
                              variable.id,
                              event.target.value,
                            )
                          }
                        />
                      ) : (
                        <input
                          value={templateValues[variable.id] ?? ''}
                          placeholder={variable.placeholder}
                          onChange={(event) =>
                            updatePromptValue(
                              template.id,
                              variable.id,
                              event.target.value,
                            )
                          }
                        />
                      )}
                    </label>
                  ))}
                </div>

                <div className="prompt-template-actions">
                  <button
                    className="primary-button"
                    onClick={() => generatePrompt(template)}
                  >
                    生成最终 Prompt
                  </button>
                  <button
                    className={
                      copyStatus[template.id] === 'copied'
                        ? 'ghost-button success-button'
                        : 'ghost-button'
                    }
                    onClick={() => copyPrompt(template)}
                  >
                    {copyLabel}
                  </button>
                </div>

                {generatedPrompt && (
                  <div className="generated-prompt">
                    <h5>最终 Prompt</h5>
                    <pre>{generatedPrompt}</pre>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </section>
    </section>
  )
}
