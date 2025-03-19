"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useAlert } from "@/hooks/useAlert";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export type DeckType = {
  deck_id: string;
  created_at: string;
  updated_at: string | null;
  name: string;
  description: string | null;
  public: string;
  leader_id: string;
  leader_name: string;
  image_url: string;
}[];

type DeckListProps = {
  user: User;
  deckList: DeckType;
};

export default function DeckList({ user, deckList }: DeckListProps) {
  const router = useRouter();
  const { showAlert } = useAlert();
  const tableDesign = "border-b px-1 py-1 sm:px-4 sm:py-2 text-[10px] sm:text-base font-bold";

  const deckDuplicate = async (deck_id: string, user_id: string) => {
    try {
      const res = await fetch(`/api/decklist/duplicate/${deck_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deck_id, user_id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error duplicating deck:", errorData.error);
        return;
      }

      const result = await res.json();
      showAlert(result.message, result.success ? "success" : "error");
      router.refresh();
    } catch (error) {
      console.error("Error duplicating deck:", error);
    }
  };

  const deckDelete = async (deck_id: string, user_id: string) => {
    try {
      const res = await fetch(`/api/decklist/delete/${deck_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deck_id, user_id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error deleting deck:", errorData.error);
        return;
      }

      const result = await res.json();
      showAlert(result.message, result.success ? "success" : "error");
      router.refresh();
    } catch (error) {
      console.error("Error deleting deck:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mx-auto rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text:xs sm:text-2xl font-bold">保存したデッキ一覧</h1>
          <Link href="/deckcreate" className="pointer">
            <Button className="rounded bg-red-500 px-2 py-1 sm:px-4 sm:py-2 text-white text-sm sm:text-lg hover:bg-red-600">
              新規作成
            </Button>
          </Link>
        </div>
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className={tableDesign}>デッキ名</th>
              <th className={tableDesign}>リーダー</th>
              <th className={tableDesign}>画像</th>
              <th className={tableDesign}>作成日</th>
              <th className={tableDesign}></th>
            </tr>
          </thead>
          <tbody>
            {deckList.map((deck, index) => (
              <tr key={deck.deck_id} className="text-center border-b ">
                <td className="px-1 py-1 sm:px-2 sm:py-2 text-[8px] sm:text-base">{deck.name}</td>
                <td className="px-1 py-1 sm:px-2 sm:py-2 text-[8px] sm:text-base">{deck.leader_name}</td>
                <td className="px-1 py-2 sm:py-2">
                  <Image src={deck.image_url} alt={deck.leader_name} width={50} height={90} />
                </td>
                <td className="px-2 py-1 text-[8px] sm:text-base w-[10%] text-center">
                  {deck.created_at ? (
                    <span className="block">{new Date(deck.created_at).toLocaleDateString()}</span>
                  ) : (
                    <span>日付なし</span>
                  )}
                </td>

                <td className="px-2 py-2 flex flex-col md:flex-row gap-1 justify-center">
                  <Link href={`/decklist/${deck.deck_id}`}>
                    <Button className="bg-red-500 hover:bg-red-600">詳細</Button>
                  </Link>
                  <Button
                    className="bg-yellow-500 hover:bg-yellow-600"
                    onClick={() => deckDuplicate(deck.deck_id, user.id)}
                  >
                    複製
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-md text-white text-sm">
                      削除
                    </AlertDialogTrigger>
                    <AlertDialogContent className="top-28">
                      <AlertDialogHeader>
                        <AlertDialogTitle>本当に削除しますか</AlertDialogTitle>
                        <AlertDialogDescription>削除すると元に戻すことはできません</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>キャンセル</AlertDialogCancel>
                        <AlertDialogAction onClick={() => deckDelete(deck.deck_id, user.id)}>削除</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
