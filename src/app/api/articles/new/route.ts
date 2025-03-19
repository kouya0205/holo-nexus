import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../../utils/supabase/server";

export async function POST(request: NextRequest) {
  const formData = await request.json();
  const title = formData.title;
  const content = formData.content;
  const thumbnailUrl = formData.thumbnail_url || null;

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("articles")
    .insert([
      {
        title,
        content,
        user_id: user.id,
        thumbnail_url: thumbnailUrl,
      },
    ])
    .select();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
