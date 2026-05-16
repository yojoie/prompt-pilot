// 左侧分类组件
const categories = [
  '全部',
  'AI 写作',
  'AI 编程',
  'AI 绘图',
  'AI 视频',
  'AI PPT',
  'AI 搜索',
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