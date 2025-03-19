"use server";

import { BreadCrumb } from "@/components/brandcrumb";
import { createClient } from "../../../../utils/supabase/server";
import Image from "next/image";
import ShareButtons from "@/components/SNS/shareButtons";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CardConfig } from "@/types";

export default async function DeckDetail({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const supabase = createClient();

  const { data: deckData, error } = await supabase
    .from("deck_list")
    .select(
      `
        *,
        deck_cards (
            *,
            cards (
                *
            )
        )
      `,
    )
    .eq("deck_id", id); // 指定したdeck_id

  if (!deckData || deckData.length === 0) {
    return <p>データがありません</p>;
  }

  // 取得したデッキ情報（配列の0番目を使用）
  const deck = deckData[0];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* パンくずリスト */}
      <BreadCrumb
        paths={[
          { label: "Home", href: "/" },
          { label: "デッキ一覧", href: "/decklist" },
        ]}
      />

      {/* デッキのヘッダー部分 */}
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-[65%]">
          <div className="mb-6 flex flex-col gap-6 rounded-lg bg-white p-6 shadow md:flex-row">
            {/* リーダーカード画像 */}
            <div className="flex w-full flex-shrink-0 items-center justify-center md:w-auto">
              <Image className="rounded" width={160} height={200} src={deck.image_url} alt={deck.leader_name} />
            </div>

            {/* デッキ情報 */}
            <div className="flex flex-col justify-center gap-2">
              <ShareButtons deckId={deck.deck_id} deckName={deck.name} />
              <h1 className="mb-2 text-2xl font-bold">{deck.name}</h1>
              <p className="mb-2 text-gray-600">{deck.description}</p>
              <div className="text-sm text-gray-500">
                <p>
                  公開設定：
                  {deck.public === "general" ? "公開" : "非公開"}
                </p>
                <p>リーダー：{deck.leader_name}</p>
              </div>
            </div>
          </div>

          {/* デッキリスト */}
          <h2 className="mb-4 text-xl font-bold">デッキリスト</h2>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
            {deck.deck_cards.map((deckCard: any) => (
              <li key={deckCard.card_id} className="flex flex-col items-center rounded-lg bg-white p-2 shadow">
                <Image
                  className="mb-2 rounded"
                  width={140}
                  height={196}
                  src={deckCard.cards.image_url}
                  alt={deckCard.cards.card_name}
                />
                <p className="text-center text-sm font-semibold leading-tight">{deckCard.cards.card_name}</p>
                <p className="text-center text-xs text-gray-500">× {deckCard.count}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full rounded-lg bg-white p-6 shadow md:w-[35%]">
          <h2 className="mb-4 text-xl font-bold">デッキ内容</h2>
          <div className="text-sm text-gray-500">
            <Table>
              <TableCaption></TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">No.</TableHead>
                  <TableHead>カード名</TableHead>
                  <TableHead className="text-right">枚数</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deckData[0].deck_cards.map((deckCard: any) => (
                  <TableRow key={deckCard.card_id}>
                    <TableCell className="font-medium">{deckCard.cards.card_number}</TableCell>
                    <TableCell>{deckCard.cards.card_name}</TableCell>
                    <TableCell className="text-right">{deckCard.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* サイドバー */}
        </div>
      </div>
    </div>
  );
}
