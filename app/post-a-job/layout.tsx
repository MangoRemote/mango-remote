import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Post a Job — MangoRemote',
  description: 'Reach remote workers who want to live and work in Asia. Post your remote job on MangoRemote.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
