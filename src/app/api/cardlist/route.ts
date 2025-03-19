import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(req.url);

  // クエリパラメータ取得
  const tab = searchParams.get("tab") || "holo";
  const text = searchParams.get("text") || "";
  const color = searchParams.get("color") || "";
  const releaseDeck = searchParams.get("release_deck") || "";
  const rarity = searchParams.get("rarity") || "";
  const tags = searchParams.get("type") || "";

  // ページネーション用パラメータ
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = parseInt(searchParams.get("per_page") || "40");
  const sort = searchParams.get("sort") || "new";

  // ページネーション計算
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  // デフォルトのクエリビルダー
  let query = supabase.from("cards").select(
    `
    *,
    card_type (
      type_list (*)
    ),
    holomencards (*),
    oshiholomencards (*),
    buzzholomencards (*),
    supportcards (*)
  `,
    { count: "exact" },
  ); // カウントを含める

  // タブフィルタ
  if (tab) {
    query = query.eq("type", tab);
  }

  // フリーワード検索
  if (text) {
    query = query.ilike("card_name", `%${text}%`);
  }

  // 色フィルタ
  if (color) {
    const colorArray = color.split(",");
    query = query.in("color", colorArray);
  }

  // リリースデッキフィルタ
  if (releaseDeck) {
    query = query.eq("release_deck", releaseDeck);
  }

  // レアリティフィルタ
  if (rarity) {
    const rarityArray = rarity.split(",");
    query = query.in("rarity", rarityArray);
  }

  // タグフィルタの事前準備（サブクエリ使用）
  if (tags) {
    const tagArray = tags.split(",");

    // サブクエリ: 指定されたタグ名を持つカードIDを取得
    const { data: filteredCardIds } = await supabase
      .from("type_list")
      .select(
        `
      type_id,
      card_type!inner(
        card_id
      )
    `,
      )
      .in("type_name", tagArray);

    // 結果からcard_idのみの配列を抽出
    const cardIds = filteredCardIds?.flatMap((item) => item.card_type).map((cardType) => cardType.card_id);

    // 重複を除去
    const uniqueCardIds = [...new Set(cardIds)];

    // メインクエリに条件を適用
    if (uniqueCardIds.length > 0) {
      query = query.in("card_id", uniqueCardIds);
    } else {
      // マッチするカードがない場合は空の結果を返す
      return { data: [], count: 0 };
    }
  }

  // ソート適用
  switch (sort) {
    case "old":
      query = query.order("created_at", { ascending: true });
      break;
    case "kana":
      query = query.order("card_name", { ascending: true });
      break;
    case "num":
      // カード番号順はフロントで処理
      query = query.order("card_number", { ascending: true });
      break;
    case "new":
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  // ページネーション適用
  query = query.range(from, to);

  // データ取得
  const { data, error, count } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data,
    pagination: {
      page,
      perPage,
      totalItems: count || 0,
      totalPages: count ? Math.ceil(count / perPage) : 0,
    },
  });
}
