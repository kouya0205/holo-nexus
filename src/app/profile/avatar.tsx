"use client";
import Image from "next/image";
import React, { useState } from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";

import { Button } from "@/components/ui/button";
import { Profile } from "@/types";

interface UploadAvatarProps {
  profile: Profile;
  onUpload: (imageList: ImageListType) => void;
  initialUrl: ImageListType;
  uid: string;
}

export default function UploadAvatar({ uid, initialUrl, onUpload, profile }: UploadAvatarProps) {
  const [previewUrl, setPreviewUrl] = useState(initialUrl);

  const uploadAvatar = (imageList: ImageListType) => {
    const file = imageList[0]?.file;
    const maxFileSize = 2 * 1024 * 1024;

    if (file && file.size > maxFileSize) {
      // setError("ファイルサイズは2MBを超えることはできません")
      return;
    }

    setPreviewUrl(imageList);
    onUpload(imageList);
  };

  return (
    <div className="mb-5">
      <ImageUploading value={previewUrl} onChange={uploadAvatar} maxNumber={1} acceptType={["jpg", "png", "jpeg"]}>
        {({ imageList, onImageUpload, onImageUpdate, dragProps }) => (
          <div className="flex flex-col items-center justify-center">
            {imageList.length == 0 && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onImageUpload();
                }}
                className="h-32 w-32 rounded-full bg-gray-200"
                {...dragProps}
              >
                <div className="text-xs text-gray-400">ファイル形式：jpg / jpeg / png</div>
                <div className="text-xs text-gray-400">ファイルサイズ：2MBまで</div>
              </button>
            )}

            {imageList.map((image, index) => (
              <div key={index}>
                {image.dataURL && (
                  <div className="relative h-32 w-32">
                    <Image
                      fill
                      src={image.dataURL}
                      alt="thumbnail"
                      className="rounded-full object-cover"
                      priority
                      sizes="128px"
                    />
                  </div>
                )}
              </div>
            ))}

            {imageList.length > 0 && (
              <div className="mt-3 text-center">
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    onImageUpdate(0);
                  }}
                >
                  画像を変更
                </Button>
              </div>
            )}
          </div>
        )}
      </ImageUploading>
    </div>
  );
}
