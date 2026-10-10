import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ ok: false, message: 'Automated job fetching is disabled' }, { status: 200 })
}
