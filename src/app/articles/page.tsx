import { BreadCrumb } from "@/components/brandcrumb";
import PostCreateButton from "@/components/postCreateButton";

import Article from "../../components/Articles";

export default async function ArticlePage() {
  const breadcrumbPaths = [
    { label: "Home", href: "/" },
    { label: "記事一覧", href: "/articles" },
  ];

  return (
    <div className="flex flex-col space-y-4 px-12 py-4">
      <BreadCrumb paths={breadcrumbPaths} />
      <PostCreateButton />
      <Article limit={200} type="pageNation" />
    </div>
  );
}
