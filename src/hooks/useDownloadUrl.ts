"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export const useDownloadUrl = (filePath: string | undefined, key: "avatars" | "posts") => {
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [fullUrl, setFullUrl] = useState("");
  const bucketName = key === "avatars" ? "avatars" : "posts";
  useEffect(() => {
    if (filePath) {
      const download = async () => {
        setIsLoading(true);
        const { data, error } = await supabase.storage.from(bucketName).download(filePath);
        if (error) {
          setIsLoading(false);
          throw error;
        }
        setFullUrl(URL.createObjectURL(data!));
        setIsLoading(false);
      };
      download();
    }
  }, [filePath, bucketName, supabase]);

  return { isLoading, fullUrl, setFullUrl };
};
