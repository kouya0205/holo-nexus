"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { BreadCrumb } from "@/components/brandcrumb";
import { TabGroup } from "@/components/tabGroup";
import { tabConfig } from "@/config/tab";
import { CardConfig } from "@/types";
import FilterForm, { defaultValues, FormValues } from "./cardFilter";
import CardList from "./cardList";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cardConfig } from "@/config/card";
import { useDebounce } from "@/hooks/useDebounce";

// 新しいレスポンス型を定義
interface CardResponse {
  data: CardConfig[];
  pagination: {
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
  };
}

export default function CardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 状態管理
  const [activeTab, setActiveTab] = useState("holo");
  const [filters, setFilters] = useState<FormValues>(defaultValues);
  const [cardData, setCardData] = useState<CardResponse>({
    data: [],
    pagination: {
      page: 1,
      perPage: 40,
      totalItems: 0,
      totalPages: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(true);

  // URLパラメータから現在のページと並び替え条件を取得
  const currentPage = parseInt(searchParams.get("page") || "1");
  const currentSort = searchParams.get("sort") || "num";

  // URLパラメータを更新する関数
  const updateURLParams = useCallback(
    (params: Record<string, string | number | null>) => {
      const newParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === "") {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }
      });

      // 変更があった場合のみルーター更新
      const newSearch = newParams.toString();
      router.push(`/cardlist?${newSearch}`, { scroll: false });
    },
    [router, searchParams],
  );

  // URLパラメータからactiveTabとfiltersを同期
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    // タブパラメータを取得
    const tabParam = params.get("tab");
    if (tabParam && tabConfig.tab.some((tab) => tab.id === tabParam)) {
      setActiveTab(tabParam);
    }

    // フィルターパラメータを復元
    const newFilters: FormValues = structuredClone(defaultValues);

    if (params.has("text")) newFilters.text = params.get("text") || "";

    if (params.has("color")) {
      const colorParam = params.get("color") || "";
      newFilters.color = colorParam ? colorParam.split(",") : [];
    }

    if (params.has("release_deck")) {
      newFilters.release_deck = params.get("release_deck") || "";
    }

    if (params.has("type")) {
      const typeParam = params.get("type") || "";
      if (typeParam) {
        const titles = typeParam.split(",");
        const typeObjects = titles.map((t) => cardConfig.types.find((x) => x.title === t)).filter(Boolean);
        newFilters.type = typeObjects as any;
      }
    }

    if (params.has("rarity")) {
      const rarityParam = params.get("rarity") || "";
      if (rarityParam) {
        const titles = rarityParam.split(",");
        const rarityObjects = titles.map((t) => cardConfig.rarity.find((x) => x.title === t)).filter(Boolean);
        newFilters.rarity = rarityObjects as any;
      }
    }

    setFilters(newFilters);
  }, [searchParams]);

  // API データ取得関数
  const fetchCards = useCallback(async () => {
    setIsLoading(true);

    // パラメータ構築
    const params = new URLSearchParams();
    params.set("tab", activeTab);
    params.set("page", currentPage.toString());
    params.set("per_page", "40");
    params.set("sort", currentSort);

    if (filters.text) params.set("text", filters.text);

    if (filters.color && filters.color.length > 0) {
      params.set("color", filters.color.join(","));
    }

    if (filters.release_deck) {
      params.set("release_deck", filters.release_deck);
    }

    if (filters.type && filters.type.length > 0) {
      const typeNames = filters.type.map((i) => i.title).join(",");
      params.set("type", typeNames);
    }

    if (filters.rarity && filters.rarity.length > 0) {
      const rarityNames = filters.rarity.map((i) => i.title).join(",");
      params.set("rarity", rarityNames);
    }

    try {
      const response = await fetch(`/api/cardlist?${params.toString()}`, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data: CardResponse = await response.json();
      setCardData(data);
    } catch (error) {
      console.error("Failed to fetch cards:", error);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, filters, currentPage, currentSort]);

  // debounce適用したフィルター条件の変更検知
  const debouncedFilters = useDebounce(filters, 500);

  // フィルター条件やページ変更時にデータ取得
  useEffect(() => {
    fetchCards();
  }, [activeTab, debouncedFilters, currentPage, currentSort, fetchCards]);

  // タブ切り替え処理
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    // ページを1に戻す
    updateURLParams({
      tab: tab,
      page: 1,
    });
  };

  // フィルタ変更処理
  const handleFilterChange = (newFilters: FormValues) => {
    setFilters(newFilters);

    // 検索条件変更時は常にページを1に戻す
    const params: Record<string, string | null> = {
      text: newFilters.text || null,
      color: newFilters.color?.length ? newFilters.color.join(",") : null,
      release_deck: newFilters.release_deck || null,
      type: newFilters.type?.length ? newFilters.type.map((i) => i.title).join(",") : null,
      rarity: newFilters.rarity?.length ? newFilters.rarity.map((i) => i.title).join(",") : null,
      page: "1", // ページを1に戻す
      tab: activeTab,
    };

    updateURLParams(params);
  };

  // ページ変更処理
  const handlePageChange = (newPage: number) => {
    updateURLParams({ page: newPage });
  };

  // ソート変更処理
  const handleSortChange = (newSort: string) => {
    updateURLParams({ sort: newSort });
  };

  const breadcrumbPaths = [
    { label: "Home", href: "/" },
    { label: "Cardlist", href: "/cardlist" },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col gap-4 bg-gray-200 p-4">
      <BreadCrumb paths={breadcrumbPaths} />
      <h1 className="text-sm sm:text-2xl font-bold">カード一覧</h1>
      <ScrollArea className="w-full whitespace-nowrap border-t-2 border-dashed">
        <TabGroup activeTab={activeTab} onTabChange={handleTabChange} />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="flex flex-1 justify-end md:flex-row md:justify-center gap-4 flex-col-reverse">
        <div className="w-full md:w-[70%] flex-wrap space-y-2 rounded-md border-2 border-gray-300 bg-white p-4">
          <Suspense fallback={<div>Loading...</div>}>
            <CardList
              cardData={cardData}
              isLoading={isLoading}
              onPageChange={handlePageChange}
              onSortChange={handleSortChange}
              currentSort={currentSort}
            />
          </Suspense>
        </div>
        <div className="w-full md:w-[30%] rounded-md border-2 border-gray-300 bg-white p-4">
          <FilterForm onFilterChange={handleFilterChange} currentFilter={filters} />
        </div>
      </div>
    </div>
  );
}
