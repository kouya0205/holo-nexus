"use client";

import {
  Autocomplete,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select as MUISelect,
  Select,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import { Search } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
// import { z } from "zod";

import { Button } from "@/components/ui/button";
import { cardConfig } from "@/config/card";
import React, { useEffect } from "react";

type FilterFormProps = {
  onFilterChange: (filters: FormValues) => void;
  currentFilter: FormValues; // いまのフィルタ状態を受け取る
};

export interface FormValues {
  color?: string[]; // undefined を許容するように
  type?: { title?: string; id?: number }[];
  rarity?: { title?: string; id?: number }[];
  release_deck?: string;
  text?: string;
}

// フォームの初期値
export const defaultValues: FormValues = {
  color: [],
  type: [],
  rarity: [],
  release_deck: "",
  text: "",
};

// zod でバリデーション作りたい場合
// const FormSchema = z.object({
//   color: z.array(z.string()),
//   type: z.array(z.object({ title: z.string(), id: z.number() })),
//   rarity: z.array(z.object({ title: z.string(), id: z.number() })),
//   release_deck: z.string().optional(),
//   text: z.string().optional(),
// });

const FilterForm = ({ onFilterChange, currentFilter }: FilterFormProps) => {
  // フォーム
  const { handleSubmit, control, reset } = useForm<FormValues>({
    defaultValues: currentFilter,
  });

  const watchFilter = JSON.stringify(currentFilter);
  useEffect(() => {
    reset(currentFilter);
  }, [watchFilter, reset, currentFilter]);

  // リセットボタン
  const handleReset = () => {
    onFilterChange(defaultValues as FormValues);
    reset(defaultValues);
  };

  // 「この条件で検索する」押下時
  function onSubmit(data: FormValues) {
    // ここで親コンポーネントに渡す
    onFilterChange(data);
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-between">
          <Button
            type="submit"
            className="h-7 w-36 rounded-[14px] bg-[#534B88] text-white hover:border hover:border-[#534B88] hover:bg-white hover:text-[#534B88]"
          >
            この条件で検索する
          </Button>
          <Button
            type="button"
            className="h-7 w-36 rounded-[14px] border-[1px] border-zinc-500 bg-white text-zinc-500 hover:border-zinc-400 hover:bg-zinc-400 hover:text-zinc-500"
            onClick={handleReset}
          >
            リセット
          </Button>
        </div>

        {/* フリーワード検索 */}
        <Controller
          name="text"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              variant="standard"
              className="w-full"
              type="search"
              label="フリーワード検索"
              color="primary"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          )}
        />

        {/* 色 (ToggleButtonGroup) -> string[] */}
        <p className="font-[#534B88]">色</p>
        <Controller
          name="color"
          control={control}
          render={({ field }) => (
            <ToggleButtonGroup
              value={field.value} // ここは string[] を想定
              onChange={(e, newValue) => {
                field.onChange(newValue);
              }}
              aria-label="color"
              exclusive={false}
              sx={{
                display: "flex",
                justifyContent: "center",
                "& .MuiToggleButtonGroup-grouped": {
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                  margin: "0 2px",
                  padding: "0 4px",
                  height: "28px",
                  width: "48px",
                  fontSize: "14px",
                },
              }}
            >
              {cardConfig.colors.map((color) => (
                <ToggleButton
                  key={color.id}
                  value={color.title} // string
                  aria-label={color.title}
                  sx={{
                    color: "#534B88",
                    backgroundColor: "#fff",
                    fontSize: "14px",
                    transition: "background-color 0.2s ease, transform 0.2s ease",
                    width: "100%",
                    "&.Mui-selected": {
                      backgroundColor: "#534B88",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "#534B88",
                      },
                    },
                    "&:hover": {
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  {color.title}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          )}
        />

        {/* リリースデッキ (Select) -> string */}
        <Controller
          name="release_deck"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel id="release_deck">収録商品</InputLabel>
              <Select
                {...field}
                variant="standard"
                className="w-full"
                label="収録商品"
                labelId="release_deck"
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
              >
                <MenuItem value="">選択しない</MenuItem>
                {cardConfig.release_deck.map((item) => (
                  <MenuItem key={item.id} value={item.name}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />

        {/* タイプ (Autocomplete) -> {title, id}[] */}
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Autocomplete
              multiple
              color="primary"
              options={cardConfig.types}
              getOptionLabel={(option) => option.title}
              value={field.value} // {title, id}[]
              onChange={(_, data) => field.onChange(data)}
              // Chip 表示
              ChipProps={{
                sx: {
                  color: "#fff",
                  backgroundColor: "#534B88",
                  fontSize: "14px",
                  "& .MuiChip-deleteIcon": {
                    color: "#fff",
                    fontSize: "16px",
                    transition: "transform 0.2s ease",
                    ":hover": {
                      transform: "translateY(2px)",
                      color: "#fff",
                    },
                  },
                },
              }}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField {...params} label="タグ" placeholder="タグを選択" variant="standard" />
              )}
            />
          )}
        />

        {/* レアリティ (Autocomplete) -> {title, id}[] */}
        <Controller
          name="rarity"
          control={control}
          render={({ field }) => (
            <Autocomplete
              multiple
              color="primary"
              options={cardConfig.rarity}
              getOptionLabel={(option) => option.title}
              value={field.value}
              onChange={(_, data) => field.onChange(data)}
              ChipProps={{
                sx: {
                  color: "#fff",
                  backgroundColor: "#534B88",
                  fontSize: "14px",
                  "& .MuiChip-deleteIcon": {
                    color: "#fff",
                    fontSize: "16px",
                    transition: "transform 0.2s ease",
                    ":hover": {
                      transform: "translateY(2px)",
                      color: "#fff",
                    },
                  },
                },
              }}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField {...params} label="レアリティ" placeholder="レアリティを選択" variant="standard" />
              )}
            />
          )}
        />
      </form>
    </div>
  );
};

export default FilterForm;
