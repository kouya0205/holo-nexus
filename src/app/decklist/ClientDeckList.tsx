"use client";

import { useState, useEffect } from "react";
import DeckList, { DeckType } from "./DeckList";
import FilterSection from "./FilterSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User } from "@supabase/supabase-js";

export default function ClientDeckList({ 
  initialDeckList, 
  user 
}: { 
  initialDeckList: DeckType;
  user: User;
}) {
  const [leaderFilter, setLeaderFilter] = useState("");
  const [colorFilter, setColorFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [filteredDeckList, setFilteredDeckList] = useState(initialDeckList);

  // フィルター適用時の処理
  useEffect(() => {
    let result = initialDeckList;
    
    if (leaderFilter) {
      result = result.filter(deck => 
        deck.leader_name?.toLowerCase().includes(leaderFilter.toLowerCase())
      );
    }
    
    if (colorFilter) {
      result = result.filter(deck => deck.color === colorFilter);
    }
    
    if (nameFilter) {
      result = result.filter(deck => 
        deck.name?.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }
    
    setFilteredDeckList(result);
  }, [leaderFilter, colorFilter, nameFilter, initialDeckList]);

  return (
    <>
      {/* フィルターセクション */}
      <FilterSection 
        leaderFilter={leaderFilter}
        setLeaderFilter={setLeaderFilter}
        colorFilter={colorFilter}
        setColorFilter={setColorFilter}
        nameFilter={nameFilter}
        setNameFilter={setNameFilter}
      />
      
      {/* 新規作成ボタン */}
      <div className="flex justify-end mb-6">
        <Link href="/deckcreate">
          <Button className="bg-red-600 hover:bg-red-700 text-white">新規作成</Button>
        </Link>
      </div>
      
      {/* フィルタリング済みのデッキリスト */}
      {filteredDeckList.length > 0 ? (
        <DeckList user={user} deckList={filteredDeckList} />
      ) : (
        <div className="text-center py-12 bg-white border rounded-lg">
          <p className="text-lg text-gray-600">条件に一致するデッキがありません</p>
          <p className="text-gray-500 mt-2">検索条件を変更してみてください</p>
        </div>
      )}
    </>
  );
} 