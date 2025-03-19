"use server";

import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import Menu from "./Menu/Menu";
const Header = ({ userProfile }: { userProfile: any }) => {
  return (
    <header
      className="flex items-center justify-between px-4 text-white h-14"
      style={{
        background:
          "linear-gradient(to right, #3D7CB6 0%, #349BD1 5%, #38B8EA 20%, #38B8EA 80%, #349BD1 95%, #3D7CB6 100%)",
      }}
    >
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/images/header/logo.webp"
          alt={siteConfig.title}
          width={220}
          height={50}
          className="cursor-pointer w-[160px] sm:w-[240px] "
        />
      </Link>
      <Menu userProfile={userProfile} />
    </header>
  );
};

export default Header;
