"use client";

import { Autocomplete, Checkbox, FormControlLabel, MenuItem, Radio, Select, TextField } from "@mui/material";
import React, { useState } from "react";
import { Controller, DefaultValues, SubmitHandler, useForm, useWatch } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

import CustomAlert from "@/components/alert";
import { Button } from "@/components/ui/button";
import { RadioGroup } from "@/components/ui/radio-group";
import { cardConfig } from "@/config/card";
import { useAlert } from "@/hooks/useAlert";

import { createClient } from "../../../utils/supabase/client";

// タイプの選択肢
const radioGroupOptions = ["holo", "buzz_holo", "oshi_holo", "support"] as const;
type RadioGroupOption = (typeof radioGroupOptions)[number];

// フォームの型
export type FormValues = {
  card_name: string | undefined;
  card_number: string | undefined;
  rarity: string;
  color: string;
  type: RadioGroupOption;
  image_url: string;
  life_count: number | undefined;
  debut_stage: string | undefined;
  hp: number | undefined;
  extra: boolean;
  tags: { title: string; id: number }[] | undefined;
  release_deck: string;
  support_type: string;
  limited: boolean;
};

export const defaultValues: DefaultValues<FormValues> = {
  card_name: undefined,
  card_number: undefined,
  rarity: "",
  color: "",
  type: "holo",
  image_url: "",
  life_count: undefined,
  debut_stage: undefined,
  hp: undefined,
  extra: false,
  tags: undefined,
  release_deck: "",
  support_type: "",
  limited: false,
};

