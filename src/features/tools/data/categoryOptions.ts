export interface CategoryOption {
  id: string
  label: string
  icon: string
}

export const categoryOptions: CategoryOption[] = [
  { id: 'all', label: '全部', icon: '◎' },
  { id: 'common', label: '常用', icon: '★' },
  { id: 'writing', label: '写作润色', icon: '✎' },
  { id: 'document', label: '文档资料', icon: '▤' },
  { id: 'search', label: '搜索研究', icon: '⌕' },
  { id: 'study', label: '学习记忆', icon: '◈' },
  { id: 'academic', label: '学术论文', icon: '§' },
  { id: 'slides', label: 'PPT 展示', icon: '▣' },
  { id: 'media', label: '语音视频', icon: '▶' },
  { id: 'dev', label: '开发编程', icon: '⌘' },
]

export const tagOptions = [
  '对话',
  '中文',
  '多模态',
  '写作',
  '英文写作',
  '文本自然化',
  '文档',
  'PDF',
  '资料整理',
  '搜索',
  '研究',
  '学习',
  '闪卡',
  '拍照解题',
  '论文',
  '引用',
  'PPT',
  '语音',
  '视频',
  '编程',
  '文件分析',
]
