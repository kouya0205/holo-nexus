import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/hooks/useActions";
import {
  mdiAccount,
  mdiBellOutline,
  mdiCreationOutline,
  mdiEmailArrowRightOutline,
  mdiLogout,
  mdiUnfoldMoreHorizontal,
} from "@mdi/js";
import Icon from "@mdi/react";
import { ListItem, ListItemButton } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export const MenuFooter = ({ userProfile, handleDrawerClose }: { userProfile: any; handleDrawerClose: () => void }) => {
  return (
    <>
      {userProfile ? (
        <>
          <ListItem disablePadding sx={{ paddingTop: "8px" }}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <ListItemButton
                  onClick={handleDrawerClose}
                  sx={{
                    paddingX: "8px",
                    borderRadius: "4px",
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "8px",
                  }}
                >
                  <div className="flex gap-2 ">
                    {userProfile.avatar_url && (
                      <Image
                        width={50}
                        height={50}
                        src={userProfile.avatar_url}
                        alt={userProfile.name}
                        className="rounded-sm w-10 h-10 md:h-auto md:w-auto"
                      />
                    )}
                    <div className="flex flex-col md:text-base text-sm text-white gap-1 justify-center">
                      <p>{userProfile.username}</p>
                      <p>{userProfile.email}</p>
                    </div>
                  </div>
                  <Icon path={mdiUnfoldMoreHorizontal} size={1} color="white" />
                </ListItemButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className={`z-[9999] ${userProfile.avatar_url ? "min-w-[300px]" : "min-w-[200px]"}`}
              >
                <DropdownMenuItem onClick={handleDrawerClose}>
                  <Link href="/profile" className="flex gap-1 w-full">
                    <Icon path={mdiAccount} size={1} color="black" />
                    プロフィール
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDrawerClose}>
                  <Link href="/notifications" className="flex gap-1 w-full">
                    <Icon path={mdiBellOutline} size={1} color="black" />
                    お知らせ
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDrawerClose}>
                  <Link href="/subscription" className="flex gap-1 w-full">
                    <Icon path={mdiCreationOutline} size={1} color="black" />
                    アップグレード
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDrawerClose}>
                  <Link href="/contact" className="flex gap-1 w-full">
                    <Icon path={mdiEmailArrowRightOutline} size={1} color="black" />
                    お問い合わせ
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDrawerClose}>
                  <form action={signOut} className="w-full">
                    <button className="w-full flex gap-1">
                      <Icon path={mdiLogout} size={1} color="black" />
                      ログアウト
                    </button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ListItem>
        </>
      ) : (
        <Link href="/auth" onClick={handleDrawerClose}>
          <Button className="w-full">ログイン</Button>
        </Link>
      )}
    </>
  );
};
