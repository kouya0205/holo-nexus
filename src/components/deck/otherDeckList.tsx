import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Card } from "../ui/card";
import { Heart } from "lucide-react";
import Image from "next/image";

export default function OtherDeckList({ deckData }: { deckData: any }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4 sm:grid-cols-4 lg:grid-cols-6">
      {deckData.map((card: any) => (
        <Card
          key={card.id}
          className="group relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-[#666c87] to-[#80858c]"
        >
          {/* Card Image */}
          <div className="absolute inset-0">
            <Image
              width={300}
              height={400}
              src={card.image_url || "/placeholder.svg"}
              alt={card.name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Overlay Content */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/70">
            {/* Top Section */}
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-2">
                <Image
                  src={card.users[0].avatar_url || "/placeholder.svg"}
                  alt={card.users[0].username}
                  width={32}
                  height={32}
                  className="rounded-full w-8 h-8"
                />
                <span className="text-sm font-medium text-white">{card.users[0].username}</span>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="absolute bottom-0 w-full space-y-1 p-3">
              <div className="text-xs md::text-sm text-white/80">{card.leader_name}</div>
              <div className="text-sm md:text-base font-bold text-white">{card.name}</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60">
                  最終更新：
                  {/* 2025-01-02T16:55:07.693303+00:00 => 2025/01/02へ */}
                  {card.updated_at
                    ? new Date(card.updated_at).toISOString().split("T")[0].replace(/-/g, "/")
                    : new Date(card.created_at).toISOString().split("T")[0].replace(/-/g, "/")}
                </span>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4 text-white/60" />
                  <span className="text-sm text-white/60">{card.likes}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
