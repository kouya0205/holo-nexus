import { BreadCrumb } from "@/components/brandcrumb";
import DeckSearch from "@/components/deck/deckSearch";
import OtherDeckList from "@/components/deck/otherDeckList";
import { createClient } from "@/utils/supabase/server";

const breadcrumbPaths = [
  { label: "Home", href: "/" },
  { label: "Deck Shared", href: "/deck_shared" },
];

export default async function DeckSharedPage() {
  const supabase = createClient();
  const { data: deckData } = await supabase
    .from("deck_list")
    .select(
      `*, 
      deck_cards(
        count, 
        cards(
          *, 
          card_type(type_list(*)), 
          supportcards(*), 
          holomencards(*), 
          oshiholomencards(*), 
          buzzholomencards(*)
        )
      ), 
      users(*)`,
    )
    .eq("public", "general");

  return (
    <div className="min-h-screen w-full bg-gray-200 py-4 px-5 md:px-14">
      <BreadCrumb paths={breadcrumbPaths} />
      <h1 className="text-sm sm:text-2xl font-bold">投稿デッキ一覧</h1>
      <DeckSearch />
      <OtherDeckList deckData={deckData} />
    </div>
  );
}
