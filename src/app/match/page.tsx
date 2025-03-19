import { BreadCrumb } from "@/components/brandcrumb";

export default function Match() {
  const breadcrumbPaths = [
    { label: "Home", href: "/" },
    { label: "Match", href: "/match" },
  ];

  return (
    <div className="flex h-screen flex-col">
      <BreadCrumb paths={breadcrumbPaths} />
      <h1>「1人回し」機能は未実装です。実装をお待ちください</h1>
    </div>
  );
}
