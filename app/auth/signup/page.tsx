import { redirect } from 'next/navigation'

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams
  redirect(`/auth/login?signup=1${next ? `&next=${encodeURIComponent(next)}` : ''}`)
}
