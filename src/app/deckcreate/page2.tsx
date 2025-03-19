"use client";
import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import { SearchIcon } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import DeckModalCard from "@/components/deckModalCard";
import SelectedCounts from "@/components/selectedCounts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { tabConfig } from "@/config/tab";

import { cardData } from "./deckCreate";

type Page2Props = {
  cardData: cardData[] | null;
  handleBack: () => void;
  handleNext: () => void;
  handleCard: (selectedCounts: { [id: string]: number }) => void;
  leaderCard: number;
};

const cardList = [
  { id: 1, title: "ホロメンカード" },
  { id: 2, title: "サポートカード" },
  { id: 3, title: "エールカード" },
  { id: 4, title: "その他" },
];

// ルール
// ・推しホロメンカード：1枚
// ・カード：50枚（ホロメンカード・サポートカード）
// ・同種類のカードは4枚まで
// ・エールデッキ（エールカード20枚）

export default function Page2({ cardData, handleBack, handleNext, handleCard, leaderCard }: Page2Props) {
  const [page, setPage] = useState(1);
  const [defaultValue, setDefaultValue] = useState(0);
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedCounts, setSelectedCounts] = useState<{
    [id: string]: number;
  }>({});
  const [selectedColors, setSelectedColors] = useState("");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (inputValue) {
      params.set("query", inputValue);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const query = searchParams.get("query") || "";

  const cards = cardData?.filter((card) => ["holo", "buzz_holo", "support"].includes(card.type));

  const filteredCards = cards?.filter(
    (card) =>
      card.card_name.toLowerCase().includes(query.toLowerCase()) ||
      card.color.toLowerCase().includes(query.toLowerCase()) ||
      card?.type_list.join().toLowerCase().includes(query.toLowerCase()),
  );

  const cardsPerPage = 60;
  const leader = cardData?.find((card) => card.card_id === leaderCard);
  if (!leader) return handleBack();

  const startIndex = (page - 1) * cardsPerPage;
  const selectedCards = filteredCards?.slice(startIndex, startIndex + cardsPerPage);

  const handleOpenModal = (index: number) => {
    const globalIndex = startIndex + index;
    setDefaultValue(globalIndex);
  };

  const onCountChange = ({ id, count }: { id: string; count: number }) => {
    setSelectedCounts((prevCounts) => ({
      ...prevCounts,
      [id]: count,
    }));
  };

  const handleClick = () => {
    handleCard(selectedCounts);
    handleNext();
  };

  const handleToggle = (values: string) => {
    setSelectedColors(values);
  };

  const convertToHiraganaKatakana = (str) =>
    str
      .replace(/[\u3041-\u3096]/g, (char) => String.fromCharCode(char.charCodeAt(0) + 0x60))
      .replace(/[\u30A1-\u30F6]/g, (char) => String.fromCharCode(char.charCodeAt(0) - 0x60));

  return (
    <Box sx={{ textAlign: "center", mt: 3 }}>
      <Typography variant="h6">その他のカード選択</Typography>
      <div className="flex gap-4">
        <div className="flex w-[60%] flex-col gap-2">
          <ToggleGroup
            type="single"
            onValueChange={handleToggle}
            value={selectedColors}
            className="flex flex-wrap gap-2"
          >
            {tabConfig.deck_create.map((card_name) => (
              <ToggleGroupItem
                key={card_name.id}
                value={card_name.label}
                aria-label={card_name.label}
                className="flex h-6 w-8 items-center justify-center rounded-md transition-all duration-200 sm:h-7 sm:w-14 lg:h-9 lg:w-20"
              >
                <span className="text-xs font-medium md:text-sm md:font-bold">{card_name.label}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          {/* 検索とカード表示グループ */}
          <Card className="flex flex-col items-center gap-2">
            <div className="flex w-full">
              <div className="relative w-full">
                <SearchIcon className="absolute left-2 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 dark:text-gray-400" />

                <Autocomplete
                  freeSolo
                  id="free-solo-2-demo"
                  disableClearable
                  options={cardList.map((option) => option.title)}
                  filterOptions={(options, { inputValue }) => {
                    const normalizedInput = convertToHiraganaKatakana(inputValue.toLowerCase());
                    return options.filter((option) =>
                      convertToHiraganaKatakana(option.toLowerCase()).includes(normalizedInput),
                    );
                  }}
                  inputValue={inputValue}
                  onInputChange={(event, newValue) => setInputValue(newValue)}
                  renderInput={(params) => <TextField {...params} label="Search input" inputMode="search" />}
                />
              </div>
              <Button
                onClick={handleSearch}
                className="h-full w-[15%] min-w-16 bg-[#534B88] text-white hover:bg-[#3C366B]"
              >
                検索
              </Button>
            </div>

            {/* カード表示 */}
            <div className="grid grid-cols-4 gap-1 sm:grid-cols-5 lg:grid-cols-6">
              {selectedCards?.map((card, index) => (
                <Dialog key={card.card_id}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" className="h-full w-full p-0" onClick={() => handleOpenModal(index)}>
                      <Image
                        src={card.image_url || ""}
                        alt={card.card_name}
                        width={90}
                        height={120}
                        className="h-full w-full rounded-lg object-cover shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-[5px]"
                      />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-auto">
                    <Carousel defaultValue={defaultValue} className="mx-auto max-w-[350px]">
                      <CarouselContent>
                        {filteredCards?.map((modalCard) => (
                          <CarouselItem key={modalCard.card_id}>
                            <DeckModalCard
                              modalCard={modalCard}
                              count={selectedCounts[modalCard.card_id] || 0} // Pass stored count
                              onCountChange={onCountChange}
                            />
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
          </Card>
        </div>
        <Card className="w-[40%] space-y-4">
          <div className="m-2 flex gap-2 rounded-sm border border-slate-800 p-2">
            <div className="sm:w-16">
              <Dialog key={leader.card_id}>
                <DialogTrigger>
                  <Image
                    src={leader.image_url || ""}
                    alt={leader.card_name}
                    width={90}
                    height={100}
                    className="rounded-lg object-cover shadow-lg transition-transform duration-300 ease-in-out hover:-translate-y-[5px]"
                  />
                </DialogTrigger>
                <DialogContent className="w-auto">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-bold text-[#534B88]">{leader.card_name}</DialogTitle>
                    <DialogDescription className="text-sm text-gray-500">{leader.color}</DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col space-y-4">
                    <Image
                      src={leader.image_url || ""}
                      alt={leader.card_name}
                      width={300}
                      height={500}
                      className="rounded-lg object-cover shadow-lg ease-in-out"
                    />
                    <DialogClose asChild>
                      <Button type="button" variant="secondary" onClick={handleBack}>
                        リーダーカード選択に戻る
                      </Button>
                    </DialogClose>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="flex flex-col items-start">
              <p>カード名: {leader.card_name}</p>
              <p className="text-sm">色: {leader.color}</p>
              <p className="text-sm">LIFE: {leader.oshiholomencards.life_count}</p>
              <p className="text-sm">収録商品: {leader.release_deck}</p>
            </div>
          </div>
          <div>
            <div className="min-h-44 space-y-4">
              <div className="flex items-center justify-between">
                <Typography variant="h6">
                  {Object.values(selectedCounts).reduce((acc, count) => acc + count, 0)}
                  枚/50枚
                </Typography>
                <Button
                  onClick={() => handleClick(selectedCounts)}
                  className="bg-[#534B88] text-white hover:bg-[#3C366B]"
                >
                  カードを決定する.
                </Button>
              </div>
              <SelectedCounts selectedCounts={selectedCounts} filteredCards={filteredCards} />
            </div>
          </div>
        </Card>
      </div>
    </Box>
  );
}
