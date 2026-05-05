import { NextRequest, NextResponse } from 'next/server'
import { getTools } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? ''
  if (!q.trim()) return NextResponse.json({ tools: [] })

  const tools = await getTools({ query: q, limit: 8 })
  return NextResponse.json({ tools })
}
