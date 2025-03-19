import { CircleChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import Article from "../components/Articles";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const Ad1 = [
    { id: 1, url: "https://dot-scallop-d45.notion.site/1-1447bfad8a6a80c3b8c1fa3352026deb?pvs=4" },
    { id: 2, url: "https://dot-scallop-d45.notion.site/1-1447bfad8a6a80c3b8c1fa3352026deb?pvs=4" },
    { id: 3, url: "https://dot-scallop-d45.notion.site/1-1447bfad8a6a80c3b8c1fa3352026deb?pvs=4" },
  ];

  const Ad2 = [
    { id: 1, url: "/decklist", src: "/images/1.webp", title: "デッキリスト" },
    { id: 2, url: "/cardlist", src: "/images/2.png", title: "カード一覧" },
    { id: 3, url: "/match", src: "/images/3.png", title: "1人回し" },
  ];

  const Ad3 = [
    { id: 1, url: "https://dot-scallop-d45.notion.site/1-1447bfad8a6a80c3b8c1fa3352026deb?pvs=4" },
    { id: 2, url: "https://dot-scallop-d45.notion.site/1-1447bfad8a6a80c3b8c1fa3352026deb?pvs=4" },
    { id: 3, url: "https://dot-scallop-d45.notion.site/1-1447bfad8a6a80c3b8c1fa3352026deb?pvs=4" },
    { id: 4, url: "https://dot-scallop-d45.notion.site/1-1447bfad8a6a80c3b8c1fa3352026deb?pvs=4" },
    { id: 5, url: "https://dot-scallop-d45.notion.site/1-1447bfad8a6a80c3b8c1fa3352026deb?pvs=4" },
    { id: 6, url: "https://dot-scallop-d45.notion.site/1-1447bfad8a6a80c3b8c1fa3352026deb?pvs=4" },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-white">
      {/* 上部の段 - 3つの広告枠 */}
      <div className="flex w-full items-center justify-center gap-4 pt-4">
        {Ad1.map((item) => (
          <Link
            href={item.url}
            className="w-1/4 sm:w-1/4 bg-gray-400 aspect-[4/3] sm:aspect-[16/9]"
            // aspect-[横/縦]
            key={item.id}
          ></Link>
        ))}
      </div>
      {/* 上部の段 - 3つの広告枠　ここまで参考に */}

      {/* 中央の段 - 3つの枠 */}
      <div className="flex w-full items-center justify-center gap-4 mt-12">
        {Ad2.map((item) => (
          <Link
            href={item.url}
            className="flex w-1/4 max-w-[300px] flex-col items-center justify-center bg-gray-300 aspect-[4/3] sm:aspect-[16/9] p-2"
            key={item.id}
          >
            <Image src={item.src} alt={item.title} width={50} height={50} className="w-7 h-auto sm:w-16" />
            <p className="mt-2 text-xs sm:text-xl">{item.title}</p>
          </Link>
        ))}
      </div>
      {/* 中央の段 - 3つの枠 ここまで*/}

      {/* 下部の段 - 横スクロール機能付きのボックス */}
      <div className="relative flex w-full flex-col gap-4 mt-12" style={{ zIndex: 10 }}>
        <div className="mb-2 flex justify-start">
          <button className="rounded bg-blue-500 text-xs sm:text-lg px-2 py-1 sm:px-5 sm:py-2 text-white ml-4">
            追加
          </button>{" "}
          {/* 追加ボタンを上部左に配置*/}
        </div>

        {/* ScrollAreaの設定 */}
        <ScrollArea className="h-40 w-full">
          <div className="flex h-28 sm:h-40 gap-4 ml-4 mr-4" style={{ whiteSpace: "nowrap", overflowX: "auto" }}>
            {[...Array(6)].map((_, index) => (
              <div key={index} className="inline-block h-3/4  bg-gray-400 aspect-[4/3] sm:aspect-[16/9]" />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <div className="flex w-full items-center gap-4 px-4">
          <h2 className="text-2xl">最新のレポート記事</h2>
          <Link
            href="/articles"
            className="flex size-auto items-center justify-between bg-[#349BD1] p-1 text-sm text-white hover:bg-[#38B8EA] rounded-md"
          >
            <Button className="bg-[#349BD1] text-white hover:bg-[#38B8EA] px-2 py-1 text-sm sm:text-lg">
              もっと見る
            </Button>
            <CircleChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        <Article user={user!} limit={20} type="scroll" />
      </div>
    </main>
  );
}
