// 添加工具弹窗
import { useState } from 'react'
import { categoryOptions } from '../data/categoryOptions'

export interface AddToolPayload {
  name: string
  group: string
  description: string
  officialUrl: string
  pricing: string
  badge: string
  tags: string[]
  capabilities: string[]
}

interface AddToolModalProps {
  initialGroup: string
  onClose: () => void
  onCreate: (payload: AddToolPayload) => void
}

const availableCategories = categoryOptions.filter(
  (category) => category.id !== 'all',
)

function splitList(value: string) {
  return value
    .split(/[,，、\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

export function AddToolModal({
  initialGroup,
  onClose,
  onCreate,
}: AddToolModalProps) {
  const [name, setName] = useState('')
  const [group, setGroup] = useState(
    availableCategories.some((category) => category.id === initialGroup)
      ? initialGroup
      : 'common',
  )
  const [officialUrl, setOfficialUrl] = useState('')
  const [description, setDescription] = useState('')
  const [pricing, setPricing] = useState('免费版 + 订阅制')
  const [badge, setBadge] = useState('新添加')
  const [tags, setTags] = useState('')
  const [capabilities, setCapabilities] = useState('文本')

  const canSubmit =
    name.trim().length > 0 &&
    officialUrl.trim().length > 0 &&
    description.trim().length > 0

  const submitTool = () => {
    if (!canSubmit) {
      return
    }

    onCreate({
      name: name.trim(),
      group,
      officialUrl: officialUrl.trim(),
      description: description.trim(),
      pricing: pricing.trim() || '待补充',
      badge: badge.trim() || '新添加',
      tags: splitList(tags),
      capabilities: splitList(capabilities),
    })
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="add-tool-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-tool-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 id="add-tool-title">添加工具</h2>
            <p>补充基础信息后，会自动生成详情页和默认 Prompt 模板。</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="关闭">
            ×
          </button>
        </div>

        <div className="add-tool-form">
          <label>
            工具名称
            <input
              value={name}
              placeholder="例如：Notion AI"
              onChange={(event) => setName(event.target.value)}
            />
          </label>

          <label>
            功能分类
            <select
              value={group}
              onChange={(event) => setGroup(event.target.value)}
            >
              {availableCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            官网链接
            <input
              value={officialUrl}
              placeholder="https://..."
              onChange={(event) => setOfficialUrl(event.target.value)}
            />
          </label>

          <label>
            定价信息
            <input
              value={pricing}
              placeholder="例如：免费版 + 订阅制"
              onChange={(event) => setPricing(event.target.value)}
            />
          </label>

          <label>
            特色标签
            <input
              value={badge}
              placeholder="例如：知识库助手"
              onChange={(event) => setBadge(event.target.value)}
            />
          </label>

          <label>
            支持能力
            <input
              value={capabilities}
              placeholder="例如：文本、图片、文件分析"
              onChange={(event) => setCapabilities(event.target.value)}
            />
          </label>

          <label className="wide-field">
            工具描述
            <textarea
              value={description}
              placeholder="说明这个工具适合做什么，以及和其他工具的差异。"
              onChange={(event) => setDescription(event.target.value)}
            />
          </label>

          <label className="wide-field">
            关键 tags
            <input
              value={tags}
              placeholder="用逗号分隔，例如：写作、文档、总结"
              onChange={(event) => setTags(event.target.value)}
            />
          </label>
        </div>

        <div className="modal-actions">
          <button className="ghost-button" onClick={onClose}>
            取消
          </button>
          <button
            className="primary-button"
            onClick={submitTool}
            disabled={!canSubmit}
          >
            添加工具
          </button>
        </div>
      </section>
    </div>
  )
}
