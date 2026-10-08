import { NextRequest, NextResponse } from 'next/server'

export function requireAdmin(request: NextRequest): NextResponse | null {
  const key = process.env.ADMIN_API_KEY
  if (!key || request.headers.get('x-admin-key') !== key) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}
