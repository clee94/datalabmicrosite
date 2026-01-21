export default function ContactPage() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h1 className="text-4xl font-bold text-gray-900">Contact</h1>
        <p className="mt-4 text-lg text-gray-600">
          Get in touch with Protege Data Lab.
        </p>

        <div className="mt-12 grid gap-12 md:grid-cols-2">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Location</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900">Address</h3>
                <p className="text-gray-600">
                  123 University Ave<br />
                  Building 100, Room 101<br />
                  City, State 12345
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Email</h3>
                <a href="mailto:contact@protegedatalab.com" className="text-blue-600 hover:underline">
                  contact@protegedatalab.com
                </a>
              </div>
            </div>

            <h2 className="mt-12 text-2xl font-bold text-gray-900">Join Our Lab</h2>
            <div className="mt-4 space-y-4 text-gray-600">
              <p>
                We are always looking for talented and motivated researchers to join our team.
              </p>
              <div>
                <h3 className="font-semibold text-gray-900">Prospective PhD Students</h3>
                <p>
                  Please apply through the university&apos;s graduate admissions process and
                  mention your interest in Protege Data Lab in your application.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Postdocs & Research Scientists</h3>
                <p>
                  Send your CV and research statement to our lab email.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Undergraduate Research</h3>
                <p>
                  We welcome undergraduate students interested in research.
                  Please reach out with your resume and areas of interest.
                </p>
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div>
            <div className="h-64 w-full rounded-lg bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Map placeholder</span>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              Located in the heart of campus, easily accessible by public transit.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
