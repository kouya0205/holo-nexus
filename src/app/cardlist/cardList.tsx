"use client";

import Pagination from "@mui/material/Pagination";
import { Select } from "@radix-ui/react-select";
import Image from "next/image";
import React, { useState } from "react";

import ModalCard from "@/components/modalCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CardConfig } from "@/types";

// 新しいPropsの型定義
interface CardListProps {
  cardData: {
    data: CardConfig[];
    pagination: {
      page: number;
      perPage: number;
      totalItems: number;
      totalPages: number;
    };
  };
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onSortChange: (sort: string) => void;
  currentSort: string;
}

export default function CardList({ cardData, isLoading, onPageChange, onSortChange, currentSort }: CardListProps) {
  const { data: cards, pagination } = cardData;

  // モーダルのデフォルト値
  const [defaultValue, setDefaultValue] = useState(0);

  const handleOpenModal = (index: number) => {
    setDefaultValue(index);
  };

  // ページ変更ハンドラー
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(value);
  };

  // ソート変更ハンドラー
  const handleSortChange = (value: string) => {
    onSortChange(value);
  };

  // カード番号の特殊処理（サーバーでのソートが不完全な場合の対応）
  const prefixPriority = ["hBP", "hSD", "hYS", "hBD"];

  // カードの先頭プレフィックス (hBP, hSD, hYS, hBD) を取得
  const getPrefix = (cardNumber: string) => {
    return prefixPriority.find((prefix) => cardNumber.startsWith(prefix)) || "";
  };

  // 数字部分を抽出して整数に変換
  const getNumber = (cardNumber: string) => {
    const numString = cardNumber.replace(/\D/g, "");
    return parseInt(numString, 10);
  };

  // 現在表示中のカード
  let displayedCards = [...cards];

  // カード番号順の場合、フロントでも補助的にソートする
  if (currentSort === "num") {
    displayedCards.sort((a, b) => {
      const prefixA = getPrefix(a.card_number);
      const prefixB = getPrefix(b.card_number);
      const prefixIndexA = prefixPriority.indexOf(prefixA);
      const prefixIndexB = prefixPriority.indexOf(prefixB);

      if (prefixIndexA !== prefixIndexB) {
        return prefixIndexA - prefixIndexB;
      } else {
        const numberA = getNumber(a.card_number);
        const numberB = getNumber(b.card_number);
        return numberA - numberB;
      }
    });
  }

  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center">
        <div className="flex flex-col  sm:gap-2 pb-4 text-sm sm:text-lg">
          <p className="text-[#534B88]">検索結果</p>
          <div className="flex gap-1 items-baseline">
            <span className="text-2xl sm:text-4xl font-bold text-[#534B88]">{pagination.totalItems}</span>
            <p className="text-sm sm:text-lg sm:items-end text-[#534B88]">件</p>
          </div>
        </div>
        <Select onValueChange={handleSortChange} defaultValue={currentSort}>
          <SelectTrigger className="w-[130px] sm:w-[180px] mb-4">
            <SelectValue placeholder="カード番号順" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="new">新しい順</SelectItem>
              <SelectItem value="old">古い順</SelectItem>
              <SelectItem value="kana">五十音順</SelectItem>
              <SelectItem value="num">カード番号順</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-1 sm:gap-4 grid-cols-4 lg:grid-cols-5">
        {isLoading
          ? Array.from(new Array(pagination.perPage)).map((_, index) => (
              <div key={index} className="w-full sm:w-auto">
                <SkeletonCard type="card" />
              </div>
            ))
          : displayedCards.map((card, index) => (
              <Dialog key={card.card_id}>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="h-full w-full p-0" onClick={() => handleOpenModal(index)}>
                    <Image
                      src={card.image_url || ""}
                      alt={card.card_name}
                      width={200}
                      height={278}
                      className="h-full sm:w-full rounded-lg object-cover shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-[5px]"
                    />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-5xl">
                  <DialogTitle></DialogTitle>
                  <Carousel className="mx-auto w-full max-w-4xl" defaultValue={defaultValue}>
                    <CarouselContent>
                      {displayedCards.map((modalCard) => (
                        <CarouselItem key={modalCard.card_id}>
                          <ModalCard modalCard={modalCard} />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="bg-[#534B88] text-white hover:border-[#534B88] hover:bg-white hover:text-[#534B88]" />
                    <CarouselNext className="bg-[#534B88] text-white hover:border-[#534B88] hover:bg-white hover:text-[#534B88]" />
                  </Carousel>
                </DialogContent>
              </Dialog>
            ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Pagination
          count={pagination.totalPages}
          page={pagination.page}
          onChange={handlePageChange}
          color="primary"
          sx={{
            mt: 4,
            display: "flex",
            justifyContent: "left",
            "& .MuiPaginationItem-root": {
              backgroundColor: "#f0f0f0",
              "&.Mui-selected": {
                backgroundColor: "#534B88",
                color: "#fff",
              },
              ":hover": {
                backgroundColor: "#d3d3d3",
              },
            },
          }}
        />
      )}
    </div>
  );
}
