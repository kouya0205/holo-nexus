import Link from "next/link";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import DeckListSkelton from "@/components/deck/deckListSkelton";
import { createClient } from "@/utils/supabase/server";
import DeckListContainer from "./DeckListContainer";

export default async function Home() {
  const supabase = createClient();

  // 現在ログイン中のユーザーを取得
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="flex min-h-screen flex-col items-center gap-2 mt-20 bg-white">
        <p>デッキリストの作成にはログインが必要です。</p>
        <Button className="bg-blue-500 text-white hover:bg-blue-600">
          <Link href="/auth" className="text-center text-xl">
            ログイン
          </Link>
        </Button>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold border-b pb-2 mb-8">保存したデッキ</h1>

        {/* デッキリスト一覧のみSuspenseでラップ */}
        <Suspense fallback={<DeckListSkelton />}>
          <DeckListContainer userId={user.id} />
        </Suspense>
      </div>
    </main>
  );
}
