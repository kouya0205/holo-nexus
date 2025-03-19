import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../../utils/supabase/server";

export async function PATCH(request: NextRequest, { params }: { params: { article_id: string } }) {
  const formData = await request.json();
  const title = formData.title;
  const content = formData.content;
  const thumbnailUrl = formData.thumbnail_url;
  const article_id = params.article_id;

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 記事の所有者を確認
  const { data: article, error: fetchError } = await supabase
    .from("articles")
    .select("user_id")
    .eq("article_id", article_id)
    .single();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (article.user_id !== user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 記事を更新
  const { data, error } = await supabase
    .from("articles")
    .update({
      title,
      content,
      thumbnail_url: thumbnailUrl,
    })
    .eq("article_id", article_id)
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
