// 工具假数据
export interface Tool {
  id: string
  name: string
  category: string
  description: string
  tags: string[]
  badge: string
  isFavorite: boolean
}

export const mockTools: Tool[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    category: 'AI 写作',
    description: '通用型 AI 助手，适合写作、代码、学习、总结和文件分析。',
    tags: ['对话', '写作', '代码'],
    badge: '综合能力强',
    isFavorite: true,
  },
  {
    id: 'claude',
    name: 'Claude',
    category: 'AI 写作',
    description: '适合长文本阅读、总结、润色和结构化表达的 AI 助手。',
    tags: ['长文本', '写作', '总结'],
    badge: '长文本优秀',
    isFavorite: true,
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    category: 'AI 绘图',
    description: '高质量 AI 图像生成工具，适合视觉设计、海报和概念图。',
    tags: ['绘图', '设计', '图片'],
    badge: '图像生成',
    isFavorite: false,
  },
  {
    id: 'runway',
    name: 'Runway',
    category: 'AI 视频',
    description: 'AI 视频生成与编辑工具，适合短视频、创意视频和动态素材制作。',
    tags: ['视频', '生成', '剪辑'],
    badge: '视频创作',
    isFavorite: false,
  },
  {
    id: 'gamma',
    name: 'Gamma',
    category: 'AI PPT',
    description: 'AI 演示文稿生成工具，可以快速生成 PPT、文档和网页展示。',
    tags: ['PPT', '演示', '文档'],
    badge: '快速出稿',
    isFavorite: false,
  },
  {
    id: 'cursor',
    name: 'Cursor',
    category: 'AI 编程',
    description: '面向开发者的 AI 编程编辑器，适合代码生成、重构和项目开发。',
    tags: ['编程', 'IDE', 'React'],
    badge: '开发必备',
    isFavorite: true,
  },
]