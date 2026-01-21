import { getResearchProjects } from '@/lib/notion';

export const revalidate = 60;

export default async function ResearchPage() {
  const projects = await getResearchProjects().catch(() => []);

  // Placeholder data if no Notion data
  const showPlaceholder = projects.length === 0;
  const placeholderProjects = [
    {
      id: '1',
      title: 'Scalable Data Pipeline Infrastructure',
      description: 'Building next-generation data processing systems that can handle petabyte-scale data with low latency and high reliability.',
      status: 'Active',
      team: 'Dr. Jane Smith, Alex Johnson',
      tags: ['Data Systems', 'Distributed Computing'],
      order: 0,
    },
    {
      id: '2',
      title: 'ML-Powered Data Quality',
      description: 'Developing machine learning techniques to automatically detect, diagnose, and repair data quality issues at scale.',
      status: 'Active',
      team: 'Dr. Jane Smith, Maria Garcia',
      tags: ['Machine Learning', 'Data Quality'],
      order: 1,
    },
    {
      id: '3',
      title: 'Interactive Data Visualization',
      description: 'Creating intuitive and responsive visualization tools for exploring complex datasets.',
      status: 'Active',
      team: 'David Chen',
      tags: ['Visualization', 'HCI'],
      order: 2,
    },
  ];

  const displayProjects = showPlaceholder ? placeholderProjects : projects;

  // Get unique tags for research areas
  const allTags = [...new Set(displayProjects.flatMap((p) => p.tags))];
  const researchAreas = allTags.length > 0 ? allTags : ['Data Systems', 'Machine Learning', 'Visualization & HCI'];

  return (
    <div className="py-16">
      <div className="mx-auto max-w-6xl px-6">
        <h1 className="text-4xl font-bold text-gray-900">Research</h1>
        <p className="mt-4 text-lg text-gray-600 max-w-3xl">
          Our research spans data infrastructure, machine learning, and human-computer
          interaction. We aim to solve fundamental challenges in how we store, process,
          and understand data at scale.
        </p>

        {showPlaceholder && (
          <p className="mt-4 text-sm text-gray-500 italic">
            Add research projects in Notion to see them here.
          </p>
        )}

        {/* Research Areas */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900">Research Areas</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {researchAreas.slice(0, 6).map((area) => (
              <div key={area} className="rounded-lg bg-blue-50 p-4 text-center">
                <span className="text-lg font-semibold text-blue-900">{area}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
          <div className="mt-6 space-y-8">
            {displayProjects.map((project) => (
              <div key={project.id} className="rounded-lg border border-gray-200 bg-white p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      project.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {project.status}
                  </span>
                </div>
                <p className="mt-4 text-gray-600">{project.description}</p>
                {project.team && (
                  <div className="mt-4">
                    <span className="text-sm font-medium text-gray-500">Team: </span>
                    <span className="text-sm text-gray-700">{project.team}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
