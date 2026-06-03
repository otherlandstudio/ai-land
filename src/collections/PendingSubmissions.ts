import type { CollectionConfig } from 'payload'

/**
 * PendingSubmissions — заявки на додавання тулів:
 * з форми /submit (user_submission) і з тижневого ресерчу (weekly_research).
 * Дзеркалить legacy `pending_tools` (src/lib/types.ts → PendingTool).
 *
 * dbName: 'pending_submissions' (default) — не конфліктує з legacy `pending_tools`.
 */
export const PendingSubmissions: CollectionConfig = {
  slug: 'pending-submissions',
  labels: { singular: 'Заявка', plural: 'Заявки (черга)' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'source', 'submittedBy', 'createdAt'],
    group: 'Каталог',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'title',
      label: 'Назва тула',
      type: 'text',
      admin: { description: 'Дублюється з даних тула для зручності в списку.' },
    },
    {
      name: 'status',
      label: 'Статус',
      type: 'select',
      defaultValue: 'pending_review',
      options: [
        { label: 'На розгляді', value: 'pending_review' },
        { label: 'Схвалено', value: 'approved' },
        { label: 'Відхилено', value: 'rejected' },
      ],
    },
    {
      name: 'source',
      label: 'Джерело',
      type: 'select',
      options: [
        { label: 'Тижневий ресерч', value: 'weekly_research' },
        { label: 'Заявка користувача', value: 'user_submission' },
      ],
    },
    { name: 'submittedBy', label: 'Хто подав', type: 'text' },
    { name: 'telegramMsgId', label: 'Telegram message ID', type: 'number' },
    {
      name: 'toolData',
      label: 'Дані тула',
      type: 'json',
      admin: { description: 'Сирі дані заявки (name, slug, category, description, тощо).' },
    },
  ],
}
