import { getPeople, Person } from '@/lib/notion';

export const revalidate = 60;

function PersonCard({ person }: { person: Person }) {
  return (
    <div className="border border-[var(--cloud)] p-5 hover:border-[var(--pro-indigo)]/30 transition-colors">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 bg-[var(--powder)]/30 flex items-center justify-center shrink-0 font-mono text-xs text-[var(--pro-indigo)]">
          {person.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-mono text-sm text-[var(--black)]">{person.name}</h3>
          <p className="text-xs text-[var(--pro-indigo)] mt-0.5">
            {person.role}
          </p>
        </div>
      </div>
      {person.bio && (
        <p className="mt-3 text-sm text-[var(--muted)] font-light">{person.bio}</p>
      )}
      {person.currentPosition && (
        <p className="mt-2 text-sm text-[var(--muted)] font-light">Now: {person.currentPosition}</p>
      )}
      {(person.website || person.email) && (
        <div className="mt-3 flex gap-3">
          {person.website && (
            <a href={person.website} className="font-mono text-xs text-[var(--muted)] hover:text-[var(--pro-indigo)] transition-colors" target="_blank" rel="noopener noreferrer">
              [web]
            </a>
          )}
          {person.email && (
            <a href={`mailto:${person.email}`} className="font-mono text-xs text-[var(--muted)] hover:text-[var(--pro-indigo)] transition-colors">
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

  // Separate team members from alumni
  const team = people.filter((p) => p.role !== 'Alumni');
  const alumni = people.filter((p) => p.role === 'Alumni');

  // Placeholder data if no Notion data
  const showPlaceholder = people.length === 0;
  const placeholderTeam = [
    { id: '1', name: 'Engy Ziedan, Ph.D.', role: 'Assistant Professor', bio: 'Indiana University Assistant Professor and Applied Economist with training in econometrics (statistics + microeconomic theory)', order: 1 },
    { id: '2', name: 'Si-Yuan Kong, Ph.D.', role: 'Senior Scientist', bio: 'UC Irvine-trained machine learning senior scientist (formerly at Activision)', order: 2 },
    { id: '3', name: 'Allison Fox', role: 'Research Scientist', bio: 'UC Berkeley-trained measurement theory expert with AI safety and data error experience (formerly at Mathematica)', order: 3 },
    { id: '4', name: 'Sarah Tucker', role: 'Researcher', bio: 'Columbia University trained. Qualitative and quantitative researcher with healthcare data experience (formerly at Datavant)', order: 4 },
  ];

  return (
    <div className="py-16">
      <div className="mx-auto max-w-5xl px-6">
        <h1 className="text-3xl tracking-tight text-[var(--black)]">People</h1>
        <p className="mt-3 text-[var(--muted)] font-light">
          Meet the team at Protege Data Lab.
        </p>

        {showPlaceholder && (
          <p className="mt-4 font-mono text-sm text-[var(--muted)]">
            // Placeholder data
          </p>
        )}

        {/* Team */}
        <section className="mt-14">
          <h2 className="text-xs font-mono uppercase tracking-wide text-[var(--muted)] mb-6">Team</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {(showPlaceholder ? placeholderTeam : team).map((person) => (
              <PersonCard key={person.id} person={person as Person} />
            ))}
          </div>
        </section>

        {/* Alumni */}
        {(alumni.length > 0 || showPlaceholder) && (
          <section className="mt-14">
            <h2 className="text-xs font-mono uppercase tracking-wide text-[var(--muted)] mb-6">Alumni</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {alumni.map((person) => (
                <PersonCard key={person.id} person={person} />
              ))}
            </div>
            {alumni.length === 0 && showPlaceholder && (
              <p className="font-mono text-sm text-[var(--muted)]">// No alumni yet</p>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
