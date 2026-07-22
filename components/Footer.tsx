import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} MangoRemote. Remote jobs that let you live in Asia.</span>
      <div style={{ display: 'flex', gap: 20 }}>
        <Link href="/jobs">Jobs</Link>
        <Link href="/post-a-job">Post a Job</Link>
        <Link href="/premium">Premium</Link>
        <Link href="/about">About</Link>
        <a href="https://instagram.com/sidneyygeorge" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a href="https://tiktok.com/@sidneyygeorge" target="_blank" rel="noopener noreferrer">TikTok</a>
      </div>
    </footer>
  )
}
