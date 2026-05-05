import { NextRequest, NextResponse } from 'next/server'
import { getTools } from '@/lib/supabase'

const PAGE_SIZE = 40

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const category = sp.get('category') ?? undefined
  const query = sp.get('q') ?? undefined
  const offset = Number(sp.get('offset') ?? 0)
  const limit = Math.min(Number(sp.get('limit') ?? PAGE_SIZE), 100)

  const tools = await getTools({ category, query, limit, offset })
  return NextResponse.json({ tools })
}
