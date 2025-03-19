import Link from "next/link";
import { Suspense } from "react";

import { createClient } from "../../../utils/supabase/server";
import DeckList, { DeckType } from "./DeckList";

export default async function Home() {
  const supabase = createClient();

  // 現在ログイン中のユーザーを取得
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-white">
        <Link href="/auth" className="mt-8 text-center text-2xl">
          ログイン
        </Link>
      </main>
    );
  }

  const { data: userDecks, error } = await supabase.from("user_deck").select("deck_list(*)").eq("id", user.id);

  if (error) {
    console.error("Failed to fetch user decks:", error);
    // 必要に応じてエラー表示など
  }

  const deckList: DeckType = (userDecks || []).map((row) => row.deck_list);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-white">
      <Suspense fallback={<div>Loading...</div>}>
        <DeckList user={user} deckList={deckList} />
      </Suspense>
    </main>
  );
}
