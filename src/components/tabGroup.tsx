"use client";

import { tabConfig } from "@/config/tab";

import { Button } from "./ui/button";
import { ToggleGroup } from "./ui/toggle-group";

type TabGroupProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};

export function TabGroup({ activeTab, onTabChange }: TabGroupProps) {
  return (
    <div className="flex">
      <ToggleGroup type="single">
        {tabConfig.tab.map((tab) => (
          <Button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            variant={activeTab === tab.id ? null : "outline"}
            className={
              activeTab === tab.id
                ? "h-7 w-[116px] cursor-pointer rounded-[14px] bg-[#534B88] text-white hover:bg-[#534B88]"
                : "h-7 w-[116px] cursor-pointer rounded-[14px] border-[#534B88] bg-gray-200 text-[#534B88] hover:bg-gray-200"
            }
          >
            {tab.label}
          </Button>
        ))}
      </ToggleGroup>
    </div>
  );
}
