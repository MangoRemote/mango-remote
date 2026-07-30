import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer-main">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-logo">🥭 <span>Mango</span>Remote</div>
          <p className="footer-tagline">Remote jobs that let you live in Asia.</p>
          <div className="footer-social">
            <a href="https://instagram.com/sidneyygeorge" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <div className="footer-col-heading">Jobs</div>
            <Link href="/">All Remote Jobs</Link>
            <Link href="/?category=Engineering">Engineering</Link>
            <Link href="/?category=Design">Design</Link>
            <Link href="/?category=Marketing">Marketing</Link>
            <Link href="/?category=Sales">Sales</Link>
          </div>
          <div className="footer-col">
            <div className="footer-col-heading">Site</div>
            <Link href="/post-a-job">Post a Job</Link>
            <Link href="/premium">Go Premium</Link>
            <Link href="/about">About</Link>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} MangoRemote. All rights reserved.</span>
        <div style={{ display: 'flex', gap: 16 }}>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  )
}
