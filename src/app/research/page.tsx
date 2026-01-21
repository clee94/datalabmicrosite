import { getPublications, getResearchProjects } from '@/lib/notion';

export const revalidate = 60;

export default async function ResearchPage() {
  const [publications, projects] = await Promise.all([
    getPublications().catch(() => []),
    getResearchProjects().catch(() => []),
  ]);

  // Placeholder data if no Notion data
  const showPlaceholderPubs = publications.length === 0;
  const showPlaceholderProjects = projects.length === 0;

  const placeholderPubs = [
    { id: '1', title: 'Efficient Data Pipeline Orchestration at Scale', authors: 'A. Johnson, J. Smith', venue: 'ICML 2025', year: 2025, paperUrl: '#', codeUrl: '#' },
    { id: '2', title: 'Learning to Detect Data Quality Issues', authors: 'M. Garcia, J. Smith', venue: 'NeurIPS 2024', year: 2024, paperUrl: '#', codeUrl: '#' },
  ];

  const placeholderProjects = [
    { id: '1', title: 'Scalable Data Pipeline Infrastructure', description: 'Building next-generation data processing systems.', status: 'Active', tags: ['Data Systems'], team: '', order: 0 },
    { id: '2', title: 'ML-Powered Data Quality', description: 'Machine learning techniques for data quality at scale.', status: 'Active', tags: ['Machine Learning'], team: '', order: 1 },
  ];

  const displayPubs = showPlaceholderPubs ? placeholderPubs : publications;
  const displayProjects = showPlaceholderProjects ? placeholderProjects : projects;

  // Group publications by year
  const pubsByYear = displayPubs.reduce((acc, pub) => {
    const year = pub.year.toString();
    if (!acc[year]) acc[year] = [];
    acc[year].push(pub);
    return acc;
  }, {} as Record<string, typeof displayPubs>);

  const years = Object.keys(pubsByYear).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <div className="py-16">
      <div className="mx-auto max-w-5xl px-6">
        <h1 className="text-3xl tracking-tight text-neutral-900">Research</h1>
        <p className="mt-3 text-neutral-500 font-light">
          Publications, working papers, and ongoing research projects.
        </p>

        {/* Research Projects */}
        <section className="mt-14">
          <h2 className="text-xs font-mono uppercase tracking-wide text-neutral-500 mb-6">Projects</h2>
          {showPlaceholderProjects && (
            <p className="mb-4 font-mono text-sm text-neutral-400">
              // Placeholder data
            </p>
          )}
          <div className="space-y-4">
            {displayProjects.map((project) => (
              <div key={project.id} className="border border-neutral-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-mono text-sm text-neutral-900">{project.title}</h3>
                    <p className="mt-2 text-sm text-neutral-500 font-light">{project.description}</p>
                    {project.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="font-mono text-xs text-neutral-400"
                          >
                            [{tag}]
                          </span>
                        ))}
                      </div>
                    )}
                    {project.team && (
                      <p className="mt-3 font-mono text-xs text-neutral-400">
                        Team: {project.team}
                      </p>
                    )}
                  </div>
                  <span
                    className={`font-mono text-xs shrink-0 ${
                      project.status === 'Active'
                        ? 'text-green-600'
                        : 'text-neutral-400'
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Publications */}
        <section className="mt-16">
          <h2 className="text-xs font-mono uppercase tracking-wide text-neutral-500 mb-6">Publications</h2>
          {showPlaceholderPubs && (
            <p className="mb-4 font-mono text-sm text-neutral-400">
              // Placeholder data
            </p>
          )}
          <div className="space-y-10">
            {years.map((year) => (
              <div key={year}>
                <h3 className="font-mono text-sm text-neutral-900 border-b border-neutral-200 pb-2 mb-4">
                  {year}
                </h3>
                <ul className="space-y-5">
                  {pubsByYear[year].map((paper) => (
                    <li key={paper.id} className="border-l border-neutral-200 pl-4">
                      <h4 className="text-base text-neutral-900">{paper.title}</h4>
                      <p className="mt-1 text-sm text-neutral-500 font-light">{paper.authors}</p>
                      <p className="font-mono text-xs text-neutral-400 mt-1">{paper.venue}</p>
                      <div className="mt-2 flex gap-3">
                        {paper.paperUrl && (
                          <a
                            href={paper.paperUrl}
                            className="font-mono text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            [paper]
                          </a>
                        )}
                        {paper.codeUrl && (
                          <a
                            href={paper.codeUrl}
                            className="font-mono text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            [code]
                          </a>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
