"use client";

import { Pagination, PaginationItem } from "@mui/material";
import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { SkeletonCard } from "@/components/SkeletonCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { createClient } from "../../utils/supabase/client";

const ITEMS_PER_PAGE = 20;

type Article = {
  article_id: string;
  title: string;
  updated_at: string;
  thumbnail_url: string;
  users: {
    avatar_url: string;
    username: string;
    id: string;
  };
};

type ArticlesData = {
  article_id: string;
  title: string;
  updated_at: string;
  users: {
    username: string;
    avatar_url: string;
    id: string;
  };
};

export default function Article({ limit, type }: { limit: number; type: "scroll" | "pageNation" }) {
  const router = useRouter();
  const supabase = createClient();

  const searchParams = useSearchParams(); // クエリパラメータを取得
  const page = parseInt(searchParams.get("page") || "1", 10);
  const [articles, setArticles] = useState<Article[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      // 合計記事数を取得
      const { count: totalArticlesCount } = await supabase.from("articles").select("*", { count: "exact", head: true });

      setTotalCount(totalArticlesCount || 0);

      // 記事データを取得
      const { data: articlesData, error } = await supabase
        .from("articles")
        .select(
          `
          article_id, title, updated_at, thumbnail_url,
          users (
            username, avatar_url, id
          )
        `,
        )
        .limit(limit)
        .range(start, end)
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("Error fetching articles:", error);
        return;
      }

      setArticles(articlesData);
      setLoading(false);
    };

    fetchArticles();
  }, [page, limit, router, supabase]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    router.push(`/articles?page=${value}`); // ページ変更時にクエリパラメータを更新
  };

  return (
    <>
      {type === "scroll" ? (
        <ScrollArea className="w-full whitespace-nowrap border-t-2 border-dashed">
          <div className="flex w-max space-x-5 p-4">
            {loading
              ? // ローディング中はスケルトンカードを表示
                Array.from(new Array(10)).map((_, index) => <SkeletonCard key={index} type="scroll" />)
              : // データ取得後に記事を表示
                articles.map((article) => (
                  <Link href={`/articles/${article.article_id}`} key={article.article_id}>
                    <Card className="w-60">
                      <figure className="shrink-0">
                        <div className="overflow-hidden bg-gray-300">
                          <Image
                            priority
                            src={article.thumbnail_url || "/images/default-thumbnail.png"}
                            alt={`${article.title}`}
                            width={600}
                            height={300}
                          />
                        </div>
                        <figcaption className="p-2 text-xs text-muted-foreground">
                          <div className="h-full min-h-10">
                            <span className="line-clamp-2 break-words font-semibold text-foreground">
                              {article.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarImage src={article.users.avatar_url} alt="@shadcn" />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div>
                              <Link className="text-xs hover:underline" href={`profile/${article.users.id}`}>
                                {article.users.username}
                              </Link>
                              <p className="text-xs">
                                最終更新 {format(new Date(article.updated_at), "yyyy年MM月dd日")}
                              </p>
                            </div>
                          </div>
                        </figcaption>
                      </figure>
                    </Card>
                  </Link>
                ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      ) : (
        <div className="gap-2">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {loading
              ? // ローディング中はスケルトンカードを表示
                Array.from(new Array(10)).map((_, index) => <SkeletonCard key={index} type="pageNation" />)
              : articles.map((article) => (
                  <Link href={`/articles/${article.article_id}`} key={article.article_id}>
                    <Card>
                      <figure className="shrink-0">
                        <div className="overflow-hidden bg-gray-300">
                          <Image
                            priority
                            src={article.thumbnail_url || "/images/default-thumbnail.png"}
                            alt={`${article.title}`}
                            width={600}
                            height={300}
                          />
                        </div>
                        <figcaption className="p-2 text-xs text-muted-foreground">
                          <div className="h-full min-h-10">
                            <span className="line-clamp-2 break-words font-semibold text-foreground">
                              {article.title}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarImage src={article.users.avatar_url} alt="@shadcn" />
                              <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div>
                              <Link className="text-xs hover:underline" href={`profile/${article.users.id}`}>
                                {article.users.username}
                              </Link>
                              <p className="text-xs">
                                最終更新 {format(new Date(article.updated_at), "yyyy年MM月dd日")}
                              </p>
                            </div>
                          </div>
                        </figcaption>
                      </figure>
                    </Card>
                  </Link>
                ))}
          </div>
          <div className="my-2">
            <Pagination
              page={page}
              count={Math.ceil(totalCount / ITEMS_PER_PAGE)}
              onChange={handlePageChange}
              renderItem={(item) => (
                <PaginationItem
                  component={Link}
                  href={`/articles${item.page === 1 ? "" : `?page=${item.page}`}`}
                  {...item}
                />
              )}
            />
          </div>
        </div>
      )}
    </>
  );
}
