import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getResearchArticle, getResearchProjects, ContentBlock } from '@/lib/notion';

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

// Generate static paths for all research articles
export async function generateStaticParams() {
  const projects = await getResearchProjects().catch(() => []);
  return projects.map((project) => ({
    id: project.id,
  }));
}

// Render a content block
function BlockRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'heading_1':
      return <h1 className="text-2xl text-[var(--black)] mt-10 mb-4">{block.content}</h1>;
    case 'heading_2':
      return <h2 className="text-xl text-[var(--black)] mt-8 mb-3">{block.content}</h2>;
    case 'heading_3':
      return <h3 className="text-lg text-[var(--black)] mt-6 mb-2">{block.content}</h3>;
    case 'paragraph':
      return block.content ? (
        <p className="text-[var(--muted)] font-light leading-relaxed mb-5">{block.content}</p>
      ) : (
        <div className="h-5" />
      );
    case 'bulleted_list_item':
      return (
        <li className="text-[var(--muted)] font-light ml-5 mb-2 list-disc">{block.content}</li>
      );
    case 'numbered_list_item':
      return (
        <li className="text-[var(--muted)] font-light ml-5 mb-2 list-decimal">{block.content}</li>
      );
    case 'quote':
      return (
        <blockquote className="border-l border-[var(--pro-indigo)]/30 pl-5 py-1 my-6 text-[var(--muted)] font-light italic">
          {block.content}
        </blockquote>
      );
    case 'callout':
      return (
        <div className="border border-[var(--cloud)] bg-[var(--powder)]/10 p-4 my-6">
          <p className="text-[var(--muted)] font-light">{block.content}</p>
        </div>
      );
    case 'divider':
      return <hr className="my-10 border-[var(--cloud)]" />;
    default:
      return null;
  }
}

export default async function ResearchArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getResearchArticle(id);

  if (!article) {
    notFound();
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const displayAuthors = article.authors || 'Protege Data Lab';

  return (
    <div className="py-16">
      {/* Wide header section */}
      <div className="mx-auto max-w-4xl px-6">
        {/* Back link */}
        <Link
          href="/research"
          className="font-mono text-xs uppercase tracking-wide text-[var(--muted)] hover:text-[var(--pro-indigo)] transition-colors mb-10 inline-block"
        >
          ← Research
        </Link>

        {/* Article header */}
        <header className="mb-8 md:mb-12">
          <div className={`flex flex-col-reverse md:flex-row gap-6 md:gap-8 ${article.previewImage ? 'md:items-start' : ''}`}>
            {/* Metadata */}
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl tracking-tight text-[var(--black)] leading-tight">
                {article.title}
              </h1>
              <p className="mt-2 md:mt-3 text-sm text-[var(--muted)] font-light">
                by{' '}
                <Link
                  href="/people"
                  className="hover:text-[var(--pro-indigo)] transition-colors"
                >
                  {displayAuthors}
                </Link>
              </p>
              <div className="flex items-center gap-3 font-mono text-xs text-[var(--muted)] mt-3 md:mt-4">
                <time>{formatDate(article.date)}</time>
                {article.articleType && (
                  <>
                    <span>/</span>
                    <span className={getArticleTypeColor(article.articleType)}>
                      {article.articleType}
                    </span>
                  </>
                )}
              </div>
              {article.tags && article.tags.length > 0 && (
                <div className="mt-3 md:mt-4 flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="font-mono text-xs text-[var(--pro-indigo)]"
                    >
                      [{tag}]
                    </span>
                  ))}
                </div>
              )}
              {/* Subtitle/Description */}
              {article.description && (
                <p className="mt-4 md:mt-6 text-base md:text-lg text-[var(--muted)] font-light leading-relaxed italic">
                  {article.description}
                </p>
              )}
            </div>
            {/* Preview Image */}
            {article.previewImage && (
              <div className="shrink-0 flex justify-center md:justify-end">
                <Image
                  src={article.previewImage}
                  alt={article.title}
                  width={320}
                  height={320}
                  className="object-contain w-auto h-auto max-w-[200px] sm:max-w-[250px] md:max-w-[320px]"
                />
              </div>
            )}
          </div>
        </header>

        {/* Divider */}
        <div className="border-t border-[var(--cloud)] mt-2"></div>
      </div>

      {/* Narrow body content */}
      <div className="mx-auto max-w-2xl px-6 mt-10">
        {/* Article content */}
        <article>
          {article.content.length > 0 ? (
            article.content.map((block) => (
              <BlockRenderer key={block.id} block={block} />
            ))
          ) : (
            <p className="font-mono text-sm text-[var(--muted)]">
              // Content coming soon
            </p>
          )}
        </article>

        {/* Footer */}
        <footer className="mt-14 pt-8 border-t border-[var(--cloud)]">
          <Link
            href="/research"
            className="font-mono text-xs uppercase tracking-wide text-[var(--muted)] hover:text-[var(--pro-indigo)] transition-colors"
          >
            ← All research
          </Link>
        </footer>
      </div>
    </div>
  );
}
