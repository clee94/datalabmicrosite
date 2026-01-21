import { getPeople, Person } from '@/lib/notion';

export const revalidate = 60;

function PersonCard({ person, showYear = false }: { person: Person; showYear?: boolean }) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-lg border border-gray-200 bg-white">
      <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
        <span className="text-4xl">👤</span>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">{person.name}</h3>
      <p className="text-sm text-blue-600">{person.role}</p>
      {showYear && person.year && (
        <p className="text-sm text-gray-500">{person.year}</p>
      )}
      {person.bio && (
        <p className="mt-2 text-sm text-gray-600">{person.bio}</p>
      )}
      {person.currentPosition && (
        <p className="mt-2 text-sm text-gray-600">Now: {person.currentPosition}</p>
      )}
      {(person.website || person.email) && (
        <div className="mt-3 flex gap-3">
          {person.website && (
            <a href={person.website} className="text-sm text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
              Website
            </a>
          )}
          {person.email && (
            <a href={`mailto:${person.email}`} className="text-sm text-blue-600 hover:underline">
              Email
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
      <div className="mx-auto max-w-6xl px-6">
        <h1 className="text-4xl font-bold text-gray-900">People</h1>
        <p className="mt-4 text-lg text-gray-600">
          Meet the researchers and students of Protege Data Lab.
        </p>

        {showPlaceholder && (
          <p className="mt-4 text-sm text-gray-500 italic">
            Add people in Notion to see them here.
          </p>
        )}

        {/* Faculty */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900">Faculty</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(showPlaceholder ? placeholderFaculty : faculty).map((person) => (
              <PersonCard key={person.id} person={person as Person} />
            ))}
          </div>
        </section>

        {/* Postdocs */}
        {(postdocs.length > 0) && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900">Postdoctoral Researchers</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {postdocs.map((person) => (
                <PersonCard key={person.id} person={person} />
              ))}
            </div>
          </section>
        )}

        {/* PhD Students */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900">PhD Students</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(showPlaceholder ? placeholderPhd : phdStudents).map((person) => (
              <PersonCard key={person.id} person={person as Person} showYear />
            ))}
          </div>
        </section>

        {/* Alumni */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900">Alumni</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(showPlaceholder ? placeholderAlumni : alumni).map((person) => (
              <PersonCard key={person.id} person={person as Person} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
