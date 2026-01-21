import Link from 'next/link';
import { getNews } from '@/lib/notion';

export const revalidate = 60;

export default async function BlogPage() {
  const articles = await getNews().catch((error) => {
    console.error('Error fetching news:', error);
    return [];
  });

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
      <div className="mx-auto max-w-5xl px-6">
        <h1 className="text-3xl tracking-tight text-neutral-900">Blog</h1>
        <p className="mt-3 text-neutral-500 font-light">
          News, insights, and updates from Protege Data Lab.
        </p>

        {articles.length === 0 ? (
          <p className="mt-12 font-mono text-sm text-neutral-400">
            // No articles yet
          </p>
        ) : (
          <div className="mt-12 divide-y divide-neutral-100">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/news/${article.id}`}
                className="block py-6 group"
              >
                <article>
                  <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
                    <time>{formatDate(article.date)}</time>
                    {article.author && (
                      <>
                        <span>/</span>
                        <span>{article.author.name}</span>
                      </>
                    )}
                  </div>
                  <h2 className="mt-2 text-xl text-neutral-900 group-hover:text-neutral-600 transition-colors">
                    {article.title}
                  </h2>
                  <p className="mt-2 text-neutral-500 font-light line-clamp-2">
                    {article.description}
                  </p>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
