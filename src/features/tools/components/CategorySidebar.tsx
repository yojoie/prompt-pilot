// 左侧分类组件
import { categoryOptions, tagOptions } from '../data/categoryOptions'

interface CategorySidebarProps {
  activeCategory: string
  selectedTags: string[]
  onCategoryChange: (categoryId: string) => void
  onTagToggle: (tag: string) => void
  onClearTags: () => void
}

export function CategorySidebar({
  activeCategory,
  selectedTags,
  onCategoryChange,
  onTagToggle,
  onClearTags,
}: CategorySidebarProps) {
  const sortedTagOptions = [...tagOptions].sort((firstTag, secondTag) => {
    if (firstTag.length !== secondTag.length) {
      return firstTag.length - secondTag.length
    }

    return tagOptions.indexOf(firstTag) - tagOptions.indexOf(secondTag)
  })

  return (
    <aside className="category-sidebar">
      <section className="filter-card">
        <h2 className="section-title">分类筛选</h2>

        <nav className="category-list" aria-label="工具分类筛选">
          {categoryOptions.map((category) => (
            <button
              key={category.id}
              className={
                activeCategory === category.id
                  ? 'category-item active'
                  : 'category-item'
              }
              onClick={() => onCategoryChange(category.id)}
              aria-label={category.label}
            >
              <span className="category-icon" aria-hidden="true">
                {category.icon}
              </span>
              <span className="category-label">{category.label}</span>
            </button>
          ))}
        </nav>
      </section>

      <section className="filter-card">
        <div className="tag-filter-header">
          <h2 className="section-title">选择标签</h2>
          {selectedTags.length > 0 && (
            <button onClick={onClearTags}>清空</button>
          )}
        </div>

        <div className="tag-filter-list">
          {sortedTagOptions.map((tag) => (
            <button
              key={tag}
              className={
                selectedTags.includes(tag)
                  ? 'tag-filter-chip active'
                  : 'tag-filter-chip'
              }
              onClick={() => onTagToggle(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>
    </aside>
  )
}
