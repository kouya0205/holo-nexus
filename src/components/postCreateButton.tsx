import Link from "next/link";

import { Button } from "./ui/button";

export default function PostCreateButton() {
  return (
    <div className="flex justify-end">
      <Link href="/articles/new">
        <Button>新規投稿</Button>
      </Link>
    </div>
  );
}