export default function UploadForm() {
  const [disabled, setDisabled] = useState(false);
  const supabase = createClient();

  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormValues>({
    defaultValues,
  });

  // ★ ここがポイント：typeの値をリアルタイムに監視
  const watchType = watch("type");

  const { alertOpen, alertMessage, alertSeverity, showAlert, handleAlertClose } = useAlert();

  async function getTypeIdsByTags(title: string[]) {
    const { data, error } = await supabase.from("type_list").select("type_id").in("type_name", title);

    if (error) {
      console.error("Error fetching type_ids:", error);
      return [];
    }

    return data.map((item) => item.type_id); // type_id のリストを返す
  }

  async function insertCardTypes(card_id: string, type_ids: number[]) {
    const cardTypes = type_ids.map((type_id) => ({ card_id, type_id }));
    const { error } = await supabase.from("card_type").insert(cardTypes);
    if (error) {
      console.error("Error inserting card types:", error);
    }
  }

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      setDisabled(true);

      // バリデーション
      if (!data.card_name || !data.card_number || !data.rarity || !data.type || !data.image_url) {
        showAlert("未入力の項目があります", "error");
        setDisabled(false);
        return;
      }

      const file = data.image_url[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${uuidv4()}.${fileExt}`;
      const card_id = uuidv4();

      // 画像をSupabaseストレージにアップロード
      const { error: uploadError } = await supabase.storage.from("cards").upload(`${card_id}/${filePath}`, file);
      const { data: urlData } = await supabase.storage.from("cards").getPublicUrl(`${card_id}/${filePath}`);

      if (uploadError) {
        throw uploadError;
      }

      // カード本体のレコードをcardsテーブルに登録
      const { data: insertCard, error } = await supabase
        .from("cards")
        .insert({
          card_id,
          card_number: data.card_number,
          card_name: data.card_name,
          rarity: data.rarity,
          color: data.color,
          image_url: urlData.publicUrl,
          type: data.type,
          release_deck: data.release_deck,
        })
        .select()
        .single();

      // ★ type ごとに別テーブルへ登録
      if (data.type === "support") {
        const { error } = await supabase
          .from("supportcards")
          .insert({
            card_id: card_id,
            limited: data.limited,
            support_type: data.support_type,
          })
          .single();
      }

      if (data.type === "oshi_holo") {
        const { error } = await supabase
          .from("oshiholomencards")
          .insert({
            card_id: card_id,
            life_count: data.life_count,
          })
          .single();
      }

      if (data.type === "buzz_holo") {
        const { error } = await supabase
          .from("buzzholomencards")
          .insert({
            card_id: card_id,
            debut_stage: data.debut_stage,
            hp: data.hp,
            extra: data.extra,
          })
          .single();
      }

      if (data.type === "holo") {
        const { error } = await supabase
          .from("holomencards")
          .insert({
            card_id: card_id,
            debut_stage: data.debut_stage,
            hp: data.hp,
            extra: data.extra,
          })
          .single();

        // タグが入力されている場合はtype_listとの中間テーブルに登録
        if (data.tags && data.tags.length > 0) {
          const type_ids = await getTypeIdsByTags(data.tags.map((tag) => tag.title));
          if (type_ids.length > 0) {
            await insertCardTypes(card_id, type_ids);
          }
        }
      }

      showAlert("カードをアップロードしました!", "success");
      setDisabled(false);
      location.reload();
    } catch (error) {
      console.error(error);
      showAlert("カードのアップロードに失敗しました", "error");
      location.reload();
    }
  };

  return (
    <>
      <CustomAlert open={alertOpen} onClose={handleAlertClose} message={alertMessage} severity={alertSeverity} />
      <div className="flex justify-center">
        <form onSubmit={handleSubmit(onSubmit)} className="flex w-2/3 flex-col space-y-6">
          {/* ★ ここから下は “常に表示する” 項目 */}
          <label>必須: カード名</label>
          <Controller render={({ field }) => <TextField {...field} />} name="card_name" control={control} />

          <label>必須: カード番号</label>
          <Controller render={({ field }) => <TextField {...field} />} name="card_number" control={control} />

          <label>必須: レアリティ</label>
          <Controller render={({ field }) => <TextField {...field} />} name="rarity" control={control} />

          <label>必須: 色</label>
          <Controller render={({ field }) => <TextField {...field} />} name="color" control={control} />

          <label>必須: リリースデッキ</label>
          <Controller
            render={({ field }) => (
              <Select {...field} value={field.value || ""}>
                {cardConfig.release_deck.map((item) => (
                  <MenuItem key={item.id} value={item.title}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
            )}
            name="release_deck"
            control={control}
          />

          <label>必須: 画像</label>
          <Controller
            control={control}
            name="image_url"
            defaultValue=""
            render={({ field: { onChange } }) => (
              <>
                <label htmlFor="checkbox-file">file</label>
                <input id="checkbox-file" type="file" onChange={(e) => onChange(e.target.files)} />
              </>
            )}
          />

          {/* ★ タイプラジオは常に表示 */}
          <label>必須: タイプ</label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <RadioGroup
                // field から得た value（現在の選択値）を RadioGroup に渡す
                value={field.value ?? ""}
                // onChange が呼ばれたら field.onChange によって react-hook-form の state を更新
                onChange={(event) => field.onChange(event.target.value)}
              >
                <FormControlLabel value="holo" control={<Radio />} label="holo" />
                <FormControlLabel value="buzz_holo" control={<Radio />} label="buzz_holo" />
                <FormControlLabel value="oshi_holo" control={<Radio />} label="oshi_holo" />
                <FormControlLabel value="support" control={<Radio />} label="support" />
              </RadioGroup>
            )}
          />

          {/* ★ ここから下は “type” の値で表示を切り替える */}
          {/** --- oshi_holoの場合 --- */}
          {watchType === "oshi_holo" && (
            <>
              <label>ライフ</label>
              <Controller render={({ field }) => <TextField {...field} />} name="life_count" control={control} />
            </>
          )}

          {/** --- holo / buzz_holo の場合  --- */}
          {(watchType === "holo" || watchType === "buzz_holo") && (
            <>
              <label>デビューステージ</label>
              <Controller render={({ field }) => <TextField {...field} />} name="debut_stage" control={control} />

              <label>HP</label>
              <Controller render={({ field }) => <TextField {...field} />} name="hp" control={control} />

              <label>エクストラ</label>
              <Controller
                name="extra"
                control={control}
                render={({ field }) => (
                  <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                )}
              />

              <label>タグ</label>
              <Controller
                control={control}
                name="tags"
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    multiple
                    options={cardConfig.types}
                    getOptionLabel={(option) => option.title}
                    renderOption={(props, option) => (
                      <li {...props} key={option.id}>
                        <span>{option.title}</span>
                      </li>
                    )}
                    filterSelectedOptions
                    renderInput={(params) => <TextField {...params} label="タグ" placeholder="タグを選択" />}
                    onChange={(_, data) => field.onChange(data)}
                  />
                )}
              />
            </>
          )}

          {/** --- support の場合 --- */}
          {watchType === "support" && (
            <>
              <label>サポート用type選択</label>
              <Controller
                render={({ field }) => (
                  <Select {...field} value={field.value || ""}>
                    {cardConfig.support_type.map((item) => (
                      <MenuItem key={item.id} value={item.value}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
                name="support_type"
                control={control}
              />

              <label>サポート用limited</label>
              <Controller
                name="limited"
                control={control}
                render={({ field }) => (
                  <Checkbox checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />
                )}
              />
            </>
          )}

          {/* Submitボタン */}
          <Button type="submit" disabled={disabled}>
            Submit
          </Button>
        </form>
      </div>
    </>
  );
}
