import Image from 'next/image';
import Link from 'next/link';
import { getResearchProjects } from '@/lib/notion';

export const revalidate = 60;

// Color mapping for article types
const articleTypeColors: Record<string, string> = {
  'Research Paper': 'text-[var(--pro-indigo)]',
  'Case Study': 'text-[var(--blue)]',
  'Technical Report': 'text-[var(--purple)]',
  'Blog Post': 'text-[var(--orange)]',
  'White Paper': 'text-[var(--sky)]',
  'Tutorial': 'text-[var(--yellow)]',
  'Analysis': 'text-[var(--sand)]',
};

const getArticleTypeColor = (articleType: string): string => {
  return articleTypeColors[articleType] || 'text-[var(--muted)]';
};

const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
};

export default async function ResearchPage() {
  const projects = await getResearchProjects().catch(() => []);

  return (
    <div className="py-16">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header with illustration */}
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center mb-14">
          <div>
            <h1 className="text-3xl tracking-tight text-[var(--black)]">Research</h1>
            <p className="mt-3 text-[var(--muted)] font-light">
              Research, ideas, and publications that explore AI's data frontier.
            </p>
          </div>
          <div className="relative h-48 overflow-hidden border border-[var(--cloud)]">
            <Image
              src="/images/illustrations.png"
              alt="Abstract illustrations"
              fill
              className="object-cover object-[0%_0%]"
              priority
            />
          </div>
        </div>

        {/* Research Projects */}
        <section>
          {projects.length === 0 ? (
            <p className="text-[var(--muted)] font-light">No research projects available.</p>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="relative border border-[var(--cloud)] hover:border-[var(--pro-indigo)]/30 transition-colors flex flex-col sm:flex-row"
                >
                  {/* Full card clickable link */}
                  <Link
                    href={`/research/${project.id}`}
                    className="absolute inset-0 z-0"
                    aria-label={`Read ${project.title}`}
                  />
                  {/* Preview Image */}
                  {project.previewImage && (
                    <div className="shrink-0 flex items-center justify-center sm:justify-start bg-[var(--cloud)]/20 h-[140px] sm:h-auto sm:max-h-[120px]">
                      <Image
                        src={project.previewImage}
                        alt={project.title}
                        width={200}
                        height={120}
                        className="object-contain max-h-[120px] w-auto"
                      />
                    </div>
                  )}
                  {/* Content */}
                  <div className="flex-1 p-4 sm:p-5 flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                    <div className="flex-1">
                      <h3 className="font-mono text-sm text-[var(--black)]">{project.title}</h3>
                      <p className="mt-1 text-xs text-[var(--muted)] font-light">
                        by{' '}
                        <Link
                          href="/people"
                          className="relative z-10 hover:text-[var(--pro-indigo)] transition-colors"
                        >
                          {project.authors || 'Protege Data Lab'}
                        </Link>
                      </p>
                      <p className="mt-2 text-sm text-[var(--muted)] font-light">{project.description}</p>
                      {project.tags && project.tags.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="font-mono text-xs text-[var(--pro-indigo)]"
                            >
                              [{tag}]
                            </span>
                          ))}
                        </div>
                      )}
                      {project.team && (
                        <p className="mt-3 font-mono text-xs text-[var(--muted)]">
                          Team: {project.team}
                        </p>
                      )}
                    </div>
                    <div className="shrink-0 sm:text-right flex sm:flex-col gap-2 sm:gap-0 mt-2 sm:mt-0">
                      {project.articleType && (
                        <span className={`font-mono text-xs ${getArticleTypeColor(project.articleType)}`}>
                          {project.articleType}
                        </span>
                      )}
                      {project.date && (
                        <span className="font-mono text-xs text-[var(--muted)] sm:mt-1">
                          {formatDate(project.date)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
