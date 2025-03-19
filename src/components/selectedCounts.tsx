import Image from "next/image";

import { cardData } from "@/app/deckcreate/deckCreate";

export default function SelectedCounts({
  selectedCounts,
  filteredCards,
}: {
  selectedCounts: { [id: string]: number };
  filteredCards: cardData[];
}) {
  const selectedCards = filteredCards.filter((card) => selectedCounts[card.card_id] > 0);

  return (
    <div className="rounded-sm border border-slate-800">
      <div className="grid grid-cols-4 gap-x-2 gap-y-6">
        {selectedCards.map((card) => (
          <div key={card.card_id} className="relative h-[120px] w-[90px]">
            {[...Array(selectedCounts[card.card_id])].map((_, index) => (
              <div key={index} className="relative">
                <Image
                  src={card.image_url || ""}
                  alt=""
                  width={90}
                  height={120}
                  className="absolute rounded-lg shadow-lg transition-transform duration-300 ease-in-out"
                  style={{
                    top: `${index * 6}px`,
                    left: `${index * 6}px`,
                  }}
                />
                {index === selectedCounts[card.card_id] - 1 && (
                  <span
                    className="absolute flex h-6 w-6 items-center justify-center rounded-full bg-[#534B88] text-xs font-bold text-white"
                    style={{
                      top: "-8px", // スタックされた画像の上に配置
                      left: "80px", // スタックされた画像の右に配置
                    }}
                  >
                    {selectedCounts[card.card_id]}
                  </span>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
