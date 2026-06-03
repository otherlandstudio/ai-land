import type { CollectionConfig } from 'payload'

/**
 * Media — завантаження зображень (скріншоти тулів тощо).
 * Файли йдуть у Supabase Storage (бакет tool-screenshots) через s3Storage-плагін,
 * або локально в public/media, якщо S3-ключі не задані.
 */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Медіа',
    plural: 'Медіа',
  },
  admin: {
    group: 'Система',
  },
  access: { read: () => true },
  fields: [
    {
      name: 'alt',
      label: 'Alt-текст',
      type: 'text',
      admin: { description: 'Alt текст для доступності та SEO' },
    },
  ],
  upload: {
    mimeTypes: ['image/*'],
  },
}
