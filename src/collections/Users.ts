import type { CollectionConfig } from 'payload'

/**
 * Users — auth-колекція для адмінів CMS (email + пароль).
 *
 * `access.create` відкритий на старті, щоб перший адмін міг
 * самозареєструватись на /admin. Після створення першого адміна
 * закриваємо на `authenticated`.
 *
 * useAPIKey — для сервісної автоматизації (Telegram-бот, submit-форма).
 */
export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    useAPIKey: true,
  },
  labels: {
    singular: 'Користувач',
    plural: 'Користувачі',
  },
  admin: {
    useAsTitle: 'email',
    group: 'Система',
  },
  access: {
    create: () => true, // ⚠️ закрити після першого адміна → ({ req }) => Boolean(req.user)
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [{ name: 'name', label: 'Імʼя', type: 'text' }],
  timestamps: true,
}
