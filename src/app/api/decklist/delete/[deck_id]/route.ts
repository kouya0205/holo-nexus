import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  const supabase = createClient();
  const body = await req.json(); // リクエストボディからデータを取得

  const { deck_id, user_id } = body;
  if (!deck_id) {
    return NextResponse.json({ error: "Deck ID is required" }, { status: 400 });
  }

  // ひも付いた情報を削除
  await supabase.from("deck_cards").delete().eq("deck_id", deck_id);

  // userとdeckの紐付け情報を削除
  await supabase.from("user_deck").delete().eq("id", user_id).eq("deck_id", deck_id);

  // デッキを削除
  await supabase.from("deck_list").delete().eq("deck_id", deck_id);

  return NextResponse.json({ success: true, message: "Deck deleted" });
}
