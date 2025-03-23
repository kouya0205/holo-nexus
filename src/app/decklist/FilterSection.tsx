"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function FilterSection({
  leaderFilter,
  setLeaderFilter,
  colorFilter,
  setColorFilter,
  nameFilter,
  setNameFilter,
}: {
  leaderFilter: string;
  setLeaderFilter: (value: string) => void;
  colorFilter: string;
  setColorFilter: (value: string) => void;
  nameFilter: string;
  setNameFilter: (value: string) => void;
}) {
  // リセット関数
  const resetFilters = () => {
    setLeaderFilter("");
    setColorFilter("");
    setNameFilter("");
  };

  return (
    <div className="bg-white border rounded-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">フィルター</h2>

      {/* リーダーフィルター */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">リーダー</label>
        <Input
          type="text"
          value={leaderFilter}
          onChange={(e) => setLeaderFilter(e.target.value)}
          placeholder="リーダー名で検索"
          className="w-full max-w-md"
        />
      </div>

      {/* カラーフィルター */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">カラー</label>
        <div className="grid grid-cols-6 gap-2 sm:gap-4 max-w-2xl">
          {["赤", "青", "緑", "黄", "紫", "黒"].map((color) => (
            <Button
              key={color}
              type="button"
              variant="outline"
              className={colorFilter === color ? "bg-gray-200" : ""}
              onClick={() => setColorFilter(colorFilter === color ? "" : color)}
            >
              {color}
            </Button>
          ))}
        </div>
      </div>

      {/* 名前フィルター */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-1">デッキ名</label>
        <Input
          type="text"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          placeholder="デッキ名で検索"
          className="w-full max-w-md"
        />
      </div>

      {/* リセットボタン */}
      <div className="flex justify-center">
        <Button onClick={resetFilters} variant="outline">
          フィルターをリセット
        </Button>
      </div>
    </div>
  );
}
