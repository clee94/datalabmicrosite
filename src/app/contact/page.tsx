export default function ContactPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-5xl px-6">
        <h1 className="text-3xl tracking-tight text-[var(--black)]">Contact</h1>
        <p className="mt-3 text-[var(--muted)] font-light">
          Get in touch with Protege Data Lab.
        </p>

        <div className="mt-14 grid gap-12 md:grid-cols-2">
          {/* Contact Info */}
          <div className="space-y-10">
            <div>
              <h2 className="text-xs font-mono uppercase tracking-wide text-[var(--muted)] mb-4">Location</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-mono text-sm text-[var(--black)]">Address</h3>
                  <p className="mt-1 text-sm text-[var(--muted)] font-light">
                    123 University Ave<br />
                    Building 100, Room 101<br />
                    City, State 12345
                  </p>
                </div>
                <div>
                  <h3 className="font-mono text-sm text-[var(--black)]">Email</h3>
                  <a href="mailto:contact@protegedatalab.com" className="text-sm text-[var(--muted)] hover:text-[var(--pro-indigo)] transition-colors">
                    contact@protegedatalab.com
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xs font-mono uppercase tracking-wide text-[var(--muted)] mb-4">Join Our Lab</h2>
              <div className="space-y-5">
                <p className="text-sm text-[var(--muted)] font-light">
                  We are always looking for talented and motivated researchers to join our team.
                </p>
                <div>
                  <h3 className="font-mono text-sm text-[var(--black)]">Prospective PhD Students</h3>
                  <p className="mt-1 text-sm text-[var(--muted)] font-light">
                    Please apply through the university&apos;s graduate admissions process and
                    mention your interest in Protege Data Lab in your application.
                  </p>
                </div>
                <div>
                  <h3 className="font-mono text-sm text-[var(--black)]">Postdocs & Research Scientists</h3>
                  <p className="mt-1 text-sm text-[var(--muted)] font-light">
                    Send your CV and research statement to our lab email.
                  </p>
                </div>
                <div>
                  <h3 className="font-mono text-sm text-[var(--black)]">Undergraduate Research</h3>
                  <p className="mt-1 text-sm text-[var(--muted)] font-light">
                    We welcome undergraduate students interested in research.
                    Please reach out with your resume and areas of interest.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div>
            <div className="h-64 w-full border border-[var(--cloud)] bg-[var(--cloud)]/20 flex items-center justify-center">
              <span className="font-mono text-xs text-[var(--muted)]">// map</span>
            </div>
            <p className="mt-4 text-sm text-[var(--muted)] font-light">
              Located in the heart of campus, easily accessible by public transit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
