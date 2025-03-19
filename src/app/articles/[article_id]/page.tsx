import { User } from "@supabase/supabase-js";
import { notFound } from "next/navigation";

import UpdateArticleEditor from "@/components/update-editor";
import { createClient } from "@/utils/supabase/server";

interface EditorProps {
  params: { article_id: string };
}
type Article = {
  article_id: string;
  title: string;
};

async function getArticle(article_id: Article["article_id"]) {
  const supabase = createClient();
  const { data: article, error } = await supabase.from("articles").select("*").eq("article_id", article_id).single();

  if (error) {
    throw error;
  }

  return article;
}

async function getUserData(user_id: User["id"]) {
  const supabase = createClient();
  const { data: user, error } = await supabase.from("users").select("*").eq("id", user_id).single();

  if (error) {
    throw error;
  }

  return user;
}

export default async function ArticlePage({ params }: EditorProps) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const article = await getArticle(params.article_id);
  const userData = await getUserData(article.user_id);

  if (!article) {
    notFound();
  }

  // 記事の所有者かどうかをチェック
  const isOwner = user?.id === article.user_id;

  return (
    <div className="mx-auto min-h-screen flex flex-col items-center p-4">
      <UpdateArticleEditor
        article={{
          article_id: article.article_id,
          title: article.title,
          content: article.content,
          thumbnail_url: article.thumbnail_url,
          updated_at: article.updated_at,
          created_at: article.created_at,
          user_id: article.user_id,
        }}
        userData={userData}
        isEditable={isOwner}
      />
    </div>
  );
}
