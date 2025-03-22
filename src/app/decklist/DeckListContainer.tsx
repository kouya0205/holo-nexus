import { createClient } from "@/utils/supabase/server";
import { DeckType } from "./DeckList";
import ClientDeckList from "./ClientDeckList";

export default async function DeckListContainer({ userId }: { userId: string }) {
  const supabase = createClient();
  
  // ユーザー情報の取得
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  
  if (!user) {
    return <div>ユーザー情報の取得に失敗しました</div>;
  }
  
  // すべてのデッキデータを一度に取得
  const { data: userDecks, error } = await supabase
    .from("user_deck")
    .select("deck_list(*)")
    .eq("id", userId);

  if (error) {
    console.error("Failed to fetch user decks:", error);
    return <div>デッキデータの取得に失敗しました</div>;
  }

  const deckList: DeckType = (userDecks || []).map((row) => row.deck_list);

  // デッキリストが空の場合
  if (deckList.length === 0) {
    return (
      <div className="text-center py-12 bg-white border rounded-lg">
        <p className="text-lg text-gray-600">デッキがまだありません</p>
        <p className="text-gray-500 mt-2">新規デッキを作成して始めましょう</p>
      </div>
    );
  }

  return <ClientDeckList initialDeckList={deckList} user={user} />;
} 