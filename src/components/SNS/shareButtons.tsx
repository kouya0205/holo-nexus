"use client";

import { useCallback, useState } from "react";

type ShareButtonsProps = {
  deckId: string;
  deckName: string;
};

export default function ShareButtons({ deckId, deckName }: ShareButtonsProps) {
  // デッキのURL。実際の自サイトのURLに書き換えてください
  const deckUrl = `https://holo-card.vercel.app/decklist/${deckId}`;

  // クリップボードにコピーしたかどうかのフラグ
  const [isCopied, setIsCopied] = useState(false);

  // Twitter シェア
  const handleShareTwitter = useCallback(() => {
    const text = `【デッキ紹介】${deckName}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text,
    )}&url=${encodeURIComponent(deckUrl)}&hashtags=CardGame,Deck`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
  }, [deckName, deckUrl]);

  // リンクをコピー
  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(deckUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // 2秒後に表示を戻す
    });
  }, [deckUrl]);

  return (
    <div className="flex flex-col sm:flex-row gap-2 mt-4">
      {/* Twitterボタン */}
      <button
        onClick={handleShareTwitter}
        className="flex items-center gap-2 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M24 4.56c-.89.39-1.83.65-2.83.78a4.92 4.92 0 0 0 2.17-2.72 9.86 9.86 0 0 1-3.13 1.2A4.92 4.92 0 0 0 16.7 3a4.94 4.94 0 0 0-4.89 4.94c0 .39.04.77.13 1.14-4.06-.2-7.67-2.16-10.1-5.14-.42.7-.66 1.52-.66 2.38 0 1.64.84 3.1 2.11 3.95a4.94 4.94 0 0 1-2.22-.62v.06c0 2.29 1.63 4.19 3.77 4.63a4.97 4.97 0 0 1-2.2.08 4.94 4.94 0 0 0 4.6 3.42A9.88 9.88 0 0 1 0 19.55 13.92 13.92 0 0 0 7.55 21c9.06 0 14.01-7.72 13.68-14.64a9.86 9.86 0 0 0 2.77-2.8z" />
        </svg>
        Twitterでシェア
      </button>

      {/* リンクコピー */}
      <button
        onClick={handleCopyLink}
        className="flex items-center gap-2 rounded bg-gray-400 px-4 py-2 text-white hover:bg-gray-500"
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 21H9c-1.103 0-2-.897-2-2V7h2v12h10v2zm-4-4H5c-1.103 0-2-.897-2-2V3c0-1.103.897-2 2-2h10c1.103 0 2 .897 2 2v12c0 1.103-.897 2-2 2zM5 3v12h10V3H5z" />
        </svg>
        {isCopied ? "コピーしました！" : "リンクをコピー"}
      </button>
    </div>
  );
}
