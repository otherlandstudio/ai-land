import type { CollectionConfig } from 'payload'

/**
 * Subscribers — email-підписники з hero-форми ("Get monthly top picks").
 * Зараз лише збираємо адреси; розсилка — окремий етап (Resend/Mailchimp пізніше).
 */
export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  labels: { singular: 'Підписник', plural: 'Підписники' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'status', 'source', 'createdAt'],
    group: 'Каталог',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: 'email',
      label: 'Email',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'status',
      label: 'Статус',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Активний', value: 'active' },
        { label: 'Відписався', value: 'unsubscribed' },
      ],
    },
    {
      name: 'source',
      label: 'Джерело',
      type: 'text',
      defaultValue: 'hero',
      admin: { description: 'Звідки прийшла підписка (hero-форма тощо).' },
    },
  ],
}
