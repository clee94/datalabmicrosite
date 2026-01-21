import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-[var(--cloud)] bg-[var(--cloud)]/30">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-wide text-[var(--black)]">Protege Data Lab</h3>
            <p className="mt-3 text-sm text-[var(--muted)] font-light">
              Tackling the fundamental challenges in data for AI.
            </p>
          </div>
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wide text-[var(--black)]">Links</h4>
            <ul className="mt-3 space-y-2">
              <li><Link href="/about" className="text-sm text-[var(--muted)] hover:text-[var(--pro-indigo)] transition-colors">About</Link></li>
              <li><Link href="/people" className="text-sm text-[var(--muted)] hover:text-[var(--pro-indigo)] transition-colors">People</Link></li>
              <li><Link href="/blog" className="text-sm text-[var(--muted)] hover:text-[var(--pro-indigo)] transition-colors">Blog</Link></li>
              <li><Link href="/research" className="text-sm text-[var(--muted)] hover:text-[var(--pro-indigo)] transition-colors">Research</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-xs uppercase tracking-wide text-[var(--black)]">Contact</h4>
            <a href="mailto:data@withprotege.ai" className="mt-3 block text-sm text-[var(--muted)] font-light hover:text-[var(--pro-indigo)] transition-colors">
              data@withprotege.ai
            </a>
          </div>
        </div>
        <div className="mt-10 border-t border-[var(--cloud)] pt-6 text-xs text-[var(--muted)] font-mono">
          © {new Date().getFullYear()} Protege Data Lab
        </div>
      </div>
    </footer>
  );
}
