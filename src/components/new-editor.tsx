"use client";

import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Embed from "@editorjs/embed";
import LinkTool from "@editorjs/link";
// import Underline from '@editorjs/underline';
import Table from "@editorjs/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@supabase/supabase-js";
import { redirect, useRouter } from "next/navigation";
import { startTransition, useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import Cropper from "react-easy-crop";
import { Dialog, DialogContent } from "./ui/dialog";
// import Image from "next/image";

import { useAlert } from "@/hooks/useAlert";
import { postPatchSchema, postPatchSchemaType } from "@/lib/validation/posts";

import CustomAlert from "./alert";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";
// import Checklist from "@editorjs/checklist";

export default function CreateArticleEditor({ user }: { user: User | null }) {
  const { alertOpen, alertMessage, alertSeverity, showAlert, handleAlertClose } = useAlert();
  const ref = useRef<EditorJS>();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const supabase = createClient();

  if (!user) {
    redirect("/auth");
  }

  const initializeEditor = useCallback(async () => {
    const editor = new EditorJS({
      holder: "editor",
      onReady() {
        ref.current = editor;
      },
      placeholder: "ここに記事を書く",
      inlineToolbar: true,
      tools: {
        header: {
          class: Header,
          shortcut: "CMD+SHIFT+H",
          config: {
            placeholder: "ヘッダー",
            levels: [1, 2, 3, 4],
            defaultLevel: 3,
          },
        },
        list: List,
        quote: Quote,
        // underline: Underline,
        table: Table,
        // checklist: Checklist,
        linkTool: {
          class: LinkTool,
          config: {
            endpoint: "/api/articles/upload",
          },
          shortcut: "CMD+SHIFT+L",
        },
        embed: {
          class: Embed,
          shortcut: "CMD+SHIFT+E",
        },
      },
    });
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      initializeEditor();
    }

    return () => {
      ref.current?.destroy();
      ref.current = undefined;
    };
  }, [isMounted, initializeEditor]);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new window.Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("No 2d context");
    }

    // キャンバスサイズを設定
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // 画像を描画
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height,
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
      }, "image/jpeg");
    });
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setOriginalImage(reader.result as string);
        setCropModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    if (originalImage && croppedAreaPixels) {
      const croppedImage = await getCroppedImg(originalImage, croppedAreaPixels);
      setThumbnail(new File([croppedImage], "cropped.jpg", { type: "image/jpeg" }));
      setThumbnailPreview(URL.createObjectURL(croppedImage));
      setCropModalOpen(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<postPatchSchemaType>({
    resolver: zodResolver(postPatchSchema),
  });

  const onSubmit = async (data: postPatchSchemaType) => {
    setIsSaving(true);
    const blocks = await ref.current?.save();

    let thumbnailUrl = null;

    // サムネイル画像がある場合はアップロード
    if (thumbnail) {
      const fileName = `${user.id}/${Date.now()}-${thumbnail.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("thumbnails")
        .upload(fileName, thumbnail);

      if (uploadError) {
        setIsSaving(false);
        return showAlert("サムネイル画像のアップロードに失敗しました", "error");
      }

      // 公開URLを取得
      const {
        data: { publicUrl },
      } = supabase.storage.from("thumbnails").getPublicUrl(fileName);

      thumbnailUrl = publicUrl;
    }

    const response = await fetch("/api/articles/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: data.title,
        content: blocks,
        thumbnail_url: thumbnailUrl,
      }),
    });

    if (!response.ok) {
      setIsSaving(false);
      return showAlert("記事の作成に失敗しました", "error");
    }

    startTransition(() => {
      router.refresh();
    });

    setIsSaving(false);

    const getArticleData = async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("article_id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        console.error(error);
        return null;
      }

      return data[0];
    };

    const CreateArticleData = await getArticleData();

    if (!CreateArticleData) {
      console.error("記事の取得に失敗しました");
      return;
    }

    router.push(`/articles/${CreateArticleData.article_id}`);

    return showAlert("記事を作成しました", "success");
  };

  return (
    <>
      <CustomAlert open={alertOpen} onClose={handleAlertClose} message={alertMessage} severity={alertSeverity} />
      <Dialog open={cropModalOpen} onOpenChange={setCropModalOpen}>
        <DialogContent>
          <div className="relative h-[300px]">
            {originalImage && (
              <Cropper
                image={originalImage}
                crop={crop}
                zoom={zoom}
                aspect={2 / 1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}
          </div>
          <div className="mt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setCropModalOpen(false)}>
              キャンセル
            </Button>
            <Button onClick={handleCropSave}>確定</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Card className="max-w-[800px] items-center justify-center">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <TextareaAutosize
                  id="title"
                  autoFocus
                  placeholder="Post Title"
                  className="w-full resize-none overflow-hidden bg-transparent text-3xl font-bold focus:outline-none"
                  {...register("title")}
                  required
                />
                <div>
                  <Button type="submit">{isSaving ? "保存中..." : "保存"}</Button>
                </div>
              </div>
            </CardHeader>
            <Separator />
            <CardContent>
              <div className="mb-6">
                <div className="flex items-center gap-4 first-letter sm:flex-row flex-col">
                  <div className="relative h-[150px] w-[300px] sm:h-[160px] sm:w-[320px] overflow-hidden rounded-md border border-gray-300">
                    {thumbnailPreview ? (
                      <Image src={thumbnailPreview} alt="サムネイルプレビュー" fill className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100 text-sm text-gray-400">
                        プレビュー
                      </div>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none"
                    />
                    <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF (最大 2MB)</p>
                  </div>
                </div>
              </div>
              <div id="editor" />
            </CardContent>
          </div>
        </form>
      </Card>
    </>
  );
}
