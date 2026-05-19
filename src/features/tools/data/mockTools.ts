// 工具数据
export interface PromptVariable {
  id: string
  label: string
  placeholder: string
  multiline?: boolean
  defaultValue?: string
}

export interface PromptTemplate {
  id: string
  title: string
  description: string
  content: string
  variables: PromptVariable[]
}

export interface Tool {
  id: string
  name: string
  category: string
  group: string
  description: string
  tags: string[]
  badge: string
  isFavorite: boolean
  logoUrl: string
  logoText: string
  logoTone: string
  officialUrl: string
  pricing: string
  useCount: number
  lastUsedAt?: string
  capabilities: string[]
  useCases: string[]
  pros: string[]
  cons: string[]
  promptTemplates: PromptTemplate[]
}

type ToolSeed = Omit<
  Tool,
  'isFavorite' | 'useCount' | 'lastUsedAt' | 'logoText' | 'logoTone'
> & {
  isFavorite?: boolean
  logoText?: string
  logoTone?: string
}

const createTool = (seed: ToolSeed): Tool => ({
  ...seed,
  isFavorite: seed.isFavorite ?? false,
  logoText: seed.logoText ?? seed.name.slice(0, 1),
  logoTone: seed.logoTone ?? '#4f46e5',
  useCount: 0,
})

const researchTemplate: PromptTemplate = {
  id: 'research-question',
  title: '资料检索 Prompt',
  description: '把模糊问题改成可检索、可追踪来源的查询。',
  content:
    '请围绕“{{question}}”进行资料检索，优先使用{{source_type}}。输出关键结论、证据来源、争议点和下一步可继续追问的问题。\n\n背景：\n{{background}}',
  variables: [
    {
      id: 'question',
      label: '研究问题',
      placeholder: '例如：AI 搜索工具如何提升学术阅读效率',
    },
    {
      id: 'source_type',
      label: '来源偏好',
      placeholder: '例如：论文、官方文档、新闻报道',
      defaultValue: '可靠来源',
    },
    {
      id: 'background',
      label: '背景说明',
      placeholder: '补充你的作业、项目或论文背景',
      multiline: true,
    },
  ],
}

