import { SiteConfig } from "@/types";

export const siteConfig: SiteConfig = {
  title: "Holo Nexus",
  description: "ホロライブカードゲームの非公式サイトです。",
  url: "https://holo-card.vercel.app",
  header: {
    title: "Holo Nexus",
    logo: "/images/icon-512x512.webp",
    icons: [
      { src: "/images/suzu.webp", alt: "鈴のアイコン" },
      { src: "/images/hito.webp", alt: "人のアイコン" },
      { src: "/images/menu.webp", alt: "メニューのアイコン" },
    ],
  },
  footer: {
    links: [
      {
        href: "https://dot-scallop-d45.notion.site/5103947e446548ca8a9d7191fa512be7?pvs=4",
        text: "利用規約",
      },
      { href: "https://www.youtube.com/", text: "Youtube" },
      { href: "https://hololive-official-cardgame.com/", text: "公式HP" },
    ],
  },
  cardList: {
    title: "カード一覧",
    description: "ホロライブカードゲームのカード一覧です。",
    url: "https://holo-card.vercel.app/cardlist",
  },
  deckCreate: {
    title: "デッキ作成",
    description: "ホロライブカードゲームのデッキを作成します。",
    url: "https://holo-card.vercel.app/deckcreate",
  },
  deckList: {
    title: "デッキリスト",
    description: "ホロライブカードゲームのデッキリストです。",
    url: "https://holo-card.vercel.app/decklist",
  },
  auth: {
    title: "ログイン | 新規登録",
    description: "ホロライブカードゲームにログインします。",
    url: "https://holo-card.vercel.app/auth",
  },
  profile: {
    title: "プロフィール",
    description: "ホロライブカードゲームのプロフィールです。",
    url: "https://holo-card.vercel.app/profile",
  },
};
