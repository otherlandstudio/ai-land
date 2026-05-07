export default function ToolCardSkeleton() {
  return (
    <div
      className="overflow-hidden"
      style={{
        background: '#222222',
        borderRadius: 24,
        padding: '20px 24px 24px 24px',
      }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 28 }}>
        <div className="h-[14px] w-[120px] rounded-full bg-[#2c2c2c] animate-pulse" />
        <div className="h-[32px] w-[32px] rounded-full bg-[#2c2c2c] animate-pulse" />
      </div>

      <div
        className="animate-pulse"
        style={{
          aspectRatio: '16 / 10',
          borderRadius: 12,
          background: '#1a1a1a',
          marginBottom: 36,
          marginLeft: 16,
          marginRight: 16,
        }}
      />

      <div className="h-[26px] w-2/3 rounded-md bg-[#2c2c2c] animate-pulse" style={{ marginBottom: 12 }} />

      <div className="flex flex-col gap-2" style={{ marginBottom: 24 }}>
        <div className="h-[14px] w-full rounded-full bg-[#1a1a1a] animate-pulse" />
        <div className="h-[14px] w-5/6 rounded-full bg-[#1a1a1a] animate-pulse" />
      </div>

      <div className="flex gap-1.5">
        <div className="h-[26px] w-[120px] rounded-md bg-[#141414] animate-pulse" />
        <div className="h-[26px] w-[100px] rounded-md bg-[#141414] animate-pulse" />
        <div className="h-[26px] w-[140px] rounded-md bg-[#141414] animate-pulse" />
      </div>
    </div>
  )
}