export const mockTools: Tool[] = [
  createTool({
    id: 'chatgpt',
    name: 'ChatGPT',
    category: '常用 AI',
    group: 'common',
    description: '通用型 AI 助手，适合写作、代码、学习、总结和文件分析。',
    tags: ['对话', '写作', '代码'],
    badge: '综合能力强',
    isFavorite: true,
    logoUrl: 'https://chatgpt.com/favicon.ico',
    logoText: 'GPT',
    logoTone: '#2f3a35',
    officialUrl: 'https://chatgpt.com/',
    pricing: '免费版 + 订阅制高级能力',
    capabilities: ['文本', '代码', '图片', '语音', '文件分析'],
    useCases: [
      '快速生成初稿、总结资料和改写内容',
      '解释代码、生成组件、辅助排查问题',
      '基于上传文件做归纳、对比和信息抽取',
    ],
    pros: ['通用能力覆盖广', '上下文理解稳定', '适合从想法到成稿的完整流程'],
    cons: ['复杂事实需要人工核验', '专业场景需要更明确的约束和素材'],
    promptTemplates: [
      {
        id: 'frontend-interviewer',
        title: '前端面试官 Prompt',
        description: '模拟真实前端面试，按候选人回答继续追问。',
        content:
          '你是一名{{interviewer_level}}前端技术面试官，请围绕{{topics}}向我提问。候选人背景：{{candidate_background}}。每次只问一个问题，并根据我的回答给出追问、评分和改进建议。',
        variables: [
          {
            id: 'interviewer_level',
            label: '面试官级别',
            placeholder: '例如：资深 / 大厂 / 校招',
            defaultValue: '资深',
          },
          {
            id: 'topics',
            label: '考察方向',
            placeholder: '例如：React、浏览器、工程化、项目经验',
            defaultValue: 'React、浏览器、工程化和项目经验',
          },
          {
            id: 'candidate_background',
            label: '候选人背景',
            placeholder: '例如：2 年前端经验，熟悉 React，准备中级岗位',
            multiline: true,
          },
        ],
      },
      {
        id: 'resume-polish',
        title: '简历润色 Prompt',
        description: '将经历改写成更清晰、更结果导向的简历表达。',
        content:
          '请帮我润色下面这段{{target_role}}简历经历，突出业务背景、技术动作和可量化结果，保持真实可信，并给出{{version_count}}个不同风格版本。\n\n原始经历：\n{{resume_text}}',
        variables: [
          {
            id: 'target_role',
            label: '目标岗位',
            placeholder: '例如：前端开发工程师',
            defaultValue: '前端开发工程师',
          },
          {
            id: 'version_count',
            label: '版本数量',
            placeholder: '例如：3',
            defaultValue: '3',
          },
          {
            id: 'resume_text',
            label: '原始经历',
            placeholder: '粘贴需要润色的简历项目经历',
            multiline: true,
          },
        ],
      },
      {
        id: 'react-component',
        title: 'React 组件生成 Prompt',
        description: '根据需求生成结构清晰、可维护的 React 组件。',
        content:
          '请根据以下需求生成一个{{tech_stack}}组件，组件名称为{{component_name}}。需要包含 props 类型、状态处理、基础样式类名和必要的交互说明。\n\n功能需求：\n{{requirements}}\n\n风格约束：\n{{style_notes}}',
        variables: [
          {
            id: 'tech_stack',
            label: '技术栈',
            placeholder: '例如：React + TypeScript',
            defaultValue: 'React + TypeScript',
          },
          {
            id: 'component_name',
            label: '组件名称',
            placeholder: '例如：ToolDetailPanel',
          },
          {
            id: 'requirements',
            label: '功能需求',
            placeholder: '描述组件需要实现的状态、交互和数据展示',
            multiline: true,
          },
          {
            id: 'style_notes',
            label: '风格约束',
            placeholder: '例如：沿用现有 className，不新增依赖',
            multiline: true,
          },
        ],
      },
      {
        id: 'cs-basics',
        title: '八股文讲解 Prompt',
        description: '把常见前端知识点讲成可理解、可复述的答案。',
        content:
          '请用{{answer_style}}的方式解释这个前端知识点：{{knowledge_point}}。先给结论，再解释原理，最后给一个实际开发例子和{{follow_up_count}}个常见追问。',
        variables: [
          {
            id: 'knowledge_point',
            label: '知识点',
            placeholder: '例如：事件循环、闭包、虚拟 DOM',
          },
          {
            id: 'answer_style',
            label: '回答风格',
            placeholder: '例如：面试可复述 / 小白友好 / 深入原理',
            defaultValue: '面试可复述',
          },
          {
            id: 'follow_up_count',
            label: '追问数量',
            placeholder: '例如：3',
            defaultValue: '3',
          },
        ],
      },
      {
        id: 'readme-generator',
        title: '项目 README 生成 Prompt',
        description: '为项目生成清晰的 README 结构和安装使用说明。',
        content:
          '请根据我的项目说明生成 README。项目名称：{{project_name}}。请包含项目介绍、技术栈、目录结构、运行方式、核心功能、截图占位和后续计划。\n\n项目说明：\n{{project_description}}\n\n技术栈：\n{{tech_stack}}',
        variables: [
          {
            id: 'project_name',
            label: '项目名称',
            placeholder: '例如：PromptPilot',
          },
          {
            id: 'project_description',
            label: '项目说明',
            placeholder: '描述项目目标、主要页面和核心功能',
            multiline: true,
          },
          {
            id: 'tech_stack',
            label: '技术栈',
            placeholder: '例如：React、TypeScript、Vite',
            multiline: true,
          },
        ],
      },
    ],
  }),
  createTool({
    id: 'doubao',
    name: '豆包',
    category: '常用 AI',
    group: 'common',
    description: '字节跳动推出的中文 AI 助手，适合中文对话、写作、学习和多模态任务。',
    tags: ['中文', '对话', '多模态'],
    badge: '中文体验好',
    isFavorite: true,
    logoUrl: 'https://www.doubao.com/favicon.ico',
    logoText: '豆',
    logoTone: '#4f7cff',
    officialUrl: 'https://www.doubao.com/',
    pricing: '免费版 + 部分高级能力',
    capabilities: ['文本', '代码', '图片', '语音', '文件分析'],
    useCases: ['中文资料总结', '写作润色和学习答疑', '图片理解与日常任务规划'],
    pros: ['中文语境友好', '入口轻量', '适合学习和生活类任务'],
    cons: ['专业事实仍需核验', '复杂项目交付需要明确上下文'],
    promptTemplates: [
      {
        id: 'study-assistant',
        title: '中文学习助手 Prompt',
        description: '把知识点拆成易懂解释、例子和练习。',
        content:
          '请用适合{{student_level}}的中文解释“{{topic}}”。先给一句话结论，再讲原理，最后给{{exercise_count}}道练习题和答案解析。',
        variables: [
          {
            id: 'student_level',
            label: '学习阶段',
            placeholder: '例如：大一学生 / 前端初学者',
            defaultValue: '初学者',
          },
          {
            id: 'topic',
            label: '知识点',
            placeholder: '例如：闭包、Promise、线性代数',
          },
          {
            id: 'exercise_count',
            label: '练习数量',
            placeholder: '例如：3',
            defaultValue: '3',
          },
        ],
      },
    ],
  }),
  createTool({
    id: 'gemini',
    name: 'Gemini',
    category: '常用 AI',
    group: 'common',
    description: 'Google 的 AI 助手，适合资料理解、写作、代码、图片和 Google 生态工作流。',
    tags: ['Google', '多模态', '写作'],
    badge: 'Google 生态',
    isFavorite: true,
    logoUrl: 'https://gemini.google.com/favicon.ico',
    logoText: 'G',
    logoTone: '#7c72ff',
    officialUrl: 'https://gemini.google.com/',
    pricing: '免费版 + Google AI 订阅能力',
    capabilities: ['文本', '代码', '图片', '语音', '文件分析'],
    useCases: ['跨语言资料理解', 'Google 生态内写作和检索', '图片和文档信息提取'],
    pros: ['多模态能力完整', '和 Google 服务结合度高', '适合资料型任务'],
    cons: ['部分能力受地区和账号限制', '输出仍需事实校验'],
    promptTemplates: [
      {
        id: 'google-workflow',
        title: '资料整理 Prompt',
        description: '把资料整理成清晰行动清单。',
        content:
          '请把下面资料整理成{{output_type}}，包含核心结论、重要事实、待确认问题和下一步行动。\n\n资料：\n{{materials}}',
        variables: [
          {
            id: 'output_type',
            label: '输出形式',
            placeholder: '例如：学习笔记 / 项目计划 / 汇报提纲',
            defaultValue: '结构化笔记',
          },
          {
            id: 'materials',
            label: '资料内容',
            placeholder: '粘贴文本、链接摘要或文档内容',
            multiline: true,
          },
        ],
      },
    ],
  }),
  createTool({
    id: 'claude',
    name: 'Claude',
    category: '常用 AI',
    group: 'common',
    description: '适合长文本阅读、总结、润色和结构化表达的 AI 助手。',
    tags: ['长文本', '写作', '总结'],
    badge: '长文本优秀',
    isFavorite: true,
    logoUrl: 'https://claude.ai/favicon.ico',
    logoText: 'C',
    logoTone: '#b06f45',
    officialUrl: 'https://claude.ai/',
    pricing: '免费版 + 订阅制高级能力',
    capabilities: ['文本', '代码', '文件分析'],
    useCases: ['长文档阅读与归纳', '方案写作和结构化表达', '多版本文案润色'],
    pros: ['长文本处理体验好', '表达自然', '适合复杂材料整理'],
    cons: ['实时资料仍需核验', '视觉和语音能力不是主场景'],
    promptTemplates: [
      {
        id: 'long-doc-summary',
        title: '长文档摘要 Prompt',
        description: '提炼长文档中的结论、证据和待办。',
        content:
          '请阅读下面的{{document_type}}，输出核心结论、关键证据、风险点和下一步行动。每一项都要引用原文依据。\n\n文档内容：\n{{document_content}}',
        variables: [
          {
            id: 'document_type',
            label: '文档类型',
            placeholder: '例如：需求文档、论文、会议纪要',
            defaultValue: '长文档',
          },
          {
            id: 'document_content',
            label: '文档内容',
            placeholder: '粘贴需要摘要的内容',
            multiline: true,
          },
        ],
      },
      {
        id: 'writing-outline',
        title: '文章大纲 Prompt',
        description: '把模糊主题拆成完整写作结构。',
        content:
          '请围绕主题“{{topic}}”生成一份文章大纲，面向{{audience}}，包含目标读者、核心观点、段落结构和每段要回答的问题。',
        variables: [
          {
            id: 'topic',
            label: '文章主题',
            placeholder: '例如：AI 工具如何提升前端学习效率',
          },
          {
            id: 'audience',
            label: '目标读者',
            placeholder: '例如：前端初学者',
            defaultValue: '普通读者',
          },
        ],
      },
    ],
  }),
  createTool({
    id: 'lightpdf',
    name: 'LightPDF',
    category: 'AI 文档',
    group: 'document',
    description: '面向 PDF 和文档处理的 AI 工具，适合阅读、总结、转换和文档问答。',
    tags: ['PDF', '文档', '总结'],
    badge: 'PDF 处理',
    logoUrl: 'https://lightpdf.com/favicon.ico',
    logoText: 'PDF',
    logoTone: '#d85b5b',
    officialUrl: 'https://lightpdf.com/',
    pricing: '免费额度 + 订阅制',
    capabilities: ['文本', '文件分析'],
    useCases: ['PDF 摘要和问答', '文档格式转换', '论文或报告重点提取'],
    pros: ['围绕 PDF 工作流完整', '适合快速阅读长文档', '转换能力实用'],
    cons: ['复杂版式文档需要人工校对', '敏感文件上传前需要注意隐私'],
    promptTemplates: [
      {
        id: 'pdf-reading',
        title: 'PDF 阅读分析 Prompt',
        description: '把 PDF 内容转成结论、证据和待办。',
        content:
          '请分析这份{{document_type}}，按{{analysis_goal}}输出摘要。请列出关键结论、原文依据、重要数据和待确认问题。\n\n补充说明：\n{{notes}}',
        variables: [
          {
            id: 'document_type',
            label: '文档类型',
            placeholder: '例如：论文、项目报告、产品手册',
            defaultValue: 'PDF 文档',
          },
          {
            id: 'analysis_goal',
            label: '分析目标',
            placeholder: '例如：写汇报 / 做课堂展示 / 提炼行动项',
          },
          {
            id: 'notes',
            label: '补充说明',
            placeholder: '粘贴你关心的页码、章节或问题',
            multiline: true,
          },
        ],
      },
    ],
  }),
  createTool({
    id: 'perplexity',
    name: 'Perplexity',
    category: 'AI 搜索',
    group: 'search',
    description: 'AI 搜索和答案引擎，适合带来源地检索事实、趋势和研究问题。',
    tags: ['搜索', '来源', '研究'],
    badge: '带来源回答',
    logoUrl: 'https://www.perplexity.ai/favicon.ico',
    logoText: 'P',
    logoTone: '#2f9da6',
    officialUrl: 'https://www.perplexity.ai/',
    pricing: '免费版 + Pro 订阅',
    capabilities: ['文本', '文件分析'],
    useCases: ['查找最新资料', '对比多个来源', '为报告或论文收集引用线索'],
    pros: ['回答附带来源', '检索速度快', '适合做初步资料调研'],
    cons: ['来源质量需要筛选', '深度学术综述仍需交叉验证'],
    promptTemplates: [researchTemplate],
  }),
  createTool({
    id: 'gamma',
    name: 'Gamma',
    category: 'AI PPT',
    group: 'slides',
    description: 'AI 演示文稿生成工具，可以快速生成 PPT、文档和网页展示。',
    tags: ['PPT', '演示', '文档'],
    badge: '快速出稿',
    logoUrl: 'https://gamma.app/favicon.ico',
    logoText: 'γ',
    logoTone: '#8b5cf6',
    officialUrl: 'https://gamma.app/',
    pricing: '免费额度 + 订阅制',
    capabilities: ['文本', '图片', '文件分析'],
    useCases: ['快速生成演示文稿', '把文档转换成展示页', '制作项目汇报和课程材料'],
    pros: ['从大纲到页面很快', '适合非设计用户', '可用于轻量网页展示'],
    cons: ['复杂品牌视觉需要二次调整', '严肃汇报仍需校对结构和数据'],
    promptTemplates: [
      {
        id: 'deck-outline',
        title: 'PPT 大纲 Prompt',
        description: '为演示文稿生成清晰叙事骨架。',
        content:
          '请为主题“{{topic}}”生成一份{{page_count}}页以内的 PPT 大纲，包含每页标题、核心观点、建议图表和演讲备注。汇报对象：{{audience}}。',
        variables: [
          {
            id: 'topic',
            label: '汇报主题',
            placeholder: '例如：PromptPilot 产品方案',
          },
          {
            id: 'page_count',
            label: '页数上限',
            placeholder: '例如：10',
            defaultValue: '10',
          },
          {
            id: 'audience',
            label: '汇报对象',
            placeholder: '例如：课程老师、项目经理、投资人',
          },
        ],
      },
    ],
  }),
  createTool({
    id: 'socratic',
    name: 'Socratic',
    category: 'AI 学习',
    group: 'study',
    description: 'Google 的学习辅助工具，支持拍照解题和按学科理解题目思路。',
    tags: ['拍照解题', '学习', '作业'],
    badge: '拍照解题',
    logoUrl: 'https://socratic.org/favicon.ico',
    logoText: 'S',
    logoTone: '#3aa76d',
    officialUrl: 'https://socratic.org/',
    pricing: '免费',
    capabilities: ['文本', '图片'],
    useCases: ['拍照识别题目', '理解解题步骤', '辅助数学、科学等学科学习'],
    pros: ['适合题目场景', '图片输入自然', '讲解路径清晰'],
    cons: ['不适合作为直接答案替代学习', '覆盖范围取决于题目和语言环境'],
    promptTemplates: [
      {
        id: 'photo-problem',
        title: '拍照解题整理 Prompt',
        description: '把题目拆成思路、步骤和易错点。',
        content:
          '请帮我分析这道{{subject}}题。先识别题意，再给解题思路，最后列出步骤、答案和易错点。\n\n我卡住的地方：\n{{stuck_point}}',
        variables: [
          {
            id: 'subject',
            label: '学科',
            placeholder: '例如：数学、物理、化学、英语',
            defaultValue: '数学',
          },
          {
            id: 'stuck_point',
            label: '卡住的位置',
            placeholder: '说明你不理解哪一步',
            multiline: true,
          },
        ],
      },
    ],
  }),
  createTool({
    id: 'speechify',
    name: 'Speechify',
    category: 'AI 语音',
    group: 'media',
    description: '文本转语音和语音生产力工具，适合把文章、材料和脚本转成可听内容。',
    tags: ['语音', 'TTS', '听读'],
    badge: '文本转语音',
    logoUrl: 'https://speechify.com/favicon.ico',
    logoText: 'SP',
    logoTone: '#e08a47',
    officialUrl: 'https://speechify.com/',
    pricing: '免费版 + 订阅制',
    capabilities: ['文本', '语音', '文件分析'],
    useCases: ['把阅读材料转成音频', '生成配音草稿', '通勤和复习时听资料'],
    pros: ['听读场景强', '适合长材料复习', '多语音选择'],
    cons: ['专业配音仍需后期调整', '付费能力更完整'],
    promptTemplates: [
      {
        id: 'audio-script',
        title: '语音学习稿 Prompt',
        description: '把材料改成适合听的语音脚本。',
        content:
          '请把下面材料改写成适合{{duration}}收听的语音脚本，语气为{{tone}}。要求句子短、过渡自然、重点清晰。\n\n材料：\n{{material}}',
        variables: [
          {
            id: 'duration',
            label: '目标时长',
            placeholder: '例如：3 分钟',
            defaultValue: '3 分钟',
          },
          {
            id: 'tone',
            label: '语气',
            placeholder: '例如：自然、课堂讲解、播客风格',
            defaultValue: '自然讲解',
          },
          {
            id: 'material',
            label: '原始材料',
            placeholder: '粘贴文章、笔记或讲稿',
            multiline: true,
          },
        ],
      },
    ],
  }),
  createTool({
    id: 'ankiweb',
    name: 'AnkiWeb',
    category: 'AI 学习',
    group: 'study',
    description: '长期记忆和闪卡同步工具，适合用间隔重复法复习知识点。',
    tags: ['闪卡', '记忆', '复习'],
    badge: '长期记忆',
    logoUrl: 'https://ankiweb.net/favicon.ico',
    logoText: 'A',
    logoTone: '#4f83cc',
    officialUrl: 'https://ankiweb.net/',
    pricing: '免费',
    capabilities: ['文本'],
    useCases: ['制作知识点闪卡', '规划长期复习', '同步多端学习进度'],
    pros: ['间隔重复机制成熟', '适合语言和专业课记忆', '生态稳定'],
    cons: ['本身不是生成式 AI', '卡片质量依赖前期整理'],
    promptTemplates: [
      {
        id: 'flashcard-generator',
        title: '闪卡生成 Prompt',
        description: '把材料转换成适合导入 Anki 的问答卡片。',
        content:
          '请把下面材料整理成{{card_count}}张 Anki 闪卡，格式为“问题 | 答案 | 标签”。知识主题：{{topic}}。\n\n材料：\n{{material}}',
        variables: [
          {
            id: 'topic',
            label: '知识主题',
            placeholder: '例如：React Hooks、英语四级词汇',
          },
          {
            id: 'card_count',
            label: '卡片数量',
            placeholder: '例如：20',
            defaultValue: '20',
          },
          {
            id: 'material',
            label: '学习材料',
            placeholder: '粘贴课堂笔记、文章或术语表',
            multiline: true,
          },
        ],
      },
    ],
  }),
  createTool({
    id: 'kuse',
    name: 'Kuse',
    category: 'AI 学习 / AI 文档',
    group: 'document',
    description: '把资料转成文档、表格、幻灯片和网站的 AI 工作台，适合学习整理和项目交付。',
    tags: ['资料整理', '文档', '幻灯片'],
    badge: '资料转交付物',
    logoUrl: 'https://www.kuse.ai/favicon.ico',
    logoText: 'K',
    logoTone: '#369b91',
    officialUrl: 'https://www.kuse.ai/',
    pricing: '免费额度 + 订阅制',
    capabilities: ['文本', '图片', '文件分析'],
    useCases: ['把资料转换为文档', '从笔记生成表格或幻灯片', '把研究内容整理成网站'],
    pros: ['输出形态多', '适合把资料变成作业或展示', '学习和文档场景结合紧密'],
    cons: ['复杂排版需要人工微调', '资料质量决定最终产物质量'],
    promptTemplates: [
      {
        id: 'material-to-output',
        title: '资料转交付物 Prompt',
        description: '明确资料、受众和输出形态。',
        content:
          '请把以下资料整理成{{output_type}}，面向{{audience}}。要求结构清晰、标题明确，并保留关键事实和来源线索。\n\n资料：\n{{materials}}',
        variables: [
          {
            id: 'output_type',
            label: '输出形态',
            placeholder: '例如：文档、表格、幻灯片、网站',
            defaultValue: '幻灯片',
          },
          {
            id: 'audience',
            label: '目标受众',
            placeholder: '例如：课程老师、项目组、同学',
          },
          {
            id: 'materials',
            label: '原始资料',
            placeholder: '粘贴笔记、链接摘要或文件内容',
            multiline: true,
          },
        ],
      },
    ],
  }),
  createTool({
    id: 'deepl-write',
    name: 'DeepL Write',
    category: 'AI 写作',
    group: 'writing',
    description: 'DeepL 的写作润色工具，适合英文改写、语气调整和语言质量提升。',
    tags: ['英文写作', '润色', '改写'],
    badge: '英文润色',
    logoUrl: 'https://www.deepl.com/favicon.ico',
    logoText: 'DL',
    logoTone: '#3268b7',
    officialUrl: 'https://www.deepl.com/write',
    pricing: '免费版 + Pro 能力',
    capabilities: ['文本'],
    useCases: ['英文邮件润色', '论文和简历语言优化', '调整语气和表达方式'],
    pros: ['语言自然', '适合英文表达细节', '改写建议直接'],
    cons: ['更偏语言润色而非复杂内容策划', '专业术语需要人工确认'],
    promptTemplates: [
      {
        id: 'english-polish',
        title: '英文润色 Prompt',
        description: '提前说明语气、用途和保留信息。',
        content:
          '请将下面英文文本润色为{{tone}}风格，用途是{{purpose}}。保留原意，提升清晰度、自然度和专业度。\n\n原文：\n{{original_text}}',
        variables: [
          {
            id: 'tone',
            label: '目标语气',
            placeholder: '例如：正式、自然、学术、简洁',
            defaultValue: '自然专业',
          },
          {
            id: 'purpose',
            label: '使用场景',
            placeholder: '例如：求职邮件、论文摘要、项目介绍',
          },
          {
            id: 'original_text',
            label: '原文',
            placeholder: '粘贴需要润色的英文',
            multiline: true,
          },
        ],
      },
    ],
  }),
  createTool({
    id: 'runway',
    name: 'Runway',
    category: 'AI 视频',
    group: 'media',
    description: 'AI 视频生成与编辑工具，适合短视频、创意视频和动态素材制作。',
    tags: ['视频', '生成', '剪辑'],
    badge: '视频创作',
    logoUrl: 'https://runwayml.com/favicon.ico',
    logoText: 'R',
    logoTone: '#2f3440',
    officialUrl: 'https://runwayml.com/',
    pricing: '免费额度 + 订阅制',
    capabilities: ['文本', '图片', '语音'],
    useCases: ['生成短视频镜头', '把静态图片转为动态画面', '制作创意广告素材'],
    pros: ['视频生成流程完整', '适合快速验证镜头创意', '编辑工具链丰富'],
    cons: ['长视频稳定性需要人工筛选', '复杂分镜需要多轮迭代'],
    promptTemplates: [
      {
        id: 'video-shot',
        title: '短视频镜头 Prompt',
        description: '把创意描述整理成视频生成指令。',
        content:
          '请把这个创意转成视频生成提示词，包含镜头运动、主体动作、场景、光线、节奏和时长建议。\n\n创意描述：{{idea}}\n\n视频时长：{{duration}}',
        variables: [
          {
            id: 'idea',
            label: '创意描述',
            placeholder: '描述视频画面、主体和情绪',
            multiline: true,
          },
          {
            id: 'duration',
            label: '视频时长',
            placeholder: '例如：5 秒',
            defaultValue: '5 秒',
          },
        ],
      },
    ],
  }),
  createTool({
    id: 'stealthwriter',
    name: 'StealthWriter',
    category: 'AI 写作',
    group: 'writing',
    description: '文本自然化和文风优化工具，适合把生硬草稿改得更顺、更像真实表达。',
    tags: ['文本自然化', '文风优化', '改写'],
    badge: '文风优化',
    logoUrl: 'https://www.stealthwriter.pro/favicon.ico',
    logoText: 'SW',
    logoTone: '#687387',
    officialUrl: 'https://www.stealthwriter.pro/',
    pricing: '免费额度 + 订阅制',
    capabilities: ['文本'],
    useCases: ['优化机器感较强的草稿', '调整简历和邮件语气', '让表达更自然流畅'],
    pros: ['定位清晰', '适合文风自然化', '能快速生成多个改写版本'],
    cons: ['不应替代事实核对', '重要文本仍需人工审校和保持真实'],
    promptTemplates: [
      {
        id: 'naturalize-writing',
        title: '文本自然化 Prompt',
        description: '把草稿改成更自然、更专业的表达。',
        content:
          '请将下面文本优化为{{target_voice}}风格，目标是提升自然度、可读性和专业感。请保留事实，不夸大，不改变核心含义。\n\n原文：\n{{draft_text}}\n\n额外要求：\n{{constraints}}',
        variables: [
          {
            id: 'target_voice',
            label: '目标文风',
            placeholder: '例如：自然、简洁、专业、口语化',
            defaultValue: '自然专业',
          },
          {
            id: 'draft_text',
            label: '原始文本',
            placeholder: '粘贴需要优化的文本',
            multiline: true,
          },
          {
            id: 'constraints',
            label: '额外要求',
            placeholder: '例如：不要改变事实、保留第一人称、控制在 200 字内',
            multiline: true,
          },
        ],
      },
    ],
  }),
  createTool({
    id: 'mybib',
    name: 'MyBib',
    category: 'AI 学术',
    group: 'academic',
    description: '引用和参考文献生成工具，适合管理论文、网页、书籍等来源格式。',
    tags: ['引用', '参考文献', '论文'],
    badge: '引用生成',
    logoUrl: 'https://www.mybib.com/favicon.ico',
    logoText: 'MB',
    logoTone: '#9b6bd3',
    officialUrl: 'https://www.mybib.com/',
    pricing: '免费',
    capabilities: ['文本', '文件分析'],
    useCases: ['生成 APA/MLA/Chicago 引用', '整理论文参考文献', '检查来源信息完整性'],
    pros: ['引用格式丰富', '使用门槛低', '适合课程论文和报告'],
    cons: ['引用信息仍需核对', '对中文资料的元数据识别可能需要补充'],
    promptTemplates: [
      {
        id: 'citation-checklist',
        title: '引用检查 Prompt',
        description: '整理来源信息并提示缺失字段。',
        content:
          '请按{{citation_style}}格式检查下面来源信息，指出缺失字段，并给出参考文献条目草稿。\n\n来源列表：\n{{sources}}',
        variables: [
          {
            id: 'citation_style',
            label: '引用格式',
            placeholder: '例如：APA 7、MLA、Chicago',
            defaultValue: 'APA 7',
          },
          {
            id: 'sources',
            label: '来源信息',
            placeholder: '粘贴论文、网页、书籍或 DOI 信息',
            multiline: true,
          },
        ],
      },
    ],
  }),
  createTool({
    id: 'elicit',
    name: 'Elicit',
    category: 'AI 学术',
    group: 'academic',
    description: 'AI 学术研究助手，适合围绕研究问题查找论文、提取证据和比较结论。',
    tags: ['论文', '研究', '证据'],
    badge: '论文检索',
    logoUrl: 'https://elicit.com/favicon.ico',
    logoText: 'E',
    logoTone: '#3f9f8f',
    officialUrl: 'https://elicit.com/',
    pricing: '免费额度 + 订阅制',
    capabilities: ['文本', '文件分析'],
    useCases: ['检索相关论文', '提取研究方法和结论', '形成文献综述线索'],
    pros: ['面向研究问题设计', '适合文献初筛', '能减少手动阅读成本'],
    cons: ['不能替代完整文献阅读', '研究结论需要回到原文确认'],
    promptTemplates: [
      {
        id: 'paper-search',
        title: '论文检索 Prompt',
        description: '把研究兴趣改成可检索问题。',
        content:
          '请围绕研究问题“{{research_question}}”查找相关论文。优先关注{{population}}，结果需要比较研究方法、样本、关键发现和局限性。\n\n特别关注指标：{{outcomes}}',
        variables: [
          {
            id: 'research_question',
            label: '研究问题',
            placeholder: '例如：AI 辅助学习是否提升长期记忆效果',
          },
          {
            id: 'population',
            label: '研究对象',
            placeholder: '例如：大学生、语言学习者、软件开发者',
            defaultValue: '相关人群',
          },
          {
            id: 'outcomes',
            label: '关注指标',
            placeholder: '例如：学习成绩、效率、满意度',
          },
        ],
      },
    ],
  }),
  createTool({
    id: 'notebooklm',
    name: 'NotebookLM',
    category: 'AI 学习 / AI 文档',
    group: 'document',
    description: 'Google 的资料理解和笔记助手，适合围绕上传资料做问答、摘要和学习整理。',
    tags: ['笔记', '资料问答', '学习'],
    badge: '资料学习',
    logoUrl: 'https://notebooklm.google.com/favicon.ico',
    logoText: 'NL',
    logoTone: '#4a7bdc',
    officialUrl: 'https://notebooklm.google.com/',
    pricing: '免费版 + 高级能力',
    capabilities: ['文本', '文件分析', '语音'],
    useCases: ['基于资料问答', '整理课堂笔记和论文', '生成学习摘要和复习提纲'],
    pros: ['以资料为中心', '适合学习和研究整理', '能减少跑题风险'],
    cons: ['依赖上传资料质量', '复杂引用仍需核对原文'],
    promptTemplates: [
      {
        id: 'source-grounded-notes',
        title: '资料问答 Prompt',
        description: '要求回答基于资料并标注依据。',
        content:
          '请只基于我提供的资料回答“{{question}}”。如果资料中没有答案，请明确说明。输出答案、依据段落和后续可追问问题。\n\n资料范围：\n{{source_scope}}',
        variables: [
          {
            id: 'question',
            label: '问题',
            placeholder: '例如：这份材料的核心论点是什么',
          },
          {
            id: 'source_scope',
            label: '资料范围',
            placeholder: '说明需要关注的文档、章节或链接',
            multiline: true,
          },
        ],
      },
    ],
  }),
  createTool({
    id: 'consensus',
    name: 'Consensus',
    category: 'AI 学术',
    group: 'academic',
    description: '面向科学研究的 AI 搜索工具，适合基于论文证据回答研究问题。',
    tags: ['学术搜索', '证据', '论文'],
    badge: '证据检索',
    logoUrl: 'https://consensus.app/favicon.ico',
    logoText: 'CS',
    logoTone: '#3d9bb3',
    officialUrl: 'https://consensus.app/',
    pricing: '免费版 + 订阅制',
    capabilities: ['文本'],
    useCases: ['查找科学证据', '比较研究结论', '为论文或报告寻找引用线索'],
    pros: ['聚焦学术论文', '适合证据型问题', '能辅助快速判断研究共识'],
    cons: ['仍需阅读原论文', '不适合非学术或实时新闻问题'],
    promptTemplates: [
      {
        id: 'evidence-summary',
        title: '证据综述 Prompt',
        description: '把研究问题拆成支持、反对和不确定证据。',
        content:
          '请围绕“{{claim}}”检索论文证据，并按支持、反对、不确定三类整理。请说明研究质量、样本限制和可引用的关键论文。',
        variables: [
          {
            id: 'claim',
            label: '待验证观点',
            placeholder: '例如：间隔重复比集中复习更有助于长期记忆',
          },
        ],
      },
    ],
  }),
  createTool({
    id: 'cursor',
    name: 'Cursor',
    category: 'AI 编程',
    group: 'dev',
    description: '面向开发者的 AI 编程编辑器，适合代码生成、重构和项目开发。',
    tags: ['编程', 'IDE', 'React'],
    badge: '开发必备',
    isFavorite: true,
    logoUrl: 'https://cursor.com/favicon.ico',
    logoText: 'CR',
    logoTone: '#343a46',
    officialUrl: 'https://cursor.com/',
    pricing: '免费版 + 订阅制高级能力',
    capabilities: ['文本', '代码', '文件分析'],
    useCases: ['在代码库内生成和修改功能', '解释复杂文件关系', '辅助重构和修复测试'],
    pros: ['贴近真实代码上下文', '适合连续开发任务', '编辑体验和 IDE 融合度高'],
    cons: ['大型改动仍需人工拆解任务', '自动修改后要运行测试和 code review'],
    promptTemplates: [
      {
        id: 'repo-refactor',
        title: '代码重构 Prompt',
        description: '让 AI 在限定范围内重构代码。',
        content:
          '请只重构以下文件中的{{refactor_goal}}，保持外部行为不变。完成后说明改动点并列出需要运行的测试。\n\n文件范围：\n{{file_scope}}',
        variables: [
          {
            id: 'refactor_goal',
            label: '重构目标',
            placeholder: '例如：重复逻辑、过大的组件、命名混乱',
            defaultValue: '重复逻辑',
          },
          {
            id: 'file_scope',
            label: '文件范围',
            placeholder: '列出需要 Cursor 关注的文件或目录',
            multiline: true,
          },
        ],
      },
    ],
  }),
]
