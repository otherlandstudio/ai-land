export default function ToolCardSkeleton() {
  return (
    <div className="bg-[#181b38] border border-white/6 rounded-2xl overflow-hidden">
      {/* Tier bar */}
      <div className="h-[3px] bg-[#25295d] animate-pulse" />

      {/* Screenshot placeholder */}
      <div className="aspect-[16/9] bg-[#1c2146] animate-pulse" />

      {/* Body */}
      <div className="p-4 flex flex-col gap-2.5">
        {/* Category */}
        <div className="h-2.5 w-16 rounded-full bg-[#25295d] animate-pulse" />

        {/* Name */}
        <div className="h-4 w-3/4 rounded-full bg-[#25295d] animate-pulse" />

        {/* Description lines */}
        <div className="flex flex-col gap-1.5">
          <div className="h-3 w-full rounded-full bg-[#1c2146] animate-pulse" />
          <div className="h-3 w-5/6 rounded-full bg-[#1c2146] animate-pulse" />
        </div>

        {/* Tags */}
        <div className="flex gap-1 mt-0.5">
          <div className="h-5 w-12 rounded-full bg-[#1c2146] animate-pulse" />
          <div className="h-5 w-16 rounded-full bg-[#1c2146] animate-pulse" />
          <div className="h-5 w-10 rounded-full bg-[#1c2146] animate-pulse" />
        </div>
      </div>
    </div>
  )
}
