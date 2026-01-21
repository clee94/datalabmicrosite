import { getPublications } from '@/lib/notion';

export const revalidate = 60;

export default async function PublicationsPage() {
  const publications = await getPublications().catch(() => []);

  // Placeholder data if no Notion data
  const showPlaceholder = publications.length === 0;
  const placeholderPubs = [
    { id: '1', title: 'Efficient Data Pipeline Orchestration at Scale', authors: 'A. Johnson, J. Smith', venue: 'ICML 2025', year: 2025, paperUrl: '#', codeUrl: '#' },
    { id: '2', title: 'Learning to Detect Data Quality Issues', authors: 'M. Garcia, J. Smith', venue: 'NeurIPS 2024', year: 2024, paperUrl: '#', codeUrl: '#' },
    { id: '3', title: 'Real-time Visualization of Streaming Data', authors: 'D. Chen, J. Smith', venue: 'CHI 2024', year: 2024, paperUrl: '#' },
    { id: '4', title: 'A Survey of Modern Data Infrastructure', authors: 'J. Smith, M. Brown', venue: 'VLDB 2023', year: 2023, paperUrl: '#' },
  ];

  const displayPubs = showPlaceholder ? placeholderPubs : publications;

  // Group by year
  const pubsByYear = displayPubs.reduce((acc, pub) => {
    const year = pub.year.toString();
    if (!acc[year]) acc[year] = [];
    acc[year].push(pub);
    return acc;
  }, {} as Record<string, typeof displayPubs>);

  const years = Object.keys(pubsByYear).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <div className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h1 className="text-4xl font-bold text-gray-900">Publications</h1>
        <p className="mt-4 text-lg text-gray-600">
          Selected publications from the Protege Data Lab.
        </p>

        {showPlaceholder && (
          <p className="mt-4 text-sm text-gray-500 italic">
            Add publications in Notion to see them here.
          </p>
        )}

        <div className="mt-12 space-y-12">
          {years.map((year) => (
            <section key={year}>
              <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-200 pb-2">
                {year}
              </h2>
              <ul className="mt-6 space-y-6">
                {pubsByYear[year].map((paper) => (
                  <li key={paper.id} className="border-l-2 border-blue-200 pl-4">
                    <h3 className="text-lg font-semibold text-gray-900">{paper.title}</h3>
                    <p className="mt-1 text-gray-600">{paper.authors}</p>
                    <p className="text-sm font-medium text-blue-600">{paper.venue}</p>
                    <div className="mt-2 flex gap-4">
                      {paper.paperUrl && (
                        <a
                          href={paper.paperUrl}
                          className="text-sm text-gray-500 hover:text-blue-600"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          [Paper]
                        </a>
                      )}
                      {paper.codeUrl && (
                        <a
                          href={paper.codeUrl}
                          className="text-sm text-gray-500 hover:text-blue-600"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          [Code]
                        </a>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
