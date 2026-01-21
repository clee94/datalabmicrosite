import { getPeople, Person } from '@/lib/notion';

export const revalidate = 60;

function PersonCard({ person, showYear = false }: { person: Person; showYear?: boolean }) {
  return (
    <div className="border border-neutral-200 p-5">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 bg-neutral-100 flex items-center justify-center shrink-0 font-mono text-xs text-neutral-400">
          {person.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-mono text-sm text-neutral-900">{person.name}</h3>
          <p className="text-xs text-neutral-500 mt-0.5">
            {person.role}
            {showYear && person.year && ` / ${person.year}`}
          </p>
        </div>
      </div>
      {person.bio && (
        <p className="mt-3 text-sm text-neutral-500 font-light">{person.bio}</p>
      )}
      {person.currentPosition && (
        <p className="mt-2 text-sm text-neutral-500 font-light">Now: {person.currentPosition}</p>
      )}
      {(person.website || person.email) && (
        <div className="mt-3 flex gap-3">
          {person.website && (
            <a href={person.website} className="font-mono text-xs text-neutral-500 hover:text-neutral-900 transition-colors" target="_blank" rel="noopener noreferrer">
              [web]
            </a>
          )}
          {person.email && (
            <a href={`mailto:${person.email}`} className="font-mono text-xs text-neutral-500 hover:text-neutral-900 transition-colors">
              [email]
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default async function PeoplePage() {
  const people = await getPeople().catch(() => []);

  // Group people by role
  const faculty = people.filter((p) => p.role === 'Faculty');
  const phdStudents = people.filter((p) => p.role === 'PhD Student');
  const postdocs = people.filter((p) => p.role === 'Postdoc');
  const alumni = people.filter((p) => p.role === 'Alumni');

  // Placeholder data if no Notion data
  const showPlaceholder = people.length === 0;
  const placeholderFaculty = [
    { id: '1', name: 'Dr. Jane Smith', role: 'Faculty', bio: 'Professor of Computer Science. Research interests include data systems, machine learning, and scalable computing.', email: 'jsmith@university.edu', website: 'https://example.com', order: 0 },
  ];
  const placeholderPhd = [
    { id: '2', name: 'Alex Johnson', role: 'PhD Student', bio: 'Research focus: Large-scale data processing systems.', year: '3rd Year', order: 0 },
    { id: '3', name: 'Maria Garcia', role: 'PhD Student', bio: 'Research focus: Machine learning for data quality.', year: '2nd Year', order: 1 },
  ];
  const placeholderAlumni = [
    { id: '4', name: 'Dr. Sarah Williams', role: 'Alumni', bio: '', currentPosition: 'Research Scientist at Google', order: 0 },
  ];

  return (
    <div className="py-16">
      <div className="mx-auto max-w-5xl px-6">
        <h1 className="text-3xl tracking-tight text-neutral-900">People</h1>
        <p className="mt-3 text-neutral-500 font-light">
          Meet the researchers and students of Protege Data Lab.
        </p>

        {showPlaceholder && (
          <p className="mt-4 font-mono text-sm text-neutral-400">
            // Placeholder data
          </p>
        )}

        {/* Faculty */}
        <section className="mt-14">
          <h2 className="text-xs font-mono uppercase tracking-wide text-neutral-500 mb-6">Faculty</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(showPlaceholder ? placeholderFaculty : faculty).map((person) => (
              <PersonCard key={person.id} person={person as Person} />
            ))}
          </div>
        </section>

        {/* Postdocs */}
        {(postdocs.length > 0) && (
          <section className="mt-14">
            <h2 className="text-xs font-mono uppercase tracking-wide text-neutral-500 mb-6">Postdoctoral Researchers</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {postdocs.map((person) => (
                <PersonCard key={person.id} person={person} />
              ))}
            </div>
          </section>
        )}

        {/* PhD Students */}
        <section className="mt-14">
          <h2 className="text-xs font-mono uppercase tracking-wide text-neutral-500 mb-6">PhD Students</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(showPlaceholder ? placeholderPhd : phdStudents).map((person) => (
              <PersonCard key={person.id} person={person as Person} showYear />
            ))}
          </div>
        </section>

        {/* Alumni */}
        <section className="mt-14">
          <h2 className="text-xs font-mono uppercase tracking-wide text-neutral-500 mb-6">Alumni</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {(showPlaceholder ? placeholderAlumni : alumni).map((person) => (
              <PersonCard key={person.id} person={person as Person} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
