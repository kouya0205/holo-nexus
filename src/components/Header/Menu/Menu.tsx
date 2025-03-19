"use client";

import { Box, Drawer, Link as MuiLink, List, ListItemButton, ListItemText, ListItem } from "@mui/material";
import { useState } from "react";

import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";
import Image from "next/image";
import { MenuFooter } from "./MenuFooter";
import Icon from "@mdi/react";
import {
  mdiCardsOutline,
  mdiHomeOutline,
  mdiFencing,
  mdiNewspaperVariantOutline,
  mdiCreationOutline,
  mdiFolderAccountOutline,
  mdiContentSaveAllOutline,
} from "@mdi/js";

const setNavLinks: Array<{ text: string; url: string; icon: string }> = [
  { text: "トップ", url: "/", icon: mdiHomeOutline },
  { text: "作成したデッキリスト", url: "/decklist", icon: mdiFolderAccountOutline },
  { text: "投稿されたデッキリスト", url: "/deck_shared", icon: mdiContentSaveAllOutline },
  { text: "カード一覧", url: "/cardlist", icon: mdiCardsOutline },
  { text: "一人回し", url: "/match", icon: mdiFencing },
  { text: "記事一覧", url: "/articles", icon: mdiNewspaperVariantOutline },
  { text: "メンバーシップについて", url: "/membership", icon: mdiCreationOutline },
];
const defaultNav: Array<{ text: string; url: string }> = [
  { text: "デッキリスト", url: "/decklist" },
  { text: "カード一覧", url: "/cardlist" },
  { text: "一人回し", url: "/match" },
];

export default function Menu({ userProfile }: { userProfile: any }) {
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Box>
        <div className="flex items-center font-mono">
          <nav className="hidden md:flex gap-4 items-center">
            {defaultNav.map((navLink, index) => (
              <li key={index} className="list-none">
                <div className="hidden items-center gap-2 md:flex">
                  <Link href={navLink.url}>{navLink.text}</Link>
                </div>
              </li>
            ))}
          </nav>
          <ListItem disablePadding className="flex-1">
            <ListItemButton onClick={handleDrawerOpen} className="flex items-center p-4">
              <ListItemText primary={<MenuIcon />} />
            </ListItemButton>
          </ListItem>
        </div>
      </Box>
      <Drawer
        anchor="right"
        open={open}
        onClose={handleDrawerClose}
        PaperProps={{
          style: {
            background:
              "linear-gradient(to right, #3D7CB6 3%, #349BD1 25%, #38B8EA 50%, #38B8EA 50%, #349BD1 75%, #3D7CB6 97%)",
            paddingLeft: "8px",
            paddingRight: "8px",
            paddingBottom: "12px",
            justifyContent: "space-between",
          },
        }}
      >
        <List component="nav">
          <ListItem disablePadding sx={{ borderBottom: "1px solid white" }}>
            <ListItemButton onClick={handleDrawerClose} sx={{ justifyContent: "space-between", borderRadius: "4px" }}>
              <Image src="/images/header/logo.webp" alt="logo" width={140} height={40} />
              <ListItemText sx={{ textAlign: "end", color: "white" }} primary={<CloseIcon />} />
            </ListItemButton>
          </ListItem>
          {setNavLinks.map((navLink, index) => (
            <ListItem disablePadding key={index} sx={{ borderBottom: "1px solid white", paddingY: "8px" }}>
              <ListItemButton
                onClick={handleDrawerClose}
                component={MuiLink}
                to={navLink.url}
                sx={{ paddingX: "8px", borderRadius: "4px", display: "flex", gap: "12px" }}
              >
                <Icon path={navLink.icon} size={1} color="white" />
                <p className="font-mono text-sm lg:text-lg text-white">{navLink.text}</p>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <MenuFooter userProfile={userProfile} handleDrawerClose={handleDrawerClose} />
      </Drawer>
    </>
  );
}
