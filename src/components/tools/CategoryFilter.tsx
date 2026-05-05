'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { CATEGORIES } from '@/lib/types'
import { getCategoryColor } from '@/lib/utils'

export default function CategoryFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const active = searchParams.get('category') ?? ''

  function select(cat: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (cat === active) {
      params.delete('category')
    } else {
      params.set('category', cat)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {/* All */}
      <button
        onClick={() => select('')}
        className="text-[12px] font-semibold px-4 py-2 rounded-full border transition-all"
        style={
          active === ''
            ? { background: '#c9e75d', color: '#121312', borderColor: '#c9e75d' }
            : { background: 'transparent', color: '#b1b1d3', borderColor: 'rgba(255,255,255,0.1)' }
        }
      >
        All
      </button>

      {CATEGORIES.map(cat => {
        const color = getCategoryColor(cat)
        const isActive = active === cat
        return (
          <button
            key={cat}
            onClick={() => select(cat)}
            className="text-[12px] font-semibold px-4 py-2 rounded-full border transition-all"
            style={
              isActive
                ? { background: `${color}20`, color: color, borderColor: `${color}60` }
                : { background: 'transparent', color: '#b1b1d3', borderColor: 'rgba(255,255,255,0.1)' }
            }
          >
            {cat}
          </button>
        )
      })}
    </div>
  )
}
