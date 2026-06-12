import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { uk } from '@payloadcms/translations/languages/uk'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Tools } from './collections/Tools'
import { PendingSubmissions } from './collections/PendingSubmissions'
import { Subscribers } from './collections/Subscribers'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// S3 (Supabase Storage) вмикається лише коли задані ключі — інакше білд/локалка
// працюють на локальному media-сховищі без зовнішніх кредів.
const s3Enabled = Boolean(process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      title: 'AI Land CMS',
      titleSuffix: ' — AI Land CMS',
      description: 'AI Land — керування каталогом AI-тулів',
    },
    components: {
      graphics: {
        Icon: '@/components/admin/AdminIcon#AdminIcon',
        Logo: '@/components/admin/AdminLogo#AdminLogo',
      },
    },
  },
  // Українська як єдина мова інтерфейсу адмінки.
  i18n: {
    supportedLanguages: { uk },
    fallbackLanguage: 'uk',
  },
  collections: [Tools, PendingSubmissions, Subscribers, Media, Users],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
      // Supabase пулери обмежені; тримаємо макс. конектів низьким на інстанс.
      max: Number(process.env.PG_POOL_MAX || 3),
      // Supabase вимагає SSL (сертифікати пулера не валідуються стандартним CA).
      ssl: /supabase\.com/.test(process.env.DATABASE_URL || '')
        ? { rejectUnauthorized: false }
        : undefined,
    },
    push: false, // прод-БД: керуємо схемою через міграції, не авто-push
  }),
  sharp,
  plugins: s3Enabled
    ? [
        s3Storage({
          collections: {
            media: {
              disablePayloadAccessControl: true,
              generateFileURL: ({ filename, prefix }) =>
                `${process.env.SUPABASE_URL}/storage/v1/object/public/${process.env.S3_BUCKET}/${
                  prefix ? prefix + '/' : ''
                }${filename}`,
            },
          },
          bucket: process.env.S3_BUCKET || 'tool-screenshots',
          config: {
            endpoint: process.env.S3_ENDPOINT,
            region: process.env.S3_REGION,
            forcePathStyle: true,
            credentials: {
              accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
              secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
            },
          },
        }),
      ]
    : [],
})
