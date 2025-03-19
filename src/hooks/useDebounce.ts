import { useEffect, useState } from "react";

/**
 * 値の変更をdebounceするカスタムフック
 * @param value 監視する値
 * @param delay 遅延時間（ミリ秒）
 * @returns debounceされた値
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // valueが変更されたら、遅延後に更新
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // クリーンアップ（前回のタイマーをクリア）
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
