import Link from 'next/link'
import Image from 'next/image'
import type { Tool } from '@/lib/types'
import { getCategoryColor } from '@/lib/utils'

export default function ToolCard({ tool }: { tool: Tool }) {
  const tierColor = getCategoryColor(tool.category)

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group block bg-[#181b38] border border-white/6 rounded-2xl overflow-hidden hover:border-white/15 hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Tier bar */}
      <div className="h-[3px]" style={{ background: tierColor }} />

      {/* Screenshot */}
      <div className="relative aspect-[16/9] bg-[#1c2146] overflow-hidden">
        {tool.screenshot_url ? (
          <Image
            src={tool.screenshot_url}
            alt={tool.name}
            fill
            className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center text-[32px] font-extrabold opacity-10"
            style={{ color: tierColor }}
          >
            {tool.name[0]}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Category */}
        <div
          className="text-[10px] font-bold uppercase tracking-wider mb-1.5"
          style={{ color: tierColor }}
        >
          {tool.category}
        </div>

        {/* Name */}
        <h3 className="font-bold text-[15px] text-[#fafafa] leading-tight mb-2 group-hover:text-[#c9e75d] transition-colors">
          {tool.name}
        </h3>

        {/* Description */}
        {tool.description && (
          <p className="text-[12px] text-[#7676a1] leading-relaxed line-clamp-2">
            {tool.description}
          </p>
        )}
      </div>
    </Link>
  )
}
