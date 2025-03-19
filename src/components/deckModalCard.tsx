"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { Button } from "./ui/button";

export default function DeckModalCard({
  modalCard,
  count,
  onCountChange,
}: {
  modalCard: any;
  count: number;
  onCountChange: (data: { id: string; count: number }) => void;
}) {
  const [localCount, setLocalCount] = useState(count);

  useEffect(() => {
    setLocalCount(count); // Update localCount if the prop changes
  }, [count]);

  const handleCountChange = (newCount: number) => {
    const clampedCount = Math.max(0, Math.min(newCount, 4));
    setLocalCount(clampedCount);
    onCountChange({ id: modalCard.card_id, count: clampedCount });
  };

  return (
    <div>
      <div className="flex flex-col items-center gap-2">
        <Image
          src={modalCard.image_url}
          alt={modalCard.card_name}
          width={250}
          height={300}
          className="rounded-lg shadow-xl"
        />
        <div className="flex items-center justify-between gap-4">
          <Button
            onClick={() => handleCountChange(localCount - 1)}
            className={`${
              localCount === 0
                ? "cursor-not-allowed bg-gray-300 text-gray-500"
                : "bg-gray-400 text-white hover:bg-gray-600"
            }`}
            disabled={localCount === 0} // localCountが0なら無効化
          >
            減らす
          </Button>
          <span>{localCount}</span>
          <Button
            onClick={() => handleCountChange(localCount + 1)}
            className={`${
              localCount === 4
                ? "cursor-not-allowed bg-gray-300 text-gray-500"
                : "bg-[#534B88] text-white hover:bg-[#3C366B]"
            }`}
            disabled={localCount === 4} // localCountが4なら無効化
          >
            増やす
          </Button>
        </div>
      </div>
    </div>
  );
}
