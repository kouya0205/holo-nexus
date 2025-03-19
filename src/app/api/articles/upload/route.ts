import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../../utils/supabase/server";
import scrapeMetadata from "@/lib/scrapeMetadata";

const CACHE_EXPIRATION_DAYS = 14; // 2週間

export async function GET(req: NextRequest) {
  const supabase = createClient();
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ success: 0, error: "URL is required" }, { status: 400 });
  }

  try {
    // DBからURLの情報を取得
    const { data, error } = await supabase
      .from("article_links")
      .select("title, description, image_url, updated_at")
      .eq("url", url)
      .single();

    // 既存データがあり、1週間以内ならそのまま返す
    if (data && data.updated_at) {
      const lastUpdated = new Date(data.updated_at);
      const now = new Date();
      const diffDays = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24);

      if (diffDays < CACHE_EXPIRATION_DAYS) {
        return NextResponse.json({
          success: 1,
          meta: {
            title: data.title,
            description: data.description,
            image: {
              url: data.image_url,
            },
          },
        });
      }
    }

    if (error) {
      // スクレイピングしてデータ取得
      const metadata = await scrapeMetadata(url);
      if (!metadata) {
        return NextResponse.json({ success: 0, error: "Failed to fetch metadata" }, { status: 500 });
      }

      // DBに保存（既存データがある場合は更新）
      await supabase.from("article_links").upsert({ url, ...metadata, updated_at: new Date().toISOString() });

      return NextResponse.json({
        success: 1,
        meta: {
          title: metadata.title,
          description: metadata.description,
          image: {
            url: metadata.image_url,
          },
        },
      });
    }
  } catch (error) {
    return NextResponse.json({ success: 0, error: "Internal server error" }, { status: 500 });
  }
}
