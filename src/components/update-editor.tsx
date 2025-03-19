"use client";

import EditorJS, { OutputData, API } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect, useRouter } from "next/navigation";
import { startTransition, useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import Image from "next/image";
import Cropper from "react-easy-crop";
import { Dialog, DialogContent } from "./ui/dialog";

import { useAlert } from "@/hooks/useAlert";
import { postPatchSchema, postPatchSchemaType } from "@/lib/validation/posts";

import CustomAlert from "./alert";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";
import LinkTool from "@editorjs/link";
import Table from "@editorjs/table";
import Embed from "@editorjs/embed";
import { createClient } from "../../utils/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
// import Checklist from "@editorjs/checklist";

export default function UpdateArticleEditor({
  article,
  userData,
  isEditable,
}: {
  article: {
    article_id: string;
    title: string;
    content: any;
    thumbnail_url: string;
    updated_at: string;
    created_at: string;
    user_id: string;
  };
  userData: { id: string; username: string; avatar_url: string };
  isEditable: boolean;
}) {
  const { alertOpen, alertMessage, alertSeverity, showAlert, handleAlertClose } = useAlert();
  const ref = useRef<EditorJS | null>(null);
  const [currentArticle, setCurrentArticle] = useState<OutputData | null>(article.content);
  const router = useRouter();
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(article.thumbnail_url || null);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const supabase = createClient();

  if (!article) {
    redirect("/articles");
  }

  useEffect(() => {
    if (ref.current === null) {
      ref.current = new EditorJS({
        holder: "editor",
        data: article.content,
        onReady() {
          setIsMounted(true);
        },
        readOnly: !isEditable,
        tools: {
          header: {
            class: Header,
            config: {
              placeholder: "Header",
              levels: [1, 2, 3, 4],
              defaultLevel: 2,
            },
            shortcut: "CMD+SHIFT+H",
          },
          list: List,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/articles/upload",
            },
          },
          table: Table,
          embed: {
            class: Embed,
            config: {
              services: {
                youtube: true,
                twitter: true,
                facebook: true,
              },
            },
          },
        },
        onChange(api: API, event: CustomEvent) {
          if (isEditable) {
            ref.current?.save().then((res) => {
              setCurrentArticle(res);
            });
          }
        },
      });
    }
  }, [article.content, isEditable]);

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

    let thumbnailUrl = article.thumbnail_url;

    // 新しいサムネイル画像がある場合はアップロード
    if (thumbnail) {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData.user;

      if (!user) {
        setIsSaving(false);
        return showAlert("認証エラーが発生しました", "error");
      }

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

    const response = await fetch(`/api/articles/${article.article_id}`, {
      method: "PATCH",
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
      return showAlert("記事の更新に失敗しました", "error");
    }

    startTransition(() => {
      router.refresh();
    });

    setIsSaving(false);

    router.refresh();

    return showAlert("記事を更新しました", "success");
  };

  return (
    <>
      <CustomAlert open={alertOpen} onClose={handleAlertClose} message={alertMessage} severity={alertSeverity} />
      <Dialog open={cropModalOpen} onOpenChange={setCropModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
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

      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          {isEditable && (
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
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
          )}
          {!isEditable && thumbnailPreview && (
            <div className="mt-6">
              <div className="relative max-h-[310px] w-full overflow-hidden rounded-md">
                <Image src={thumbnailPreview} alt="サムネイル画像" width={620} height={310} className="object-cover" />
              </div>
            </div>
          )}
          <TextareaAutosize
            id="title"
            autoFocus
            defaultValue={article.title}
            placeholder="Post Title"
            className="w-full resize-none overflow-hidden bg-transparent mt-14 text-3xl font-bold focus:outline-none"
            {...register("title")}
            required
            readOnly={!isEditable}
          />
          <div className="flex items-center justify-between">
            <Link href={`/profile/${userData.id}`} className="flex items-center space-x-2 my-2">
              <Avatar>
                <AvatarImage src={userData.avatar_url} />
                <AvatarFallback>{userData.username}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-gray-500">{userData.username}</p>
                <p className="text-sm text-gray-500">
                  {(article.updated_at ? new Date(article.updated_at) : new Date(article.created_at)).toLocaleString(
                    "ja-JP",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    },
                  )}
                </p>
              </div>
            </Link>
            {isEditable && (
              <div>
                <Button type="submit">{isSaving ? "保存中..." : "保存"}</Button>
              </div>
            )}
          </div>
          <div id="editor" defaultValue={article.content} />
        </div>
      </form>
    </>
  );
}
