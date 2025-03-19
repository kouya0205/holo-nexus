import { FC } from "react";

import { Separator } from "./ui/separator";

export const Separate: FC = () => {
  return (
    <div className="flex w-full items-center justify-around py-3">
      <Separator className="w-[40%]" />
      <p className="text-sm text-gray-500">または</p>
      <Separator className="w-[40%]" />
    </div>
  );
};
