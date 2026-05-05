export interface Tool {
  id: string
  name: string
  slug: string
  category: string
  description: string | null
  eli5: string | null
  tags: string[] | null
  use_cases: string[] | null
  price_label: string | null
  price_type: 'free' | 'freemium' | 'paid' | null
  website_url: string | null
  cover_color: string | null
  screenshot_url: string | null
  published: boolean
  submitted_by_user: boolean
  created_at: string
  published_at: string | null
}

export interface PendingTool {
  id: string
  telegram_msg_id: number | null
  tool_data: Omit<Tool, 'id' | 'published' | 'submitted_by_user' | 'created_at' | 'published_at'>
  status: 'pending_review' | 'approved' | 'rejected'
  source: 'weekly_research' | 'user_submission'
  submitted_by: string | null
  created_at: string
}

export type Category =
  | 'Assistants'
  | 'Writing & Content'
  | 'Creativity & Design'
  | 'Development'
  | 'Research & Analytics'
  | 'Product Management'
  | 'Productivity'
  | 'Marketing'
  | 'Sales'
  | 'Hiring & HR'

export const CATEGORIES: Category[] = [
  'Assistants',
  'Writing & Content',
  'Creativity & Design',
  'Development',
  'Research & Analytics',
  'Product Management',
  'Productivity',
  'Marketing',
  'Sales',
  'Hiring & HR',
]
