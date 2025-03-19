import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AuthCodeErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <h2 className="text-center">ログインに失敗しました。</h2>
      <p>再度ログインしてください。</p>
      <Link href="/auth">
        <Button className="mt-4">ログイン画面へ</Button>
      </Link>
    </div>
  );
}
