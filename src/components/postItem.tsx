import Link from "next/link";

export default function PostItem({ article }: { article: { article_id: string; title: string; createdAt: string } }) {
  return (
    <div className="flex items-center justify-between p-4" key={article.article_id}>
      <div className="grid gap-1">
        <Link href={`/articles/${article.article_id}`} className="font-semibold hover:underline">
          {article.title}
        </Link>

        <div>
          <p className="text-sm text-muted-foreground">{article.createdAt}</p>
        </div>
      </div>
    </div>
  );
}
