// 左侧分类组件
const categories = [
  '全部',
  '常用 AI',
  'AI 文档',
  'AI 搜索',
  'AI PPT',
  'AI 学习',
  'AI 学习 / AI 文档',
  'AI 语音',
  'AI 写作',
  'AI 编程',
  'AI 视频',
  'AI 学术',
]

export function CategorySidebar() {
  return (
    <aside className="category-sidebar">
      <h2 className="section-title">分类筛选</h2>

      <nav className="category-list">
        {categories.map((category, index) => (
          <button
            key={category}
            className={index === 0 ? 'category-item active' : 'category-item'}
          >
            {category}
          </button>
        ))}
      </nav>
    </aside>
  )
}
