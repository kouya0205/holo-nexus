"use client";
import { Box, Pagination, Typography } from "@mui/material";
import { DialogDescription } from "@radix-ui/react-dialog";
import Image from "next/image";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cardConfig } from "@/config/card";

import { cardData } from "./deckCreate";

type Page1Props = {
  cardData: cardData[] | null;
  handleBack: () => void;
  handleNext: () => void;
  handleLeaderCard: (card_id: number) => void;
};

export default function Page1({ cardData, handleBack, handleNext, handleLeaderCard }: Page1Props) {
  const [page, setPage] = useState(1);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const cardsPerPage = 90;
  const filterCards = cardData?.filter(
    (card) => card.type === "oshi_holo" && (selectedColors.length === 0 || selectedColors.includes(card.color)),
  );

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleClick = (card_id: number) => {
    handleLeaderCard(card_id);
    handleNext();
  };

  const handleToggle = (values: string[]) => {
    setSelectedColors(values);
  };

  return (
    <Box sx={{ textAlign: "center", mt: 4, gap: 4 }}>
      <div className="space-y-4 p-2">
        <Typography variant="h6">リーダーカード選択</Typography>
        <ToggleGroup
          type="multiple"
          onValueChange={handleToggle}
          value={selectedColors}
          className="flex flex-wrap gap-2"
        >
          {cardConfig.oshi_colors.map((color) => (
            <ToggleGroupItem
              key={color.id}
              value={color.title}
              aria-label={color.title}
              className={`flex h-6 w-8 items-center justify-center rounded-md transition-all duration-200 sm:h-7 sm:w-14 lg:h-9 lg:w-20 ${selectedColors.includes(color.title) ? "scale-[1.04]" : "scale-100"} ${color.title === "無" ? "bg-checkerboard bg-gray-100" : ""} `}
              style={{
                backgroundColor: selectedColors.includes(color.title) ? color.value : "transparent",
                borderColor: color.title === "白" ? "#c0c0c0" : color.title === "無" ? "#9CA3AF" : color.value,
                borderWidth: color.title === "白" ? "2px" : "1px",
                borderStyle: "solid",
                color: selectedColors.includes(color.title)
                  ? color.title === "無"
                    ? "black"
                    : "white"
                  : color.title === "白" || color.title === "無"
                    ? "black"
                    : color.value,
                boxShadow: color.title === "白" ? "0 0 1px rgba(0,0,0,0.2)" : "none", // subtle shadow for white
              }}
            >
              <span className="text-xs font-medium md:text-sm md:font-bold">{color.title}</span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="grid grid-cols-4 gap-1 sm:grid-cols-5 sm:gap-2 sm:px-4 md:grid-cols-6 md:gap-4 md:px-12 lg:grid-cols-6">
        {filterCards?.map((card) => (
          <Dialog key={card.card_id}>
            <DialogTrigger asChild>
              <Button variant="ghost" className="h-full w-full p-0">
                <Image
                  src={card.image_url || ""}
                  alt={card.card_name}
                  width={200}
                  height={278}
                  className="h-full w-full rounded-lg object-cover shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-[5px]"
                />
              </Button>
            </DialogTrigger>
            <DialogContent className="w-auto">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-[#534B88]">{card.card_name}</DialogTitle>
                <DialogDescription className="text-sm text-gray-500">
                  {card.color} / {card.rarity}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col justify-center space-y-4">
                <Image
                  src={card.image_url || ""}
                  alt={card.card_name}
                  width={300}
                  height={500}
                  className="rounded-lg object-cover shadow-lg ease-in-out"
                />
                <div className="flex justify-center space-x-4">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      戻る
                    </Button>
                  </DialogClose>
                  <Button
                    onClick={() => handleClick(card.card_id)}
                    className="bg-[#534B88] text-white hover:bg-[#3C366B]"
                  >
                    このカードを選択する
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
      <Pagination
        count={Math.ceil(filterCards?.length / cardsPerPage)}
        page={page}
        onChange={handlePageChange}
        color="primary"
        sx={{
          mt: 4,
          display: "flex",
          justifyContent: "left",
          alignItems: "bottom",
          "& .MuiPaginationItem-root": {
            backgroundColor: "#f0f0f0", // 通常時の背景色
            "&.Mui-selected": {
              backgroundColor: "#534B88", // 選択時の背景色
              color: "#fff", // 選択時の文字色
            },
            ":hover": {
              backgroundColor: "#d3d3d3", // ホバー時の背景色
            },
          },
        }}
      />
    </Box>
  );
}
