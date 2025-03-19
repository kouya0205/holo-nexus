"use server";

import Link from "next/link";
import { Suspense } from "react";

import { createClient } from "../../../utils/supabase/server";
import DeckCreate from "./deckCreate";

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: cardData, error } = await supabase
    .from("cards")
    .select("*, holomencards(*), oshiholomencards(*), buzzholomencards(*), type_list(*)");

  if (error) {
    return { error: "Failed to get cards" };
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-white">
      {user !== null ? (
        <Suspense fallback={<div>Loading...</div>}>
          <DeckCreate cardData={cardData} user={user} />
        </Suspense>
      ) : (
        <>
          <Link href="/auth" className="mt-8 text-center text-2xl">
            ログイン
          </Link>
        </>
      )}
    </main>
  );
}
