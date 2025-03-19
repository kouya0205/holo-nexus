import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../../../utils/supabase/server";
import { v4 as uuidv4 } from "uuid"; // UUIDを生成するために使用

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const body = await req.json(); // リクエストボディからデータを取得

  const { deck_id } = body;
  if (!deck_id) {
    return NextResponse.json({ error: "Deck ID is required" }, { status: 400 });
  }

  // 元のデッキ情報を取得
  const { data: originalDeck, error: deckError } = await supabase
    .from("deck_list")
    .select("*")
    .eq("deck_id", deck_id)
    .single();

  if (deckError || !originalDeck) {
    return NextResponse.json({ error: "Failed to fetch original deck" }, { status: 500 });
  }

  // 元のデッキに紐付いたカード情報を取得
  const { data: deckCards, error: cardsError } = await supabase.from("deck_cards").select("*").eq("deck_id", deck_id);

  if (cardsError) {
    return NextResponse.json({ error: "Failed to fetch deck cards" }, { status: 500 });
  }

  // 新しいデッキIDを生成
  const newDeckId = uuidv4();

  // 新しいデッキを作成
  const { error: createDeckError } = await supabase.from("deck_list").insert({
    deck_id: newDeckId,
    name: originalDeck.name + " (コピー)", // コピー用に名前を変更
    description: originalDeck.description,
    public: originalDeck.public,
    leader_id: originalDeck.leader_id,
    leader_name: originalDeck.leader_name,
    image_url: originalDeck.image_url,
    created_at: new Date().toISOString(),
  });

  if (createDeckError) {
    return NextResponse.json({ error: "Failed to create new deck" }, { status: 500 });
  }

  // 元のデッキのカードを新しいデッキにコピー
  const newDeckCards = deckCards.map((card) => ({
    deck_id: newDeckId,
    card_id: card.card_id,
    count: card.count,
  }));

  const { error: createCardsError } = await supabase.from("deck_cards").insert(newDeckCards);

  if (createCardsError) {
    return NextResponse.json({ error: "Failed to copy deck cards" }, { status: 500 });
  }

  // userとdeckの紐付け情報を作成
  const { user_id } = body;
  const { error: createUserDeckError } = await supabase.from("user_deck").insert({
    id: user_id,
    deck_id: newDeckId,
  });

  if (createUserDeckError) {
    return NextResponse.json({ success: false, error: "Failed to create user deck" }, { status: 500 });
  }

  // 複製成功
  return NextResponse.json({ success: true, message: "デッキの複製に成功しました。", newDeckId }, { status: 200 });
}
