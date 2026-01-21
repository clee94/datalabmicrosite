import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getNewsArticle, getNews, ContentBlock } from '@/lib/notion';

export const revalidate = 60;

// Generate static paths for all news articles
export async function generateStaticParams() {
  const news = await getNews().catch(() => []);
  return news.map((article) => ({
    id: article.id,
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

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getNewsArticle(id);

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

  return (
    <div className="py-16">
      <div className="mx-auto max-w-2xl px-6">
        {/* Back link */}
        <Link
          href="/blog"
          className="font-mono text-xs uppercase tracking-wide text-[var(--muted)] hover:text-[var(--pro-indigo)] transition-colors mb-10 inline-block"
        >
          ← Blog
        </Link>

        {/* Article header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 font-mono text-xs text-[var(--muted)] mb-4">
            <time>{formatDate(article.date)}</time>
            {article.author && (
              <>
                <span>/</span>
                <span>{article.author.name}</span>
              </>
            )}
          </div>
          <h1 className="text-3xl tracking-tight text-[var(--black)] leading-tight">
            {article.title}
          </h1>
          {article.description && (
            <p className="mt-4 text-[var(--muted)] font-light border-l border-[var(--cloud)] pl-4">
              {article.description}
            </p>
          )}
        </header>

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
            href="/blog"
            className="font-mono text-xs uppercase tracking-wide text-[var(--muted)] hover:text-[var(--pro-indigo)] transition-colors"
          >
            ← All articles
          </Link>
        </footer>
      </div>
    </div>
  );
}
