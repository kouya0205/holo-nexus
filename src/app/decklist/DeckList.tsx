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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAlert } from "@/hooks/useAlert";
import { User } from "@supabase/supabase-js";
import { MoreVertical, Copy, Eye, Trash2 } from "lucide-react";
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
  image_url: string | null;
  color: string;
  card_number: number;
}[];

type DeckListProps = {
  user: User;
  deckList: DeckType;
};

export default function DeckList({ user, deckList }: DeckListProps) {
  const router = useRouter();
  const { showAlert } = useAlert();

  const colorMap: Record<string, string> = {
    赤: "bg-red-500",
    緑: "bg-green-500",
    青: "bg-blue-500",
    紫: "bg-purple-500",
    黒: "bg-gray-800",
    黄: "bg-yellow-500",
  };

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
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
      {deckList.map((deck) => (
        <div key={deck.deck_id} className="bg-white border rounded-lg overflow-hidden relative">
          {/* デッキ画像 */}
          <div className="relative h-[200px]">
            <Image
              src={deck.image_url || "/placeholder.svg"}
              alt={deck.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />

            {/* 右上のメニュー */}
            <div className="absolute top-2 right-2 z-10">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0 bg-white/80 hover:bg-white">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-16">
                  <DropdownMenuItem asChild>
                    <Link href={`/decklist/${deck.deck_id}`} className="flex items-center">
                      <Eye className="mr-2 h-4 w-4" />
                      <span className="text-sm">詳細</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => deckDuplicate(deck.deck_id, user.id)} className="flex items-center">
                    <Copy className="mr-2 h-4 w-4" />
                    <span className="text-sm">複製</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        className="flex items-center text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span className="text-sm">削除</span>
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>「{deck.name || "無題のデッキ"}」を削除しますか？</AlertDialogTitle>
                        <AlertDialogDescription>削除すると元に戻すことはできません</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>キャンセル</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deckDelete(deck.deck_id, user.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          削除
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* 下部の黒いオーバーレイ */}
            <div className="absolute bottom-0 left-0 w-full h-14 bg-gradient-to-t from-black/80 to-transparent"></div>

            <div className="text-white absolute bottom-2 left-2">
              <div className="flex flex-col">
                <div className="text-xs">{deck.card_number}</div>
                <div className="text-xs">{deck.leader_name}</div>
              </div>
            </div>

            {/* リーダーカラー */}
            {deck.color && (
              <div className="absolute bottom-2 right-2">
                <div className={`w-4 h-4 rounded-full border border-white ${colorMap[deck.color]}`} />
              </div>
            )}
          </div>

          <div className="p-2">
            <Link href={`/decklist/${deck.deck_id}`}>
              <h3 className="font-bold">{deck.name || "無題のデッキ"}</h3>
              <div className="flex flex-col mt-1">
                <div className="text-xs text-gray-500">
                  最終更新:{" "}
                  {deck.updated_at
                    ? new Date(deck.updated_at).toLocaleDateString("ja-JP")
                    : new Date(deck.created_at).toLocaleDateString("ja-JP")}
                </div>
              </div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
